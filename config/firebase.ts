/**
 * Firebase configuration and initialization module.
 * 
 * This module initializes Firebase app, authentication with AsyncStorage persistence,
 * and Firestore database. It ensures Firebase is only initialized once and handles
 * cases where auth might already be initialized.
 * 
 * @module config/firebase
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * Firebase configuration object constructed from environment variables.
 * All values should be set in .env file using EXPO_PUBLIC_ prefix.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Firebase app instance.
 * Reuses existing app if already initialized, otherwise creates a new one.
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Firebase Auth instance with persistence.
 * This allows users to stay signed in even after closing the app.
 */
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
  });
} catch (error: any) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

/**
 * Firestore database instance for storing user roles and other data.
 */
const db: Firestore = getFirestore(app);

export { auth, db };
