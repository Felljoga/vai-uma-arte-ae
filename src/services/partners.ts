import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Partner interface
export interface Partner {
  id: string;
  userId?: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  category: PartnerCategory;
  status: PartnerStatus;
  socialLinks: SocialLinks;
  benefits: string[];
  featuredOrder?: number;
  isFeatured: boolean;
  viewCount: number;
  clickCount: number;
  viewedBy: string[];  // Array de userIds que já visualizaram
  clickedBy: string[]; // Array de userIds que já clicaram
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  updatedAt?: Date;
}

export type PartnerCategory = 
  | 'streamer'
  | 'creator'
  | 'artist'
  | 'brand'
  | 'influencer'
  | 'community'
  | 'other';

export type PartnerStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface SocialLinks {
  instagram?: string;
  discord?: string;
  youtube?: string;
  twitch?: string;
  twitter?: string;
  tiktok?: string;
  website?: string;
}

export interface PartnerApplication {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  name: string;
  description: string;
  category: PartnerCategory;
  socialLinks: SocialLinks;
  benefits: string[];
  reason: string;
  audience: string;
  status: PartnerStatus;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

// Category configuration
export const PARTNER_CATEGORIES: Record<PartnerCategory, {
  name: string;
  icon: string;
  color: string;
  gradient: string;
}> = {
  streamer: {
    name: 'Streamer',
    icon: '🎮',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-violet-600',
  },
  creator: {
    name: 'Criador de Conteúdo',
    icon: '🎬',
    color: 'text-red-400',
    gradient: 'from-red-500 to-rose-600',
  },
  artist: {
    name: 'Artista',
    icon: '🎨',
    color: 'text-pink-400',
    gradient: 'from-pink-500 to-fuchsia-600',
  },
  brand: {
    name: 'Marca',
    icon: '🏢',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-600',
  },
  influencer: {
    name: 'Influencer',
    icon: '⭐',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-600',
  },
  community: {
    name: 'Comunidade',
    icon: '👥',
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-600',
  },
  other: {
    name: 'Outro',
    icon: '💼',
    color: 'text-zinc-400',
    gradient: 'from-zinc-500 to-zinc-600',
  },
};

// Submit partner application
export async function submitPartnerApplication(
  userId: string,
  userEmail: string,
  userName: string,
  userPhoto: string,
  data: {
    name: string;
    description: string;
    category: PartnerCategory;
    socialLinks: Record<string, string>;
    benefits: string[];
    reason: string;
    audience: string;
  }
): Promise<string> {
  try {
    const applicationsRef = collection(db, 'partnerApplications');
    
    const docRef = await addDoc(applicationsRef, {
      userId,
      userEmail,
      userName,
      userPhoto: userPhoto || '',
      name: data.name,
      description: data.description,
      category: data.category,
      socialLinks: data.socialLinks,
      benefits: data.benefits,
      reason: data.reason,
      audience: data.audience,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erro ao enviar solicitação de parceria:', error);
    throw error;
  }
}

// Get all partner applications (admin)
export async function getPartnerApplications(): Promise<PartnerApplication[]> {
  const applicationsRef = collection(db, 'partnerApplications');
  const q = query(applicationsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      reviewedAt: (data.reviewedAt as Timestamp)?.toDate(),
    } as PartnerApplication;
  });
}

// Subscribe to partner applications in real-time
export function subscribeToPartnerApplications(
  callback: (applications: PartnerApplication[]) => void
): Unsubscribe {
  const applicationsRef = collection(db, 'partnerApplications');
  const q = query(applicationsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const applications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        reviewedAt: (data.reviewedAt as Timestamp)?.toDate(),
      } as PartnerApplication;
    });
    callback(applications);
  });
}

// Approve partner application
export async function approvePartnerApplication(
  applicationId: string,
  approverUid: string
): Promise<void> {
  // Get application
  const appRef = doc(db, 'partnerApplications', applicationId);
  const appSnap = await getDoc(appRef);
  
  if (!appSnap.exists()) {
    throw new Error('Solicitação não encontrada');
  }
  
  const appData = appSnap.data();
  
  // Update application status
  await updateDoc(appRef, {
    status: 'approved',
    reviewedAt: serverTimestamp(),
    reviewedBy: approverUid,
  });
  
  // Create partner entry
  const partnersRef = collection(db, 'partners');
  await addDoc(partnersRef, {
    userId: appData.userId,
    name: appData.name,
    description: appData.description,
    category: appData.category,
    socialLinks: appData.socialLinks,
    benefits: appData.benefits,
    status: 'approved',
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    viewedBy: [],
    clickedBy: [],
    createdAt: serverTimestamp(),
    approvedAt: serverTimestamp(),
    approvedBy: approverUid,
  });
  
  // Update user role to partner
  if (appData.userId) {
    const userRef = doc(db, 'users', appData.userId);
    await updateDoc(userRef, {
      role: 'partner',
      isPartner: true,
      partnerSince: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

// Reject partner application
export async function rejectPartnerApplication(
  applicationId: string,
  reviewerUid: string,
  reason: string
): Promise<void> {
  const appRef = doc(db, 'partnerApplications', applicationId);
  
  await updateDoc(appRef, {
    status: 'rejected',
    reviewedAt: serverTimestamp(),
    reviewedBy: reviewerUid,
    rejectionReason: reason,
  });
}

// Get all approved partners
export async function getApprovedPartners(): Promise<Partner[]> {
  const partnersRef = collection(db, 'partners');
  const q = query(
    partnersRef,
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      approvedAt: (data.approvedAt as Timestamp)?.toDate(),
    } as Partner;
  });
}

// Subscribe to partners in real-time
export function subscribeToPartners(
  callback: (partners: Partner[]) => void
): Unsubscribe {
  const partnersRef = collection(db, 'partners');
  const q = query(
    partnersRef,
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const partners = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        approvedAt: (data.approvedAt as Timestamp)?.toDate(),
      } as Partner;
    });
    callback(partners);
  });
}

