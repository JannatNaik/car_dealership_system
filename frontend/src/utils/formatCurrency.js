// formatCurrency.js - Formats a numeric price as Indian Rupees, e.g. 4200000 -> "₹42,00,000"

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
