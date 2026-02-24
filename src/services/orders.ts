import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Order {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'logo' | 'social' | 'illustration' | 'ui' | 'branding' | 'package';
  complexity: 'simple' | 'medium' | 'complex' | 'premium';
  deadline: 'urgent' | 'fast' | 'normal' | 'relaxed';
  revisions: number;
  isCommercial: boolean;
  price: number;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  files?: string[];
  messages?: Message[];
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  isAdmin: boolean;
}

export interface CreateOrderData {
  userId: string;
  title: string;
  description: string;
  type: Order['type'];
  complexity: Order['complexity'];
  deadline: Order['deadline'];
  revisions: number;
  isCommercial: boolean;
  price: number;
}

// Create a new order
export async function createOrder(data: CreateOrderData): Promise<string> {
  const ordersRef = collection(db, 'orders');
  
  const orderData = {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    files: [],
    messages: [],
  };

  const docRef = await addDoc(ordersRef, orderData);
  
  // Update user's order count
  const userRef = doc(db, 'users', data.userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const currentCount = userSnap.data().ordersCount || 0;
    await updateDoc(userRef, {
      ordersCount: currentCount + 1,
      // Add points for creating order
      points: (userSnap.data().points || 0) + 10,
    });
  }

  return docRef.id;
}

// Get orders for a user
export async function getUserOrders(userId: string): Promise<Order[]> {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      completedAt: data.completedAt ? (data.completedAt as Timestamp).toDate() : undefined,
    } as Order;
  });
}

// Get single order
export async function getOrder(orderId: string): Promise<Order | null> {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) return null;

  const data = orderSnap.data();
  return {
    id: orderSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    completedAt: data.completedAt ? (data.completedAt as Timestamp).toDate() : undefined,
  } as Order;
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (status === 'completed') {
    updateData.completedAt = serverTimestamp();
  }

  await updateDoc(orderRef, updateData);
}

// Add message to order
export async function addOrderMessage(
  orderId: string,
  userId: string,
  content: string,
  isAdmin: boolean = false
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) throw new Error('Order not found');

  const currentMessages = orderSnap.data().messages || [];
  const newMessage: Omit<Message, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    id: `msg_${Date.now()}`,
    userId,
    content,
    isAdmin,
    createdAt: serverTimestamp(),
  };

  await updateDoc(orderRef, {
    messages: [...currentMessages, newMessage],
    updatedAt: serverTimestamp(),
  });
}

// Cancel order
export async function cancelOrder(orderId: string): Promise<void> {
  await updateOrderStatus(orderId, 'cancelled');
}

// Delete order (admin only in production)
export async function deleteOrder(orderId: string): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await deleteDoc(orderRef);
}
