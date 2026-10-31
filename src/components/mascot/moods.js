// Kontrak mood maskot — dipakai sprite 2D, scene 3D, dan klip animasi GLB (nama klip = nama mood).
export const MOODS = ['idle', 'wave', 'thinking', 'happy', 'sad', 'celebrate'];
export const normalizeMood = m => (MOODS.includes(m) ? m : 'idle');
