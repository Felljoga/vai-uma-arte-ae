import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Forum Categories (Channels like Discord)
export interface ForumChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isPrivate: boolean;
  allowedRoles: string[];
  createdAt: Date;
}

// Forum Thread
export interface ForumThread {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  authorRole: 'owner' | 'admin' | 'moderator' | 'client' | 'member';
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  likes: number;
  likedBy: string[];
  repliesCount: number;
  views: number;
  lastReplyAt: Date;
  lastReplyBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Forum Reply
export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  authorRole: 'owner' | 'admin' | 'moderator' | 'client' | 'member';
  content: string;
  likes: number;
  likedBy: string[];
  replyTo?: string;
  replyToAuthor?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Default channels
export const defaultChannels: Omit<ForumChannel, 'id' | 'createdAt'>[] = [
  {
    name: 'geral',
    description: 'Discussões gerais sobre design e criatividade',
    icon: '💬',
    color: 'from-indigo-500 to-purple-500',
    order: 1,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    name: 'apresente-se',
    description: 'Apresente-se para a comunidade',
    icon: '👋',
    color: 'from-green-500 to-emerald-500',
    order: 2,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    name: 'dúvidas',
    description: 'Tire suas dúvidas sobre design',
    icon: '❓',
    color: 'from-amber-500 to-orange-500',
    order: 3,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    name: 'feedback',
    description: 'Peça feedback sobre seus trabalhos',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    order: 4,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    name: 'inspiração',
    description: 'Compartilhe e encontre inspiração',
    icon: '✨',
    color: 'from-cyan-500 to-blue-500',
    order: 5,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    name: 'anúncios',
    description: 'Anúncios oficiais da plataforma',
    icon: '📢',
    color: 'from-red-500 to-pink-500',
    order: 0,
    isPrivate: false,
    allowedRoles: ['owner', 'admin'],
  },
  {
    name: 'vip-lounge',
    description: 'Área exclusiva para membros premium',
    icon: '👑',
    color: 'from-yellow-500 to-amber-500',
    order: 6,
    isPrivate: true,
    allowedRoles: ['owner', 'admin', 'moderator', 'client'],
  },
];

// Initialize default channels if they don't exist
export async function initializeChannels(): Promise<void> {
  const channelsRef = collection(db, 'forumChannels');
  const snapshot = await getDocs(channelsRef);
  
  if (snapshot.empty) {
    for (const channel of defaultChannels) {
      await addDoc(channelsRef, {
        ...channel,
        createdAt: serverTimestamp(),
      });
    }
  }
}

// Get all channels
export async function getChannels(): Promise<ForumChannel[]> {
  const channelsRef = collection(db, 'forumChannels');
  const q = query(channelsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    } as ForumChannel;
  });
}

// Subscribe to channels
export function subscribeToChannels(callback: (channels: ForumChannel[]) => void): () => void {
  const channelsRef = collection(db, 'forumChannels');
  const q = query(channelsRef, orderBy('order', 'asc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const channels: ForumChannel[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      } as ForumChannel;
    });
    callback(channels);
  });
  
  return unsubscribe;
}

// Create a new thread
export async function createThread(
  channelId: string,
  authorId: string,
  authorName: string,
  authorAvatar: string | null,
  authorRole: ForumThread['authorRole'],
  title: string,
  content: string
): Promise<string> {
  const threadsRef = collection(db, 'forumThreads');
  
  const threadData = {
    channelId,
    authorId,
    authorName,
    authorAvatar,
    authorRole,
    title,
    content,
    isPinned: false,
    isLocked: false,
    likes: 0,
    likedBy: [],
    repliesCount: 0,
    views: 0,
    lastReplyAt: serverTimestamp(),
    lastReplyBy: authorName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(threadsRef, threadData);
  
  // Add points to user
  const userRef = doc(db, 'users', authorId);
  await updateDoc(userRef, {
    points: increment(10),
  });
  
  return docRef.id;
}

// Get threads for a channel
export async function getChannelThreads(channelId: string, limitCount: number = 50): Promise<ForumThread[]> {
  const threadsRef = collection(db, 'forumThreads');
  const q = query(
    threadsRef,
    where('channelId', '==', channelId),
    orderBy('isPinned', 'desc'),
    orderBy('lastReplyAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      lastReplyAt: (data.lastReplyAt as Timestamp)?.toDate() || new Date(),
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    } as ForumThread;
  });
}

// Subscribe to threads in a channel
export function subscribeToThreads(
  channelId: string,
  callback: (threads: ForumThread[]) => void
): () => void {
  const threadsRef = collection(db, 'forumThreads');
  const q = query(
    threadsRef,
    where('channelId', '==', channelId),
    orderBy('lastReplyAt', 'desc'),
    limit(50)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const threads: ForumThread[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastReplyAt: (data.lastReplyAt as Timestamp)?.toDate() || new Date(),
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      } as ForumThread;
    });
    
    // Sort: pinned first, then by lastReplyAt
    threads.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.lastReplyAt.getTime() - a.lastReplyAt.getTime();
    });
    
    callback(threads);
  });
  
  return unsubscribe;
}

