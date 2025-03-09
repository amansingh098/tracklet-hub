
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, OrderStatus, StatusUpdate, PaymentStatus, DashboardMetrics } from "./types";
import { generateTrackingId, getEstimatedDelivery } from "./utils";
import { toast } from "sonner";

const ORDERS_COLLECTION = "orders";

// Convert Firestore timestamps to JavaScript Date objects
const convertOrder = (doc: any): Order => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    estimatedDelivery: data.estimatedDelivery?.toDate() || new Date(),
    statusHistory: data.statusHistory.map((update: any) => ({
      ...update,
      timestamp: update.timestamp.toDate(),
    })),
  };
};

export const createOrder = async (orderData: Omit<Order, 'trackingId' | 'status' | 'createdAt' | 'updatedAt' | 'estimatedDelivery' | 'statusHistory' | 'paymentStatus'>): Promise<Order> => {
  try {
    const trackingId = generateTrackingId();
    const now = new Date();
    const estimatedDelivery = getEstimatedDelivery(now);
    
    const initialStatusUpdate: StatusUpdate = {
      status: "pending",
      timestamp: now,
      note: "Order received and pending processing",
    };
    
    // Set default payment status if not provided
    const paymentStatus: PaymentStatus = orderData.amount > 0 ? 
      (orderData.transactionId ? "paid" : "unpaid") : 
      "unpaid";
    
    const newOrder: Omit<Order, 'id'> = {
      ...orderData,
      trackingId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      estimatedDelivery,
      statusHistory: [initialStatusUpdate],
      paymentStatus,
    };
    
    // Use server timestamp for more accuracy
    const firestoreData = {
      ...newOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      estimatedDelivery: Timestamp.fromDate(estimatedDelivery),
      statusHistory: [
        {
          ...initialStatusUpdate,
          timestamp: Timestamp.fromDate(initialStatusUpdate.timestamp),
        },
      ],
    };
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), firestoreData);
    console.log("Order created with ID:", docRef.id);
    
    // Create a complete order object with the ID
    const newOrderWithId: Order = {
      ...newOrder,
      id: docRef.id,
    };
    
    return newOrderWithId;
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("Failed to create order in database");
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertOrder(docSnap);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting order by ID:", error);
    toast.error("Failed to retrieve order from database");
    throw error;
  }
};

export const getOrderByTrackingId = async (trackingId: string): Promise<Order | null> => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, where("trackingId", "==", trackingId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return convertOrder(doc);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting order by tracking ID:", error);
    toast.error("Failed to retrieve order from database");
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(convertOrder);
    console.log(`Retrieved ${orders.length} orders from Firestore`);
    return orders;
  } catch (error) {
    console.error("Error getting all orders:", error);
    toast.error("Failed to retrieve orders from database");
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  location?: string,
  note?: string
): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      toast.error("Order not found in database");
      return null;
    }
    
    const now = new Date();
    const statusUpdate: StatusUpdate = {
      status,
      timestamp: now,
      location,
      note,
    };
    
    const currentOrder = convertOrder(docSnap);
    
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
      statusHistory: [
        ...currentOrder.statusHistory,
        {
          ...statusUpdate,
          timestamp: Timestamp.fromDate(now),
        },
      ],
    });
    
    console.log(`Updated order ${orderId} status to ${status}`);
    
    const updatedDocSnap = await getDoc(docRef);
    return convertOrder(updatedDocSnap);
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update order status in database");
    throw error;
  }
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus,
  transactionId?: string
): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      toast.error("Order not found in database");
      return null;
    }
    
    const updateData: any = {
      paymentStatus,
      updatedAt: serverTimestamp(),
    };
    
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    
    await updateDoc(docRef, updateData);
    
    console.log(`Updated order ${orderId} payment status to ${paymentStatus}`);
    
    const updatedDocSnap = await getDoc(docRef);
    return convertOrder(updatedDocSnap);
  } catch (error) {
    console.error("Error updating payment status:", error);
    toast.error("Failed to update payment status in database");
    throw error;
  }
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const orders = await getAllOrders();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    
    const pendingOrders = orders.filter(order => 
      ["pending", "processing"].includes(order.status)).length;
    
    const deliveredOrders = orders.filter(order => 
      order.status === "delivered").length;
    
    const inTransitOrders = orders.filter(order => 
      ["shipped", "in_transit", "out_for_delivery"].includes(order.status)).length;
    
    // Calculate average delivery time for delivered orders
    const deliveredOrdersWithDuration = orders
      .filter(order => order.status === "delivered")
      .map(order => {
        const deliveredUpdate = order.statusHistory.find(update => update.status === "delivered");
        if (!deliveredUpdate) return null;
        
        const deliveryDuration = deliveredUpdate.timestamp.getTime() - order.createdAt.getTime();
        return deliveryDuration / (1000 * 60 * 60 * 24); // Convert to days
      })
      .filter((duration): duration is number => duration !== null);
    
    const averageDeliveryTime = deliveredOrdersWithDuration.length > 0
      ? deliveredOrdersWithDuration.reduce((sum, duration) => sum + duration, 0) / deliveredOrdersWithDuration.length
      : 0;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      inTransitOrders,
      averageDeliveryTime
    };
  } catch (error) {
    console.error("Error calculating dashboard metrics:", error);
    toast.error("Failed to calculate dashboard metrics");
    throw error;
  }
};
