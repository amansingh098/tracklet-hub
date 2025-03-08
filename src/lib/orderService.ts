
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
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, OrderStatus, StatusUpdate } from "./types";
import { generateTrackingId, getEstimatedDelivery } from "./utils";

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
  
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...newOrder,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    estimatedDelivery: Timestamp.fromDate(estimatedDelivery),
    statusHistory: [
      {
        ...initialStatusUpdate,
        timestamp: Timestamp.fromDate(initialStatusUpdate.timestamp),
      },
    ],
  });
  
  const newOrderWithId: Order = {
    ...newOrder,
    id: docRef.id,
  };
  
  return newOrderWithId;
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return convertOrder(docSnap);
  }
  
  return null;
};

export const getOrderByTrackingId = async (trackingId: string): Promise<Order | null> => {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, where("trackingId", "==", trackingId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return convertOrder(doc);
  }
  
  return null;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(convertOrder);
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  location?: string,
  note?: string
): Promise<Order | null> => {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
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
    updatedAt: Timestamp.fromDate(now),
    statusHistory: [
      ...currentOrder.statusHistory,
      {
        ...statusUpdate,
        timestamp: Timestamp.fromDate(now),
      },
    ],
  });
  
  const updatedDocSnap = await getDoc(docRef);
  return convertOrder(updatedDocSnap);
};
