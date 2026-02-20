// Firebase Auth Functions - VAI UMA ARTE AÊ?!
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  UserCredential
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { auth, db } from "./config";

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  phoneNumber: string | null;
  bio: string;
  company: string;
  website: string;
  instagram: string;
  preferredStyle: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  emailVerified: boolean;
  totalOrders: number;
  memberSince: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Create user profile in Firestore
const createUserProfile = async (user: User, additionalData?: Partial<UserProfile>) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName, photoURL, phoneNumber } = user;
    const createdAt = serverTimestamp();

    const userData: Partial<UserProfile> = {
      uid: user.uid,
      email: email || "",
      displayName: displayName || additionalData?.displayName || "",
      photoURL: photoURL,
      phoneNumber: phoneNumber || additionalData?.phoneNumber || null,
      bio: "",
      company: "",
      website: "",
      instagram: "",
      preferredStyle: "neon",
      createdAt: createdAt as Timestamp,
      updatedAt: createdAt as Timestamp,
      emailVerified: user.emailVerified,
      totalOrders: 0,
      memberSince: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      ...additionalData
    };

    await setDoc(userRef, userData);
    return userData;
  }

  return userSnap.data() as UserProfile;
};

// Sign Up with Email and Password
export const signUpWithEmail = async (data: SignUpData): Promise<{ user: User; profile: Partial<UserProfile> }> => {
  const { email, password, displayName, phoneNumber } = data;
  
  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile with display name
  await updateProfile(user, { displayName });

  // Send email verification
  await sendEmailVerification(user);

  // Create user profile in Firestore
  const profile = await createUserProfile(user, { displayName, phoneNumber });

  return { user, profile };
};

// Sign In with Email and Password
export const signInWithEmail = async (data: SignInData): Promise<User> => {
  const { email, password } = data;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Update last login
  const userRef = doc(db, "users", userCredential.user.uid);
  await updateDoc(userRef, {
    lastLoginAt: serverTimestamp()
  }).catch(() => {}); // Ignore if profile doesn't exist yet

  return userCredential.user;
};

// Sign In with Google
export const signInWithGoogle = async (): Promise<{ user: User; profile: Partial<UserProfile> }> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Create or get user profile
  const profile = await createUserProfile(user);

  return { user, profile };
};

// Sign Out
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

// Send Password Reset Email
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Resend Email Verification
export const resendVerificationEmail = async (user: User): Promise<void> => {
  await sendEmailVerification(user);
};

// Get User Profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  return null;
};

// Update User Profile
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Update User Display Name
export const updateUserDisplayName = async (user: User, displayName: string): Promise<void> => {
  await updateProfile(user, { displayName });
  await updateUserProfile(user.uid, { displayName });
};

// Update User Photo
export const updateUserPhoto = async (user: User, photoURL: string): Promise<void> => {
  await updateProfile(user, { photoURL });
  await updateUserProfile(user.uid, { photoURL });
};

// Update User Email
export const updateUserEmail = async (
  user: User,
  newEmail: string,
  currentPassword: string
): Promise<void> => {
  // Re-authenticate user first
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  
  // Update email
  await updateEmail(user, newEmail);
  await sendEmailVerification(user);
  await updateUserProfile(user.uid, { email: newEmail, emailVerified: false });
};

// Update User Password
export const updateUserPassword = async (
  user: User,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  // Re-authenticate user first
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  
  // Update password
  await updatePassword(user, newPassword);
};

// Delete User Account
export const deleteUserAccount = async (
  user: User,
  currentPassword: string
): Promise<void> => {
  // Re-authenticate user first
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  
  // Delete user profile from Firestore
  // Note: In production, you might want to use Cloud Functions to handle this
  // const userRef = doc(db, "users", user.uid);
  // await deleteDoc(userRef);
  
  // Delete user account
  await user.delete();
};
