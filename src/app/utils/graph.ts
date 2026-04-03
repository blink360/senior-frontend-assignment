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


const TITLES = [
  'Dinner with Client',
  'Uber to Airport',
  'WeWork Pass',
  'Figma Subscription',
  'AWS Hosting',
  'Office Snacks',
  'Team Lunch',
  'Flight Booking',
  'Hotel Stay',
  'Conference Ticket',
];

const CATEGORIES = [
  'Travel',
  'Software',
  'Meals',
  'Office Supplies',
  'Entertainment',
];

const EMPLOYEES = [
  'Jane Doe',
  'John Smith',
  'Alice Johnson',
  'Bob Brown',
  'Emily Davis',
];

const STATUSES: Expense['status'][] = [
  'pending',
  'approved',
  'rejected',
];

const getRandomDate = () => {
  const now = Date.now();
  const fiveYearsAgo = now - 5 * 365 * 24 * 60 * 60 * 1000;

  const randomTime =
    fiveYearsAgo + Math.random() * (now - fiveYearsAgo);

  return new Date(randomTime).toISOString();
};

export const INITIAL_DATA: Expense[] = Array.from(
  { length: 200 },
  (_, i) => ({
    id: `exp-${i + 1}`,
    title: TITLES[i % TITLES.length],
    amount: Number(
      (Math.random() * 1000 + 20).toFixed(2)
    ), 
    status:
      STATUSES[Math.floor(Math.random() * STATUSES.length)],
    category:
      CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    employee:
      EMPLOYEES[Math.floor(Math.random() * EMPLOYEES.length)],
    date: getRandomDate(),
  })
);