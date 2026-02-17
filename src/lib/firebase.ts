import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth'; // Simplified
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';

export interface QuizAttempt {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timestamp: Date;
}


// --- MANDATORY FIREBASE SETUP ---

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Parsing the config from the single JSON string env var if available
let firebaseConfig;

try {
  const configStr = import.meta.env.VITE_FIREBASE_CONFIG;
  if (configStr) {
    firebaseConfig = JSON.parse(configStr);
  } else {
    // Fallback to individual variables if strictly necessary, or leave as empty object to trigger warning
    firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };
  }
} catch (e) {
  console.error("Error parsing VITE_FIREBASE_CONFIG:", e);
  firebaseConfig = {};
}


if (!firebaseConfig?.apiKey) {
  console.warn("Firebase config is missing or invalid. Please check .env or environment variables.");
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

// --- LOCAL STORAGE HELPERS ---
const getLocalAttempts = (userId: string): QuizAttempt[] => {
  try {
    const key = `quiz_attempts_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    // Parse and convert ISO strings back to Date objects
    return JSON.parse(stored).map((a: any) => ({
      ...a,
      timestamp: new Date(a.timestamp)
    }));
  } catch (e) {
    console.warn("Failed to load local attempts:", e);
    return [];
  }
};

const saveLocalAttempt = (userId: string, attempt: QuizAttempt) => {
  try {
    const current = getLocalAttempts(userId);
    current.push(attempt);
    // Sort recently added first? Or just append. We sort on retrieval.
    localStorage.setItem(`quiz_attempts_${userId}`, JSON.stringify(current));
    console.log("Saved attempt to localStorage.");
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
};

// --- QUIZ ATTEMPTS ---

export const saveQuizAttempt = async (userId: string, attempt: QuizAttempt) => {
  try {
    const attemptsRef = collection(db, "artifacts", appId, "users", userId, "attempts");
    console.log("Saving quiz attempt to:", attemptsRef.path);
    await addDoc(attemptsRef, {
      ...attempt,
      timestamp: Timestamp.fromDate(attempt.timestamp),
    });
    console.log("Quiz attempt saved successfully!");
  } catch (error: any) {
    console.error("Error saving quiz attempt FULL details:", error);
    if (error.code === 'permission-denied') {
      console.error("PERMISSION GRANTED: You are likely facing a Firestore Rule issue. The Clerk User ID does not match the Firebase Auth ID.");
    }
    throw error;
  }
};

export const getUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  try {
    const attemptsRef = collection(db, "artifacts", appId, "users", userId, "attempts");
    const q = query(attemptsRef); // Removed orderBy to avoid index issues
    const querySnapshot = await getDocs(q);

    const attempts: QuizAttempt[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      attempts.push({
        quizId: data.quizId,
        quizTitle: data.quizTitle,
        score: data.score,
        totalQuestions: data.totalQuestions,
        timestamp: data.timestamp.toDate(),
      });
    });

    console.log(`Fetched ${attempts.length} attempts for user ${userId} from Firestore`);

    // Sort in memory (newest first)
    attempts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return attempts;
  } catch (error: any) {
    console.error("Error fetching quiz attempts FULL details:", error);
    return []; // Return empty array on error to prevent crashes
  }
};

export { app, db, auth, appId };

