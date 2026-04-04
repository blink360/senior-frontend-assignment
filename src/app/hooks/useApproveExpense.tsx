import { useRef, useCallback, useContext } from 'react';
import { updateExpenseStatus } from '@/services/api.mock';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import BatchApprovalContext from '../global-state/BatchItemApprovalContext';

const MAX_CONCURRENT = 3;

const useBatchApproveExpense = () => {
    const queryClient = useQueryClient();
    const activeRequests = useRef(0);
    const queue = useRef<string[]>([]);
    const seenIds = useRef<Set<string>>(new Set());

    const context = useContext(BatchApprovalContext);

    if (!context) {
        throw new Error('BatchApprovalContext must be used within provider');
    }

    const { state, dispatch } = context;

    const items = Object.values(state.items);

    const queuedItems = items.filter((i) => i.status === 'queued');
    const processingItems = items.filter((i) => i.status === 'processing');
    const succeededItems = items.filter((i) => i.status === 'succeeded');
    const failedItems = items.filter((i) => i.status === 'failed');

    const totalCount = items.length;
    const completedCount = succeededItems.length + failedItems.length;

    const processQueue = useCallback(() => {
        while (
            activeRequests.current < MAX_CONCURRENT &&
            queue.current.length > 0
        ) {
            const id = queue.current.shift()!;
            activeRequests.current++;

            dispatch({ type: 'MARK_PROCESSING', id });

            updateExpenseStatus(id, 'approved')
                .then(() => {
                    dispatch({ type: 'MARK_SUCCEEDED', id });
                })
                .catch(() => {
                    dispatch({ type: 'MARK_FAILED', id });
                    seenIds.current.delete(id);
                })
                .finally(() => {
                    activeRequests.current--;

                    const isDone =
                        queue.current.length === 0 &&
                        activeRequests.current === 0;

                    if (isDone) {
                        queryClient.invalidateQueries({ queryKey: ['expenses'] });

                        if (failedItems.length > 0) {
                            toast.warning(
                                `${succeededItems.length} approved, ${failedItems.length} failed`
                            );
                        } else {
                            toast.success('All expenses approved successfully');
                        }
                    }

                    processQueue();
                });
        }
    }, [dispatch, queryClient, failedItems.length, succeededItems.length]);

    const enqueue = useCallback((ids: string[]) => {
        const newIds = ids.filter(id => !seenIds.current.has(id));
        if (!newIds.length) return;

        newIds.forEach(id => seenIds.current.add(id));
        queue.current.push(...newIds);

        dispatch({ type: 'QUEUE', ids: newIds });

        processQueue();
    }, [dispatch, processQueue]);

    const approveOne = useCallback((id: string) => {
        enqueue([id]);
    }, [enqueue]);

    const approveBatch = useCallback((ids: string[]) => {
        const newIds = ids.filter(id => !seenIds.current.has(id));

        if (!newIds.length) {
            toast.info('All selected items are already processing');
            return;
        }

        enqueue(newIds);
        toast.info(`Queued ${newIds.length} expenses`);
    }, [enqueue]);

    const reset = useCallback(() => {
        queue.current = [];
        seenIds.current.clear();
        activeRequests.current = 0;

        dispatch({ type: 'RESET' });
    }, [dispatch]);

    const getStatus = useCallback(
        (id: string) => state.items[id]?.status ?? null,
        [state.items]
    );

    const isQueued = (id: string) => getStatus(id) === 'queued';
    const isProcessing = (id: string) => getStatus(id) === 'processing';
    const isSucceeded = (id: string) => getStatus(id) === 'succeeded';
    const isFailed = (id: string) => getStatus(id) === 'failed';

    return {
        state,
        queuedItems,
        processingItems,
        succeededItems,
        failedItems,
        totalCount,
        completedCount,
        isActive: state.isActive,
        approveOne,
        approveBatch,
        reset,
        isQueued,
        isProcessing,
        isSucceeded,
        isFailed,
        getStatus,
    };
};

export default useBatchApproveExpense;