import {
  collection,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// User Role Types
export type UserRole = 'owner' | 'admin' | 'moderator' | 'client' | 'member';

// Owner email - this is the main admin
export const OWNER_EMAIL = 'wandersonsilvasantos2@gmail.com';

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 100,
  admin: 80,
  moderator: 60,
  client: 40,
  member: 20,
};

// Role configuration
export const ROLE_CONFIG: Record<UserRole, {
  name: string;
  displayName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradient: string;
  badge: string;
  icon: string;
}> = {
  owner: {
    name: 'owner',
    displayName: 'Fundador',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    badge: '👑',
    icon: 'Crown',
  },
  admin: {
    name: 'admin',
    displayName: 'Administrador',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    gradient: 'from-red-500 to-rose-600',
    badge: '🛡️',
    icon: 'Shield',
  },
  moderator: {
    name: 'moderator',
    displayName: 'Moderador',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    gradient: 'from-purple-500 to-violet-600',
    badge: '⚔️',
    icon: 'Sword',
  },
  client: {
    name: 'client',
    displayName: 'Cliente',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    gradient: 'from-green-500 to-emerald-600',
    badge: '✓',
    icon: 'Check',
  },
  member: {
    name: 'member',
    displayName: 'Membro',
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-500/20',
    borderColor: 'border-zinc-500/50',
    gradient: 'from-zinc-500 to-zinc-600',
    badge: '●',
    icon: 'User',
  },
};

// Check if user is owner
export function isOwner(email: string | null): boolean {
  return email === OWNER_EMAIL;
}

// Check if user has permission based on role
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Get user role from email or role field
export function getUserRole(email: string | null, role?: UserRole): UserRole {
  if (isOwner(email)) return 'owner';
  return role || 'member';
}

// Admin user interface
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  plan: string;
  points: number;
  level: number;
  ordersCount: number;
  createdAt: Date;
  lastLogin?: Date;
  isOnline?: boolean;
  isBanned?: boolean;
  banReason?: string;
}

// Get all users (admin only)
export async function getAllUsers(limitCount: number = 100): Promise<AdminUser[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      role: getUserRole(data.email, data.role),
      plan: data.plan || 'free',
      points: data.points || 0,
      level: data.level || 1,
      ordersCount: data.ordersCount || 0,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      lastLogin: (data.lastLogin as Timestamp)?.toDate(),
      isOnline: data.isOnline || false,
      isBanned: data.isBanned || false,
      banReason: data.banReason,
    } as AdminUser;
  });
}

// Update user role
export async function updateUserRole(targetUid: string, newRole: UserRole): Promise<void> {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, {
    role: newRole,
    updatedAt: serverTimestamp(),
  });
}

// Ban user
export async function banUser(targetUid: string, reason: string): Promise<void> {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, {
    isBanned: true,
    banReason: reason,
    updatedAt: serverTimestamp(),
  });
}

// Unban user
export async function unbanUser(targetUid: string): Promise<void> {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, {
    isBanned: false,
    banReason: null,
    updatedAt: serverTimestamp(),
  });
}

// Update user plan
export async function updateUserPlan(targetUid: string, plan: string): Promise<void> {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, {
    plan,
    updatedAt: serverTimestamp(),
  });
}

// Add points to user
export async function addPointsToUser(targetUid: string, points: number): Promise<void> {
  const userRef = doc(db, 'users', targetUid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentPoints = userSnap.data().points || 0;
    await updateDoc(userRef, {
      points: currentPoints + points,
      updatedAt: serverTimestamp(),
    });
  }
}

// Get platform stats
export interface PlatformStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeUsers: number;
  newUsersToday: number;
  newOrdersToday: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get users
  const usersRef = collection(db, 'users');
  const usersSnap = await getDocs(usersRef);
  const totalUsers = usersSnap.size;
  
  // New users today
  const newUsersQuery = query(usersRef, where('createdAt', '>=', today));
  const newUsersSnap = await getDocs(newUsersQuery);
  const newUsersToday = newUsersSnap.size;
  
  // Get orders
  const ordersRef = collection(db, 'orders');
  const ordersSnap = await getDocs(ordersRef);
  const totalOrders = ordersSnap.size;
  
  // Calculate revenue
  let totalRevenue = 0;
  let pendingOrders = 0;
  ordersSnap.docs.forEach((doc) => {
    const data = doc.data();
    if (data.status === 'completed') {
      totalRevenue += data.price || 0;
    }
    if (data.status === 'pending') {
      pendingOrders++;
    }
  });
  
  // New orders today
  const newOrdersQuery = query(ordersRef, where('createdAt', '>=', today));
  const newOrdersSnap = await getDocs(newOrdersQuery);
  const newOrdersToday = newOrdersSnap.size;
  
  return {
    totalUsers,
    totalOrders,
    totalRevenue,
    pendingOrders,
    activeUsers: 0, // Would need real-time presence system
    newUsersToday,
    newOrdersToday,
  };
}

// Get all orders (admin)
export interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  title: string;
  type: string;
  price: number;
  status: string;
  createdAt: Date;
}

export async function getAllOrders(limitCount: number = 100): Promise<AdminOrder[]> {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  
  const orders: AdminOrder[] = [];
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    
    // Get user name
    let userName = 'Usuário desconhecido';
    try {
      const userRef = doc(db, 'users', data.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        userName = userSnap.data().displayName || userName;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    
    orders.push({
      id: docSnap.id,
      userId: data.userId,
      userName,
      title: data.title,
      type: data.type,
      price: data.price || 0,
      status: data.status,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    });
  }
  
  return orders;
}

// Update order status (admin)
export async function adminUpdateOrderStatus(orderId: string, status: string): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

// Create channel (admin)
export async function createChannel(
  name: string,
  description: string,
  icon: string,
  color: string,
  isPrivate: boolean,
  allowedRoles: string[]
): Promise<void> {
  const channelsRef = collection(db, 'forumChannels');
  const snapshot = await getDocs(channelsRef);
  const order = snapshot.size;
  
  const { addDoc } = await import('firebase/firestore');
  await addDoc(channelsRef, {
    name,
    description,
    icon,
    color,
    order,
    isPrivate,
    allowedRoles,
    createdAt: serverTimestamp(),
  });
}
