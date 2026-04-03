'use client'

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SplitExpenseFormData, SplitExpenseFormSchema } from "@/app/schema/splitExpenseFormSchema";
import SplitExpenseRow from "./SplitExpenseRow";
import { Plus, Zap } from "lucide-react";
import { createExpense } from "@/services/api.mock";
import { toast } from "sonner";
import { useEffect } from "react";
import { getItemFromLocalStorage, removeItemFromLocalStorage, storeItemInLocalStorage } from "@/app/utils/storage";
import useSplitExpense from "@/app/hooks/useSplitExpense";
import RemainingBalance from "./RemainingBalance";


interface ISplitExpenseFormProps {
    id: string;
    amount: number;
    onSuccess?: () => void;
}

const SplitExpenseForm = ({ id, amount, onSuccess }: ISplitExpenseFormProps) => {

    const { register, handleSubmit, control, watch, formState: { errors, isSubmitting }, setValue, reset } = useForm<SplitExpenseFormData>(
        {
            resolver: zodResolver(SplitExpenseFormSchema(amount)),
            defaultValues: {
                splits: [{ id: crypto.randomUUID(), category: '', remarks: '', amount: amount }]
            },
            mode: 'onChange'
        }
    );


    const { fields, append, remove } = useFieldArray({
        control,
        name: "splits",
    });

    const watchSplits = useWatch({control, name: "splits"});

    const { remainingAmount, remainingCents, isBalanced, isOver } = useSplitExpense(watchSplits, amount);

    useEffect(() => {
        const key = `split-expense-store`;
        const item = getItemFromLocalStorage(key);

        if (!item) return;
        try {
            reset(item);
        } catch {
            removeItemFromLocalStorage(key);
        }
    }, [id, reset])

    useEffect(() => {
        const key = `split-expense-store`;
        const subscription = watch((values) => {
            storeItemInLocalStorage(key, JSON.stringify(values));
        });
        return () => subscription.unsubscribe();
    }, [watch, id]);


    const onSubmit = async (data: SplitExpenseFormData) => {
        try {
            await Promise.all(
                data.splits.map(split =>
                    createExpense({
                        title: 'Split Expense',
                        amount: split.amount,
                        category: split.category,
                        note: split.remarks,
                        parentId: id,
                        status: 'pending',
                    })
                )
            );
            removeItemFromLocalStorage('split-expense-store')
            toast.success(`Split into ${data.splits.length} expenses`);
            onSuccess?.();
        } catch {
            toast.error('Failed to create split expenses');
        }
    };

    const handleAddRow = () => {
        append({ id: crypto.randomUUID(), category: '', remarks: '', amount: 0 })
    }

    const handleQuickSplit = () => {
        const amountInCents = Math.round(amount * 100);
        const numberOfSplits = fields.length;
        const baseShare = Math.floor(amountInCents / numberOfSplits);
        const remainder = amountInCents % numberOfSplits;

        fields.forEach((_, i) => {
            setValue(`splits.${i}.amount`, (i < remainder ? baseShare + 1 : baseShare) / 100);
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <RemainingBalance remainingAmount={remainingAmount} remainingCents={remainingCents} isBalanced={isBalanced} isOver={isOver} amount={amount} />
            <div className="flex justify-between items-center mb-4">
                <button
                    type="button"
                    onClick={handleQuickSplit}
                    className="btn btn-outline flex items-center gap-2 text-sm"
                >
                    Split
                </button>
                <button
                    type="button"
                    onClick={handleAddRow}
                    className="btn btn-outline flex items-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Row
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                    <SplitExpenseRow
                        key={field.id}
                        index={index}
                        register={register}
                        errors={errors}
                        onRemove={remove}
                        isRemoveDisabled={fields.length === 1}
                    />
                ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={isSubmitting || !isBalanced}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting..' : 'Submit'}
                </button>
            </div>
        </form>
    )
}

export default SplitExpenseForm;