
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

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  location?: string;
  note?: string;
}
