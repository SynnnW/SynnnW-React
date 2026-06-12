import { useState, useEffect } from "react";

const FEATURES_ID = [
  { icon: "fa-solid fa-brain", name: "MINDOVA Framework", desc: "4 mekanisme utama: Body-Talk Session (rekonsiliasi tubuh-pikiran), Micro-Wins Rituals (merayakan pencapaian), Emo-Tracking Colors (visualisasi emosi), dan Self-Symbol Creation (identitas positif)." },
  { icon: "fa-solid fa-heart", name: "PELUK Principle", desc: "Self-compassion framework: Pahami emosi, Ekspresikan sehat, Lakukan relaksasi, Utamakan kebutuhan, Komunikasi dengan orang terdekat." },
  { icon: "fa-solid fa-users", name: "Psychological Rehabilitation", desc: "Fokus pada rehabilitasi psikologis pasien PCOS melalui pendekatan sistematis yang meningkatkan resiliensi dan kualitas hidup." },
  { icon: "fa-solid fa-chart-line", name: "Research Evidence", desc: "Berbasis riset terkini menunjukkan 30-40% pasien PCOS mengalami kecemasan dan >25% mengalami depresi, memerlukan dukungan psikososial." },
];

const FEATURES_EN = [
  { icon: "fa-solid fa-brain", name: "MINDOVA Framework", desc: "4 key mechanisms: Body-Talk Session (mind-body reconciliation), Micro-Wins Rituals (celebrating achievements), Emo-Tracking Colors (emotion visualization), Self-Symbol Creation (positive identity)." },
  { icon: "fa-solid fa-heart", name: "PELUK Principle", desc: "Self-compassion framework emphasizing emotional understanding, healthy expression, relaxation, personal wellness, and communication." },
  { icon: "fa-solid fa-users", name: "Psychological Rehabilitation", desc: "Focuses on psychological rehabilitation of PCOS patients through systematic approach improving resilience and quality of life." },
  { icon: "fa-solid fa-chart-line", name: "Research Evidence", desc: "Based on current research showing 30-40% of PCOS patients experience anxiety and >25% experience depression, requiring psychosocial support." },
];

export default function WorkDetail22({ t = {} }) {
  const isEn = t.lang === 'en';
  const FEATURES = isEn ? FEATURES_EN : FEATURES_ID;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{padding: '80px', maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', marginBottom: '12px'}}>
        {isEn ? 'MINDOVA Research Poster' : 'MINDOVA Poster'}
      </h1>
      <p style={{fontSize: '1rem', marginBottom: '12px', color: 'var(--text-dim)', fontWeight: 600}}>
        {isEn ? 'Mind Over Ovaries: Systematic Psychological Empowerment Strategy for PCOS Patients' 
                : 'Mind Over Ovaries: Strategi Sistematis Pemberdayaan Psikologis Pasien PCOS'}
      </p>
      <p style={{fontSize: '0.9rem', marginBottom: '40px', color: 'var(--text-dim)'}}>
        {isEn ? 'Authors: Aldo Leo Saputra, Agustian Adven Arya Putra, Reydo Andrea Priatama' 
                : 'Penulis: Aldo Leo Saputra, Agustian Adven Arya Putra, Reydo Andrea Priatama'}
      </p>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '60px'}}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{padding: '24px', background: 'var(--glass)', border: '1px solid var(--gborder)', borderRadius: '16px'}}>
            <i className={f.icon} style={{fontSize: '2rem', color: 'var(--accent3)', marginBottom: '12px', display: 'block'}} />
            <h3 style={{fontWeight: 700, marginBottom: '8px'}}>{f.name}</h3>
            <p style={{fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-dim)'}}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', padding: '60px', borderRadius: '20px', color: '#fff', marginBottom: '40px'}}>
        <h2 style={{fontSize: '2.2rem', marginBottom: '16px', fontWeight: 300}}>
          🏥 MEDSPIN UNAIR 2025
        </h2>
        <p style={{fontSize: '1rem', marginBottom: '24px', lineHeight: 1.8}}>
          {isEn 
            ? 'Research presentation poster featuring psychological rehabilitation framework for PCOS patients through integrated MINDOVA and PELUK approaches.'
            : 'Poster presentasi riset dengan framework rehabilitasi psikologis pasien PCOS melalui pendekatan terintegrasi MINDOVA dan PELUK.'}
        </p>
        <a href="https://drive.google.com/file/d/1qZHAg6tA3v2PgrndCMiEubeFVYrl81tU/preview" target="_blank" rel="noopener noreferrer"
          style={{display: 'inline-block', padding: '14px 36px', background: '#fff', color: '#dc2626', borderRadius: '99px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s', cursor: 'pointer'}}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          View Poster on Google Drive
        </a>
      </div>

      <div style={{padding: '40px', background: 'var(--glass)', border: '1px solid var(--gborder)', borderRadius: '16px'}}>
        <h3 style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px'}}>
          {isEn ? 'Key Information' : 'Informasi Penting'}
        </h3>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li style={{marginBottom: '12px', paddingLeft: '24px', position: 'relative'}}>
            <span style={{position: 'absolute', left: 0, color: 'var(--accent3)'}}>✓</span>
            <strong>{isEn ? 'Event' : 'Acara'}:</strong> {isEn ? 'Medical Spin (MEDSPIN) UNAIR 2025' : 'Medical Spin (MEDSPIN) UNAIR 2025'}
          </li>
          <li style={{marginBottom: '12px', paddingLeft: '24px', position: 'relative'}}>
            <span style={{position: 'absolute', left: 0, color: 'var(--accent3)'}}>✓</span>
            <strong>{isEn ? 'Focus' : 'Fokus'}:</strong> {isEn ? 'Psychological Rehabilitation in PCOS' : 'Rehabilitasi Psikologis pada Pasien PCOS'}
          </li>
          <li style={{marginBottom: '12px', paddingLeft: '24px', position: 'relative'}}>
            <span style={{position: 'absolute', left: 0, color: 'var(--accent3)'}}>✓</span>
            <strong>{isEn ? 'Category' : 'Kategori'}:</strong> {isEn ? 'Research Poster - Healthcare/Psychology' : 'Poster Riset - Kesehatan/Psikologi'}
          </li>
          <li style={{paddingLeft: '24px', position: 'relative'}}>
            <span style={{position: 'absolute', left: 0, color: 'var(--accent3)'}}>✓</span>
            <strong>{isEn ? 'Format' : 'Format'}:</strong> {isEn ? 'Standard Research Poster (A1/Vertical)' : 'Poster Riset Standar (A1/Vertikal)'}
          </li>
        </ul>
      </div>
    </div>
  );
}
