import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  bio: string;
  preferredStyle: string;
  plan: 'free' | 'pro' | 'studio' | 'agency';
  role: 'owner' | 'admin' | 'moderator' | 'client' | 'member';
  points: number;
  level: number;
  badges: string[];
  ordersCount: number;
  createdAt: Date;
  emailVerified: boolean;
  isBanned?: boolean;
  banReason?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Create user profile in Firestore
  const createUserProfile = async (user: User, additionalData: Partial<UserProfile> = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Check if this is the owner email
      const isOwner = user.email === 'wandersonsilvasantos2@gmail.com';
      
      const profileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || additionalData.displayName || 'Usuário',
        photoURL: user.photoURL,
        bio: '',
        preferredStyle: 'moderno',
        plan: isOwner ? 'agency' : 'free',
        role: isOwner ? 'owner' : 'member',
        points: isOwner ? 10000 : 0,
        level: isOwner ? 99 : 1,
        badges: isOwner ? ['novato', 'fundador', 'vip'] : ['novato'],
        ordersCount: 0,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, profileData);
      return { ...profileData, createdAt: new Date() } as UserProfile;
    }

    return userSnap.data() as UserProfile;
  };

  // Fetch user profile
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Register
  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(result.user, { displayName });
    await sendEmailVerification(result.user);
    
    const profile = await createUserProfile(result.user, { displayName });
    setUserProfile(profile);
  };

  // Login
  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchUserProfile(result.user.uid);
    setUserProfile(profile);
  };

  // Login with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const profile = await createUserProfile(result.user);
    setUserProfile(profile);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Update User Profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, data, { merge: true });
    
    // Also update auth profile if displayName or photoURL changed
    if (data.displayName || data.photoURL) {
      await updateProfile(currentUser, {
        displayName: data.displayName || currentUser.displayName,
        photoURL: data.photoURL || currentUser.photoURL,
      });
    }

    const updatedProfile = await fetchUserProfile(currentUser.uid);
    setUserProfile(updatedProfile);
  };

  // Refresh User Profile
  const refreshUserProfile = async () => {
    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.uid);
      setUserProfile(profile);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        if (!profile) {
          const newProfile = await createUserProfile(user);
          setUserProfile(newProfile);
        } else {
          setUserProfile(profile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
