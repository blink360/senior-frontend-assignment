"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchExpenses } from "@/services/api.mock";
import { Check, X, Zap, BarChart3, ReceiptText } from "lucide-react";
import { Toaster } from "sonner";
import SplitExpenseModal from "./components/SplitExpenseModal";
import DataChart from "./components/DataChart";
import useBatchApproveExpense from "./hooks/useApproveExpense";


export default function ExpensesDashboard() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  const {
    approveOne,
    approveBatch,
    isQueued,
    isProcessing,
    isSucceeded,
    isFailed,
  } = useBatchApproveExpense();

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkApprove = () => {
    approveBatch([...selectedIds]);
    setSelectedIds(new Set());
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        <Toaster richColors position="bottom-right" />
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
              Expense Operations
            </h1>
            <p className="text-slate-500 text-lg">
              Manage your company's spending and approvals at scale.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="btn btn-outline flex items-center gap-2"
              onClick={() => setShowGraph(!showGraph)}
            >
              <BarChart3 className="w-4 h-4" /> View Insights
            </button>
            <button
              className="btn btn-primary flex items-center gap-2 shadow-indigo-100"
              onClick={() => setShowExpenseModal(true)}
            >
              <ReceiptText className="w-4 h-4" /> New Expense
            </button>
          </div>
        </header>

        {showGraph && <DataChart expenses={expenses} />}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 card bg-indigo-600 border-none text-foreground">
            <h3 className="font-medium opacity-80 mb-1">Total Pending</h3>
            <p className="text-4xl font-bold">$12,450.00</p>
          </div>
          <div className="col-span-12 lg:col-span-4 card">
            <h3 className="text-slate-500 font-medium mb-1">Approved this month</h3>
            <p className="text-4xl font-bold">$42,890.12</p>
          </div>
          <div className="col-span-12 lg:col-span-4 card">
            <h3 className="text-slate-500 font-medium mb-1">Active Staff</h3>
            <p className="text-4xl font-bold text-slate-900">124</p>
          </div>

          <div className="col-span-12 space-y-4">
            <div className="flex justify-between items-center py-2 px-1">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Recent Submissions
                {selectedIds.size > 0 && (
                  <span className="text-sm font-normal text-slate-500 ml-2 animate-in fade-in slide-in-from-left-2">
                    ({selectedIds.size} selected)
                  </span>
                )}
              </h2>

              {selectedIds.size > 0 && (
                <div className="flex gap-2 animate-in slide-in-from-right-4 fade-in">
                  <button
                    onClick={handleBulkApprove}
                    className="btn bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Bulk Approve
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="btn btn-outline text-slate-500 border-none hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="card p-0 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 transform scale-110"
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedIds(new Set(expenses.map((e) => e.id)));
                          else setSelectedIds(new Set());
                        }}
                      />
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-sm">EXPENSE</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-sm">EMPLOYEE</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">AMOUNT</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-sm">STATUS</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Loading expenses...
                      </td>
                    </tr>
                  ) : (
                    expenses
                      .filter(item => item.status === 'pending')
                      .map((expense) => (
                        <tr
                          key={expense.id}
                          className={`hover:bg-slate-50/50 transition-colors
                            ${selectedIds.has(expense.id) ? "bg-indigo-50/30" : ""}
                            ${isProcessing(expense.id) ? "opacity-60" : ""}
                          `}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(expense.id)}
                              onChange={() => toggleSelect(expense.id)}
                              disabled={isProcessing(expense.id) || isSucceeded(expense.id)}
                              className="rounded border-slate-300 transform scale-110 accent-indigo-600"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{expense.title}</p>
                            <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
                              {expense.category}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{expense.employee}</td>
                          <td className="px-6 py-4 text-right font-mono font-medium text-slate-900 underline decoration-slate-200 underline-offset-4 decoration-1">
                            ${expense.amount.toFixed(2)}
                          </td>

                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                              ${isSucceeded(expense.id) ? 'bg-emerald-100 text-emerald-700'
                                : isFailed(expense.id) ? 'bg-rose-100 text-rose-500'
                                  : isProcessing(expense.id) ? 'bg-indigo-100 text-indigo-600'
                                    : isQueued(expense.id) ? 'bg-slate-100 text-slate-500'
                                      : expense.status === 'pending' ? 'bg-amber-100 text-amber-700'
                                        : 'bg-emerald-100 text-emerald-700'}`}>
                              {isSucceeded(expense.id) ? 'approved'
                                : isFailed(expense.id) ? 'failed'
                                  : isProcessing(expense.id) ? 'processing...'
                                    : isQueued(expense.id) ? 'queued'
                                      : expense.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            {!isSucceeded(expense.id) && (
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => approveOne(expense.id)}
                                  disabled={
                                    isProcessing(expense.id) ||
                                    isQueued(expense.id) ||
                                    isSucceeded(expense.id)
                                  }
                                  className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {isProcessing(expense.id) ? (
                                    <Zap className="w-5 h-5 animate-pulse" />
                                  ) : (
                                    <Check className="w-5 h-5" />
                                  )}
                                </button>
                                <button className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-md">
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <SplitExpenseModal show={showExpenseModal} setShow={setShowExpenseModal} />
    </>
  );
}