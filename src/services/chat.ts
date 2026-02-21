import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  isAdmin: boolean;
  read: boolean;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  orderId: string;
  orderTitle: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  createdAt: Date;
}

// Create or get chat room for an order
export async function getOrCreateChatRoom(
  orderId: string,
  orderTitle: string,
  userId: string
): Promise<string> {
  const chatRoomRef = doc(db, 'chatRooms', orderId);
  const chatRoomSnap = await getDoc(chatRoomRef);

  if (!chatRoomSnap.exists()) {
    await setDoc(chatRoomRef, {
      orderId,
      orderTitle,
      participants: [userId, 'admin'],
      lastMessage: 'Chat iniciado',
      lastMessageAt: serverTimestamp(),
      unreadCount: 0,
      createdAt: serverTimestamp(),
    });

    // Add system message
    const messagesRef = collection(db, 'chatRooms', orderId, 'messages');
    await addDoc(messagesRef, {
      orderId,
      senderId: 'system',
      senderName: 'Sistema',
      senderAvatar: null,
      content: 'Chat iniciado. Você pode enviar mensagens para se comunicar com nossa equipe.',
      type: 'system',
      isAdmin: false,
      read: true,
      createdAt: serverTimestamp(),
    });
  }

  return orderId;
}

// Send a message
export async function sendMessage(
  orderId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string | null,
  content: string,
  type: ChatMessage['type'] = 'text',
  fileUrl?: string,
  fileName?: string
): Promise<void> {
  const messagesRef = collection(db, 'chatRooms', orderId, 'messages');
  
  await addDoc(messagesRef, {
    orderId,
    senderId,
    senderName,
    senderAvatar,
    content,
    type,
    fileUrl: fileUrl || null,
    fileName: fileName || null,
    isAdmin: false,
    read: false,
    createdAt: serverTimestamp(),
  });

  // Update chat room with last message
  const chatRoomRef = doc(db, 'chatRooms', orderId);
  await updateDoc(chatRoomRef, {
    lastMessage: type === 'text' ? content : `📎 ${fileName || 'Arquivo'}`,
    lastMessageAt: serverTimestamp(),
  });
}

// Subscribe to messages in real-time
export function subscribeToMessages(
  orderId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const messagesRef = collection(db, 'chatRooms', orderId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        orderId: data.orderId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        content: data.content,
        type: data.type || 'text',
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        isAdmin: data.isAdmin,
        read: data.read,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      };
    });
    callback(messages);
  });

  return unsubscribe;
}

// Subscribe to user's chat rooms
export function subscribeToUserChatRooms(
  userId: string,
  callback: (rooms: ChatRoom[]) => void
): () => void {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(chatRoomsRef, orderBy('lastMessageAt', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const rooms: ChatRoom[] = snapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return data.participants?.includes(userId);
      })
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          orderId: data.orderId,
          orderTitle: data.orderTitle,
          participants: data.participants,
          lastMessage: data.lastMessage,
          lastMessageAt: (data.lastMessageAt as Timestamp)?.toDate() || new Date(),
          unreadCount: data.unreadCount || 0,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        };
      });
    callback(rooms);
  });

  return unsubscribe;
}

// Mark messages as read
export async function markMessagesAsRead(orderId: string): Promise<void> {
  const chatRoomRef = doc(db, 'chatRooms', orderId);
  await updateDoc(chatRoomRef, {
    unreadCount: 0,
  });
}
