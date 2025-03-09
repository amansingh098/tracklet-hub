
export interface Order {
  id?: string;
  trackingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  senderAddress: string;
  receiverAddress: string;
  packageDescription: string;
  weight: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery: Date;
  statusHistory: StatusUpdate[];
  // Payment information
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
}

export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "in_transit" 
  | "out_for_delivery" 
  | "delivered" 
  | "failed_delivery" 
  | "returned";

export type PaymentStatus = 
  | "unpaid"
  | "paid"
  | "partially_paid"
  | "refunded";

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  location?: string;
  note?: string;
}

// Dashboard metrics interface
export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  inTransitOrders: number;
  averageDeliveryTime: number;
}
