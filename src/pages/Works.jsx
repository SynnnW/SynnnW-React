import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/* ══════════════════════════════════════════════════════
   KARYA DATA — newest first, 21 karya
   Per PATCH 09: Added 2 new works + 2 new categories
   Filter state now persists via URL params
══════════════════════════════════════════════════════ */
const KARYA_LIST = [
  /* ── 2026 ── */
  {
    id: 'lanyard-ekstrakurikuler-2026',
    route: '/works/lanyard-ekstrakurikuler-2026',
    year: 2026,
    category: ['Lanyard', 'Design'],
    titleEN: 'Extracurricular Lanyard Design',
    titleID: 'Design Lanyard Ekstrakurikuler',
    descEN: 'Custom lanyard design for extracurricular activities featuring vibrant colors and meaningful graphics to represent student involvement and school spirit.',
    descID: 'Design lanyard custom untuk kegiatan ekstrakurikuler dengan warna cerah dan grafis bermakna yang merepresentasikan keterlibatan siswa dan semangat sekolah.',
    tags: ['Lanyard Design', 'School ID', 'Branding'],
    image: '/assets/img/lanyard-ekstra.jpg',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  {
    id: 'lanyard-genesis-2026',
    route: '/works/lanyard-genesis-2026',
    year: 2026,
    category: ['Lanyard', 'Event'],
    titleEN: 'GENESIS Lanyard Design',
    titleID: 'Lanyard GENESIS - Generasi Sejuta Inspirasi',
    descEN: 'Official lanyard design for GENESIS competition (Generasi Sejuta Inspirasi), a prestigious regional-scale competition and olympiad held annually by SMAN 1 Kraksaan, Probolinggo Regency.',
    descID: 'Design lanyard resmi untuk kompetisi GENESIS (Generasi Sejuta Inspirasi), ajang kompetisi dan olimpiade bergengsi berskala regional yang diselenggarakan setiap tahun oleh SMAN 1 Kraksaan, Kabupaten Probolinggo.',
    tags: ['Lanyard Design', 'Competition', 'Event Branding', 'GENESIS', 'SMAN 1 Kraksaan'],
    image: '/assets/img/lanyard-genesis.jpg',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  },
  {
    id: 'lanyard-kelas-2026',
    route: '/works/lanyard-kelas-2026',
    year: 2026,
    category: ['Lanyard', 'Design'],
    titleEN: 'Class Lanyard Design',
    titleID: 'Lanyard Kelas - Identitas Bersama',
    descEN: 'Class lanyard design featuring unified branding elements that strengthen class identity and unity among students.',
    descID: 'Design lanyard kelas dengan elemen branding terpadu yang memperkuat identitas dan kesatuan kelas di antara siswa.',
    tags: ['Lanyard Design', 'Class Identity', 'Student Branding'],
    image: '/assets/img/lanyard-kelas.jpg',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  {
    id: 'poster-waktu-untuk-diri-2026',
    route: '/works/poster-waktu-untuk-diri-2026',
    year: 2026,
    category: ['Poster', 'Event'],
    titleEN: '"Me Time" - Time For Yourself',
    titleID: 'Waktu Untuk Diri - Me Time',
    descEN: 'Research poster for "Not An Ordinary Teenage" competition held by UNEJ Faculty of Nursing (FKEP). Promoting the importance of personal time and self-care for teenage mental health.',
    descID: 'Poster riset untuk kompetisi "Not An Ordinary Teenage" yang diselenggarakan oleh UNEJ Fakultas Keperawatan (FKEP). Mempromosikan pentingnya waktu pribadi dan perawatan diri untuk kesehatan mental remaja.',
    tags: ['Research Poster', 'Mental Health', 'UNEJ FKEP', 'Nursing'],
    image: '/assets/img/poster-metime.jpg',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  },
  {
    id: 'poster-fomo-2026',
    route: '/works/poster-fomo-2026',
    year: 2026,
    category: ['Poster', 'Design'],
    titleEN: 'FOMO - Fear Of Missing Out In The Digital Age',
    titleID: 'FOMO - Ketakutan Ketinggalan di Era Digital',
    descEN: 'Educational poster highlighting FOMO (Fear of Missing Out) anxiety caused by social media comparisons. Explores how constant digital engagement impacts self-esteem, stress levels, and sleep quality.',
    descID: 'Poster edukatif tentang FOMO (Fear of Missing Out) - kecemasan akibat perbandingan media sosial. Mengeksplorasi bagaimana keterlibatan digital konstan berdampak pada harga diri, tingkat stres, dan kualitas tidur.',
    tags: ['Educational Poster', 'Digital Awareness', 'Mental Health', 'Social Media'],
    note: 'Poster Task by Aldo Leo Saputra, Anggi Dwi Aprilia, Big TL',
    image: '/assets/img/poster-fomo.jpg',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },

  /* ── 2026 (existing) ── */
  {
    id: 'editing-praktikum-biologi-2026',
    route: '/works/editing-praktikum-biologi-2026',
    year: 2026,
    category: ['Video', 'Educational'],
    titleEN: 'Biology Practicum Editing',
    titleID: 'Editing Praktikum Biologi',
    descEN: 'Professional editing of biology practicum session — capturing hands-on learning moments, clear visuals, and educational flow for student reference and class documentation.',
    descID: 'Editing video praktikum biologi yang capture momen pembelajaran hands-on, visual jelas, dan alur pendidikan untuk referensi siswa dan dokumentasi kelas.',
    tags: ['Video Editing', 'Educational', 'STEM'],
    image: '/assets/img/belajar.jpg',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  },
  {
    id: 'mindova-poster-2026',
    route: '/works/mindova-poster-2026',
    year: 2026,
    category: ['Poster', 'Academic'],
    titleEN: 'MINDOVA Research Poster',
    titleID: 'MINDOVA Poster - Strategi Psikologis PCOS',
    descEN: 'Research presentation poster for MINDOVA: Mind Over Ovaries — A systematic strategy for psychological empowerment of PCOS patients. Features 4 core mechanisms and PELUK framework for self-compassion.',
    descID: 'Poster presentasi riset MINDOVA (Mind Over Ovaries) - Strategi Sistematis Pemberdayaan Psikologis Pasien PCOS dengan mekanisme Body-Talk, Micro-Wins, Emo-Tracking, dan Self-Symbol Creation.',
    tags: ['Research', 'Healthcare', 'Psychology', 'PCOS', 'UNAIR 2025'],
    award: '🏥 Research Poster — MEDSPIN UNAIR 2025',
    note: 'Aldo Leo Saputra, Agustian Adven Arya Putra, Reydo Andrea Priatama',
    image: '/assets/img/MEDSPIN.jpg',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
  },

  {
    id: 'birthday-gift',
    route: '/works/birthday-gift',
    year: 2026,
    category: ['Web Dev'],
    titleEN: 'Interactive Birthday Gift',
    titleID: 'Website Kado Ulang Tahun',
    descEN: 'A birthday website built purely in HTML/CSS/JS. Mini-games, a personal AI assistant, and an immersive story experience for someone special. Vibe coded — no React, no framework, just fast and personal.',
    descID: 'Website kado ulang tahun buat pasangan atau anak. Ada game tantangan, story interaktif, asisten AI personal — semua HTML CSS JS, cepet dan personal banget.',
    tags: ['HTML/CSS/JS', 'Interactive Game', 'AI Integration', 'Vibe Code'],
    image: '/assets/img/image.png',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  },

  /* ── 2025 ── */
  {
    id: 'suara-sumbang-angin-utara-2025',
    route: '/works/suara-sumbang-angin-utara-2025',
    year: 2025,
    category: ['Short Film'],
    titleEN: 'Suara Sumbang Angin Utara',
    titleID: 'Suara Sumbang Angin Utara',
    descEN: 'Mira loves traditional music — the saronèn. When a national competition offers her a golden ticket to art school, her mother presents a ring. A film about choosing between a dream and whats expected of you.',
    descID: 'Mira cinta musik saronèn. Lomba nasional datang bawa tiket ke perguruan tinggi seni. Tapi ibu kasih cincin — tanda pernikahan. Film tentang dilema mimpi dan kenyataan.',
    tags: ['Short Film', 'Sinematura', 'Competition'],
    award: '🥈 Juara 2 Nasional — Film Festival Cendana 2025',
    image: '/assets/img/sumbang.jpg',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #065f46 100%)',
  },
  {
    id: 'guru-kita-yang-jahat-2025',
    route: '/works/guru-kita-yang-jahat-2025',
    year: 2025,
    category: ['Short Film'],
    titleEN: 'Guru Kita Yang Jahat',
    titleID: 'Guru Kita Yang Jahat',
    descEN: 'School is more than knowledge transfer — it\'s where moral character is shaped by real humans, not algorithms. A film questioning what happens when tech replaces the presence only a teacher can provide.',
    descID: 'Sekolah bukan cuma transfer ilmu. Guru bukan cuma pengajar — dia pembentuk karakter. Film ini nanya: apa yang hilang ketika teknologi mulai ngegantiin peran itu?',
    tags: ['Short Film', 'Sinematura', 'Competition'],
    note: 'Jawa Pos SMA Awards 2025',
    image: '/assets/img/jahat.jpg',
    gradient: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
  },
  {
    id: 'video-profil-uswatun-2025',
    route: '/works/video-profil-uswatun-2025',
    year: 2025,
    category: ['Documentary'],
    titleEN: 'Video Profil — Uswatun Hasanah',
    titleID: 'Video Profil — Uswatun Hasanah',
    descEN: 'A profile documentary on an English teacher at SMAN 1 Kraksaan — capturing her personal, human-centered approach to language teaching.',
    descID: 'Dokumenter profil guru Bahasa Inggris SMAN 1 Kraksaan. Cara beliau mengajar — pendekatan yang personal dan bikin siswa nggak takut bahasa Inggris.',
    tags: ['Video Profile', 'EJIES 2025'],
    image: '/assets/img/uswa.jpg',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
  },
  {
    id: 'video-profil-iwan-2025',
    route: '/works/video-profil-iwan-2025',
    year: 2025,
    category: ['Documentary'],
    titleEN: 'Video Profil — Iwan Cahyadi',
    titleID: 'Video Profil — Iwan Cahyadi',
    descEN: 'A profile documentary featuring the fingerprint attendance system at SMAN 1 Kraksaan — how the tech works, and how it\'s reshaping school administration through biometric data.',
    descID: 'Dokumenter profil tentang sistem absen sidik jari di SMAN 1 Kraksaan — gimana teknologinya jalan dan ngubah cara administrasi sekolah.',
    tags: ['Video Profile', 'EJIES 2025', 'Biometric Tech'],
    image: '/assets/img/iwan.jpg',
    gradient: 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
  },
  {
    id: 'senam-indonesia-hebat-2025',
    route: '/works/senam-indonesia-hebat-2025',
    year: 2025,
    category: ['Event', 'Video'],
    titleEN: 'Senam Anak Indonesia Hebat 2025',
    titleID: 'Senam Anak Indonesia Hebat 2025',
    descEN: 'Competition video for the national Anak Indonesia Hebat gymnastics program — SMAN 1 Kraksaan\'s provincial entry. Clean coverage, tight audio sync.',
    descID: 'Video lomba senam Anak Indonesia Hebat 2025, mewakili Jawa Timur dari SMAN 1 Kraksaan. Shoot dan edit bersih, sync audio ketat.',
    tags: ['Competition Video', 'Jawa Timur'],
    image: '/assets/img/anak.jpg',
    gradient: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
  },
  {
    id: 'parlemen-remaja-faza-2025',
    route: '/works/parlemen-remaja-faza-2025',
    year: 2025,
    category: ['Event', 'Video'],
    titleEN: 'Parlemen Remaja — Faza Abdi Mahalila',
    titleID: 'Parlemen Remaja — Faza Abdi Mahalila',
    descEN: 'Campaign video for youth parliament candidate Faza Abdi Mahalila. Energy transition isn\'t optional — PLTU Paiton lights millions of homes, but at a cost the land is still paying.',
    descID: 'Video kampanye caleg Parlemen Remaja. PLTU Paiton terangin jutaan rumah, tapi sawah kena abu, hasil panen turun. Program GENSIA: aksi nyata menuju energi bersih.',
    tags: ['Political', 'Youth Parliament', 'Energy Transition'],
    image: '/assets/img/faza.jpg',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
  },
  {
    id: 'video-kreatif-antikorupsi-2025',
    route: '/works/video-kreatif-antikorupsi-2025',
    year: 2025,
    category: ['Event', 'Video'],
    titleEN: 'Video Kreatif Anti-Korupsi',
    titleID: 'Video Kreatif Anti-Korupsi',
    descEN: 'A non-AI creative video on corruption awareness. Bribery, gratification, nepotism — they hurt everyone. The message: start with yourself.',
    descID: 'Video kreatif anti-korupsi yang nggak pake AI. Korupsi ngerugiin semua orang. Pesannya mulai dari diri sendiri: jujur dan berani nolak.',
    tags: ['Competition', 'Non-AI', 'Anti-Corruption'],
    note: 'Non-AI Production',
    image: '/assets/img/anti.jpg',
    gradient: 'linear-gradient(135deg, #be123c 0%, #9f1239 100%)',
  },

  /* ── 2024 ── */
  {
    id: 'ruang-kepala-2024',
    route: '/works/ruang-kepala-2024',
    year: 2024,
    category: ['Short Film'],
    titleEN: 'Ruang Kepala',
    titleID: 'Ruang Kepala',
    descEN: 'Arka, 16, feels invisible to his workaholic parents. A school fight forces a reckoning. He finds martial arts, trains in secret, enters a competition nobody knows about — and wins.',
    descID: 'Arka, 16 tahun, ngerasa jauh dari orang tuanya yang sibuk. Perkelahian di sekolah jadi titik balik. Dia nemuin beladiri, latihan diam-diam, ikut lomba sendirian — dan menang.',
    tags: ['Short Film', 'Sinematura', 'FLS2N'],
    award: '🏆 Juara 1 Nasional — Film Festival Cendana 2025',
    image: '/assets/img/kepala.jpg',
    gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
  },
  {
    id: 'rantai-2024',
    route: '/works/rantai-2024',
    year: 2024,
    category: ['Short Film'],
    titleEN: 'Rantai',
    titleID: 'Rantai',
    descEN: 'Saka\'s bike chain breaks. Everyone passes by. One teacher stops — not with words, but with action. A quiet film about the kind of help that doesn\'t make a scene.',
    descID: 'Rantai sepeda Saka lepas. Semua orang lewat. Satu guru berhenti — bukan dengan kata-kata, tapi dengan tindakan. Film yang tenang tentang pertolongan yang nggak butuh penonton.',
    tags: ['Short Film', 'Sinematura', 'Piala Kadinas Jatim'],
    image: '/assets/img/rantai.jpg',
    gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
  },
  {
    id: 'luka-menjadi-lukisan-2024',
    route: '/works/luka-menjadi-lukisan-2024',
    year: 2024,
    category: ['Short Film'],
    titleEN: 'Luka Menjadi Lukisan',
    titleID: 'Luka Menjadi Lukisan',
    descEN: 'A solo project — written, shot, and edited by one person. A student artist who gets mocked for his craft turns that noise into motivation. The kind of film you make when you have a point to prove.',
    descID: 'Proyek solo — nulis, nge-shoot, ngedit sendiri. Siswa yang suka seni terus dikomenin orang, terus jadiin itu bahan bakar. Film yang dibuat waktu ada sesuatu yang harus dibuktiin.',
    tags: ['Short Film', 'Solo Project'],
    note: 'Solo production — satu orang',
    image: '/assets/img/luka.jpg',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #6b21a8 100%)',
  },
  {
    id: 'jalan-tengah-2024',
    route: '/works/jalan-tengah-2024',
    year: 2024,
    category: ['Short Film'],
    titleEN: 'Jalan Tengah',
    titleID: 'Jalan Tengah',
    descEN: 'A story about a minority student fighting to hold a Christmas event at his school, and the unexpected ally who makes it happen. A film about how tolerance is a decision, not a concept.',
    descID: 'Alvin, siswa minoritas, mau ngadain acara Natal di sekolah. Jalannya nggak mudah. Tapi akhirnya ada yang bantu dari tempat yang nggak dia sangka. Film tentang toleransi yang bukan cuma slogan.',
    tags: ['Short Film', 'Sinematura', 'Moderasi Beragama'],
    image: '/assets/img/tengah.jpg',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #164e63 100%)',
  },
  {
    id: 'sma-awards-sinematografi-2024',
    route: '/works/sma-awards-sinematografi-2024',
    year: 2024,
    category: ['Short Film'],
    titleEN: 'Jawa Pos SMA Awards — Sinematografi',
    titleID: 'Jawa Pos SMA Awards — Sinematografi',
    descEN: 'An exploration of how personal objects reveal personality — the things kids carry say more about who they are than any introduction. A quiet visual essay about individuality.',
    descID: 'Eksplorasi tentang perbedaan yang sering nggak disadari — kepribadian anak-anak yang tergambar dari barang-barang yang mereka bawa.',
    tags: ['Jawa Pos SMA Awards', 'Sinematografi'],
    image: '/assets/img/pos.jpg',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)',
  },
  {
    id: 'teaser-alterio-mpls-2024',
    route: '/works/teaser-alterio-mpls-2024',
    year: 2024,
    category: ['Event'],
    titleEN: 'Teaser MPLS 2024 — ALTERIO',
    titleID: 'Teaser MPLS 2024 — ALTERIO',
    descEN: 'A time-travel teaser for SMAN 1 Kraksaan\'s MPLS orientation. Alvin finds a mysterious clock, activates it, and ends up witnessing the moment their class name was decided.',
    descID: 'Teaser MPLS. Alvin nemu jam misterius, nggak sengaja ngaktifin, dan tiba-tiba nonton rapat OSIS tahun 2022 nentuin nama angkatan — ALTERIO 47.',
    tags: ['MPLS', 'Time Travel', 'SMAN 1 Kraksaan'],
    image: '/assets/img/teaser.jpg',
    gradient: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
  },
  {
    id: 'duta-pelajar-putri-2024',
    route: '/works/duta-pelajar-putri-2024',
    year: 2024,
    category: ['Event'],
    titleEN: 'Duta Pelajar Putri — SMA Awards 2024',
    titleID: 'Duta Pelajar Putri — SMA Awards 2024',
    descEN: 'Video profile for Bilqis Zahratus Syita\'s award entry — edited to match the energy of her vision: moving forward despite obstacles, finding rhythm in every challenge.',
    descID: 'Video profil lomba Duta Pelajar Putri Award 2024. Diedit seenergi semangat Bilqis: terus bergerak, nemu irama di setiap tantangan.',
    tags: ['Jawa Pos SMA Awards', 'Duta Pelajar Putri'],
    image: '/assets/img/pelajar.jpg',
    gradient: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
  },
  {
    id: 'livestream-perbasi',
    route: '/works/livestream-perbasi',
    year: 2024,
    category: ['Live Stream'],
    titleEN: 'PERBASI Live Stream System',
    titleID: 'Sistem Live Stream PERBASI',
    descEN: 'Full live stream production for PERBASI Youth Basketball League — Probolinggo Regency (Kabupaten 14, East Java). Custom OBS overlay, controlled via a tablet web app.',
    descID: 'Produksi live streaming liga basket PERBASI kabupaten 14 Jawa Timur. Desain overlay OBS custom, dikontrol real-time lewat web app di tablet.',
    tags: ['OBS', 'Live Streaming', 'Broadcast Design'],
    image: '/assets/img/perbasi.jpg',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)',
  },

  /* ── 2023 ── */
  {
    id: 'sarka-2023',
    route: '/works/sarka-2023',
    year: 2023,
    category: ['Short Film'],
    titleEN: 'SARKA',
    titleID: 'SARKA',
    descEN: 'Raka has a vision for waste management that nobody takes seriously. His classmates laugh, throw trash in his bag, call him names. He doesn\'t back down. Sinematura\'s first serious short film.',
    descID: 'Raka visioner soal pengolahan sampah tapi terus dibully temen-temennya. Dia nggak menyerah. Film serius pertama Sinematura.',
    tags: ['Short Film', 'Sinematura', 'Debut'],
    image: '/assets/img/sarka.jpg',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
  },
  {
    id: 'pramu-rasa-2023',
    route: '/works/pramu-rasa-2023',
    year: 2023,
    category: ['Short Film'],
    titleEN: 'Pramu Rasa',
    titleID: 'Pramu Rasa',
    descEN: 'The very first film — before there was a club, before there were awards. Pak Rehan is 35, has three kids, wants to apply for civil service, but barely knows how to use his phone.',
    descID: 'Film pertama yang pernah dibuat — sebelum ada komunitas, sebelum ada penghargaan. Pak Rehan pengen daftar CPNS tapi baru belajar pegang HP.',
    tags: ['Short Film', 'First Film'],
    note: 'Before Sinematura existed',
    image: '/assets/img/pramu.jpg',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
  },

  /* ── Year flexible ── */
  {
    id: 'wedding-invite',
    route: '/works/wedding-invite',
    year: 2025,
    category: ['Web Dev'],
    titleEN: 'Digital Wedding Invite',
    titleID: 'Undangan Pernikahan Digital',
    descEN: 'A wedding site that greets each guest by name, opens with a cinematic video intro, and connects to a Firebase dashboard for RSVP management, guest messages, and live attendance tracking.',
    descID: 'Undangan pernikahan digital yang nyambut tamu pakai nama mereka, ada video sinematik di awal, terus semua data tamu diatur via dashboard Firebase.',
    tags: ['Firebase', 'Real-time RSVP', 'HTML/CSS/JS'],
    image: '/assets/img/bg.png',
    gradient: 'linear-gradient(135deg, #9d174d 0%, #831843 100%)',
  },
];

