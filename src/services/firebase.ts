import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDBLEDmx-E6uM7Mp3fPmintRDG2s0vz4Mk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "modbox-bf052.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "modbox-bf052",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "modbox-bf052.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1008961266174",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1008961266174:web:7fc9c020c89ac11b98a0af"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

