export const convertDollarToCents = (amount: number): number =>
  Math.round(amount * 100);

export const convertCentsToDollar = (cents: number): number => cents / 100;

export const splitShares = (totalCents: number, count: number): number[] => {
  if (count === 0) return [];

  const baseShare = Math.floor(totalCents / count);
  const leftoverCents = totalCents % count;

  const result: number[] = [];

  for (let i = 0; i < count; i++) {
    const centsForThisIndex = i < leftoverCents ? baseShare + 1 : baseShare;
    result.push(convertCentsToDollar(centsForThisIndex));
  }
  
  return result;
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
