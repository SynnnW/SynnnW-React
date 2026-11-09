import { useEffect, useState } from 'react';
import '../styles/cv.css';

/* ══════════════════════════════════════════════════════
   DATA — sinkron dengan AboutCV.jsx & About.jsx, jangan diubah
   manual di dua tempat — kalau CV-nya diupdate, update juga di situ.
══════════════════════════════════════════════════════ */
const EDUCATION = [
  { school: 'S1 Ilmu Keperawatan', sub: 'Universitas Jember · 2023 — sekarang · aktif di BEM FKEP' },
  { school: 'SMAN 1 Kraksaan', sub: 'Probolinggo' },
  { school: 'SMPN 2 Kraksaan', sub: 'Probolinggo' },
  { school: 'SDN 1 Sidomukti Kraksaan', sub: 'Probolinggo' },
];

const SKILLS = [
  { k: 'Web Development', tags: ['React', 'Next.js', 'Supabase', 'Git', 'HTML/CSS/JS'] },
  { k: 'Video Editing / Motion', tags: ['DaVinci Resolve', 'Premiere', 'After Effects', 'CapCut', 'Alight Motion'] },
  { k: 'Desain & Ilustrasi', tags: ['Illustrator', 'Photoshop', 'Canva', 'Affinity Designer', 'Figma'] },
  { k: 'Videografi / Fotografi', tags: ['DJI Gimbal', 'Sony', 'Canon', 'Lumix'] },
  { k: 'Live Streaming', tags: ['OBS Studio', 'Overlay Design', 'Web Controller'] },
];

const AWARDS = [
  { y: '2025', t: 'Juara 1 Nasional, Festival Film Cendana · SMAS Cendana Mandau, Bengkalis, Riau' },
  { y: '2024', t: 'Juara 2 Kabupaten, Film Pendek FLS2N · Probolinggo' },
  { y: '2025', t: 'Research Poster, MEDSPIN UNAIR' },
  { y: '#1', t: 'Penulisan Terbaik, Workshop Jurnalistik · UNHASA Genggong' },
  { y: '2025', t: 'Peserta, NOT (Not an Ordinary Teenage) · Universitas Jember' },
];

const EXPERIENCE = [
  { y: '2025–2026', role: 'Developer & Designer', desc: 'Website portofolio pribadi (synnnw.com, React + Supabase), website kado ulang tahun, undangan pernikahan digital; aplikasi desktop Leo dan Notch untuk Windows.' },
  { y: '2026', role: 'Designer / Author & Researcher', desc: 'Lanyard GENESIS, lanyard kelas, lanyard ekstrakurikuler, poster FOMO; penulis & desainer poster MINDOVA; riset & desain poster "Me Time".' },
  { y: '2025', role: 'Editor, Audioman & Cameraman', desc: 'Senam Anak Indonesia Hebat 2025; video profil guru (Uswatun Hasanah, Iwan Cahyadi); kampanye Parlemen Remaja; video kreatif Anti-Korupsi; sinematografer "Guru Kita Yang Jahat".' },
  { y: '2024', role: 'Editor, Writer & Cameraman (solo)', desc: '"Luka Menjadi Lukisan" — produksi solo; stream designer & operator siaran langsung PERBASI.' },
  { y: '2023–2026', role: 'Editor', desc: 'SARKA · Ruang Kepala · Rantai · Jalan Tengah · Jawa Pos SMA Awards · teaser MPLS ALTERIO · Duta Pelajar Putri · Suara Sumbang Angin Utara · Praktikum Biologi.' },
  { y: '2023', role: 'Assistant Cameraman', desc: '"Pramu Rasa" — produksi film pendek tim.' },
];

