import { BatchItemApprovalAction } from "@/app/global-state/BatchItemApprovalContext/actions";

export const initialState: BatchState = {
  items: {},
  isActive: false,
};

export type BatchItemStatus = "queued" | "processing" | "succeeded" | "failed";

export interface BatchItem {
  id: string;
  status: BatchItemStatus;
}

export interface BatchState {
  items: Record<string, BatchItem>;
  isActive: boolean;
}

export const batchItemApprovalReducer = (
  state: BatchState,
  action: BatchItemApprovalAction,
): BatchState => {
  switch (action.type) {
    case "QUEUE": {
      const newItems = { ...state.items };
      action.ids.forEach((id) => {
        if (!newItems[id]) {
          newItems[id] = { id, status: "queued" };
        }
      });
      return {
        ...state,
        items: newItems,
        isActive: true,
      };
    }

    case "MARK_PROCESSING": {
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: { id: action.id, status: "processing" },
        },
      };
    }

    case "MARK_SUCCEEDED": {
      const items = {
        ...state.items,
        [action.id]: { id: action.id, status: "succeeded" as BatchItemStatus },
      };
      const isActive = Object.values(items).some(
        (item) => item.status === "queued" || item.status === "processing",
      );
      return { ...state, items, isActive };
    }

    case "MARK_FAILED": {
      const items = {
        ...state.items,
        [action.id]: { id: action.id, status: "failed" as BatchItemStatus },
      };
      const isActive = Object.values(items).some(
        (item) => item.status === "queued" || item.status === "processing",
      );
      return { ...state, items, isActive };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
};
