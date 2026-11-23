// src/components/quiz/paletteBus.js
// Jembatan kecil: tombol/kolom cari di halaman manapun membuka command palette milik shell lewat satu event.
export const SEARCH_EVENT = 'quiziz:search';
export const openPalette = () => window.dispatchEvent(new Event(SEARCH_EVENT));
export const shortcutLabel = () => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || '') ? '⌘K' : 'Ctrl K');
