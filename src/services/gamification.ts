import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  increment,
  arrayUnion,
  serverTimestamp,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ==================== SISTEMA DE NÍVEIS ====================

export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
  benefits: string[];
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Novato', minXP: 0, maxXP: 99, color: 'from-zinc-400 to-zinc-500', icon: '🌱', benefits: ['Acesso básico à comunidade'] },
  { level: 2, name: 'Iniciante', minXP: 100, maxXP: 249, color: 'from-zinc-400 to-zinc-500', icon: '🌿', benefits: ['Pode criar tópicos no fórum'] },
  { level: 3, name: 'Aprendiz', minXP: 250, maxXP: 499, color: 'from-green-400 to-green-500', icon: '📗', benefits: ['Pode comentar em artes'] },
  { level: 4, name: 'Aspirante', minXP: 500, maxXP: 999, color: 'from-green-400 to-emerald-500', icon: '⭐', benefits: ['Badge de Aspirante'] },
  { level: 5, name: 'Criador', minXP: 1000, maxXP: 1999, color: 'from-blue-400 to-blue-500', icon: '🎨', benefits: ['Pode publicar artes', 'Acesso ao chat VIP'] },
  { level: 6, name: 'Artista', minXP: 2000, maxXP: 3499, color: 'from-blue-400 to-indigo-500', icon: '🖌️', benefits: ['Moldura especial no perfil'] },
  { level: 7, name: 'Designer', minXP: 3500, maxXP: 5499, color: 'from-purple-400 to-purple-500', icon: '💎', benefits: ['Destaque no ranking'] },
  { level: 8, name: 'Expert', minXP: 5500, maxXP: 7999, color: 'from-purple-400 to-pink-500', icon: '🔥', benefits: ['Pode criar eventos', 'Badge exclusivo'] },
  { level: 9, name: 'Mestre', minXP: 8000, maxXP: 11999, color: 'from-amber-400 to-orange-500', icon: '👑', benefits: ['Prioridade em pedidos', 'Desconto de 10%'] },
  { level: 10, name: 'Lenda', minXP: 12000, maxXP: 17999, color: 'from-amber-400 to-red-500', icon: '🏆', benefits: ['Todas as vantagens anteriores', 'Acesso antecipado'] },
  { level: 11, name: 'Supremo', minXP: 18000, maxXP: 24999, color: 'from-red-400 to-rose-500', icon: '⚡', benefits: ['Badge animado', 'Canal exclusivo'] },
  { level: 12, name: 'Imortal', minXP: 25000, maxXP: Infinity, color: 'from-rose-400 to-purple-600', icon: '🌟', benefits: ['Status máximo', 'Vantagens vitalícias'] },
];

export function getLevelFromXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXP(xp);
  
  if (level.level >= LEVELS.length) {
    return { current: xp, needed: xp, percentage: 100 };
  }
  
  const xpInLevel = xp - level.minXP;
  const xpNeeded = level.maxXP - level.minXP + 1;
  const percentage = Math.min((xpInLevel / xpNeeded) * 100, 100);
  
  return { current: xpInLevel, needed: xpNeeded, percentage };
}

// ==================== SISTEMA DE XP ====================

export interface XPAction {
  action: string;
  xp: number;
  description: string;
  icon: string;
  cooldown?: number; // em milissegundos
}

