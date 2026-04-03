
'use client'

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expense } from '@/services/api.mock';
import { aggregateGraphDataByMonth, aggregateGraphDataByYear } from '@/app/utils/graph';
import AnnualChart from '@/app/components/DataChart/AnnualChart';
import MonthlyChart from './MonthlyChart';

type ChartView = 'annual' | 'monthly';

interface IDataChartProps {
    expenses: Expense[];
}

const DataChart = ({ expenses }: IDataChartProps) => {
    const [view, setView] = useState<ChartView>('annual');

    const annualGraphData = useMemo(() =>
        aggregateGraphDataByYear(expenses)
        , [expenses])

    console.log(annualGraphData);
    
    const monthlyGraphData = useMemo(() =>
        aggregateGraphDataByMonth(expenses)
        , [expenses])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-2">
                {['annual', 'monthly'].map((item: string) =>
                    <button
                        key={item}
                        onClick={() => setView(item as ChartView)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                             ${view === item
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {item.charAt(0).toUpperCase() + item.slice(1, item.length)}
                    </button>
                )
                }
            </div>

            < AnimatePresence mode="wait" >
                {view === 'annual' ? (
                    <motion.div
                        key="annual"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AnnualChart data={annualGraphData} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="monthly"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MonthlyChart data={monthlyGraphData} />
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
}

export default DataChart;