// Get a single thread
export async function getThread(threadId: string): Promise<ForumThread | null> {
  const threadRef = doc(db, 'forumThreads', threadId);
  const snapshot = await getDoc(threadRef);
  
  if (!snapshot.exists()) return null;
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    lastReplyAt: (data.lastReplyAt as Timestamp)?.toDate() || new Date(),
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  } as ForumThread;
}

// View thread (increment views)
export async function viewThread(threadId: string): Promise<void> {
  const threadRef = doc(db, 'forumThreads', threadId);
  await updateDoc(threadRef, {
    views: increment(1),
  });
}

// Like/unlike thread
export async function likeThread(threadId: string, userId: string): Promise<boolean> {
  const threadRef = doc(db, 'forumThreads', threadId);
  const threadSnap = await getDoc(threadRef);
  
  if (!threadSnap.exists()) return false;
  
  const likedBy = threadSnap.data().likedBy || [];
  const isLiked = likedBy.includes(userId);
  
  if (isLiked) {
    await updateDoc(threadRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
    return false;
  } else {
    await updateDoc(threadRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
    
    // Add points to author
    const authorId = threadSnap.data().authorId;
    if (authorId !== userId) {
      const userRef = doc(db, 'users', authorId);
      await updateDoc(userRef, {
        points: increment(2),
      });
    }
    return true;
  }
}

// Create a reply
export async function createReply(
  threadId: string,
  authorId: string,
  authorName: string,
  authorAvatar: string | null,
  authorRole: ForumReply['authorRole'],
  content: string,
  replyTo?: string,
  replyToAuthor?: string
): Promise<string> {
  const repliesRef = collection(db, 'forumThreads', threadId, 'replies');
  
  const replyData = {
    threadId,
    authorId,
    authorName,
    authorAvatar,
    authorRole,
    content,
    likes: 0,
    likedBy: [],
    replyTo: replyTo || null,
    replyToAuthor: replyToAuthor || null,
    isEdited: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(repliesRef, replyData);
  
  // Update thread
  const threadRef = doc(db, 'forumThreads', threadId);
  await updateDoc(threadRef, {
    repliesCount: increment(1),
    lastReplyAt: serverTimestamp(),
    lastReplyBy: authorName,
  });
  
  // Add points
  const userRef = doc(db, 'users', authorId);
  await updateDoc(userRef, {
    points: increment(5),
  });
  
  return docRef.id;
}

// Subscribe to replies
export function subscribeToReplies(
  threadId: string,
  callback: (replies: ForumReply[]) => void
): () => void {
  const repliesRef = collection(db, 'forumThreads', threadId, 'replies');
  const q = query(repliesRef, orderBy('createdAt', 'asc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const replies: ForumReply[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      } as ForumReply;
    });
    callback(replies);
  });
  
  return unsubscribe;
}

// Like/unlike reply
export async function likeReply(threadId: string, replyId: string, userId: string): Promise<boolean> {
  const replyRef = doc(db, 'forumThreads', threadId, 'replies', replyId);
  const replySnap = await getDoc(replyRef);
  
  if (!replySnap.exists()) return false;
  
  const likedBy = replySnap.data().likedBy || [];
  const isLiked = likedBy.includes(userId);
  
  if (isLiked) {
    await updateDoc(replyRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
    return false;
  } else {
    await updateDoc(replyRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
    return true;
  }
}

// Pin/unpin thread (mod+)
export async function togglePinThread(threadId: string): Promise<void> {
  const threadRef = doc(db, 'forumThreads', threadId);
  const threadSnap = await getDoc(threadRef);
  
  if (!threadSnap.exists()) return;
  
  await updateDoc(threadRef, {
    isPinned: !threadSnap.data().isPinned,
  });
}

// Lock/unlock thread (mod+)
export async function toggleLockThread(threadId: string): Promise<void> {
  const threadRef = doc(db, 'forumThreads', threadId);
  const threadSnap = await getDoc(threadRef);
  
  if (!threadSnap.exists()) return;
  
  await updateDoc(threadRef, {
    isLocked: !threadSnap.data().isLocked,
  });
}

// Delete thread (mod+)
export async function deleteThread(threadId: string): Promise<void> {
  const threadRef = doc(db, 'forumThreads', threadId);
  await deleteDoc(threadRef);
}

// Delete reply (mod+)
export async function deleteReply(threadId: string, replyId: string): Promise<void> {
  const replyRef = doc(db, 'forumThreads', threadId, 'replies', replyId);
  await deleteDoc(replyRef);
  
  // Update thread count
  const threadRef = doc(db, 'forumThreads', threadId);
  await updateDoc(threadRef, {
    repliesCount: increment(-1),
  });
}

// Edit thread
export async function editThread(threadId: string, title: string, content: string): Promise<void> {
  const threadRef = doc(db, 'forumThreads', threadId);
  await updateDoc(threadRef, {
    title,
    content,
    updatedAt: serverTimestamp(),
  });
}

// Edit reply
export async function editReply(threadId: string, replyId: string, content: string): Promise<void> {
  const replyRef = doc(db, 'forumThreads', threadId, 'replies', replyId);
  await updateDoc(replyRef, {
    content,
    isEdited: true,
    updatedAt: serverTimestamp(),
  });
}
