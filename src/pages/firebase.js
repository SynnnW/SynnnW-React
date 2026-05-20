import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi resmi dari Firebase Console milikmu
const firebaseConfig = {
  apiKey: "AIzaSyCUUtQZbqd5yjJgBMlwjNEo5JGIRcgKowI",
  authDomain: "synnnw-85363.firebaseapp.com",
  projectId: "synnnw-85363",
  storageBucket: "synnnw-85363.firebasestorage.app",
  messagingSenderId: "625609420361",
  appId: "1:625609420361:web:137d5b46fe6e96bb33d998",
  measurementId: "G-95CV0YB7FK"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Export agar bisa dibaca oleh Contact.jsx milikmu
export const auth = getAuth(app);
export const db = getFirestore(app);