const ORGS = [
  { y: '2023–2025', t: 'OSIS — Sekbid Jurnalistik dan Komunikasi' },
  { y: '', t: 'Wartamatura — bidang wartawan / jurnalistik' },
  { y: '', t: 'Sinematura — bidang perfilman' },
  { y: '2024–2025', t: 'Sie PDD — GENESIS se-Tapal Kuda' },
  { y: '2025', t: 'Sie Publikasi & Dokumentasi — YEJBL, se-Jawa Timur' },
  { y: '2023', t: 'Sie PDD — Batik Pandalungan' },
  { y: '2023/2024', t: 'Sie PDD — Kas' },
  { y: '', t: 'Sie PDD — Talent Show & Acara Teater (event)' },
];

/* Karya film/video & desain — source: src/data/showcase.js (SHOWCASE_FILM / SHOWCASE_DESIGN) */
const FILM_WORKS = [
  { thumb: '/assets/thumbs/kepala.webp', title: 'Ruang Kepala', year: 2024, cat: 'Short Film', award: 'Juara 1 Nasional — Festival Film Cendana 2025' },
  { thumb: '/assets/thumbs/sumbang.webp', title: 'Suara Sumbang Angin Utara', year: 2025, cat: 'Short Film', award: 'Juara 2 Nasional — Festival Film Cendana 2025' },
  { thumb: '/assets/thumbs/biology.webp', title: 'Editing Praktikum Biologi', year: 2026, cat: 'Video' },
  { thumb: '/assets/thumbs/faza.webp', title: 'Dokumentasi Parlemen Remaja', year: 2026, cat: 'Documentary' },
  { thumb: '/assets/thumbs/anti.webp', title: 'Kampanye Kesadaran Anti-Korupsi', year: 2026, cat: 'Documentary' },
  { thumb: '/assets/thumbs/jahat.webp', title: 'Guru Kita Yang Jahat', year: 2025, cat: 'Short Film' },
  { thumb: '/assets/thumbs/uswa.webp', title: 'Video Profil — Uswatun Hasanah', year: 2025, cat: 'Documentary' },
  { thumb: '/assets/thumbs/iwan.webp', title: 'Video Profil — Iwan Cahyadi', year: 2025, cat: 'Documentary' },
  { thumb: '/assets/thumbs/anak.webp', title: 'Senam Anak Indonesia Hebat 2025', year: 2025, cat: 'Event' },
  { thumb: '/assets/thumbs/rantai.webp', title: 'Rantai', year: 2024, cat: 'Short Film' },
  { thumb: '/assets/thumbs/luka.webp', title: 'Luka Menjadi Lukisan', year: 2024, cat: 'Short Film' },
  { thumb: '/assets/thumbs/tengah.webp', title: 'Jalan Tengah', year: 2024, cat: 'Short Film' },
  { thumb: '/assets/thumbs/pos.webp', title: 'Jawa Pos SMA Awards — Sinematografi', year: 2024, cat: 'Short Film' },
  { thumb: '/assets/thumbs/teaser.webp', title: 'Teaser MPLS 2024 — ALTERIO', year: 2024, cat: 'Event' },
  { thumb: '/assets/thumbs/pelajar.webp', title: 'Duta Pelajar Putri — SMA Awards 2024', year: 2024, cat: 'Event' },
  { thumb: '/assets/thumbs/perbasi.webp', title: 'Sistem Live Stream PERBASI', year: 2024, cat: 'Live Stream' },
  { thumb: '/assets/thumbs/sarka.webp', title: 'SARKA', year: 2023, cat: 'Short Film' },
  { thumb: '/assets/thumbs/pramu.webp', title: 'Pramu Rasa', year: 2023, cat: 'Short Film' },
];