// Get featured partners
export async function getFeaturedPartners(): Promise<Partner[]> {
  const partnersRef = collection(db, 'partners');
  const q = query(
    partnersRef,
    where('status', '==', 'approved'),
    where('isFeatured', '==', true),
    orderBy('featuredOrder', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    } as Partner;
  });
}

// Update partner
export async function updatePartner(
  partnerId: string,
  data: Partial<Partner>
): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await updateDoc(partnerRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Toggle partner featured status
export async function togglePartnerFeatured(
  partnerId: string,
  isFeatured: boolean,
  order?: number
): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await updateDoc(partnerRef, {
    isFeatured,
    featuredOrder: order || 0,
    updatedAt: serverTimestamp(),
  });
}

// Suspend partner
export async function suspendPartner(partnerId: string, userId?: string): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await updateDoc(partnerRef, {
    status: 'suspended',
    updatedAt: serverTimestamp(),
  });
  
  // Update user role
  if (userId) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'member',
      isPartner: false,
      updatedAt: serverTimestamp(),
    });
  }
}

// Reactivate partner
export async function reactivatePartner(partnerId: string, userId?: string): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await updateDoc(partnerRef, {
    status: 'approved',
    updatedAt: serverTimestamp(),
  });
  
  // Update user role
  if (userId) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'partner',
      isPartner: true,
      updatedAt: serverTimestamp(),
    });
  }
}

// Delete partner
export async function deletePartner(partnerId: string, userId?: string): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await deleteDoc(partnerRef);
  
  // Update user role
  if (userId) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'member',
      isPartner: false,
      updatedAt: serverTimestamp(),
    });
  }
}

// Remove partner (alias for deletePartner)
export async function removePartner(partnerId: string, userId?: string): Promise<void> {
  return deletePartner(partnerId, userId);
}

// Get all partners (including suspended)
export async function getAllPartners(): Promise<Partner[]> {
  const partnersRef = collection(db, 'partners');
  const q = query(partnersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      approvedAt: (data.approvedAt as Timestamp)?.toDate(),
    } as Partner;
  });
}

// Subscribe to all partners in real-time (including suspended)
export function subscribeToAllPartners(
  callback: (partners: Partner[]) => void
): Unsubscribe {
  const partnersRef = collection(db, 'partners');
  const q = query(partnersRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const partners = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        approvedAt: (data.approvedAt as Timestamp)?.toDate(),
      } as Partner;
    });
    callback(partners);
  });
}

// Increment view count (anti-spam: each user can only view once)
export async function incrementPartnerViews(partnerId: string, userId?: string): Promise<boolean> {
  const partnerRef = doc(db, 'partners', partnerId);
  const partnerSnap = await getDoc(partnerRef);
  
  if (!partnerSnap.exists()) return false;
  
  const data = partnerSnap.data();
  const viewedBy: string[] = data.viewedBy || [];
  
  // Se não tem userId (usuário não logado), não conta
  if (!userId) return false;
  
  // Verifica se já visualizou
  if (viewedBy.includes(userId)) {
    return false; // Já contou, não incrementa
  }
  
  // Incrementa e adiciona ao array de quem visualizou
  await updateDoc(partnerRef, {
    viewCount: (data.viewCount || 0) + 1,
    viewedBy: arrayUnion(userId),
  });
  
  return true;
}

// Increment click count (anti-spam: each user can only click once per partner)
export async function incrementPartnerClicks(partnerId: string, userId?: string): Promise<boolean> {
  const partnerRef = doc(db, 'partners', partnerId);
  const partnerSnap = await getDoc(partnerRef);
  
  if (!partnerSnap.exists()) return false;
  
  const data = partnerSnap.data();
  const clickedBy: string[] = data.clickedBy || [];
  
  // Se não tem userId (usuário não logado), não conta
  if (!userId) return false;
  
  // Verifica se já clicou
  if (clickedBy.includes(userId)) {
    return false; // Já contou, não incrementa
  }
  
  // Incrementa e adiciona ao array de quem clicou
  await updateDoc(partnerRef, {
    clickCount: (data.clickCount || 0) + 1,
    clickedBy: arrayUnion(userId),
  });
  
  return true;
}

