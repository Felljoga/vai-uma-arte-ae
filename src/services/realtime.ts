import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
  setDoc,
  getDoc,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type Order } from './orders';
import { type UserRole } from './admin';

// ===============================
// SISTEMA DE PRESENÇA ONLINE
// ===============================

export interface UserPresence {
  uid: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  isOnline: boolean;
  lastSeen: Date;
  currentPage?: string;
}

// Update user presence
export async function updatePresence(
  uid: string,
  displayName: string,
  photoURL: string | null,
  role: UserRole,
  isOnline: boolean,
  currentPage?: string
): Promise<void> {
  const presenceRef = doc(db, 'presence', uid);
  await setDoc(presenceRef, {
    uid,
    displayName,
    photoURL,
    role,
    isOnline,
    lastSeen: serverTimestamp(),
    currentPage: currentPage || null,
  }, { merge: true });
}

// Set user offline
export async function setUserOffline(uid: string): Promise<void> {
  const presenceRef = doc(db, 'presence', uid);
  await updateDoc(presenceRef, {
    isOnline: false,
    lastSeen: serverTimestamp(),
  });
}

// Subscribe to online users (real-time)
export function subscribeToOnlineUsers(
  callback: (users: UserPresence[]) => void
): () => void {
  const presenceRef = collection(db, 'presence');
  const q = query(presenceRef, where('isOnline', '==', true));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const users: UserPresence[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        displayName: data.displayName,
        photoURL: data.photoURL,
        role: data.role || 'member',
        isOnline: data.isOnline,
        lastSeen: (data.lastSeen as Timestamp)?.toDate() || new Date(),
        currentPage: data.currentPage,
      };
    });
    callback(users);
  });

  return unsubscribe;
}

// Subscribe to all users presence (for admin)
export function subscribeToAllPresence(
  callback: (users: UserPresence[]) => void
): () => void {
  const presenceRef = collection(db, 'presence');
  const q = query(presenceRef, orderBy('lastSeen', 'desc'), limit(100));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const users: UserPresence[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        displayName: data.displayName,
        photoURL: data.photoURL,
        role: data.role || 'member',
        isOnline: data.isOnline,
        lastSeen: (data.lastSeen as Timestamp)?.toDate() || new Date(),
        currentPage: data.currentPage,
      };
    });
    callback(users);
  });

  return unsubscribe;
}

// ===============================
// PEDIDOS EM TEMPO REAL
// ===============================

// Subscribe to user's orders (real-time)
export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void
): () => void {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders: Order[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
        completedAt: data.completedAt ? (data.completedAt as Timestamp).toDate() : undefined,
      } as Order;
    });
    callback(orders);
  });

  return unsubscribe;
}

// Subscribe to all orders (for admin/mod - real-time)
export function subscribeToAllOrders(
  callback: (orders: Order[]) => void,
  limitCount: number = 100
): () => void {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(limitCount));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders: Order[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
        completedAt: data.completedAt ? (data.completedAt as Timestamp).toDate() : undefined,
      } as Order;
    });
    callback(orders);
  });

  return unsubscribe;
}

// ===============================
// CONQUISTAS/ACHIEVEMENTS EM TEMPO REAL
// ===============================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export const ACHIEVEMENTS_CONFIG: Record<string, {
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  maxProgress?: number;
}> = {
  first_order: {
    name: 'Primeiro Pedido',
    description: 'Faça seu primeiro pedido na plataforma',
    icon: '🎯',
    condition: (stats) => stats.ordersCount >= 1,
  },
  five_orders: {
    name: '5 Pedidos',
    description: 'Complete 5 pedidos na plataforma',
    icon: '🔥',
    condition: (stats) => stats.ordersCount >= 5,
    maxProgress: 5,
  },
  ten_orders: {
    name: '10 Pedidos',
    description: 'Complete 10 pedidos na plataforma',
    icon: '🚀',
    condition: (stats) => stats.ordersCount >= 10,
    maxProgress: 10,
  },
  first_post: {
    name: 'Primeiro Post',
    description: 'Crie seu primeiro tópico no fórum',
    icon: '📝',
    condition: (stats) => stats.forumPosts >= 1,
  },
  social_butterfly: {
    name: 'Borboleta Social',
    description: 'Faça 10 comentários no fórum',
    icon: '🦋',
    condition: (stats) => stats.forumReplies >= 10,
    maxProgress: 10,
  },
  early_adopter: {
    name: 'Pioneiro',
    description: 'Seja um dos primeiros 100 usuários',
    icon: '⭐',
    condition: (stats) => stats.isEarlyAdopter,
  },
  pro_member: {
    name: 'Membro Pro',
    description: 'Assine o plano Pro ou superior',
    icon: '💎',
    condition: (stats) => ['pro', 'studio', 'agency'].includes(stats.plan),
  },
  points_100: {
    name: 'Colecionador',
    description: 'Acumule 100 pontos',
    icon: '💰',
    condition: (stats) => stats.points >= 100,
    maxProgress: 100,
  },
  points_500: {
    name: 'Mestre',
    description: 'Acumule 500 pontos',
    icon: '🏆',
    condition: (stats) => stats.points >= 500,
    maxProgress: 500,
  },
  points_1000: {
    name: 'Lendário',
    description: 'Acumule 1000 pontos',
    icon: '👑',
    condition: (stats) => stats.points >= 1000,
    maxProgress: 1000,
  },
};

