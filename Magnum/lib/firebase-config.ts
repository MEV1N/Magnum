// Step 1: First, let's fix firebase-config.ts
// lib/firebase-config.ts (create this in the lib directory)

import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYyw1IyRDUIG1amrBKF7_p1Ihg_-bb47c",
  authDomain: "magnum-media.firebaseapp.com",
  projectId: "magnum-media",
  storageBucket: "magnum-media.firebasestorage.app",
  messagingSenderId: "816334043499",
  appId: "1:816334043499:web:70868992e2ad60feea742e",
  measurementId: "G-2YBN7VBKKG",
};

// Create a singleton instance
let app: FirebaseApp;
let db: Firestore;

export async function initializeFirebaseAndFirestore() {
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
    }
    
    if (!db) {
      db = getFirestore(app);
    }
    
    return { app, db, error: null };
  } catch (error) {
    console.error("Error initializing Firebase and Firestore:", error);
    return { app: null, db: null, error: error };
  }
}

// Export initialized instances for direct import elsewhere
export const getFirebaseApp = () => app;
export const getFirestoreDB = () => db;