const DESIGN_WORKS = [
  { thumb: '/assets/thumbs/leo.webp', title: 'Leo — Notch untuk Windows', year: 2026, cat: 'Software' },
  { thumb: '/assets/thumbs/mindova.webp', title: 'MINDOVA Research Poster', year: 2026, cat: 'Poster', award: 'Research Poster — MEDSPIN UNAIR 2025' },
  { thumb: '/assets/thumbs/genesis.webp', title: 'Lanyard GENESIS', year: 2026, cat: 'Lanyard' },
  { thumb: '/assets/thumbs/extracule.webp', title: 'Lanyard Ekstrakurikuler', year: 2026, cat: 'Lanyard' },
  { thumb: '/assets/thumbs/class.webp', title: 'Lanyard Kelas', year: 2026, cat: 'Lanyard' },
  { thumb: '/assets/thumbs/metime.webp', title: 'Waktu Untuk Diri — Me Time', year: 2026, cat: 'Poster' },
  { thumb: '/assets/thumbs/fomo.webp', title: 'FOMO — Ketakutan Ketinggalan di Era Digital', year: 2026, cat: 'Poster' },
  { thumb: '/assets/thumbs/image.webp', title: 'Website Kado Ulang Tahun', year: 2026, cat: 'Web Dev' },
  { thumb: '/assets/thumbs/bg.webp', title: 'Undangan Pernikahan Digital', year: 2025, cat: 'Web Dev' },
];

const CERTS = [
  { thumb: '/assets/thumbs/cert-1.webp', title: 'Juara I Festival Film Cendana 2025', desc: 'Juara I Nasional — SMAS Cendana Mandau, Bengkalis, Riau' },
  { thumb: '/assets/thumbs/cert-2.webp', title: 'Juara 2 Film Pendek FLS2N 2024', desc: 'Juara 2 Tingkat Kabupaten Probolinggo — SMAN 1 Kraksaan' },
  { thumb: '/assets/thumbs/cert-3.webp', title: 'NOT AN ORDINARY TEENAGE 2025', desc: 'Peserta — Universitas Jember, tema Strong Mind, Bright Future' },
  { thumb: '/assets/thumbs/cert-4.webp', title: 'Anggota Sekbid Jurnalistik OSIS 2023–2024', desc: 'OSIS & MPK SMAN 1 Kraksaan · Periode 2023–2024' },
  { thumb: '/assets/thumbs/cert-5.webp', title: 'Participant Public Poster MEDSPIN 2025', desc: 'Peserta Public Poster — Universitas Airlangga · Sep–Okt 2025' },
];

function PCard({ w }) {
  return (
    <div className="pcard">
      <div className="pcard-img"><img src={w.thumb} alt={w.title} /></div>
      <div className="pcard-body">
        <div className="pcard-top"><span className="pcard-cat">{w.cat}</span><span className="pcard-year">{w.year}</span></div>
        <h4>{w.title}</h4>
        {w.award && <span className="pcard-award">★ {w.award}</span>}
      </div>
    </div>
  );
}

const THEMES = [
  { id: 'classic', n: 1, label: 'Klasik' },
  { id: 'cute', n: 2, label: 'Imut ♡' },
  { id: 'lime', n: 3, label: 'Lime' },
];

function readLS(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } }
function writeLS(k, v) { try { localStorage.setItem(k, v); } catch { /* abaikan */ } }

