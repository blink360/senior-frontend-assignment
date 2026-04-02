/**
 * Simulated backend for the Velorona Interview Assignment.
 * These functions have intentional random failures and delays to 
 * test handling of real-world networking scenarios.
 */

export interface Expense {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  category: string;
  employee: string;
  date: string;
}

const INITIAL_DATA: Expense[] = Array.from({ length: 20 }, (_, i) => ({
  id: `exp-${i + 1}`,
  title: [
    'Dinner with Client', 
    'Uber to Airport', 
    'WeWork Pass', 
    'Figma Subscription', 
    'AWS Hosting', 
    'Office Snacks'
  ][i % 6],
  amount: Math.floor(Math.random() * 500) + 10,
  status: 'pending',
  category: ['Travel', 'Software', 'Meals', 'Office Supplies'][i % 4],
  employee: ['Jane Doe', 'John Smith', 'Alice Johnson'][i % 3],
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

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