export const XP_ACTIONS: Record<string, XPAction> = {
  CREATE_ACCOUNT: { action: 'create_account', xp: 100, description: 'Criar conta', icon: '🎉' },
  COMPLETE_PROFILE: { action: 'complete_profile', xp: 50, description: 'Completar perfil', icon: '✅' },
  FIRST_ORDER: { action: 'first_order', xp: 200, description: 'Primeiro pedido', icon: '🛒' },
  COMPLETE_ORDER: { action: 'complete_order', xp: 100, description: 'Completar pedido', icon: '📦' },
  CREATE_THREAD: { action: 'create_thread', xp: 30, description: 'Criar tópico', icon: '💬' },
  REPLY_THREAD: { action: 'reply_thread', xp: 15, description: 'Responder tópico', icon: '💭' },
  RECEIVE_LIKE: { action: 'receive_like', xp: 5, description: 'Receber curtida', icon: '❤️' },
  GIVE_LIKE: { action: 'give_like', xp: 2, description: 'Curtir algo', icon: '👍' },
  DAILY_LOGIN: { action: 'daily_login', xp: 10, description: 'Login diário', icon: '📅', cooldown: 86400000 },
  PUBLISH_ARTWORK: { action: 'publish_artwork', xp: 50, description: 'Publicar arte', icon: '🎨' },
  RECEIVE_COMMENT: { action: 'receive_comment', xp: 10, description: 'Receber comentário', icon: '💬' },
  RATE_ORDER: { action: 'rate_order', xp: 25, description: 'Avaliar pedido', icon: '⭐' },
  REFER_FRIEND: { action: 'refer_friend', xp: 100, description: 'Indicar amigo', icon: '👥' },
  WIN_CHALLENGE: { action: 'win_challenge', xp: 500, description: 'Vencer desafio', icon: '🏆' },
  PARTICIPATE_EVENT: { action: 'participate_event', xp: 75, description: 'Participar de evento', icon: '🎪' },
  STREAK_7_DAYS: { action: 'streak_7_days', xp: 100, description: 'Sequência de 7 dias', icon: '🔥' },
  STREAK_30_DAYS: { action: 'streak_30_days', xp: 500, description: 'Sequência de 30 dias', icon: '💎' },
};

export async function addXP(userId: string, actionKey: string): Promise<{ success: boolean; xpGained: number; newTotal: number; levelUp: boolean; newLevel?: Level }> {
  const action = XP_ACTIONS[actionKey];
  if (!action) {
    return { success: false, xpGained: 0, newTotal: 0, levelUp: false };
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return { success: false, xpGained: 0, newTotal: 0, levelUp: false };
  }

  const userData = userSnap.data();
  const currentXP = userData.points || 0;
  const currentLevel = getLevelFromXP(currentXP);
  
  // Check cooldown
  if (action.cooldown) {
    const lastAction = userData.lastActions?.[actionKey];
    if (lastAction) {
      const lastTime = lastAction.toDate ? lastAction.toDate().getTime() : lastAction;
      if (Date.now() - lastTime < action.cooldown) {
        return { success: false, xpGained: 0, newTotal: currentXP, levelUp: false };
      }
    }
  }

  const newXP = currentXP + action.xp;
  const newLevel = getLevelFromXP(newXP);
  const levelUp = newLevel.level > currentLevel.level;

  // Update user
  await updateDoc(userRef, {
    points: increment(action.xp),
    [`lastActions.${actionKey}`]: serverTimestamp(),
    xpHistory: arrayUnion({
      action: actionKey,
      xp: action.xp,
      timestamp: new Date().toISOString(),
    }),
  });

  // If leveled up, check for level achievements
  if (levelUp) {
    await checkLevelAchievements(userId, newLevel.level);
  }

  return {
    success: true,
    xpGained: action.xp,
    newTotal: newXP,
    levelUp,
    newLevel: levelUp ? newLevel : undefined,
  };
}

