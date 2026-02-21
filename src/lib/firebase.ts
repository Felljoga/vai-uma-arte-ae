import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDNCJ4sZTDdcQrZdeGAEcWjQwx23MOYBnQ",
  authDomain: "vai-uma-arte-ae-b27ed.firebaseapp.com",
  projectId: "vai-uma-arte-ae-b27ed",
  storageBucket: "vai-uma-arte-ae-b27ed.firebasestorage.app",
  messagingSenderId: "815052259449",
  appId: "1:815052259449:web:4cdef8fe473b9cd1bdd4a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
