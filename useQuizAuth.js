// src/components/quiz/useQuizAuth.js
// Hook kecil yang mengembalikan user dari instance Firebase 'quiz' yang sama
// dipakai QuizEngine, SubjectComments, dan SaranWebsite — supaya status login
// konsisten di seluruh fitur Quiziz (landing, materi, quiz, komentar, saran).
import { useState, useEffect } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import '../../pages/firebase'; // pastikan default Firebase app sudah init

export const ADMIN_EMAIL = 'aldokraksaan@gmail.com';

export const quizApp  = getApps().find(a => a.name === 'quiz') || initializeApp(getApp().options, 'quiz');
export const quizAuth = getAuth(quizApp);
export const quizDb   = getFirestore(quizApp);

export default function useQuizAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => onAuthStateChanged(quizAuth, setUser), []);
  return user;
}
