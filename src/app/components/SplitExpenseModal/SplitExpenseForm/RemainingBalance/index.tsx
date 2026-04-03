interface IRemainingBalanceProps {
    remainingAmount: number;
    remainingCents: number;
    amount: number;
    isBalanced: boolean;
    isOver: boolean;
}

const RemainingBalance = ({
    remainingAmount,
    remainingCents,
    amount,
    isBalanced,
    isOver,
}: IRemainingBalanceProps) => {
    const containerClass = isBalanced
        ? 'bg-emerald-50 border-emerald-200'
        : isOver
            ? 'bg-rose-50 border-rose-200'
            : 'bg-amber-50 border-amber-200';

    const amountClass = isBalanced
        ? 'text-emerald-600'
        : isOver
            ? 'text-rose-600'
            : 'text-amber-600';

    return (
        <div className={`rounded-xl p-4 flex justify-between items-center border ${containerClass} mb-4`}>
            <div>
                <p className="text-sm text-slate-500">Remaining Balance</p>
                <p className={`text-2xl font-bold font-mono ${amountClass}`}>
                    ${remainingAmount.toFixed(2)}
                    {isOver && ' over'}
                </p>
                {isBalanced && (
                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                        Balanced
                    </p>
                )}
            </div>
            <div className="text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-semibold text-slate-900">${amount.toFixed(2)}</p>
            </div>
        </div>
    );
}

export default RemainingBalance;