import * as zod from "zod";
import { convertDollarToCents } from "../utils/currency";

export interface ISplitExpense {
  id: string;
  amount: number;
  remarks?: string;
  category: string;
}

export const SplitExpenseSchema = zod.object({
  id: zod.string(),
  amount: zod.number().min(0.01, "Must be greater than 0."),
  remarks: zod.string().optional(),
  category: zod.string(),
});

export type SplitExpenseRow = zod.infer<typeof SplitExpenseSchema>;

export const SplitExpenseFormSchema = (amount: number) => {
  const amountInCents = convertDollarToCents(amount);

  return zod
    .object({
      splits: zod.array(SplitExpenseSchema).min(1, "Add at least one split"),
    })
    .refine(
      ({ splits }) => {
        const totalSplitCents = splits.reduce(
          (sum, split) => sum + convertDollarToCents(split.amount),
          0,
        );

        return totalSplitCents === amountInCents;
      },
      {
        message: "Split total must equal the expense amount.",
        path: ["splits"],
      },
    );
};

export type SplitExpenseFormData = zod.infer<ReturnType<typeof SplitExpenseFormSchema>>;
