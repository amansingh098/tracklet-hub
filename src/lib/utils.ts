// Format a date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Generate a random tracking ID
export function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // First 2 characters are always letters
  for (let i = 0; i < 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * 26));
  }
  
  result += '-';
  
  // Next 6 characters are numbers
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * 10) + 26);
  }
  
  result += '-';
  
  // Last 2 characters are letters
  for (let i = 0; i < 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * 26));
  }
  
  return result;
}

// Calculate estimated delivery date (5-7 business days from creation)
export function getEstimatedDelivery(fromDate: Date): Date {
  const deliveryDate = new Date(fromDate);
  // Add 5-7 days
  const daysToAdd = Math.floor(Math.random() * 3) + 5;
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  return deliveryDate;
}