// ==================== SISTEMA DE CONQUISTAS ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'social' | 'creator' | 'engagement' | 'special' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirement: {
    type: string;
    value: number;
  };
  secret?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Social
  { id: 'first_friend', name: 'Primeira Conexão', description: 'Siga seu primeiro criador', icon: '👋', category: 'social', rarity: 'common', xpReward: 25, requirement: { type: 'follows', value: 1 } },
  { id: 'social_butterfly', name: 'Borboleta Social', description: 'Siga 10 criadores', icon: '🦋', category: 'social', rarity: 'rare', xpReward: 100, requirement: { type: 'follows', value: 10 } },
  { id: 'influencer', name: 'Influenciador', description: 'Tenha 50 seguidores', icon: '📢', category: 'social', rarity: 'epic', xpReward: 250, requirement: { type: 'followers', value: 50 } },
  { id: 'celebrity', name: 'Celebridade', description: 'Tenha 500 seguidores', icon: '⭐', category: 'social', rarity: 'legendary', xpReward: 1000, requirement: { type: 'followers', value: 500 } },
  
  // Creator
  { id: 'first_artwork', name: 'Primeiro Passo', description: 'Publique sua primeira arte', icon: '🎨', category: 'creator', rarity: 'common', xpReward: 50, requirement: { type: 'artworks', value: 1 } },
  { id: 'portfolio_builder', name: 'Construtor de Portfólio', description: 'Publique 10 artes', icon: '📁', category: 'creator', rarity: 'rare', xpReward: 150, requirement: { type: 'artworks', value: 10 } },
  { id: 'prolific_artist', name: 'Artista Prolífico', description: 'Publique 50 artes', icon: '🖼️', category: 'creator', rarity: 'epic', xpReward: 500, requirement: { type: 'artworks', value: 50 } },
  { id: 'art_master', name: 'Mestre das Artes', description: 'Publique 100 artes', icon: '👨‍🎨', category: 'creator', rarity: 'legendary', xpReward: 1500, requirement: { type: 'artworks', value: 100 } },
  
  // Engagement
  { id: 'first_like', name: 'Coração Generoso', description: 'Dê sua primeira curtida', icon: '❤️', category: 'engagement', rarity: 'common', xpReward: 10, requirement: { type: 'likes_given', value: 1 } },
  { id: 'like_machine', name: 'Máquina de Likes', description: 'Dê 100 curtidas', icon: '💕', category: 'engagement', rarity: 'rare', xpReward: 100, requirement: { type: 'likes_given', value: 100 } },
  { id: 'popular', name: 'Popular', description: 'Receba 100 curtidas', icon: '🔥', category: 'engagement', rarity: 'rare', xpReward: 200, requirement: { type: 'likes_received', value: 100 } },
  { id: 'viral', name: 'Viral', description: 'Receba 1000 curtidas', icon: '💥', category: 'engagement', rarity: 'legendary', xpReward: 1000, requirement: { type: 'likes_received', value: 1000 } },
  { id: 'commenter', name: 'Comentarista', description: 'Faça 50 comentários', icon: '💬', category: 'engagement', rarity: 'rare', xpReward: 150, requirement: { type: 'comments', value: 50 } },
  
  // Milestones
  { id: 'level_5', name: 'Criador Oficial', description: 'Alcance o nível 5', icon: '🎯', category: 'milestone', rarity: 'common', xpReward: 100, requirement: { type: 'level', value: 5 } },
  { id: 'level_10', name: 'Lenda Viva', description: 'Alcance o nível 10', icon: '🏆', category: 'milestone', rarity: 'epic', xpReward: 500, requirement: { type: 'level', value: 10 } },
  { id: 'level_max', name: 'Imortalidade', description: 'Alcance o nível máximo', icon: '🌟', category: 'milestone', rarity: 'legendary', xpReward: 2000, requirement: { type: 'level', value: 12 } },
  { id: 'first_order', name: 'Cliente Especial', description: 'Faça seu primeiro pedido', icon: '🛒', category: 'milestone', rarity: 'common', xpReward: 50, requirement: { type: 'orders', value: 1 } },
  { id: 'loyal_customer', name: 'Cliente Fiel', description: 'Faça 10 pedidos', icon: '💎', category: 'milestone', rarity: 'rare', xpReward: 300, requirement: { type: 'orders', value: 10 } },
  
  // Special
  { id: 'early_adopter', name: 'Pioneiro', description: 'Cadastrou-se no primeiro mês', icon: '🚀', category: 'special', rarity: 'legendary', xpReward: 500, requirement: { type: 'special', value: 0 }, secret: true },
  { id: 'night_owl', name: 'Coruja Noturna', description: 'Publique algo entre 2h e 5h', icon: '🦉', category: 'special', rarity: 'rare', xpReward: 75, requirement: { type: 'special', value: 0 }, secret: true },
  { id: 'subscriber', name: 'Assinante', description: 'Assine um plano premium', icon: '💳', category: 'special', rarity: 'rare', xpReward: 200, requirement: { type: 'special', value: 0 } },
  { id: 'partner', name: 'Parceiro Oficial', description: 'Torne-se um parceiro', icon: '🤝', category: 'special', rarity: 'epic', xpReward: 500, requirement: { type: 'special', value: 0 } },
  { id: 'challenge_winner', name: 'Campeão', description: 'Vença um desafio da comunidade', icon: '🥇', category: 'special', rarity: 'epic', xpReward: 500, requirement: { type: 'special', value: 0 } },
  { id: 'streak_master', name: 'Consistência', description: 'Mantenha uma sequência de 30 dias', icon: '🔥', category: 'special', rarity: 'epic', xpReward: 300, requirement: { type: 'streak', value: 30 } },
];

