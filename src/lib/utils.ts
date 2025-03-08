
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTrackingId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const prefix = "TRK";
  let result = prefix;
  
  for (let i = 0; i < 9; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-100";
    case "processing":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "shipped":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "in_transit":
      return "bg-purple-50 text-purple-700 border-purple-100";
    case "out_for_delivery":
      return "bg-orange-50 text-orange-700 border-orange-100";
    case "delivered":
      return "bg-green-50 text-green-700 border-green-100";
    case "failed_delivery":
      return "bg-red-50 text-red-700 border-red-100";
    case "returned":
      return "bg-gray-50 text-gray-700 border-gray-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-100";
  }
}

export function getStatusLabel(status: OrderStatus): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getEstimatedDelivery(createdAt: Date): Date {
  const result = new Date(createdAt);
  result.setDate(result.getDate() + Math.floor(Math.random() * 3) + 3); // Random between 3-5 days
  return result;
}