export default function CV() {
  const [theme, setTheme] = useState(() => {
    const t = readLS('cv-theme', 'classic');
    return THEMES.some(x => x.id === t) ? t : 'classic';
  });
  const [withPorto, setWithPorto] = useState(() => readLS('cv-porto', '1') !== '0');

  useEffect(() => { writeLS('cv-theme', theme); }, [theme]);
  useEffect(() => { writeLS('cv-porto', withPorto ? '1' : '0'); }, [withPorto]);

  /* tandai body supaya navbar/footer/mascot disembunyikan saat print */
  useEffect(() => {
    document.body.classList.add('cv-route');
    return () => document.body.classList.remove('cv-route');
  }, []);

  return (
    <main className={`cv-page${withPorto ? '' : ' cv-noporto'}`} data-theme={theme}>
      <div className="cv-toolbar noprint">
        <p>Curriculum Vitae — Aldo Leo Saputra</p>
        <button className="cv-dl" onClick={() => window.print()}>⬇ Download CV (PDF)</button>
      </div>

      <div className="cv-opts noprint">
        <div className="cv-themes" role="group" aria-label="Pilih desain CV">
          <span className="cv-opts-l">Desain</span>
          {THEMES.map(t => (
            <button key={t.id} type="button" className="cv-theme-btn" aria-pressed={theme === t.id} onClick={() => setTheme(t.id)}>
              <b>{t.n}</b> {t.label}
            </button>
          ))}
        </div>
        <label className="cv-check">
          <input type="checkbox" checked={withPorto} onChange={e => setWithPorto(e.target.checked)} />
          Sertakan portofolio bergambar di PDF
        </label>
      </div>

      <div id="cv-print">
        <div className="cv-head">
          <div>
            <p className="cv-name"><span className="f">ALDO LEO</span> <span className="l">SAPUTRA</span></p>
            <p className="cv-role">Multidisciplinary Digital Creator · Nursing Student</p>
          </div>
          <div className="cv-contact">
            Jember, Jawa Timur, Indonesia · Lahir 07 Agustus 2008<br />
            WhatsApp 0812-5279-0018<br />
            <a href="https://www.instagram.com/aldosynnn">@aldosynnn</a> · <a href="https://synnnw.com">synnnw.com</a>
          </div>
        </div>

        <div className="cv-grid">
          <div className="cv-side">
            <section>
              <h2>Pendidikan</h2>
              {EDUCATION.map(e => (
                <div className="cv-edu-item" key={e.school}>
                  <b>{e.school}</b><span className="sub">{e.sub}</span>
                </div>
              ))}
            </section>

            <section>
              <h2>Keahlian</h2>
              {SKILLS.map(s => (
                <div className="cv-skillblock" key={s.k}>
                  <span className="k">{s.k}</span>
                  <div className="cv-taglist">{s.tags.map(t => <span key={t}>{t}</span>)}</div>
                </div>
              ))}
            </section>

            <section>
              <h2>Prestasi</h2>
              {AWARDS.map((a, i) => (
                <p className="cv-award" key={i}><span className="y">{a.y}</span> — {a.t}</p>
              ))}
            </section>
          </div>

          <div className="cv-main">
            <section>
              <h2>Pengalaman & Proyek</h2>
              {EXPERIENCE.map((e, i) => (
                <div className="cv-exp-item" key={i}>
                  <div className="y">{e.y}</div>
                  <div><span className="role-t">{e.role}</span><div className="desc">{e.desc}</div></div>
                </div>
              ))}
            </section>

            <section>
              <h2>Organisasi & Kepanitiaan</h2>
              {ORGS.map((o, i) => (
                <p className="cv-org-item" key={i}>{o.y && <span className="y">{o.y}</span>} {o.t}</p>
              ))}
            </section>
          </div>
        </div>
        <div className="cv-foot">{withPorto ? 'Portofolio bergambar ada di halaman berikutnya & di synnnw.com' : 'Portofolio lengkap bergambar di synnnw.com'}</div>
      </div>

      {/* ── Portofolio bergambar (ikut ke-print kecuali dicentang off) ── */}
      <div className="cv-porto">
        <div className="cv-porto-head">
          <span className="kicker">Portofolio lengkap</span>
          <h2>Semua karya, satu per satu.</h2>
        </div>

        <div className="cv-porto-sub">Film & Video <span className="n">{FILM_WORKS.length}</span></div>
        <div className="cv-pgrid">{FILM_WORKS.map(w => <PCard w={w} key={w.title} />)}</div>

        <div className="cv-porto-sub">Desain & Web Dev <span className="n">{DESIGN_WORKS.length}</span></div>
        <div className="cv-pgrid">{DESIGN_WORKS.map(w => <PCard w={w} key={w.title} />)}</div>

        <div className="cv-porto-sub">Sertifikat & Penghargaan <span className="n">{CERTS.length}</span></div>
        <div className="cv-cgrid">
          {CERTS.map(c => (
            <div className="cv-ccard" key={c.title}>
              <img src={c.thumb} alt={c.title} />
              <div><b>{c.title}</b><span>{c.desc}</span></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
