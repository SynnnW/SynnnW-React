// src/components/quiz/useQuizAuth.js
// Hook kecil yang mengembalikan user dari instance Firebase 'quiz' yang sama
// dipakai QuizEngine, SubjectComments, dan SaranWebsite — supaya status login
// konsisten di seluruh fitur Quiziz (landing, materi, quiz, komentar, saran).
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from '@/lib/authCompat';
import { getFirestore } from '@/lib/firestoreCompat';

export const ADMIN_EMAIL = 'aldokraksaan@gmail.com';

export const quizAuth = getAuth();
export const quizDb   = getFirestore();

export default function useQuizAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => onAuthStateChanged(quizAuth, setUser), []);
  return user;
}
