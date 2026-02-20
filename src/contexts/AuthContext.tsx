// Auth Context - VAI UMA ARTE AÊ?!
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  resetPassword,
  resendVerificationEmail,
  getUserProfile,
  updateUserProfile,
  updateUserDisplayName,
  updateUserPhoto,
  updateUserEmail,
  updateUserPassword,
  UserProfile,
  SignUpData,
  SignInData
} from '../firebase/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  updatePhoto: (photoURL: string) => Promise<void>;
  updateEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh profile from Firestore
  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
    }
  };

  // Sign Up
  const signUp = async (data: SignUpData) => {
    try {
      setError(null);
      setLoading(true);
      const { user: newUser, profile: newProfile } = await signUpWithEmail(data);
      setUser(newUser);
      setProfile(newProfile as UserProfile);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign In
  const signIn = async (data: SignInData) => {
    try {
      setError(null);
      setLoading(true);
      const loggedUser = await signInWithEmail(data);
      setUser(loggedUser);
      const userProfile = await getUserProfile(loggedUser.uid);
      setProfile(userProfile);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Google
  const signInGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const { user: googleUser, profile: googleProfile } = await signInWithGoogle();
      setUser(googleUser);
      setProfile(googleProfile as UserProfile);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await logOut();
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Send Password Reset
  const sendPasswordReset = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Resend Verification Email
  const resendVerification = async () => {
    if (!user) return;
    try {
      setError(null);
      await resendVerificationEmail(user);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      setError(null);
      await updateUserProfile(user.uid, data);
      await refreshProfile();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update Display Name
  const handleUpdateDisplayName = async (displayName: string) => {
    if (!user) return;
    try {
      setError(null);
      await updateUserDisplayName(user, displayName);
      await refreshProfile();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update Photo
  const handleUpdatePhoto = async (photoURL: string) => {
    if (!user) return;
    try {
      setError(null);
      await updateUserPhoto(user, photoURL);
      await refreshProfile();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update Email
  const handleUpdateEmail = async (newEmail: string, currentPassword: string) => {
    if (!user) return;
    try {
      setError(null);
      await updateUserEmail(user, newEmail, currentPassword);
      await refreshProfile();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update Password
  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    try {
      setError(null);
      await updateUserPassword(user, currentPassword, newPassword);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Clear Error
  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signInGoogle,
    logout,
    sendPasswordReset,
    resendVerification,
    updateProfile: handleUpdateProfile,
    updateDisplayName: handleUpdateDisplayName,
    updatePhoto: handleUpdatePhoto,
    updateEmail: handleUpdateEmail,
    updatePassword: handleUpdatePassword,
    clearError,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to get user-friendly error messages
function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este email já está em uso. Tente fazer login.';
    case 'auth/invalid-email':
      return 'Email inválido. Verifique o formato.';
    case 'auth/operation-not-allowed':
      return 'Operação não permitida. Entre em contato com o suporte.';
    case 'auth/weak-password':
      return 'Senha muito fraca. Use pelo menos 6 caracteres.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada. Entre em contato com o suporte.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique o email ou crie uma conta.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas. Verifique email e senha.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um momento e tente novamente.';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet.';
    case 'auth/popup-closed-by-user':
      return 'Login cancelado. Tente novamente.';
    case 'auth/requires-recent-login':
      return 'Por segurança, faça login novamente para continuar.';
    default:
      return 'Ocorreu um erro. Tente novamente.';
  }
}

export default AuthContext;
