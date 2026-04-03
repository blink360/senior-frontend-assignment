import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SplitExpenseFormData } from '@/app/schema/splitExpenseFormSchema';
import { ExpenseCategories } from '@/app/components/SplitExpenseModal/SplitExpenseForm/index.d';
import { Trash2 } from 'lucide-react';

interface ISplitExpenseRowProps {
    index: number;
    register: UseFormRegister<SplitExpenseFormData>;
    errors: FieldErrors<SplitExpenseFormData>;
    onRemove: (index: number) => void;
    isRemoveDisabled: boolean;
}

const SplitExpenseRow = ({
    index,
    register,
    errors,
    onRemove,
    isRemoveDisabled,
}: ISplitExpenseRowProps) => {
    return (
        <div className="grid grid-cols-12 gap-3 items-start p-4 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="col-span-4">
                <label className="text-xs text-slate-500 mb-1 block">Category</label>
                <select
                    {...register(`splits.${index}.category`)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                    <option value="">Select One</option>
                    {['Travel', 'Software', 'Meals', 'Office Supplies'].map((value: string) => (
                        <option key={value} value={value as ExpenseCategories}>{value}</option>
                    ))}
                </select>
                
                {errors.splits?.[index]?.category && (
                    <p className="text-xs text-rose-500 mt-1">
                        {errors.splits[index]?.category?.message}
                    </p>
                )}
            </div>

            <div className="col-span-4">
                <label className="text-xs text-slate-500 mb-1 block">Remarks</label>
                <input
                    {...register(`splits.${index}.remarks`)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                />
            </div>

            <div className="col-span-3">
                <label className="text-xs text-slate-500 mb-1 block">Amount</label>
                <input
                    {...register(`splits.${index}.amount`, { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white font-mono"
                />
                {errors.splits?.[index]?.amount && (
                    <p className="text-xs text-rose-500 mt-1">
                        {errors.splits[index]?.amount?.message}
                    </p>
                )}
            </div>

            <div className="col-span-1 pt-6">
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    disabled={isRemoveDisabled}
                    className="p-2 hover:bg-rose-50 text-rose-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Remove split row"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default SplitExpenseRow;