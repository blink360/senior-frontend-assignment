/**
 * Simulated backend for the Velorona Interview Assignment.
 * These functions have intentional random failures and delays to 
 * test handling of real-world networking scenarios.
 */

import { INITIAL_DATA } from "@/app/utils/graph";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  category: string;
  employee: string;
  date: string;
}

export const fetchExpenses = async (): Promise<Expense[]> => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Network delay
  return [...INITIAL_DATA];
};

export const updateExpenseStatus = async (id: string, status: Expense['status']): Promise<{ success: boolean; id: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Processing delay
  
  // Intentional failure rate (20%) to test rollback/error handling
  if (Math.random() < 0.2) {
    throw new Error(`Failed to update expense ${id}`);
  }
  
  return { success: true, id };
};

export const createExpense = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: `exp-${Date.now()}`, ...data };
};
