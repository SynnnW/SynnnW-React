// src/pages/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUUtQZbqd5yjJgBMlwjNEo5JGIRcgKowI",
  authDomain: "synnnw-85363.firebaseapp.com",
  projectId: "synnnw-85363",
  storageBucket: "synnnw-85363.firebasestorage.app",
  messagingSenderId: "625609420361",
  appId: "1:625609420361:web:137d5b46fe6e96bb33d998",
  measurementId: "G-95CV0YB7FK",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
