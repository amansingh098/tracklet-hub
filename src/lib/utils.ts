
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "./types";

// Utility for merging Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// Get the appropriate color class for a status badge
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case 'processing':
      return "bg-blue-50 text-blue-600 border-blue-200";
    case 'shipped':
      return "bg-indigo-50 text-indigo-600 border-indigo-200";
    case 'in_transit':
      return "bg-purple-50 text-purple-600 border-purple-200";
    case 'out_for_delivery':
      return "bg-cyan-50 text-cyan-600 border-cyan-200";
    case 'delivered':
      return "bg-green-50 text-green-600 border-green-200";
    case 'failed_delivery':
      return "bg-red-50 text-red-600 border-red-200";
    case 'returned':
      return "bg-gray-50 text-gray-600 border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

// Get the human-readable label for a status
export function getStatusLabel(status: OrderStatus): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
