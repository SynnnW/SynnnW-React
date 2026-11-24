// Daftar topik materi Bahasa Inggris TM 1-7 (hanya metadata: id, label, TM). Sumber tunggal untuk reader, registry, dan pencarian.
// Dipisah dari materi.js supaya registry tidak ikut memuat reading-examples.js yang besar.
export const topics = [
  {
    category: 'GRAMMAR', icon: '✍️', color: '#8b5cf6',
    topics: [
      { id: 'tenses',      label: 'Tenses',                    tm: 'TM 1' },
      { id: 'verbforms',   label: 'Verb Forms V1–V5',          tm: 'TM 1' },
      { id: 'modal',       label: 'Modal Verbs',               tm: 'TM 2' },
      { id: 'sva',         label: 'Subject-Verb Agreement',    tm: 'TM 2' },
      { id: 'conditional', label: 'Conditional Sentences',     tm: 'TM 3' },
      { id: 'passive',     label: 'Passive Voice',             tm: 'TM 3' },
      { id: 'gerund',      label: 'Gerund vs Infinitive',      tm: 'TM 4' },
      { id: 'relative',    label: 'Relative Pronouns',         tm: 'TM 4' },
      { id: 'subjunctive', label: 'Subjunctive Mood',          tm: 'TM 5' },
      { id: 'comparative', label: 'Comparative Structures',    tm: 'TM 5' },
      { id: 'preposition', label: 'Prepositions & Fixed Exp.', tm: 'TM 6' },
    ],
  },
  {
    category: 'VOCABULARY', icon: '📖', color: '#10b981',
    topics: [
      { id: 'vocab-campus',  label: 'Campus Life',                      tm: 'TM 1' },
      { id: 'vocab-tech',    label: 'Technology & Digital World',       tm: 'TM 2' },
      { id: 'vocab-env',     label: 'Environment & Sustainable Living', tm: 'TM 3' },
      { id: 'vocab-nursing', label: 'Nursing / Agronursing',            tm: 'TM 4–7' },
    ],
  },
  {
    category: 'READING', icon: '📚', color: '#a78bfa',
    topics: [
      { id: 'reading-short', label: 'Short Text Strategy',        tm: 'TM 6' },
      { id: 'reading-long',  label: 'Long Text Strategy',         tm: 'TM 7' },
      { id: 'reading-dina',  label: 'Contoh Long Text & Analisis',tm: 'TM 7' },
      { id: 'reading-practice', label: 'Latihan Membaca (50 Contoh Soal)', tm: 'TM 6–7' },
    ],
  },
];
