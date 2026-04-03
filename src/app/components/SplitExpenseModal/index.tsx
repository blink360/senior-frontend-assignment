'use client'

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import SplitExpenseForm from './SplitExpenseForm';
import { getItemFromLocalStorage, removeItemFromLocalStorage, storeItemInLocalStorage } from '@/app/utils/storage';
import { formatCurrency } from '@/app/utils/currency';

interface ISplitExpenseModal {
    show: boolean;
    setShow: (show: boolean) => void;
}

interface ExpenseDetails {
    title: string;
    amount: number;
}

const SplitExpenseModal = ({ show, setShow }: ISplitExpenseModal) => {
    const [details, setDetails] = useState<ExpenseDetails | null>(null);

    useEffect(() => {
        if (show) {
            const stored = getItemFromLocalStorage('split-expense-details');
            if (stored) {
                try { setDetails(stored); }
                catch { setDetails(null); }
            } else {
                setDetails(null);
            }
        }
    }, [show]);

    useEffect(() => {
        if (details) {
            storeItemInLocalStorage('split-expense-details', JSON.stringify(details))
        }
    }, [details])

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    const handleStart = () => {
        if (!title || !amount || Number(amount) <= 0) return;
        setDetails({ title, amount: Number(amount) });
    };

    const handleClose = () => {
        setShow(false);
        setTimeout(() => {
            setDetails(null);
            setTitle('');
            setAmount('');
        }, 300);
    };

    return (
        <Dialog.Root open={show} onOpenChange={(open) => !open && handleClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
                <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl overflow-y-auto p-8">

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <Dialog.Title className="text-2xl font-bold text-slate-900">
                                {details ? `${details.title}` : 'New Expense'}
                            </Dialog.Title>
                            <Dialog.Description className="text-slate-500 mt-1">
                                {details
                                    ? `${formatCurrency(details.amount)}`
                                    : '$0.00'}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close className="p-2 hover:bg-slate-100 rounded-lg">
                            <X className="w-5 h-5 text-slate-500" />
                        </Dialog.Close>
                    </div>

                    {!details && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">Amount ($)</label>
                                <input
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <button
                                onClick={handleStart}
                                disabled={!title || Number(amount) <= 0}
                                className="btn btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {details && (
                        <SplitExpenseForm
                            id={`split-expense-store`}
                            amount={details.amount}
                            onSuccess={handleClose}
                        />
                    )}

                    {details &&
                        <button
                            onClick={() => {
                                setDetails(null);
                                setTitle('');
                                setAmount('');
                                removeItemFromLocalStorage('split-expense-details')
                            }}
                            className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 mt-2"
                        >
                            Discard
                        </button>}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SplitExpenseModal;