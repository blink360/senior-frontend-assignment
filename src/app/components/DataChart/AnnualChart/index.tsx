import { IAnnualGraphData } from "@/app/utils/graph";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from 'framer-motion';
import CustomTooltip from "./CustomTooltip";
interface IAnnualChartProps {
    data: IAnnualGraphData[];
}

const AnnualChart = ({ data }: IAnnualChartProps) => {
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
                {data.map((d) => (
                    <motion.div
                        key={d.year}
                        layoutId={`summary-${d.year}`}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                    >
                        <p className="text-sm text-slate-500">{d.year}</p>
                        <p className="text-xl font-bold font-mono text-slate-900">
                            ${d.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </motion.div>
                ))}
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data.map(d => ({ ...d, name: String(d.year) }))}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    barCategoryGap="40%"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 13, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
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
                        radius={[6, 6, 0, 0]}
                        maxBarSize={80}
                        isAnimationActive={true}
                        animationDuration={600}
                        animationEasing="ease-out"
                        fill="#8884d8"
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

export default AnnualChart;