/* ── Filter categories (All = show all) ── */
const FILTER_CATS = [
  { key: 'All',        label: 'All' },
  { key: 'Web Dev',    label: 'Web Dev' },
  { key: 'Short Film', label: 'Short Film' },
  { key: 'Video',      label: 'Video' },
  { key: 'Event',      label: 'Event' },
  { key: 'Poster',     label: 'Poster' },
  { key: 'Lanyard',    label: 'Lanyard' },
  { key: 'Academic',   label: 'Academic' },
  { key: 'Live Stream',label: 'Live Stream' },
  { key: 'Documentary',label: 'Documentary' },
  { key: 'Educational',label: 'Educational' },
];

/* ══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════ */
export default function Works({ lang = 'id' }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filter & sort from URL params, fallback to defaults
  const [activeFilter, setActiveFilter] = useState(() => searchParams.get('filter') || 'All');
  const [sortOrder, setSortOrder] = useState(() => searchParams.get('sort') || 'newest');

  // Update URL when filter changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('filter', activeFilter);
    newParams.set('sort', sortOrder);
    setSearchParams(newParams, { replace: true });
  }, [activeFilter, sortOrder, searchParams, setSearchParams]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.06, rootMargin: '0px 0px -16px 0px' }
    );
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 80);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);

  /* ── CSS injection ── */
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'works-page-styles';
    style.textContent = `
      /* ─── HERO ─── */
      .wk-hero {
        min-height: 48vh;
        display: flex; align-items: flex-end;
        padding: 130px 80px 70px;
        position: relative; overflow: hidden;
        border-bottom: 1px solid var(--border);
        background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
      }
      .wk-hero-bg {
        position: absolute; inset: 0; pointer-events: none;
        background:
          radial-gradient(ellipse 55% 60% at 85% 15%, rgba(139,92,246,0.11) 0%, transparent 65%),
          radial-gradient(ellipse 40% 50% at 10% 80%, rgba(139,92,246,0.07) 0%, transparent 60%);
      }
      .wk-hero-content { position: relative; z-index: 1; }
      .wk-hero-label {
        display: block; font-size: 0.6rem; font-weight: 700;
        letter-spacing: 0.32em; text-transform: uppercase;
        color: var(--text-dim); margin-bottom: 14px;
      }
      .wk-hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(3.2rem, 8vw, 8.5rem);
        font-weight: 300; line-height: 0.88; margin-bottom: 18px;
      }
      .wk-hero-tagline {
        font-size: 0.88rem; color: var(--text-dim);
        max-width: 360px; line-height: 1.7;
      }
      .wk-hero-count {
        display: inline-flex; align-items: center; gap: 8px;
        margin-top: 18px;
        background: var(--glass); border: 1px solid var(--gborder);
        border-radius: 99px; padding: 7px 16px;
        font-size: 0.68rem; font-weight: 700;
        letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--text-dim);
      }
      .wk-hero-count span { color: var(--accent3); }

      /* ─── TOOLBAR ─── */
      .wk-toolbar {
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 14px;
        padding: 32px 80px 0;
      }
      .wk-filter-bar { display: flex; flex-wrap: wrap; gap: 8px; }
      .wk-filter-btn {
        font-family: 'Outfit', sans-serif;
        font-size: 0.7rem; font-weight: 600;
        letter-spacing: 0.08em; text-transform: uppercase;
        padding: 8px 16px; border-radius: 99px; cursor: pointer;
        border: 1px solid var(--gborder);
        background: var(--glass); color: var(--text-dim);
        transition: all 0.25s;
      }
      .wk-filter-btn:hover { border-color: var(--gborder2); color: var(--text); }
      .wk-filter-btn.active {
        background: rgba(139,92,246,0.12);
        border-color: rgba(139,92,246,0.4);
        color: var(--accent3);
      }
      .wk-sort-bar { display: flex; gap: 8px; }
      .wk-sort-btn {
        font-family: 'Outfit', sans-serif;
        font-size: 0.68rem; font-weight: 600;
        letter-spacing: 0.06em; padding: 7px 14px;
        border-radius: 99px; cursor: pointer;
        border: 1px solid var(--gborder);
        background: var(--glass); color: var(--text-dim);
        transition: all 0.25s;
      }
      .wk-sort-btn:hover { border-color: var(--gborder2); color: var(--text); }
      .wk-sort-btn.active { border-color: rgba(139,92,246,0.4); color: var(--accent3); }

      /* ─── GRID ─── */
      .wk-section { padding: 40px 80px 100px; }
      .wk-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      /* ─── CARD ─── */
      .wk-card {
        background: var(--glass); border: 1px solid var(--gborder);
        border-radius: 20px; overflow: hidden; cursor: pointer;
        transition: border-color 0.3s, transform 0.3s, background 0.3s;
        display: flex; flex-direction: column;
      }
      .wk-card:hover {
        border-color: rgba(139,92,246,0.4);
        transform: translateY(-5px);
        background: var(--glass2);
      }
      .wk-card-thumb {
        width: 100%; aspect-ratio: 16/9;
        display: flex; align-items: center; justify-content: center;
        position: relative; overflow: hidden;
        flex-shrink: 0;
      }
      .wk-card-thumb-inner {
        position: absolute; inset: 0;
      }
      .wk-card-year-badge {
        position: absolute; top: 12px; right: 12px;
        background: rgba(0,0,0,0.55); backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 99px; padding: 4px 10px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.62rem; font-weight: 700;
        letter-spacing: 0.1em; color: rgba(255,255,255,0.7);
      }
      .wk-card-award-badge {
        position: absolute; bottom: 10px; left: 10px; right: 10px;
        background: rgba(0,0,0,0.72); backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px; padding: 6px 10px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.62rem; font-weight: 700;
        letter-spacing: 0.04em; color: #fbbf24;
        line-height: 1.3;
      }
      .wk-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
      .wk-card-cats { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
      .wk-cat-pill {
        font-family: 'Outfit', sans-serif;
        font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
        text-transform: uppercase; border-radius: 99px; padding: 3px 10px;
        border: 1px solid;
      }
      .cat-web    { color: #60a5fa; border-color: rgba(96,165,250,0.35); background: rgba(96,165,250,0.08); }
      .cat-film   { color: #a78bfa; border-color: rgba(167,139,250,0.35); background: rgba(167,139,250,0.08); }
      .cat-video  { color: #34d399; border-color: rgba(52,211,153,0.35); background: rgba(52,211,153,0.08); }
      .cat-event  { color: #fb923c; border-color: rgba(251,146,60,0.35); background: rgba(251,146,60,0.08); }
      .cat-live   { color: #f472b6; border-color: rgba(244,114,182,0.35); background: rgba(244,114,182,0.08); }
      .cat-doc    { color: #fbbf24; border-color: rgba(251,191,36,0.35); background: rgba(251,191,36,0.08); }
      .cat-poster { color: #ec4899; border-color: rgba(236,72,153,0.35); background: rgba(236,72,153,0.08); }
      .cat-lany   { color: #f59e0b; border-color: rgba(245,158,11,0.35); background: rgba(245,158,11,0.08); }
      .cat-acad   { color: #8b5cf6; border-color: rgba(139,92,246,0.35); background: rgba(139,92,246,0.08); }
      .cat-edu    { color: #06b6d4; border-color: rgba(6,182,212,0.35); background: rgba(6,182,212,0.08); }
      .cat-design { color: #10b981; border-color: rgba(16,185,129,0.35); background: rgba(16,185,129,0.08); }
      .cat-other  { color: var(--text-dim); border-color: var(--gborder); background: var(--glass); }

      .wk-card-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.2rem; font-weight: 500;
        color: var(--text); margin-bottom: 10px; line-height: 1.2;
      }
      .wk-card-desc {
        font-family: 'Outfit', sans-serif;
        font-size: 0.8rem; line-height: 1.75;
        color: var(--text-dim); margin-bottom: 14px; flex: 1;
        display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .wk-card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
      .wk-tag {
        font-family: 'Outfit', sans-serif;
        font-size: 0.6rem; font-weight: 600; letter-spacing: 0.05em;
        background: var(--glass2); border: 1px solid var(--gborder);
        border-radius: 99px; padding: 3px 9px; color: var(--text-dim);
      }
      .wk-card-note {
        display: flex; align-items: center; gap: 6px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.66rem; color: var(--accent3);
        opacity: 0.8; margin-bottom: 12px;
      }
      .wk-card-cta {
        display: flex; align-items: center; justify-content: space-between;
        padding-top: 14px; border-top: 1px solid var(--border);
        margin-top: auto;
      }
      .wk-card-cta span {
        font-family: 'Outfit', sans-serif;
        font-size: 0.66rem; font-weight: 700; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--accent3);
      }
      .wk-card-cta i { color: var(--accent3); font-size: 0.8rem; }
      .wk-card:hover .wk-card-cta span,
      .wk-card:hover .wk-card-cta i { color: var(--accent); }

      /* ─── EMPTY STATE ─── */
      .wk-empty {
        grid-column: 1 / -1; text-align: center;
        padding: 80px 20px;
        color: var(--text-dim); font-family: 'Outfit', sans-serif;
        font-size: 0.9rem;
      }

      /* ─── BOTTOM CTA ─── */
      .wk-bottom-cta {
        padding: 60px 80px 80px;
        background: linear-gradient(180deg, var(--bg2) 0%, var(--bg3) 100%);
        border-top: 1px solid var(--border);
        text-align: center;
      }
      .wk-bottom-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(1.6rem, 3vw, 2.6rem);
        font-weight: 300; color: var(--text); margin-bottom: 24px;
      }
      .wk-btn-start {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 14px 36px; border: none; border-radius: 99px; cursor: pointer;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: #fff; font-family: 'Outfit', sans-serif;
        font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em;
        text-transform: uppercase; transition: opacity 0.25s, transform 0.25s;
      }
      .wk-btn-start:hover { opacity: 0.88; transform: scale(1.04); }

      /* ─── RESPONSIVE ─── */
      @media (max-width: 1200px) {
        .wk-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 1024px) {
        .wk-hero, .wk-toolbar, .wk-section, .wk-bottom-cta {
          padding-left: 40px; padding-right: 40px;
        }
      }
      @media (max-width: 768px) {
        .wk-hero, .wk-toolbar, .wk-section, .wk-bottom-cta {
          padding-left: 24px; padding-right: 24px;
        }
        .wk-hero { min-height: auto; padding-top: 100px; padding-bottom: 48px; }
        .wk-grid { grid-template-columns: 1fr; }
        .wk-toolbar { flex-direction: column; align-items: flex-start; }
        .wk-section { padding-top: 28px; padding-bottom: 70px; }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('works-page-styles')?.remove();
  }, []);

  /* ── Filtered + sorted data ── */
  const filteredKarya = KARYA_LIST
    .filter((k) => activeFilter === 'All' || k.category.includes(activeFilter))
    .sort((a, b) => sortOrder === 'newest' ? b.year - a.year : a.year - b.year);

  const getCatClass = useCallback((cat) => {
    if (cat === 'Web Dev') return 'cat-web';
    if (cat === 'Short Film') return 'cat-film';
    if (cat === 'Video') return 'cat-video';
    if (cat === 'Event') return 'cat-event';
    if (cat === 'Live Stream') return 'cat-live';
    if (cat === 'Documentary') return 'cat-doc';
    if (cat === 'Poster') return 'cat-poster';
    if (cat === 'Lanyard') return 'cat-lany';
    if (cat === 'Academic') return 'cat-acad';
    if (cat === 'Educational') return 'cat-edu';
    if (cat === 'Design') return 'cat-design';
    return 'cat-other';
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <div className="wk-hero">
        <div className="wk-hero-bg" />
        <div className="wk-hero-content">
          <span className="wk-hero-label reveal">Works</span>
          <h1 className="wk-hero-title reveal">
            Selected{' '}
            <span className="grad-text-1">Work.</span>
          </h1>
          <p className="wk-hero-tagline reveal">
            {lang === 'id'
              ? 'Dikerjain serius, selesai tepat waktu.'
              : 'Built with trust. Delivered with care.'}
          </p>
          <div className="wk-hero-count reveal">
            <span>{filteredKarya.length}</span> projects
          </div>
        </div>
      </div>

      {/* ── TOOLBAR: filters + sort ── */}
      <div className="wk-toolbar reveal">
        {/* Filter by category */}
        <div className="wk-filter-bar">
          {FILTER_CATS.map((cat) => (
            <button
              key={cat.key}
              className={`wk-filter-btn${activeFilter === cat.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <div className="wk-sort-bar">
          <button
            className={`wk-sort-btn${sortOrder === 'newest' ? ' active' : ''}`}
            onClick={() => setSortOrder('newest')}
          >
            🕐 Terbaru Dulu
          </button>
          <button
            className={`wk-sort-btn${sortOrder === 'oldest' ? ' active' : ''}`}
            onClick={() => setSortOrder('oldest')}
          >
            📅 Terlama Dulu
          </button>
        </div>
      </div>

      {/* ── WORKS GRID ── */}
      <section className="wk-section">
        <div className="wk-grid">
          {filteredKarya.length === 0 ? (
            <div className="wk-empty">
              <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '2rem', marginBottom: 12, display: 'block', opacity: 0.3 }} />
              No works found in this category.
            </div>
          ) : (
            filteredKarya.map((k, i) => (
              <div
                key={k.id}
                className={`wk-card reveal${i % 3 === 1 ? ' rv-d1' : i % 3 === 2 ? ' rv-d2' : ''}`}
                onClick={() => navigate(k.route)}
              >
                {/* Thumbnail / gradient placeholder */}
                <div className="wk-card-thumb">
                  <div
                    className="wk-card-thumb-inner"
                    style={{
                      background: k.image 
                        ? `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('${k.image}')`
                        : k.gradient,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  {/* Year badge */}
                  <div className="wk-card-year-badge">{k.year}</div>
                  {/* Award badge */}
                  {k.award && (
                    <div className="wk-card-award-badge">{k.award}</div>
                  )}
                </div>

                {/* Body */}
                <div className="wk-card-body">
                  {/* Category pills */}
                  <div className="wk-card-cats">
                    {k.category.map((cat) => (
                      <span key={cat} className={`wk-cat-pill ${getCatClass(cat)}`}>
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="wk-card-title">
                    {lang === 'id' ? k.titleID : k.titleEN}
                  </h3>

                  {/* Description */}
                  <p className="wk-card-desc">
                    {lang === 'id' ? k.descID : k.descEN}
                  </p>

                  {/* Tags */}
                  <div className="wk-card-tags">
                    {k.tags.map((tag, j) => (
                      <span key={j} className="wk-tag">{tag}</span>
                    ))}
                  </div>

                  {/* Note */}
                  {k.note && (
                    <div className="wk-card-note">
                      <i className="fa-solid fa-circle-info" />
                      <span>{k.note}</span>
                    </div>
                  )}

                  {/* CTA row */}
                  <div className="wk-card-cta">
                    <span>View Project</span>
                    <i className="fa-solid fa-arrow-up-right" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <div className="wk-bottom-cta">
        <p className="wk-bottom-title">
          {lang === 'id' ? 'Punya project yang mau digarap?' : 'Have a project in mind?'}
        </p>
        <button className="wk-btn-start" onClick={() => navigate('/price-list')}>
          <span>{lang === 'id' ? 'Mulai Proyek' : 'Start a Project'}</span>
          <i className="fa-solid fa-arrow-up-right" />
        </button>
      </div>
    </>
  );
}
