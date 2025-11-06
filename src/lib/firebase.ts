import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth'; // Simplified
import { getFirestore } from 'firebase/firestore';

// --- MANDATORY FIREBASE SETUP ---

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : (import.meta.env.VITE_FIREBASE_CONFIG || '{}'));
} catch (e) {
  console.error("Failed to parse Firebase config", e);
  firebaseConfig = {};
}

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
