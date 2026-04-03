import { useMemo } from 'react';
import { SplitExpenseRow } from '@/app/schema/splitExpenseFormSchema';
import { convertDollarToCents } from '../utils/currency';


interface IUseSplitExpense {
  totalCents: number;
  remainingCents: number;
  remainingAmount: number;
  isBalanced: boolean;
  isOver: boolean;
}

const useSplitExpense = (
  splits: SplitExpenseRow[],
  amount: number
): IUseSplitExpense => {
  return useMemo(() => {
    // Total of all split amounts in cents
    const totalCents = splits.reduce((sum, split) => {
      const splitAmount = Number(split?.amount) || 0;
      return sum + convertDollarToCents(splitAmount);
    }, 0);

    const amountInCents = convertDollarToCents(amount);
    const remainingCents = amountInCents - totalCents;
    
    return {
      totalCents,
      remainingCents,
      remainingAmount: Math.abs(remainingCents) / 100,
      isBalanced: remainingCents === 0,
      isOver: remainingCents < 0,
    };
  }, [splits, amount]);
};

export default useSplitExpense;