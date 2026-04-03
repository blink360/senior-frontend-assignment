import { TooltipProps  } from 'recharts';

type ChartPayload = {
  byCategory?: Record<string, number>;
};

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: Array<{
    value: number;
    payload: ChartPayload;
  }>;
  label?:string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
 
  if (!active || !payload || payload.length === 0) return null;

  const dataPoint = payload[0];
  const total = dataPoint?.value ?? 0;
  const categoryBreakdown = dataPoint?.payload?.byCategory;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
      <p className="font-semibold text-slate-900 mb-2">
        {label}
      </p>

      <p className="text-indigo-600 font-mono font-bold text-lg">
        ${total.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })}
      </p>

      {categoryBreakdown && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1">
          {Object.entries(categoryBreakdown).map(
            ([category, amount]) => (
              <div
                key={category}
                className="flex justify-between gap-6 text-sm"
              >
                <span className="text-slate-500">
                  {category}
                </span>

                <span className="font-mono text-slate-700">
                  ${(amount as number).toFixed(2)}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;