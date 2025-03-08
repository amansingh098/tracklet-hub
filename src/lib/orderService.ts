
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
import { Order, OrderStatus, StatusUpdate } from "./types";
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

export const createOrder = async (orderData: Omit<Order, 'trackingId' | 'status' | 'createdAt' | 'updatedAt' | 'estimatedDelivery' | 'statusHistory'>): Promise<Order> => {
  try {
    const trackingId = generateTrackingId();
    const now = new Date();
    const estimatedDelivery = getEstimatedDelivery(now);
    
    const initialStatusUpdate: StatusUpdate = {
      status: "pending",
      timestamp: now,
      note: "Order received and pending processing",
    };
    
    const newOrder: Omit<Order, 'id'> = {
      ...orderData,
      trackingId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      estimatedDelivery,
      statusHistory: [initialStatusUpdate],
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