// Check if user already viewed partner
export function hasUserViewedPartner(partner: Partner, userId?: string): boolean {
  if (!userId) return false;
  return (partner.viewedBy || []).includes(userId);
}

// Check if user already clicked partner
export function hasUserClickedPartner(partner: Partner, userId?: string): boolean {
  if (!userId) return false;
  return (partner.clickedBy || []).includes(userId);
}

// Discord Server Embed Interface
export interface DiscordServerEmbed {
  id: string;
  serverId: string;
  name: string;
  description: string;
  inviteLink: string;
  category: PartnerCategory;
  isOfficial: boolean;
  isFeatured: boolean;
  order: number;
  addedBy: string;
  addedAt: Date;
  updatedAt?: Date;
}

// Add Discord server embed
export async function addDiscordServer(
  data: {
    serverId: string;
    name: string;
    description: string;
    inviteLink: string;
    category: PartnerCategory;
    isOfficial?: boolean;
    isFeatured?: boolean;
  },
  addedBy: string
): Promise<string> {
  const serversRef = collection(db, 'discordServers');
  
  // Get current count for order
  const snapshot = await getDocs(serversRef);
  const order = snapshot.size;
  
  const docRef = await addDoc(serversRef, {
    ...data,
    isOfficial: data.isOfficial || false,
    isFeatured: data.isFeatured || false,
    order,
    addedBy,
    addedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

// Get all Discord servers
export async function getDiscordServers(): Promise<DiscordServerEmbed[]> {
  const serversRef = collection(db, 'discordServers');
  const q = query(serversRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      addedAt: (data.addedAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate(),
    } as DiscordServerEmbed;
  });
}

// Subscribe to Discord servers in real-time
export function subscribeToDiscordServers(
  callback: (servers: DiscordServerEmbed[]) => void
): Unsubscribe {
  const serversRef = collection(db, 'discordServers');
  const q = query(serversRef, orderBy('order', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const servers = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        addedAt: (data.addedAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate(),
      } as DiscordServerEmbed;
    });
    callback(servers);
  });
}

// Update Discord server
export async function updateDiscordServer(
  serverId: string,
  data: Partial<DiscordServerEmbed>
): Promise<void> {
  const serverRef = doc(db, 'discordServers', serverId);
  await updateDoc(serverRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete Discord server
export async function deleteDiscordServer(serverId: string): Promise<void> {
  const serverRef = doc(db, 'discordServers', serverId);
  await deleteDoc(serverRef);
}

// Reorder Discord servers
export async function reorderDiscordServers(
  serverIds: string[]
): Promise<void> {
  const batch: Promise<void>[] = serverIds.map((id, index) => {
    const serverRef = doc(db, 'discordServers', id);
    return updateDoc(serverRef, { order: index });
  });
  
  await Promise.all(batch);
}

// Toggle Discord server featured
export async function toggleDiscordServerFeatured(
  serverId: string,
  isFeatured: boolean
): Promise<void> {
  const serverRef = doc(db, 'discordServers', serverId);
  await updateDoc(serverRef, {
    isFeatured,
    updatedAt: serverTimestamp(),
  });
}

// Check if user is already a partner
export async function checkUserPartnerStatus(userId: string): Promise<{
  isPartner: boolean;
  hasPendingApplication: boolean;
  partner?: Partner;
  application?: PartnerApplication;
}> {
  // Check partners
  const partnersRef = collection(db, 'partners');
  const partnerQuery = query(partnersRef, where('userId', '==', userId));
  const partnerSnap = await getDocs(partnerQuery);
  
  if (!partnerSnap.empty) {
    const partnerDoc = partnerSnap.docs[0];
    const data = partnerDoc.data();
    return {
      isPartner: data.status === 'approved',
      hasPendingApplication: false,
      partner: {
        id: partnerDoc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      } as Partner,
    };
  }
  
  // Check pending applications
  const applicationsRef = collection(db, 'partnerApplications');
  const appQuery = query(
    applicationsRef,
    where('userId', '==', userId),
    where('status', '==', 'pending')
  );
  const appSnap = await getDocs(appQuery);
  
  if (!appSnap.empty) {
    const appDoc = appSnap.docs[0];
    const data = appDoc.data();
    return {
      isPartner: false,
      hasPendingApplication: true,
      application: {
        id: appDoc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      } as PartnerApplication,
    };
  }
  
  return {
    isPartner: false,
    hasPendingApplication: false,
  };
}
