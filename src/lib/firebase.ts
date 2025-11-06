import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth'; // Simplified
import { getFirestore } from 'firebase/firestore';

// --- MANDATORY FIREBASE SETUP ---

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.warn("Firebase config is missing. Please check .env or environment variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- LOCALHOST AUTHENTICATION ---
// This is the correct way to handle auth on localhost
const signIn = async () => {
  try {
    // We only sign in anonymously if the special token is NOT provided
    if (typeof __initial_auth_token === 'undefined') {
      await signInAnonymously(auth);
      console.log("Firebase signed in anonymously for localhost.");
    }
  } catch (error) {
    console.error("Firebase anonymous sign-in error:", error);
  }
};

// We only run this if we're not in the production environment
if (typeof __initial_auth_token === 'undefined') {
  signIn();
}

export { app, db, auth, appId };