export interface UserStats {
  ordersCount: number;
  forumPosts: number;
  forumReplies: number;
  points: number;
  plan: string;
  isEarlyAdopter: boolean;
}

// Subscribe to user achievements (real-time)
export function subscribeToUserAchievements(
  userId: string,
  callback: (achievements: Achievement[]) => void
): () => void {
  const userRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    if (!snapshot.exists()) return callback([]);

    const data = snapshot.data();
    const userBadges = data.badges || [];
    const stats: UserStats = {
      ordersCount: data.ordersCount || 0,
      forumPosts: data.forumPosts || 0,
      forumReplies: data.forumReplies || 0,
      points: data.points || 0,
      plan: data.plan || 'free',
      isEarlyAdopter: data.isEarlyAdopter || false,
    };

    const achievements: Achievement[] = Object.entries(ACHIEVEMENTS_CONFIG).map(([id, config]) => {
      const isUnlocked = userBadges.includes(id) || config.condition(stats);
      
      // Calculate progress for progressive achievements
      let progress: number | undefined;
      if (config.maxProgress) {
        if (id.includes('orders')) progress = stats.ordersCount;
        else if (id.includes('points')) progress = stats.points;
        else if (id === 'social_butterfly') progress = stats.forumReplies;
      }

      return {
        id,
        name: config.name,
        description: config.description,
        icon: config.icon,
        unlockedAt: isUnlocked ? new Date() : undefined,
        progress,
        maxProgress: config.maxProgress,
      };
    });

    callback(achievements);
  });

  return unsubscribe;
}

// Check and award new achievements
export async function checkAndAwardAchievements(userId: string): Promise<string[]> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return [];

  const data = userSnap.data();
  const currentBadges = data.badges || [];
  const stats: UserStats = {
    ordersCount: data.ordersCount || 0,
    forumPosts: data.forumPosts || 0,
    forumReplies: data.forumReplies || 0,
    points: data.points || 0,
    plan: data.plan || 'free',
    isEarlyAdopter: data.isEarlyAdopter || false,
  };

  const newBadges: string[] = [];

  for (const [id, config] of Object.entries(ACHIEVEMENTS_CONFIG)) {
    if (!currentBadges.includes(id) && config.condition(stats)) {
      newBadges.push(id);
    }
  }

  if (newBadges.length > 0) {
    await updateDoc(userRef, {
      badges: [...currentBadges, ...newBadges],
    });
  }

  return newBadges;
}

// ===============================
// NOTIFICAÇÕES EM TEMPO REAL
// ===============================

export interface Notification {
  id: string;
  userId: string;
  type: 'order_update' | 'new_message' | 'achievement' | 'system' | 'mention';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

// Subscribe to user notifications (real-time)
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): () => void {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(50));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifications: Notification[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      } as Notification;
    });
    callback(notifications);
  });

  return unsubscribe;
}

// ===============================
// STATS EM TEMPO REAL (ADMIN)
// ===============================

export interface RealtimeStats {
  onlineUsers: number;
  pendingOrders: number;
  activeChats: number;
  todayOrders: number;
  todayRevenue: number;
}

// Subscribe to platform stats (real-time for admin)
export function subscribeToPlatformStats(
  callback: (stats: RealtimeStats) => void
): () => void {
  // Listen to presence for online users
  const presenceRef = collection(db, 'presence');
  const onlineQuery = query(presenceRef, where('isOnline', '==', true));
  
  // Listen to orders for pending count
  const ordersRef = collection(db, 'orders');
  const pendingQuery = query(ordersRef, where('status', '==', 'pending'));
  
  // Track stats
  let onlineUsers = 0;
  let pendingOrders = 0;

  const unsubOnline = onSnapshot(onlineQuery, (snapshot) => {
    onlineUsers = snapshot.size;
    callback({
      onlineUsers,
      pendingOrders,
      activeChats: 0,
      todayOrders: 0,
      todayRevenue: 0,
    });
  });

  const unsubPending = onSnapshot(pendingQuery, (snapshot) => {
    pendingOrders = snapshot.size;
    callback({
      onlineUsers,
      pendingOrders,
      activeChats: 0,
      todayOrders: 0,
      todayRevenue: 0,
    });
  });

  return () => {
    unsubOnline();
    unsubPending();
  };
}
