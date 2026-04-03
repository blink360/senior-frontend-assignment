import { Expense } from "@/services/api.mock";

export interface IAnnualGraphData {
  year: number;
  total: number;
  byCategory: Record<string, number>;
}

export interface IMonthlyGraphData {
  key: string;
  label: string;
  total: number;
  growth: number | null;
}

export const aggregateGraphDataByYear = (
  expenses: Expense[],
): IAnnualGraphData[] => {
  const yearlyMap = new Map<number, IAnnualGraphData>();

  for (const expense of expenses) {
    if (expense.status !== "approved") continue;

    const year = new Date(expense.date).getFullYear();

    if (!yearlyMap.has(year)) {
      yearlyMap.set(year, {
        year,
        total: 0,
        byCategory: {},
      });
    }

    const yearData = yearlyMap.get(year)!;
    yearData.total += expense.amount;

    const currentCategoryTotal = yearData.byCategory[expense.category] || 0;

    yearData.byCategory[expense.category] =
      currentCategoryTotal + expense.amount;
  }

  const sortedArray = Array.from(yearlyMap.values()).sort(
    (a, b) => a.year - b.year,
  );

  return sortedArray;
};

export const aggregateGraphDataByMonth = (expenses: Expense[]): IMonthlyGraphData[] => {
  const monthlyTotals = new Map<string, number>();

  for (const expense of expenses) {
    if (expense.status !== "approved") continue;

    const date = new Date(expense.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const monthKey = `${year}-${month}`;

    const existingTotal = monthlyTotals.get(monthKey) || 0;
    monthlyTotals.set(monthKey, existingTotal + expense.amount);
  }

  if (monthlyTotals.size === 0) return [];

  const sortedKeys = Array.from(monthlyTotals.keys()).sort();

  const startDate = new Date(`${sortedKeys[0]}-01`);
  const endDate = new Date(`${sortedKeys[sortedKeys.length - 1]}-01`);

  const results: IMonthlyGraphData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const monthKey = `${year}-${month}`;

    const total = monthlyTotals.get(monthKey) || 0;

    const label = currentDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    const previous = results[results.length - 1];
    let growth: number | null = null;

    if (previous && previous.total > 0) {
      growth = ((total - previous.total) / previous.total) * 100;
    }

    results.push({
      key: monthKey,
      label,
      total,
      growth,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return results;
};