export async function checkLevelAchievements(userId: string, level: number): Promise<void> {
  const levelAchievements = ACHIEVEMENTS.filter(a => a.requirement.type === 'level' && a.requirement.value === level);
  
  for (const achievement of levelAchievements) {
    await unlockAchievement(userId, achievement.id);
  }
}

export async function unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return false;

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return false;
  
  const userData = userSnap.data();
  const unlockedAchievements = userData.achievements || [];
  
  if (unlockedAchievements.includes(achievementId)) return false;

  await updateDoc(userRef, {
    achievements: arrayUnion(achievementId),
    points: increment(achievement.xpReward),
  });

  // Log achievement
  await addDoc(collection(db, 'achievementLogs'), {
    userId,
    achievementId,
    achievementName: achievement.name,
    xpReward: achievement.xpReward,
    unlockedAt: serverTimestamp(),
  });

  return true;
}

export async function getUserAchievements(userId: string): Promise<{ unlocked: string[]; progress: Record<string, number> }> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return { unlocked: [], progress: {} };
  }
  
  const userData = userSnap.data();
  return {
    unlocked: userData.achievements || [],
    progress: userData.achievementProgress || {},
  };
}

// ==================== SISTEMA DE RANKING ====================

export interface RankingUser {
  rank: number;
  id: string;
  displayName: string;
  photoURL: string | null;
  points: number;
  level: Level;
  role: string;
  achievements: string[];
}

export async function getRanking(_type: 'all' | 'weekly' | 'monthly' = 'all', limitCount: number = 50): Promise<RankingUser[]> {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    orderBy('points', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc, index) => {
    const data = doc.data();
    return {
      rank: index + 1,
      id: doc.id,
      displayName: data.displayName || 'Usuário',
      photoURL: data.photoURL || null,
      points: data.points || 0,
      level: getLevelFromXP(data.points || 0),
      role: data.role || 'user',
      achievements: data.achievements || [],
    };
  });
}

export function subscribeToRanking(limitCount: number, callback: (users: RankingUser[]) => void): () => void {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    orderBy('points', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        rank: index + 1,
        id: doc.id,
        displayName: data.displayName || 'Usuário',
        photoURL: data.photoURL || null,
        points: data.points || 0,
        level: getLevelFromXP(data.points || 0),
        role: data.role || 'user',
        achievements: data.achievements || [],
      };
    });
    callback(users);
  });
}

// ==================== SISTEMA DE EVENTOS ====================

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'contest' | 'workshop' | 'live' | 'special';
  status: 'upcoming' | 'active' | 'ended';
  startDate: Date;
  endDate: Date;
  image?: string;
  prizes: string[];
  participants: string[];
  maxParticipants?: number;
  requirements?: string[];
  xpReward: number;
  createdBy: string;
  createdAt: Date;
}

