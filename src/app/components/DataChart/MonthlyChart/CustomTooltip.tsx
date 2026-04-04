import { IMonthlyGraphData } from "@/app/utils/graph";

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const point: IMonthlyGraphData = payload[0]?.payload;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg min-w-44">
            <p className="font-semibold text-slate-900 mb-1">{point.label}</p>
            <p className="text-indigo-600 font-mono font-bold text-lg mb-2">
                ${point.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            {point.growth !== null && (
                <div className={`flex items-center gap-1 text-sm font-medium
          ${point.growth >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    <span>{point.growth >= 0 ? '+' : '-'}</span>
                    <span>{Math.abs(point.growth).toFixed(1)}% vs prev month</span>
                </div>
            )}

            {point.total === 0 && (
                <p className="text-xs text-slate-400 mt-1">No expenses this month</p>
            )}
        </div>
    );
};

export default CustomTooltip;