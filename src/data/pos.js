export const TAX_RATE = 0.04712;

export const round2 = (value) => Math.round(value * 100) / 100;

export function computeTotals(lines, taxRate = TAX_RATE) {
  const subtotal = round2(
    lines.reduce((sum, line) => sum + line.price * line.qty, 0)
  );
  const tax = round2(subtotal * taxRate);
  const total = round2(subtotal + tax);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  return { subtotal, tax, total, count };
}

export function serializeHistory(list) {
  return list.map((receipt) => ({
    ...receipt,
    createdAt:
      receipt.createdAt instanceof Date
        ? receipt.createdAt.toISOString()
        : receipt.createdAt,
  }));
}

export function reviveHistory(list) {
  return list.map((receipt) => ({
    ...receipt,
    createdAt: new Date(receipt.createdAt),
  }));
}
