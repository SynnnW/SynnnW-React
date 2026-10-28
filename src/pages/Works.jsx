import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LineReveal from '../components/LineReveal';
import Magnetic from '../components/Magnetic';
import { ThumbImg, Reveal, Arrow, ContactCard } from '../components/BentoKit';
import { useLang, waLink, IG_URL, workSpans } from '../lib/bento';

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
    image: '/assets/img/extracule.jpg',
    gradient: 'var(--bg3)',
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
    image: '/assets/img/genesis.jpg',
    gradient: 'var(--bg3)',
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
    image: '/assets/img/class.jpg',
    gradient: 'var(--bg3)',
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
    image: '/assets/img/metime.jpg',
    gradient: 'var(--bg3)',
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
    image: '/assets/img/fomo.jpg',
    gradient: 'var(--bg3)',
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
    image: '/assets/img/biology.jpg',
    gradient: 'var(--bg3)',
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
    image: '/assets/img/mindova.jpg',
    gradient: 'var(--bg3)',
  },
  {
    id: 'parlemen-remaja-2026',
    route: '/works/parlemen-remaja-faza-2025',
    year: 2026,
    category: ['Documentary', 'Event'],
    titleEN: 'Youth Parliament Documentary',
    titleID: 'Dokumentasi Parlemen Remaja',
    descEN: 'Documentary film capturing the Youth Parliament event, showcasing young leaders engaging in civic discussions, debates, and democratic processes. A celebration of youth voice and political awareness.',
    descID: 'Film dokumenter tentang acara Parlemen Remaja, menampilkan para pemimpin muda terlibat dalam diskusi sipil, debat, dan proses demokratis. Perayaan suara pemuda dan kesadaran politik.',
    tags: ['Documentary', 'Youth', 'Parliament', 'Civic', 'Leadership'],
    image: '/assets/img/faza.jpg',
    gradient: 'var(--bg3)',
  },
  {
    id: 'korupsi-awareness-2026',
    route: '/works/video-kreatif-antikorupsi-2025',
    year: 2026,
    category: ['Documentary', 'Educational'],
    titleEN: 'Anti-Corruption Awareness Campaign',
    titleID: 'Kampanye Kesadaran Anti-Korupsi',
    descEN: 'Educational documentary highlighting the impacts of corruption and promoting anti-corruption awareness among youth. Explores systemic issues and individual responsibility in combating corruption.',
    descID: 'Dokumenter edukatif yang menyoroti dampak korupsi dan mempromosikan kesadaran anti-korupsi di kalangan pemuda. Mengeksplorasi isu sistemik dan tanggung jawab individu dalam memerangi korupsi.',
    tags: ['Documentary', 'Anti-Corruption', 'Awareness', 'Education', 'Social Justice'],
    image: '/assets/img/anti.jpg',
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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
    gradient: 'var(--bg3)',
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



const MotionLink = motion.create(Link);

/* Bento card grid (same card language as Journal). Nothing depends on cursor movement. */
function WorkIndex({ items, isID }) {
  const spans = workSpans(items.length);
  return (
    <div className="bn-grid bn-grid--rows wk-bento">
      {items.map((k, i) => {
        const title = isID ? k.titleID : k.titleEN;
        const cat = k.category.find(c => c !== 'Design') || k.category[0];
        return (
          <MotionLink
            key={k.id}
            to={k.route}
            className={`bn-work bn-span-${spans[i]}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: Math.min(i, 7) * 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="bn-work-in">
              {k.image && <ThumbImg src={k.image} alt={title} priority={i < 2} />}
              <span className="bn-work-shade" />
              <span className="bn-work-go"><Arrow /></span>
              <span className="bn-work-txt">
                <span className="bn-work-head"><em className="bn-pill">{cat}</em></span>
                <strong className="bn-work-title">{title}</strong>
                <span className="bn-work-meta">{k.year}</span>
              </span>
            </span>
          </MotionLink>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT — tampilan bento (data di atas tidak diubah)
   Halaman detail /works/* tidak terpengaruh.
══════════════════════════════════════════════════════ */
export default function Works({ lang: propLang }) {
  const lang = useLang(propLang);
  const isID = lang === 'id';
  const L = (en, id) => (isID ? id : en);
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();

  /* Filter & urutan hidup di URL, jadi bisa di-share dan tahan refresh */
  const rawFilter = sp.get('filter');
  const activeFilter = FILTER_CATS.some(c => c.key === rawFilter) ? rawFilter : 'All';
  const sortOrder = sp.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const update = patch => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    setSp(next, { replace: true });
  };

  const counts = useMemo(() => {
    const out = {};
    FILTER_CATS.forEach(c => {
      out[c.key] = c.key === 'All' ? KARYA_LIST.length : KARYA_LIST.filter(k => k.category.includes(c.key)).length;
    });
    return out;
  }, []);

  const items = useMemo(
    () => KARYA_LIST
      .filter(k => activeFilter === 'All' || k.category.includes(activeFilter))
      .sort((a, b) => (sortOrder === 'newest' ? b.year - a.year : a.year - b.year)),
    [activeFilter, sortOrder]
  );
  
  return (
    <main className="bn">
      <div className="bn-wrap">
        {/* ── Intro ── */}
        <div className="bn-grid">
          <Reveal className="bn-card bn-hello bn-span-4">
            <div className="bn-who">
              <span className="bn-avatar"><img src="/assets/img/favicon.png" alt="" /></span>
              <div>
                <b>Aldo Leo Saputra</b>
                <small>{L('Digital creator · East Java', 'Kreator digital · Jawa Timur')}</small>
              </div>
            </div>
            <div className="bn-social">
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
              <a href={waLink(L('Hi Aldo, I saw your works.', 'Halo Aldo, aku lihat karya-karyamu.'))} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp" /></a>
            </div>
            <LineReveal as="h1" className="bn-title" text={L('Selected work.', 'Karya pilihan.')} />
            <p className="bn-lead">
              {L('Built with trust. Delivered with care.', 'Dikerjain serius, selesai tepat waktu.')}
            </p>
          </Reveal>

          <Reveal className="bn-card bn-hot bn-span-2" delay={0.08}>
            <span className="bn-kicker" style={{ color: 'rgba(255,255,255,.85)' }}>
              {activeFilter === 'All' ? L('All projects', 'Semua proyek') : activeFilter}
            </span>
            <div>
              <div className="bn-big">{items.length}</div>
              <small>{L('projects shown', 'proyek ditampilkan')}</small>
            </div>
          </Reveal>
        </div>

        {/* ── Filter + urutan ── */}
        <Reveal className="bn-bar">
          <div className="bn-chips" role="tablist" aria-label={L('Filter by category', 'Filter kategori')}>
            {FILTER_CATS.map(c => (
              <button
                key={c.key}
                role="tab"
                aria-selected={activeFilter === c.key}
                className={`bn-chip${activeFilter === c.key ? ' on' : ''}`}
                onClick={() => update({ filter: c.key })}
              >
                {c.label} <i>{counts[c.key]}</i>
              </button>
            ))}
          </div>
          <div className="bn-seg" role="group" aria-label={L('Sort', 'Urutkan')}>
            <button className={sortOrder === 'newest' ? 'on' : ''} onClick={() => update({ sort: 'newest' })}>
              {L('Newest', 'Terbaru')}
            </button>
            <button className={sortOrder === 'oldest' ? 'on' : ''} onClick={() => update({ sort: 'oldest' })}>
              {L('Oldest', 'Terlama')}
            </button>
          </div>
        </Reveal>

        {/* ── Daftar karya ── */}
        <div className="wk-head">
          <span>(01) — {L('Selected works', 'Karya pilihan')}</span>
          <span>2024–2026</span>
        </div>
        {items.length === 0 && (
          <div className="bn-empty">{L('No works found in this category.', 'Belum ada karya di kategori ini.')}</div>
        )}
        <WorkIndex key={`${activeFilter}-${sortOrder}`} items={items} isID={isID} />

        {/* ── CTA ── */}
        <ContactCard
          title={L('Have a project in mind?', 'Punya project yang mau digarap?')}
          text={L('Tell me what you’re building — we’ll talk scope, timeline and price together.',
                  'Ceritakan idenya — kita bahas scope, waktu, dan harga bareng.')}
          primary={
            <Magnetic><button className="bn-btn bn-btn--solid" onClick={() => navigate('/price-list')}>
              {L('Start a Project', 'Mulai Proyek')} <Arrow />
            </button></Magnetic>
          }
          secondary={
            <a className="bn-btn" href={waLink(L('Hi Aldo, I want to ask about a project.', 'Halo Aldo, aku mau tanya soal project.'))} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          }
        />
      </div>
    </main>
  );
}
