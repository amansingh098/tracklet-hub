
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDQlnRn_0jKQZEQObRfRPRFTIE8oeTdKu0",
  authDomain: "tracking-system-4122c.firebaseapp.com",
  projectId: "tracking-system-4122c",
  storageBucket: "tracking-system-4122c.firebasestorage.app",
  messagingSenderId: "660829513601",
  appId: "1:660829513601:web:6740209cfea38c70feaa80",
  measurementId: "G-HR0QZJ65BK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
