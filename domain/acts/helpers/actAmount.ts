export const getActItemAmount = (quantity: string, unitPrice: string): number => {
  const total = parseFloat(quantity) * parseFloat(unitPrice);
  return Math.round(total * 100) / 100;
};

export const sumActItems = (amounts: number[]): number => {
  const total = amounts.reduce((acc, value) => acc + value, 0);
  return Math.round(total * 100) / 100;
};