export async function getActiveEvents(): Promise<CommunityEvent[]> {
  const eventsRef = collection(db, 'events');
  const q = query(
    eventsRef,
    where('status', 'in', ['upcoming', 'active']),
    orderBy('startDate', 'asc')
  );

  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: (data.startDate as Timestamp).toDate(),
      endDate: (data.endDate as Timestamp).toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
    } as CommunityEvent;
  });
}

export async function joinEvent(eventId: string, userId: string): Promise<boolean> {
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);
  
  if (!eventSnap.exists()) return false;
  
  const eventData = eventSnap.data();
  
  if (eventData.maxParticipants && eventData.participants.length >= eventData.maxParticipants) {
    return false;
  }
  
  if (eventData.participants.includes(userId)) {
    return false;
  }

  await updateDoc(eventRef, {
    participants: arrayUnion(userId),
  });

  // Add XP for participation
  await addXP(userId, 'PARTICIPATE_EVENT');

  return true;
}

export async function createEvent(data: Omit<CommunityEvent, 'id' | 'participants' | 'createdAt'>): Promise<string> {
  const eventsRef = collection(db, 'events');
  
  const eventData = {
    ...data,
    participants: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(eventsRef, eventData);
  return docRef.id;
}

export function subscribeToEvents(callback: (events: CommunityEvent[]) => void): () => void {
  const eventsRef = collection(db, 'events');
  const q = query(
    eventsRef,
    orderBy('startDate', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: (data.startDate as Timestamp)?.toDate() || new Date(),
        endDate: (data.endDate as Timestamp)?.toDate() || new Date(),
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      } as CommunityEvent;
    });
    callback(events);
  });
}

// ==================== SISTEMA DE STREAK (SEQUÊNCIA) ====================

export async function checkDailyLogin(userId: string): Promise<{ streak: number; xpGained: number }> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return { streak: 0, xpGained: 0 };
  }

  const userData = userSnap.data();
  const lastLogin = userData.lastLoginDate?.toDate?.() || null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = userData.loginStreak || 0;
  let xpGained = 0;

  if (lastLogin) {
    const lastLoginDate = new Date(lastLogin);
    lastLoginDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Already logged in today
      return { streak, xpGained: 0 };
    } else if (diffDays === 1) {
      // Consecutive day
      streak++;
    } else {
      // Streak broken
      streak = 1;
    }
  } else {
    streak = 1;
  }

  // Calculate XP based on streak
  xpGained = Math.min(10 + (streak * 2), 50); // 10-50 XP based on streak

  await updateDoc(userRef, {
    loginStreak: streak,
    lastLoginDate: serverTimestamp(),
    points: increment(xpGained),
  });

  // Check streak achievements
  if (streak === 7) {
    await addXP(userId, 'STREAK_7_DAYS');
  } else if (streak === 30) {
    await addXP(userId, 'STREAK_30_DAYS');
    await unlockAchievement(userId, 'streak_master');
  }

  return { streak, xpGained };
}

// ==================== SISTEMA DE SEGUIR ====================

export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) return false;

  const followerRef = doc(db, 'users', followerId);
  const followingRef = doc(db, 'users', followingId);

  await updateDoc(followerRef, {
    following: arrayUnion(followingId),
  });

  await updateDoc(followingRef, {
    followers: arrayUnion(followerId),
  });

  return true;
}

export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  const { arrayRemove } = await import('firebase/firestore');
  
  const followerRef = doc(db, 'users', followerId);
  const followingRef = doc(db, 'users', followingId);

  await updateDoc(followerRef, {
    following: arrayRemove(followingId),
  });

  await updateDoc(followingRef, {
    followers: arrayRemove(followerId),
  });

  return true;
}
