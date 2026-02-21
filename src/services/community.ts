import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Artwork {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  likes: number;
  likedBy: string[];
  views: number;
  comments: Comment[];
  featured: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface CreateArtworkData {
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

// Create artwork
export async function createArtwork(data: CreateArtworkData): Promise<string> {
  const artworksRef = collection(db, 'artworks');
  
  const artworkData = {
    ...data,
    likes: 0,
    likedBy: [],
    views: 0,
    comments: [],
    featured: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(artworksRef, artworkData);
  
  // Add points to user
  const userRef = doc(db, 'users', data.userId);
  await updateDoc(userRef, {
    points: increment(25), // 25 points for posting artwork
  });

  return docRef.id;
}

// Get trending artworks
export async function getTrendingArtworks(limitCount: number = 10): Promise<Artwork[]> {
  const artworksRef = collection(db, 'artworks');
  const q = query(
    artworksRef,
    orderBy('likes', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      comments: data.comments?.map((c: { createdAt: Timestamp } & Omit<Comment, 'createdAt'>) => ({
        ...c,
        createdAt: c.createdAt?.toDate?.() || new Date(),
      })) || [],
    } as Artwork;
  });
}

// Get latest artworks
export async function getLatestArtworks(limitCount: number = 10): Promise<Artwork[]> {
  const artworksRef = collection(db, 'artworks');
  const q = query(
    artworksRef,
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      comments: data.comments?.map((c: { createdAt: Timestamp } & Omit<Comment, 'createdAt'>) => ({
        ...c,
        createdAt: c.createdAt?.toDate?.() || new Date(),
      })) || [],
    } as Artwork;
  });
}

// Like artwork
export async function likeArtwork(artworkId: string, userId: string): Promise<void> {
  const artworkRef = doc(db, 'artworks', artworkId);
  const artworkSnap = await getDoc(artworkRef);

  if (!artworkSnap.exists()) throw new Error('Artwork not found');

  const likedBy = artworkSnap.data().likedBy || [];
  const isLiked = likedBy.includes(userId);

  if (isLiked) {
    // Unlike
    await updateDoc(artworkRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  } else {
    // Like
    await updateDoc(artworkRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });

    // Add points to artwork author
    const artworkData = artworkSnap.data();
    if (artworkData.userId !== userId) {
      const authorRef = doc(db, 'users', artworkData.userId);
      await updateDoc(authorRef, {
        points: increment(2), // 2 points per like received
      });
    }
  }
}

// View artwork
export async function viewArtwork(artworkId: string): Promise<void> {
  const artworkRef = doc(db, 'artworks', artworkId);
  await updateDoc(artworkRef, {
    views: increment(1),
  });
}

// Add comment
export async function addComment(
  artworkId: string,
  userId: string,
  userName: string,
  content: string
): Promise<void> {
  const artworkRef = doc(db, 'artworks', artworkId);
  
  const newComment = {
    id: `comment_${Date.now()}`,
    userId,
    userName,
    content,
    createdAt: serverTimestamp(),
  };

  await updateDoc(artworkRef, {
    comments: arrayUnion(newComment),
  });

  // Add points to artwork author
  const artworkSnap = await getDoc(artworkRef);
  if (artworkSnap.exists()) {
    const artworkData = artworkSnap.data();
    if (artworkData.userId !== userId) {
      const authorRef = doc(db, 'users', artworkData.userId);
      await updateDoc(authorRef, {
        points: increment(5), // 5 points per comment received
      });
    }
  }
}

// Get top creators
export async function getTopCreators(limitCount: number = 10): Promise<{
  uid: string;
  displayName: string;
  photoURL: string | null;
  points: number;
}[]> {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    orderBy('points', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      displayName: data.displayName,
      photoURL: data.photoURL,
      points: data.points || 0,
    };
  });
}
