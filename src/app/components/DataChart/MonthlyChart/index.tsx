import { IMonthlyGraphData } from "@/app/utils/graph";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, ReferenceLine, Tooltip } from "recharts";
import { motion } from 'framer-motion';
import CustomTooltip from "./CustomTooltip";
interface IMonthlyChartProps {
    data: IMonthlyGraphData[];
}

const MonthlyChart = ({ data }: IMonthlyChartProps) => {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                No approved expenses to display
            </div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="text-xl font-bold font-mono text-slate-900">
                        ${data.reduce((s, d) => s + d.total, 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-500">Peak Month</p>
                    <p className="text-xl font-bold font-mono text-slate-900">
                        {data.reduce((max, d) => d.total > max.total ? d : max, data[0]).label}
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    barCategoryGap="30%"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        width={55}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar
                        dataKey="total"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={48}
                        isAnimationActive={true}
                        animationDuration={600}
                        animationEasing="ease-out"
                        fill="#8884d8"
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>

    )
}

export default MonthlyChart;