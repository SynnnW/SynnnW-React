import { useState, useEffect, useRef } from "react";

const FEATURES_ID = [
  { icon: "fa-solid fa-video", name: "Editing Praktikum Berkualitas Tinggi", desc: "Video praktikum yang diambil dan diedit dengan standar broadcast — sharp focus pada setiap moment, color correction konsisten, dan lighting yang optimal untuk dokumentasi pembelajaran." },
  { icon: "fa-solid fa-book-open", name: "Alur Naratif Pendidikan", desc: "Struktur video mengikuti urutan logis praktikum dari persiapan, eksekusi, hingga hasil — mudah diikuti siswa untuk review atau pembelajaran mandiri." },
];

const FEATURES_EN = [
  { icon: "fa-solid fa-video", name: "High-Quality Practicum Editing", desc: "Practicum footage edited to broadcast standards with sharp focus and consistent color correction." },
  { icon: "fa-solid fa-book-open", name: "Educational Narrative Flow", desc: "Video structure follows the logical sequence easy for students to follow for review." },
];

export default function WorkDetail21({ t = {} }) {
  const isEn = t.lang === 'en';
  const FEATURES = isEn ? FEATURES_EN : FEATURES_ID;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{padding: '80px', maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', marginBottom: '24px'}}>
        {isEn ? 'Biology Practicum Editing' : 'Editing Praktikum Biologi'}
      </h1>
      <p style={{fontSize: '1.1rem', marginBottom: '40px', color: 'var(--text-dim)'}}>
        {isEn ? 'Professional video editing for educational content' : 'Editing video profesional untuk konten pendidikan'}
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

      <div style={{background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', padding: '60px', borderRadius: '20px', textAlign: 'center', color: '#fff'}}>
        <h2 style={{fontSize: '2rem', marginBottom: '12px'}}>Watch Project</h2>
        <p>Professional biology practicum video documentation</p>
        <a href="https://drive.google.com/file/d/1T5QXUrhx87AEJ_gU2HB_2z4Nl_qB7dks/preview" target="_blank" rel="noopener noreferrer"
          style={{display: 'inline-block', marginTop: '20px', padding: '12px 32px', background: '#fff', color: '#059669', borderRadius: '99px', textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s'}}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Open in Google Drive
        </a>
      </div>
    </div>
  );
}
