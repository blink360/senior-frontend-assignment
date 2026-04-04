'use client'

import {
  createContext,
  useReducer,
  ReactNode,
  Dispatch
} from 'react';

import { batchItemApprovalReducer, BatchState, initialState } from '@/app/global-state/BatchItemApprovalContext/reducer';
import { BatchItemApprovalAction } from "@/app/global-state/BatchItemApprovalContext/actions";

interface IBatchApprovalContext {
  state: BatchState;
  dispatch: Dispatch<BatchItemApprovalAction>;
}

const BatchApprovalContext = createContext<IBatchApprovalContext | null>(null);

export const BatchItemApprovalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(batchItemApprovalReducer, initialState);

  return (
    <BatchApprovalContext.Provider value={{ state, dispatch }}>
      {children}
    </BatchApprovalContext.Provider>
  )
}

export default BatchApprovalContext;