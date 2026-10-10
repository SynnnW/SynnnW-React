// src/pages/BahasaInggrisMateri.jsx
// ─────────────────────────────────────────────────────────────
// Halaman Materi Belajar Bahasa Inggris
// Agronursing/Keperawatan UNEJ — Semester 1 Angkatan 2026
// Kelas A · B · C · D | TM 1–7
//
// 🤖 Penjelasan materi: Claude.ai + ChatGPT (AI-generated)
//    Digunakan sebagai panduan belajar, bukan sumber resmi tunggal.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════════
   DATA NAVIGASI TOPIK
══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  {
    category: 'GRAMMAR',
    icon: '✍️',
    color: '#3b82f6',
    topics: [
      { id: 'tenses',        label: 'Tenses',                    tm: 'TM 1' },
      { id: 'verbforms',     label: 'Verb Forms V1–V5',          tm: 'TM 1' },
      { id: 'modal',         label: 'Modal Verbs',               tm: 'TM 2' },
      { id: 'sva',           label: 'Subject-Verb Agreement',    tm: 'TM 2' },
      { id: 'conditional',   label: 'Conditional Sentences',     tm: 'TM 3' },
      { id: 'passive',       label: 'Passive Voice',             tm: 'TM 3' },
      { id: 'gerund',        label: 'Gerund vs Infinitive',      tm: 'TM 4' },
      { id: 'relative',      label: 'Relative Pronouns',         tm: 'TM 4' },
      { id: 'subjunctive',   label: 'Subjunctive Mood',          tm: 'TM 5' },
      { id: 'comparative',   label: 'Comparative Structures',    tm: 'TM 5' },
      { id: 'preposition',   label: 'Prepositions & Fixed Exp.', tm: 'TM 6' },
    ],
  },
  {
    category: 'VOCABULARY',
    icon: '📖',
    color: '#10b981',
    topics: [
      { id: 'vocab-campus',  label: 'Campus Life',               tm: 'TM 1' },
      { id: 'vocab-tech',    label: 'Technology & Digital World', tm: 'TM 2' },
      { id: 'vocab-env',     label: 'Environment & Sustainable Living', tm: 'TM 3' },
      { id: 'vocab-nursing', label: 'Nursing / Agronursing',     tm: 'TM 4–7' },
    ],
  },
  {
    category: 'READING',
    icon: '📚',
    color: '#8b5cf6',
    topics: [
      { id: 'reading-short', label: 'Short Text Strategy',       tm: 'TM 6' },
      { id: 'reading-long',  label: 'Long Text Strategy',        tm: 'TM 7' },
      { id: 'reading-dina',  label: 'Contoh Long Text & Analisis', tm: 'TM 7' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   STYLE CONSTANTS — Dark Quiz Theme (matching QuizEngine)
══════════════════════════════════════════════════════════════ */
const QZ = {
  bg:       '#070709',
  surface:  'rgba(255,255,255,0.04)',
  surface2: 'rgba(255,255,255,0.07)',
  border:   'rgba(255,255,255,0.09)',
  text:     '#f4f4f6',
  muted:    '#8d8d99',
  primary:  '#8b7bff',
  primary2: '#5eead4',
  success:  '#34d399',
  danger:   '#fb7185',
  warning:  '#fbbf24',
  font:     '"Inter","Segoe UI",system-ui,sans-serif',
};

const S = {
  page: {
    display: 'flex', minHeight: '100dvh',
    background: QZ.bg,
    fontFamily: QZ.font, color: QZ.text,
    WebkitFontSmoothing: 'antialiased',
    position: 'relative', overflow: 'hidden',
  },
  sidebar: {
    width: 260, minWidth: 240,
    background: 'rgba(255,255,255,0.02)',
    borderRight: `1px solid ${QZ.border}`,
    padding: '1rem 0', overflowY: 'auto',
    position: 'sticky', top: 0,
    height: '100dvh', flexShrink: 0,
  },
  main: { flex: 1, padding: '1.5rem 1.75rem 5rem', maxWidth: 860, margin: '0 auto', width: '100%', overflowX: 'hidden' },
  card: {
    background: QZ.surface, borderRadius: 14, border: `1px solid ${QZ.border}`,
    padding: '1.5rem', marginBottom: '1.5rem',
  },
  badge: (color) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: 99,
    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    background: color + '22', color: color, border: `1px solid ${color}44`,
  }),
  accordion: {
    border: `1px solid ${QZ.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: '0.75rem',
    background: QZ.surface,
  },
  accordionBtn: {
    width: '100%', background: 'transparent', border: 'none', padding: '0.85rem 1rem',
    textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: 14,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    color: QZ.text, fontFamily: QZ.font,
  },
  table: {
    width: '100%', borderCollapse: 'collapse', fontSize: 13.5, marginTop: '0.75rem',
  },
  th: {
    background: QZ.surface2, padding: '8px 12px', textAlign: 'left',
    fontWeight: 700, fontSize: 12, borderBottom: `2px solid ${QZ.border}`, color: QZ.muted,
  },
  td: { padding: '8px 12px', borderBottom: `1px solid ${QZ.border}`, verticalAlign: 'top', color: QZ.text },
  example: {
    background: 'rgba(94,234,212,0.07)', border: '1px solid rgba(94,234,212,0.25)', borderRadius: 8,
    padding: '0.75rem 1rem', marginTop: '0.5rem', fontSize: 13.5, color: QZ.text,
  },
  warning: {
    background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8,
    padding: '0.75rem 1rem', marginTop: '0.5rem', fontSize: 13.5, color: QZ.text,
  },
  tip: {
    background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8,
    padding: '0.75rem 1rem', marginTop: '0.5rem', fontSize: 13.5, color: QZ.text,
  },
};

/* ══════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
══════════════════════════════════════════════════════════════ */

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={S.accordion}>
      <button style={S.accordionBtn} onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span style={{ color: '#94a3b8', transition: 'transform 0.2s',
          display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '1rem', borderTop: `1px solid ${QZ.border}`, background: QZ.surface2 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ExampleBox({ label, children }) {
  return (
    <div style={S.example}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: QZ.primary2, marginBottom: 4 }}>{label}</div>}
      {children}
    </div>
  );
}

function WarningBox({ label, children }) {
  return (
    <div style={S.warning}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: QZ.warning, marginBottom: 4 }}>⚠️ {label}</div>}
      {children}
    </div>
  );
}

function TipBox({ children }) {
  return <div style={S.tip}><span style={{ fontWeight: 700, color: QZ.success }}>💡 </span>{children}</div>;
}

function RuleCard({ title, color, children }) {
  return (
    <div style={{ border: `2px solid ${color}30`, borderLeft: `4px solid ${color}`,
      borderRadius: 10, padding: '1rem', marginBottom: '0.75rem', background: `${color}0d` }}>
      <div style={{ fontWeight: 700, color, marginBottom: 6, fontSize: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function SampleQuestion({ num, question, options, correctIdx, explanation, passage }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const reset = () => { setSelected(null); setChecked(false); };

  return (
    <div style={{ border: `1px solid ${QZ.border}`, borderRadius: 10, padding: '1rem',
      marginBottom: '0.75rem', background: QZ.surface }}>
      {passage && (
        <div style={{ background: QZ.surface2, borderRadius: 8, padding: '0.75rem 1rem',
          fontSize: 13, lineHeight: 1.65, marginBottom: '0.75rem', whiteSpace: 'pre-line', color: QZ.text }}>
          {passage}
        </div>
      )}
      <div style={{ fontWeight: 600, marginBottom: '0.6rem', fontSize: 14, color: QZ.text }}>
        <span style={S.badge('#8b7bff')}>Contoh {num}</span>{' '}
        {question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {options.map((opt, i) => {
          const letter = 'ABCD'[i];
          let bg = QZ.surface, border = `1px solid ${QZ.border}`, color = QZ.text;
          if (checked) {
            if (i === correctIdx) { bg = 'rgba(52,211,153,0.12)'; border = '1.5px solid #34d399'; color = '#34d399'; }
            else if (i === selected) { bg = 'rgba(251,113,133,0.12)'; border = '1.5px solid #fb7185'; color = '#fb7185'; }
          } else if (selected === i) { bg = 'rgba(139,123,255,0.12)'; border = '1.5px solid #8b7bff'; }

          return (
            <button key={i} disabled={checked}
              onClick={() => setSelected(i)}
              style={{ background: bg, border, borderRadius: 8, padding: '0.55rem 0.85rem',
                textAlign: 'left', cursor: checked ? 'default' : 'pointer',
                fontSize: 13.5, color, display: 'flex', gap: 8, alignItems: 'flex-start',
                fontFamily: QZ.font, transition: 'all 0.15s' }}>
              <strong>{letter}.</strong> {opt}
              {checked && i === correctIdx && <span style={{ marginLeft: 'auto' }}>✅</span>}
              {checked && i === selected && i !== correctIdx && <span style={{ marginLeft: 'auto' }}>❌</span>}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: 8 }}>
        {!checked && (
          <button onClick={() => selected !== null && setChecked(true)}
            disabled={selected === null}
            style={{ background: QZ.primary, color: '#fff', border: 'none', borderRadius: 8,
              padding: '0.5rem 1.2rem', cursor: selected !== null ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 600, opacity: selected !== null ? 1 : 0.5, fontFamily: QZ.font }}>
            Cek Jawaban
          </button>
        )}
        {checked && (
          <>
            <button onClick={reset}
              style={{ background: QZ.surface2, color: QZ.muted, border: `1px solid ${QZ.border}`,
                borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontSize: 13, fontFamily: QZ.font }}>
              Coba Lagi
            </button>
            <div style={{ flex: 1, background: 'rgba(94,234,212,0.07)', border: '1px solid rgba(94,234,212,0.2)',
              borderRadius: 8, padding: '0.5rem 1rem', fontSize: 13, color: QZ.primary2, lineHeight: 1.55 }}>
              <strong>Penjelasan:</strong> {explanation}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   KONTEN MATERI — PER TOPIK
══════════════════════════════════════════════════════════════ */

function TopicTenses() {
  return (
    <div>
      <p style={{ lineHeight: 1.7, marginBottom: '1rem', fontSize: 14 }}>
        Tenses menggambarkan <strong>waktu terjadinya suatu aksi atau keadaan</strong>.
        Memahami tenses bukan sekadar menghafal rumus, tapi mengerti <em>kapan</em> dan <em>mengapa</em>
        suatu bentuk kata kerja digunakan.
      </p>

      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={S.table}>
          <thead>
            <tr>
              {['Tense','Fungsi','Signal Words','Formula','Contoh'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Simple Present','Kebiasaan, fakta umum, prosedur rutin','usually, every day, often, always','S + V1 / V1+s/es','The nurse checks vitals every morning.'],
              ['Present Continuous','Aktivitas sedang berlangsung / rencana dekat','now, right now, at the moment, currently','S + am/is/are + V-ing','She is checking the patient now.'],
              ['Present Perfect','Pengalaman tanpa waktu spesifik; masa lalu yg masih relevan','already, yet, just, ever, never, since, for','S + have/has + V3','She has worked here since 2020.'],
              ['Present Perfect Continuous','Aksi mulai masa lalu, masih berlangsung, penekanan durasi','since, for, how long','S + have/has + been + V-ing','He has been waiting for an hour.'],
              ['Simple Past','Kejadian selesai pada waktu spesifik di masa lalu','yesterday, last week, ago, in 2020','S + V2','She visited the clinic yesterday.'],
              ['Past Continuous','Aksi sedang berlangsung di titik tertentu masa lalu','while, when, at that time','S + was/were + V-ing','The nurse was monitoring the patient when the doctor arrived.'],
              ['Past Perfect','Aksi selesai sebelum aksi lain di masa lalu','before, after, by the time, already, when','S + had + V3','The patient had already eaten before the doctor arrived.'],
              ['Simple Future','Keputusan spontan, prediksi, fakta masa depan','tomorrow, next week, soon','S + will + V1','The new regulation will take effect next month.'],
              ['Future Continuous','Aksi sedang berlangsung di titik tertentu masa depan','this time tomorrow, at 5 p.m. next week','S + will be + V-ing','This time next week, we will be presenting our research.'],
              ['Future Perfect','Aksi selesai sebelum titik tertentu di masa depan','by next year, by the time, by 2030','S + will have + V3','By 2030, hospitals will have automated most administrative tasks.'],
            ].map(([t,f,sw,fm,ex]) => (
              <tr key={t}>
                <td style={{ ...S.td, fontWeight: 600, color: '#60a5fa', whiteSpace: 'nowrap' }}>{t}</td>
                <td style={S.td}>{f}</td>
                <td style={{ ...S.td, color: QZ.muted, fontSize: 12 }}>{sw}</td>
                <td style={{ ...S.td, fontFamily: 'monospace', background: QZ.surface2, fontSize: 12 }}>{fm}</td>
                <td style={{ ...S.td, fontStyle: 'italic', color: QZ.muted }}>{ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WarningBox label="JANGAN SAMPAI TERTUKAR: Simple Past vs Present Perfect">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div>
            <strong style={{ color: '#ef4444' }}>Simple Past</strong><br />
            <em>"She visited the clinic yesterday."</em><br />
            <span style={{ fontSize: 12 }}>→ "yesterday" = waktu lampau spesifik yang sudah selesai sepenuhnya.</span>
          </div>
          <div>
            <strong style={{ color: '#10b981' }}>Present Perfect</strong><br />
            <em>"She has visited the clinic several times this month."</em><br />
            <span style={{ fontSize: 12 }}>→ "this month" = periode masih berlangsung; pengalaman masih relevan.</span>
          </div>
        </div>
        <TipBox>Signal word <em>bukan</em> penentu mutlak — makna kalimat tetap harus diperhatikan.</TipBox>
      </WarningBox>

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Contoh Soal Demonstrasi</div>
        <SampleQuestion num={1}
          question='She ______ as a community health volunteer since she was a second-year student.'
          options={['worked','is working','works','has worked']}
          correctIdx={3}
          explanation={"'Since + waktu spesifik di masa lalu' menunjukkan Present Perfect — aksi dimulai masa lalu dan berlanjut sampai sekarang: 'has worked'."}
        />
        <SampleQuestion num={2}
          question='Last semester, our research team ______ a community health survey in three rural villages.'
          options={['conducted','has conducted','conducts','is conducting']}
          correctIdx={0}
          explanation={"Ada penanda waktu 'last semester' (masa lalu spesifik), jadi gunakan Simple Past: 'conducted'."}
        />
      </div>
    </div>
  );
}

function TopicVerbForms() {
  const [filter, setFilter] = useState('all');
  const verbs = [
    { v1:'be (am/is/are)', v2:'was/were', v3:'been', ving:'being', v5:'is/are', cat:'irregular', ex:'She is a nurse. / She was tired.' },
    { v1:'check', v2:'checked', v3:'checked', ving:'checking', v5:'checks', cat:'regular', ex:'The nurse checks vitals. (Simple Pres.) / The lab checked the result. (Simple Past)' },
    { v1:'give', v2:'gave', v3:'given', ving:'giving', v5:'gives', cat:'irregular', ex:'The doctor gave instructions. / The medication has been given.' },
    { v1:'take', v2:'took', v3:'taken', ving:'taking', v5:'takes', cat:'irregular', ex:'Please take your medicine. / The nurse is taking vitals.' },
    { v1:'write', v2:'wrote', v3:'written', ving:'writing', v5:'writes', cat:'irregular', ex:'She has written the report. / She was writing notes.' },
    { v1:'monitor', v2:'monitored', v3:'monitored', ving:'monitoring', v5:'monitors', cat:'regular', ex:'The device monitors heart rate. / The device is monitoring the patient.' },
    { v1:'administer', v2:'administered', v3:'administered', ving:'administering', v5:'administers', cat:'regular', ex:'The nurse administers medication correctly.' },
    { v1:'do', v2:'did', v3:'done', ving:'doing', v5:'does', cat:'irregular', ex:'What does the nurse do? / She has done her duty.' },
    { v1:'go', v2:'went', v3:'gone', ving:'going', v5:'goes', cat:'irregular', ex:'She went to the clinic. / She has gone home.' },
    { v1:'report', v2:'reported', v3:'reported', ving:'reporting', v5:'reports', cat:'regular', ex:'She should have reported the symptom earlier.' },
  ];
  const filtered = filter === 'all' ? verbs : verbs.filter(v => v.cat === filter);

  return (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: '1rem' }}>
        Setiap kata kerja bahasa Inggris memiliki lima bentuk. Memahami <em>kapan</em> masing-masing dipakai
        jauh lebih penting daripada sekadar menghafal perubahannya.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem' }}>
        {['all','regular','irregular'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? '#3b82f6' : QZ.surface2,
              color: filter === f ? '#fff' : QZ.muted,
              border: 'none', borderRadius: 8, padding: '0.4rem 1rem',
              cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            {f === 'all' ? 'Semua' : f === 'regular' ? 'Regular' : 'Irregular'}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr>
              {['V1 (Dasar)','V2 (Past)','V3 (Past Part.)','V-ing / V4','V5 (3rd Sing.)','Contoh'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.v1}>
                <td style={{ ...S.td, fontWeight: 700 }}>{v.v1}</td>
                <td style={S.td}>{v.v2}</td>
                <td style={S.td}>{v.v3}</td>
                <td style={S.td}>{v.ving}</td>
                <td style={S.td}>{v.v5}</td>
                <td style={{ ...S.td, fontSize: 12, color: QZ.muted }}>{v.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ExampleBox label="Kapan masing-masing dipakai?">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.8 }}>
          <li><strong>V1</strong> — Simple Present, setelah modal (must, can, will…), infinitive (to + V1)</li>
          <li><strong>V2</strong> — Simple Past</li>
          <li><strong>V3</strong> — Setelah have/has/had (Perfect tense), setelah be (Passive voice)</li>
          <li><strong>V-ing</strong> — Continuous tense, setelah preposisi, sebagai gerund (subjek/objek)</li>
          <li><strong>V5</strong> — Simple Present dengan subjek orang ketiga tunggal (he, she, it, the nurse)</li>
        </ul>
      </ExampleBox>
    </div>
  );
}

function TopicModal() {
  const pairs = [
    { pair: 'Can vs Could', items: [
      { modal: 'Can', use: 'Kemampuan atau izin saat ini', ex: 'She can speak English fluently.' },
      { modal: 'Could', use: 'Kemampuan masa lalu, permintaan lebih sopan, kemungkinan', ex: 'Could you help me with this form?' },
    ], note: 'Could lebih sopan daripada can dalam permintaan.' },
    { pair: 'May vs Might', items: [
      { modal: 'May', use: 'Kemungkinan atau izin formal', ex: 'The patient may be discharged tomorrow.' },
      { modal: 'Might', use: 'Kemungkinan dengan nuansa lebih tentatif', ex: 'The results might take two more days.' },
    ], note: 'Perbedaan tingkat kepastian bergantung pada konteks, bukan persentase tetap.' },
    { pair: 'Must vs Have to', items: [
      { modal: 'Must', use: 'Keharusan kuat dari diri sendiri, atau kesimpulan logis', ex: 'You must wash your hands before every procedure.' },
      { modal: 'Have to', use: 'Keharusan dari aturan atau keadaan luar', ex: 'Nurses have to wear an ID badge at all times.' },
    ], note: 'Dalam percakapan sehari-hari, keduanya sering dipertukarkan.' },
    { pair: 'Should vs Ought to', items: [
      { modal: 'Should', use: 'Saran, rekomendasi, harapan', ex: 'You should rest more to recover faster.' },
      { modal: 'Ought to', use: 'Kewajiban moral, lebih formal dari should', ex: 'Nurses ought to maintain patient confidentiality.' },
    ], note: 'Should lebih umum dalam percakapan; ought to terdengar lebih formal.' },
    { pair: 'Will vs Would vs Shall', items: [
      { modal: 'Will', use: 'Keputusan spontan, prediksi, janji', ex: 'I will call the doctor immediately.' },
      { modal: 'Would', use: 'Kondisional, permintaan sopan, kebiasaan masa lalu', ex: 'Would you mind waiting outside?' },
      { modal: 'Shall', use: 'Tawaran / saran formal (terutama dengan I/we)', ex: 'Shall I call the head nurse for you?' },
    ], note: 'Would digunakan dalam Second Conditional (If... would...).' },
  ];

  return (
    <div>
      {pairs.map(p => (
        <Accordion key={p.pair} title={p.pair}>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {p.items.map(item => (
              <RuleCard key={item.modal} title={item.modal} color='#3b82f6'>
                <p style={{ margin: '0 0 0.4rem', fontSize: 13.5 }}><strong>Penggunaan:</strong> {item.use}</p>
                <ExampleBox><em>{item.ex}</em></ExampleBox>
              </RuleCard>
            ))}
          </div>
          <TipBox>{p.note}</TipBox>
        </Accordion>
      ))}
      <Accordion title="Modal + have + V3 (untuk masa lalu)">
        <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
          <p>Pola ini digunakan untuk membicarakan sesuatu yang berkaitan dengan masa lalu:</p>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Pola</th><th style={S.th}>Makna</th><th style={S.th}>Contoh</th></tr></thead>
            <tbody>
              {[
                ['should have + V3','Seharusnya dilakukan tapi tidak','She should have reported the symptom earlier.'],
                ['must have + V3','Dugaan kuat tentang masa lalu','He must have forgotten to take his medicine.'],
                ['could have + V3','Mungkin terjadi tapi tidak','With early treatment, it could have been prevented.'],
                ['would have + V3','Akan terjadi dalam kondisi yg berbeda (Third Conditional)','If they had arrived earlier, it would have been controlled.'],
              ].map(([p,m,e]) => (
                <tr key={p}><td style={{ ...S.td, fontFamily: 'monospace', fontWeight: 700 }}>{p}</td>
                  <td style={S.td}>{m}</td><td style={{ ...S.td, fontStyle: 'italic' }}>{e}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Contoh Soal</div>
        <SampleQuestion num={1}
          question='He ______ have forgotten to take his medicine; that would explain his symptoms today.'
          options={['must','should','can','will']}
          correctIdx={0}
          explanation={"'Must have + V3' dipakai untuk dugaan kuat tentang sesuatu yang terjadi di masa lalu."}
        />
      </div>
    </div>
  );
}

function TopicSVA() {
  const rules = [
    { title: '1. Frasa tambahan di antara S dan V', ex: 'The nurse, along with her colleagues, is on duty.', note: 'Frasa "along with her colleagues" bukan subjek utama. Kata kerja tetap mengikuti "The nurse" (tunggal).' },
    { title: '2. Relative clause mengikuti kata benda yang diterangkan', ex: 'Nurses who work in rural areas often face challenges.', note: '"who work" mengikuti "Nurses" (jamak), bukan subjek utama kalimat.' },
    { title: '3. Each, every, everyone, someone, anyone, nobody → tunggal', ex: 'Each patient is responsible for following the medication schedule.', note: '"Each" selalu dianggap tunggal meskipun merujuk banyak orang.' },
    { title: '4. "The number of" vs "A number of"', ex: 'The number of cases has increased.\nA number of patients have arrived.', note: '"The number of" = jumlahnya (tunggal). "A number of" = beberapa (jamak).' },
    { title: '5. Neither…nor / Either…or → ikuti subjek terdekat', ex: 'Neither the doctor nor the nurses are aware of the policy.', note: 'Kata kerja mengikuti subjek yang paling dekat: "the nurses" (jamak) → "are".' },
    { title: '6. Uncountable nouns → tunggal', ex: 'The information about the allergy is critical.', note: '"Information", "equipment", "furniture", "news" adalah uncountable → selalu tunggal.' },
    { title: '7. Subjek gabungan dengan "and" → biasanya jamak', ex: 'The doctor and the nurse are in the ward.', note: 'Pengecualian: jika dipahami sebagai satu kesatuan, bisa tunggal (mis. "bread and butter is a staple").' },
    { title: '8. There is / There are', ex: 'There is a patient waiting.\nThere are five patients waiting.', note: '"Is" untuk subjek tunggal, "are" untuk subjek jamak yang mengikuti "there".' },
  ];
  return (
    <div>
      {rules.map((r, i) => (
        <Accordion key={i} title={r.title} defaultOpen={i === 0}>
          <ExampleBox label="Contoh kalimat">
            <em style={{ whiteSpace: 'pre-line' }}>{r.ex}</em>
          </ExampleBox>
          <p style={{ fontSize: 13.5, marginTop: '0.5rem', lineHeight: 1.65 }}>📌 {r.note}</p>
        </Accordion>
      ))}
    </div>
  );
}

function TopicConditional() {
  return (
    <div>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={S.table}>
          <thead>
            <tr>
              {['Tipe','If-Clause','Main Clause','Kegunaan','Contoh'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ['Zero','Present Simple','Present Simple','Fakta umum, hukum alam, SOP medis','If temperature rises above 38°C, it indicates fever.'],
              ['First','Present Simple','will + V1','Kemungkinan nyata di masa depan','If a nurse notices unusual symptoms, she will inform the doctor.'],
              ['Second','Past Simple','would + V1','Pengandaian tidak nyata sekarang/masa depan','If the government invested more, healthcare would improve.'],
              ['Third','Past Perfect','would have + V3','Pengandaian masa lalu (sudah tidak bisa diubah)','If the team had arrived earlier, the outbreak would have been controlled.'],
              ['Mixed','Past Perfect (if)','would + V1 (main)','Pengandaian masa lalu berdampak pada masa kini','If she had completed her training, she would be a qualified nurse now.'],
            ].map(([t,i,m,k,e]) => (
              <tr key={t}>
                <td style={{ ...S.td, fontWeight: 700, color: '#7c3aed', whiteSpace: 'nowrap' }}>{t}</td>
                <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 12, background: QZ.surface2 }}>{i}</td>
                <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 12, background: QZ.surface2 }}>{m}</td>
                <td style={S.td}>{k}</td>
                <td style={{ ...S.td, fontStyle: 'italic', fontSize: 12 }}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RuleCard title='"If I were" — Pengandaian Formal' color='#7c3aed'>
        <ExampleBox><em>If I were the head nurse, I would change the shift schedule.</em></ExampleBox>
        <p style={{ fontSize: 13, marginTop: '0.5rem' }}>
          "Were" lazim digunakan untuk semua subjek dalam pengandaian formal (Second Conditional),
          termasuk I/he/she/it. Bentuk ini dianggap baku dalam bahasa tulis formal.
        </p>
      </RuleCard>
      <WarningBox label="Kesalahan Umum First Conditional">
        <p style={{ margin: 0, fontSize: 13 }}>
          ❌ <em>"If a nurse will notice unusual symptoms, she will inform the doctor."</em><br />
          ✅ <em>"If a nurse notices unusual symptoms, she will inform the doctor."</em><br />
          <br />
          Pada if-clause First Conditional, gunakan Present Simple — bukan "will" — meskipun artinya masa depan.
        </p>
      </WarningBox>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Contoh Soal</div>
        <SampleQuestion num={1}
          question='The patient would not have developed complications if she ______ her medication regularly.'
          options={['took','had taken','takes','would take']}
          correctIdx={1}
          explanation={"Main clause 'would not have developed' → Third Conditional. If-clause harus Past Perfect: 'had taken'."}
        />
      </div>
    </div>
  );
}

function TopicPassive() {
  return (
    <div>
      <ExampleBox label="Cara mengubah ke Passive Voice">
        <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.9 }}>
          <li>Objek kalimat aktif → menjadi subjek baru.</li>
          <li>Pilih bentuk <strong>"be"</strong> sesuai tense dan subjek baru.</li>
          <li>Gunakan <strong>V3</strong> (kata kerja bentuk ketiga).</li>
          <li>Tambahkan <strong>"by + pelaku"</strong> hanya jika pelaku perlu disebutkan.</li>
        </ol>
        <div style={{ marginTop: '0.5rem', fontSize: 13.5 }}>
          <strong>Active:</strong> <em>The nurse measures the patient's temperature.</em><br />
          <strong>Passive:</strong> <em>The patient's temperature is measured by the nurse.</em>
        </div>
      </ExampleBox>
      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table style={S.table}>
          <thead>
            <tr>
              {['Tense / Pola','Formula Passive','Contoh Passive'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ['Simple Present','am/is/are + V3','The wound is cleaned twice a day.'],
              ['Present Continuous','am/is/are + being + V3','The patient is being monitored now.'],
              ['Present Perfect','have/has + been + V3','The results have been sent to the doctor.'],
              ['Simple Past','was/were + V3','The results were explained to the patient yesterday.'],
              ['Past Continuous','was/were + being + V3','The patient was being treated when the doctor arrived.'],
              ['Past Perfect','had + been + V3','The medication had been administered before the visit.'],
              ['Simple Future','will + be + V3','New regulations will be implemented next month.'],
              ['Future Perfect','will + have + been + V3','The report will have been submitted by Friday.'],
              ['Modal + be + V3','modal + be + V3','Patient confidentiality must be protected at all times.'],
              ['Modal + have + been + V3','modal + have + been + V3','The symptom should have been reported earlier.'],
            ].map(([t,f,e]) => (
              <tr key={t}>
                <td style={{ ...S.td, fontWeight: 600, color: '#0f766e' }}>{t}</td>
                <td style={{ ...S.td, fontFamily: 'monospace', background: '#f0fdfa', fontSize: 12 }}>{f}</td>
                <td style={{ ...S.td, fontStyle: 'italic', fontSize: 13 }}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopicGerund() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#1d4ed8', marginBottom: 8 }}>Kata Kerja + Gerund (V-ing)</div>
          <ul style={{ fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: '1.2rem' }}>
            {['avoid','finish','enjoy','suggest','recommend','consider','practice','keep','mind','miss'].map(v => <li key={v}>{v}</li>)}
          </ul>
          <ExampleBox><em>The nurse suggested reviewing the notes.</em></ExampleBox>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '1rem' }}>
          <div style={{ fontWeight: 700, color: QZ.success, marginBottom: 8 }}>Kata Kerja + Infinitive (to + V1)</div>
          <ul style={{ fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: '1.2rem' }}>
            {['want','need','hope','decide','plan','agree','expect','refuse','manage','fail'].map(v => <li key={v}>{v}</li>)}
          </ul>
          <ExampleBox><em>She decided to continue her studies.</em></ExampleBox>
        </div>
        <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#854d0e', marginBottom: 8 }}>Bisa Keduanya</div>
          <ul style={{ fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: '1.2rem' }}>
            {['like','love','start','begin','continue','prefer'].map(v => <li key={v}>{v}</li>)}
          </ul>
          <ExampleBox><em>She likes reading / to read medical journals.</em></ExampleBox>
        </div>
      </div>
      <WarningBox label="Kata Kerja yang BERUBAH MAKNA">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem', fontSize: 13.5 }}>
          <div>
            <strong>stop + V-ing</strong> → berhenti melakukan sesuatu<br />
            <em>"He stopped smoking."</em><br />
            <strong>stop + to-inf</strong> → berhenti untuk melakukan sesuatu lain<br />
            <em>"He stopped to smoke."</em>
          </div>
          <div>
            <strong>remember + V-ing</strong> → ingat pernah melakukan<br />
            <em>"I remember giving the medication."</em><br />
            <strong>remember + to-inf</strong> → ingat untuk melakukan<br />
            <em>"Please remember to give the medication."</em>
          </div>
        </div>
      </WarningBox>
    </div>
  );
}

function TopicRelative() {
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr>{['Pronoun','Merujuk ke','Fungsi dalam Clause','Contoh'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ['who','Orang','Subjek','Nurses who work in rural areas face unique challenges.'],
              ['whom','Orang','Objek','The researcher whom the university chose leads the project.'],
              ['which','Benda / Hewan','Subjek / Objek','AI systems, which analyze patient data, help predict risks.'],
              ['that','Orang / Benda','Subjek / Objek (restrictive only)','The device that monitors heart rate is widely used.'],
              ['whose','Orang / Benda','Kepemilikan','A patient whose chart is incomplete must be flagged.'],
              ['where','Tempat','Keterangan tempat','The village where the clinic was built lacks clean water.'],
              ['when','Waktu','Keterangan waktu','There was a time when telemedicine was not available here.'],
            ].map(([p,r,f,e]) => (
              <tr key={p}>
                <td style={{ ...S.td, fontWeight: 700, color: '#7c3aed' }}>{p}</td>
                <td style={S.td}>{r}</td><td style={S.td}>{f}</td>
                <td style={{ ...S.td, fontStyle: 'italic', fontSize: 12 }}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <WarningBox label="Restrictive vs Non-Restrictive Clause">
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7 }}>
          <strong>Restrictive</strong> (tanpa koma): informasi penting yang membatasi makna.<br />
          <em>"The nurse who works nights is very experienced."</em> → khusus yang kerja malam<br /><br />
          <strong>Non-restrictive</strong> (dengan koma): informasi tambahan, bisa dihilangkan.<br />
          <em>"Dr. Sari, who specializes in community health, visited the village."</em><br /><br />
          ⚠️ "That" <strong>tidak digunakan</strong> dalam non-restrictive clause (yang diapit koma).
        </p>
      </WarningBox>
    </div>
  );
}

function TopicSubjunctive() {
  return (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: '1rem' }}>
        Subjunctive Mood digunakan setelah kata kerja atau ekspresi yang menyatakan
        <strong> tuntutan, saran, keharusan, atau kepentingan</strong>. Kata kerja setelah "that" menggunakan
        bentuk dasar (V1) tanpa -s, meskipun subjeknya he/she/it.
      </p>
      <ExampleBox label="Pola Umum: V/phrase + that + S + V1 (base form)">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.9 }}>
          <li>The doctor <strong>insisted that</strong> the patient <strong>rest</strong> for two more days.</li>
          <li>Hospital policy <strong>requires that</strong> every staff member <strong>wear</strong> an ID badge.</li>
          <li>The supervisor <strong>recommended that</strong> she <strong>submit</strong> the report earlier.</li>
          <li>It is <strong>essential that</strong> the data <strong>be</strong> verified before publication.</li>
        </ul>
      </ExampleBox>
      <WarningBox label="Jangan Tambahkan -s">
        <p style={{ margin: 0, fontSize: 13 }}>
          ❌ <em>"The doctor insisted that the patient rests."</em><br />
          ✅ <em>"The doctor insisted that the patient rest."</em><br />
          Meskipun "the patient" adalah orang ketiga tunggal, dalam Subjunctive tidak ada -s.
        </p>
      </WarningBox>
    </div>
  );
}

function TopicComparative() {
  return (
    <div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {[
          { pattern: 'The more…, the more/less…', desc: 'Semakin…, semakin…', ex: 'The more technology develops, the more accessible healthcare becomes.' },
          { pattern: 'As…as / Not as…as', desc: 'Sama seperti / Tidak sama dengan', ex: 'Rural clinics are not as well-equipped as city hospitals.' },
          { pattern: 'Less…than', desc: 'Lebih sedikit / Kurang dari', ex: 'Elderly patients are less familiar with digital health apps than younger patients.' },
          { pattern: 'Comparative + and + comparative', desc: 'Semakin lama semakin…', ex: 'AI systems are becoming more and more advanced each year.' },
        ].map(item => (
          <RuleCard key={item.pattern} title={item.pattern} color='#0891b2'>
            <p style={{ margin: '0 0 0.4rem', fontSize: 13.5 }}><strong>Makna:</strong> {item.desc}</p>
            <ExampleBox><em>{item.ex}</em></ExampleBox>
          </RuleCard>
        ))}
      </div>
    </div>
  );
}

function TopicPreposition() {
  const [search, setSearch] = useState('');
  const items = [
    { expr: 'depend on', arti: 'bergantung pada', ex: 'The program depends on collecting accurate data.' },
    { expr: 'be aware of', arti: 'sadar akan', ex: 'Nurses must be aware of the risks of pesticide exposure.' },
    { expr: 'be responsible for', arti: 'bertanggung jawab atas', ex: 'Each team member is responsible for their own patients.' },
    { expr: 'be interested in', arti: 'tertarik pada', ex: 'She has always been interested in community health.' },
    { expr: 'consist of', arti: 'terdiri dari', ex: 'The team consists of nurses, doctors, and health workers.' },
    { expr: 'result in', arti: 'mengakibatkan', ex: 'Poor sanitation can result in disease outbreaks.' },
    { expr: 'be used to + V-ing', arti: 'sudah terbiasa dengan', ex: 'She is used to working long shifts.' },
    { expr: 'used to + V1', arti: 'dulu biasa melakukan (sekarang tidak)', ex: 'He used to work at the city hospital before moving to the village.' },
    { expr: 'because of + noun phrase', arti: 'karena (kata benda)', ex: 'Because of the storm, the clinic closed early.' },
    { expr: 'due to + noun phrase', arti: 'disebabkan oleh', ex: 'Due to limited funding, the program was scaled down.' },
    { expr: 'despite / in spite of + noun/V-ing', arti: 'meskipun', ex: 'Despite having a busy schedule, she still volunteers.' },
    { expr: 'although / even though + clause', arti: 'meskipun (diikuti klausa lengkap)', ex: 'Although she has a busy schedule, she still volunteers.' },
  ];
  const filtered = search ? items.filter(i =>
    i.expr.toLowerCase().includes(search.toLowerCase()) ||
    i.arti.toLowerCase().includes(search.toLowerCase())
  ) : items;

  return (
    <div>
      <input placeholder="Cari ekspresi atau arti..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: 10, border: `1px solid ${QZ.border}`,
          fontSize: 14, marginBottom: '0.75rem', boxSizing: 'border-box', outline: 'none',
          background: QZ.surface2, color: QZ.text, fontFamily: QZ.font }} />
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead><tr>
            {['Ekspresi','Arti','Contoh Kalimat'].map(h => <th key={h} style={S.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.expr}>
                <td style={{ ...S.td, fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}>{item.expr}</td>
                <td style={{ ...S.td, color: QZ.muted }}>{item.arti}</td>
                <td style={{ ...S.td, fontStyle: 'italic', fontSize: 13 }}>{item.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <WarningBox label="Bedakan Polanya">
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 13.5, lineHeight: 1.9 }}>
          <li><strong>because of</strong> + noun phrase → <em>Because of the storm, the clinic closed early.</em></li>
          <li><strong>although / even though</strong> + klausa (S + V) → <em>Although it rained, they continued the program.</em></li>
          <li><strong>despite / in spite of</strong> + noun / V-ing → <em>Despite heavy rain, they continued.</em></li>
          <li><strong>be used to + V-ing</strong> (terbiasa) ≠ <strong>used to + V1</strong> (dulu biasa)</li>
        </ul>
      </WarningBox>
    </div>
  );
}

function TopicVocab({ category }) {
  const data = {
    'vocab-campus': [
      { word: 'Major', arti: 'Jurusan / bidang studi utama', ex: 'I chose nursing as my major because I want to work in healthcare.' },
      { word: 'Association', arti: 'Asosiasi / organisasi', ex: 'She joined the Nursing Student Association to develop leadership skills.' },
      { word: 'Volunteer', arti: 'Relawan', ex: 'Many students decide to be a volunteer in rural health programs.' },
      { word: 'Academic advisor', arti: 'Dosen pembimbing akademik', ex: 'My academic advisor helped me choose the right courses.' },
      { word: 'Scholarship', arti: 'Beasiswa', ex: 'She received a scholarship for her outstanding academic performance.' },
      { word: 'Orientation', arti: 'Program orientasi / pengenalan', ex: 'The new students felt nervous during the campus orientation.' },
      { word: 'Freshman', arti: 'Mahasiswa tingkat pertama', ex: 'As a freshman, she had to adjust to a new environment.' },
      { word: 'Achievement', arti: 'Prestasi / pencapaian', ex: 'Her achievement in the debate competition was impressive.' },
      { word: 'Collaboration', arti: 'Kerja sama / kolaborasi', ex: 'Collaboration between students improved the project outcome significantly.' },
    ],
    'vocab-tech': [
      { word: 'Telemedicine', arti: 'Layanan kesehatan jarak jauh', ex: 'Telemedicine allows doctors to consult patients remotely.' },
      { word: 'Wearable device', arti: 'Perangkat yang dikenakan di tubuh', ex: 'A smartwatch is a wearable device that tracks heart rate.' },
      { word: 'Digital etiquette', arti: 'Etika dalam komunikasi digital', ex: 'Social media users should follow proper digital etiquette.' },
      { word: 'Misinformation', arti: 'Informasi yang salah / menyesatkan', ex: 'The spread of misinformation on social media confuses people.' },
      { word: 'Data privacy', arti: 'Privasi / kerahasiaan data', ex: 'Hospitals must protect patient data privacy strictly.' },
      { word: 'Algorithm', arti: 'Algoritma (urutan langkah logis)', ex: 'AI algorithms help predict which patients are at higher risk.' },
      { word: 'Cybersecurity', arti: 'Keamanan siber', ex: 'Keeping personal information safe online is part of good cybersecurity practice.' },
      { word: 'Automate', arti: 'Mengotomatiskan', ex: 'Hospitals will automate routine administrative tasks using AI.' },
    ],
    'vocab-env': [
      { word: 'Pollution', arti: 'Pencemaran / polusi', ex: 'Throwing plastic waste into rivers causes serious pollution.' },
      { word: 'Eco-friendly', arti: 'Ramah lingkungan', ex: 'Using tote bags is one simple eco-friendly habit.' },
      { word: 'Renewable energy', arti: 'Energi terbarukan', ex: 'Solar panels are an example of renewable energy.' },
      { word: 'Climate change', arti: 'Perubahan iklim', ex: 'Long-term changes in average temperatures are called climate change.' },
      { word: 'Biodegradable', arti: 'Dapat terurai secara alami', ex: 'Paper bags are biodegradable; plastic bags are not.' },
      { word: 'Carbon footprint', arti: 'Jejak karbon (emisi CO₂)', ex: 'Driving less reduces your carbon footprint significantly.' },
      { word: 'Deforestation', arti: 'Penggundulan hutan', ex: 'Deforestation has reduced habitats for wildlife in rural areas.' },
      { word: 'Greenhouse gas', arti: 'Gas rumah kaca', ex: 'Carbon dioxide is a greenhouse gas that traps heat in the atmosphere.' },
      { word: 'Recycle', arti: 'Mendaur ulang', ex: 'Students are encouraged to reduce, reuse, and recycle on campus.' },
    ],
    'vocab-nursing': [
      { word: 'Vital signs', arti: 'Tanda-tanda vital', ex: 'The nurse measured the patient\'s vital signs every two hours.' },
      { word: 'Prescription', arti: 'Resep dokter', ex: 'The doctor gave a prescription so she could buy the medicine.' },
      { word: 'Malnutrition', arti: 'Kekurangan gizi', ex: 'Children in rural areas may suffer from malnutrition.' },
      { word: 'Chronic disease', arti: 'Penyakit kronis / jangka panjang', ex: 'Diabetes and hypertension are examples of chronic diseases.' },
      { word: 'Screening', arti: 'Skrining / pemeriksaan awal', ex: 'Regular screening helps detect early signs of illness.' },
      { word: 'Referral', arti: 'Rujukan medis', ex: 'Complex cases need a referral to a bigger hospital.' },
      { word: 'Vulnerable population', arti: 'Kelompok rentan', ex: 'Elderly people living alone are considered a vulnerable population.' },
      { word: 'Preventive care', arti: 'Perawatan pencegahan', ex: 'Hand sanitizer and masks are tools for preventive care.' },
      { word: 'Outbreak', arti: 'Wabah / peningkatan kasus mendadak', ex: 'A sudden increase in cases is called an outbreak.' },
      { word: 'Administer medication', arti: 'Memberikan obat', ex: 'Nurses must correctly administer medication to avoid errors.' },
      { word: 'Community health worker', arti: 'Kader kesehatan masyarakat', ex: 'A community health worker helps villagers access medical services.' },
      { word: 'Pesticide exposure', arti: 'Paparan pestisida', ex: 'Farmers face health risks from pesticide exposure over time.' },
    ],
  };
  const [search, setSearch] = useState('');
  const words = data[category] || [];
  const filtered = search ? words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.arti.toLowerCase().includes(search.toLowerCase())
  ) : words;

  return (
    <div>
      <input placeholder="Cari kata atau arti..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: 10,
          border: `1px solid ${QZ.border}`, background: QZ.surface, color: QZ.text,
          fontSize: 14, marginBottom: '1rem', boxSizing: 'border-box', fontFamily: QZ.font }} />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {filtered.map(item => (
          <div key={item.word} style={{ background: QZ.surface, border: `1px solid ${QZ.border}`, borderRadius: 10,
            padding: '0.9rem 1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <strong style={{ fontSize: 15, color: QZ.text }}>{item.word}</strong>
              <span style={{ fontSize: 12, color: QZ.muted, background: QZ.surface2,
                padding: '2px 8px', borderRadius: 99 }}>{item.arti}</span>
            </div>
            <div style={{ fontSize: 13.5, color: QZ.muted, fontStyle: 'italic', lineHeight: 1.6 }}>
              <em>"{item.ex}"</em>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: QZ.muted, padding: '2rem' }}>
            Kata tidak ditemukan — coba kata kunci lain.
          </div>
        )}
      </div>
    </div>
  );
}

function TopicReadingShort() {
  return (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.7 }}>
        Short text biasanya 1–3 paragraf. Strategi efektif: <strong>baca pertanyaan dulu</strong>,
        lalu cari jawabannya di teks.
      </p>
      {[
        { step: '1. Identifikasi tipe soal', desc: 'Main idea, detail, vocabulary in context, atau inference.' },
        { step: '2. Baca pertanyaan', desc: 'Sebelum membaca teks agar tahu apa yang dicari.' },
        { step: '3. Cari kata kunci', desc: 'Temukan kata atau frasa dari soal di dalam teks.' },
        { step: '4. Eliminasi pilihan salah', desc: 'Singkirkan opsi yang jelas tidak relevan atau bertentangan dengan teks.' },
      ].map(s => (
        <div key={s.step} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
          <span style={{ background: QZ.primary, color: '#fff', fontWeight: 700, fontSize: 12,
            padding: '2px 10px', borderRadius: 99, whiteSpace: 'nowrap', marginTop: 2 }}>{s.step}</span>
          <span style={{ fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function TopicReadingLong() {
  return (
    <div>
      {[
        { step: '1. Baca judul & skim', desc: 'Baca judul dan lihat sekilas setiap paragraf untuk gambaran umum.' },
        { step: '2. Baca pertanyaan dulu', desc: 'Periksa semua pertanyaan sebelum membaca teks secara penuh.' },
        { step: '3. Scanning untuk detail', desc: 'Gunakan kata kunci dari soal untuk menemukan info spesifik.' },
        { step: '4. Vocabulary in context', desc: 'Gunakan kalimat sebelum dan sesudah kata untuk memahami artinya.' },
        { step: '5. Inference dari teks', desc: 'Kesimpulan harus didukung isi teks, bukan asumsi dari luar.' },
      ].map(s => (
        <div key={s.step} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
          <span style={{ background: '#8b5cf6', color: '#fff', fontWeight: 700, fontSize: 12,
            padding: '2px 10px', borderRadius: 99, whiteSpace: 'nowrap', marginTop: 2 }}>{s.step}</span>
          <span style={{ fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function TopicReadingDina() {
  const passage = `Nurse Dina is a community health nurse assigned to a remote village in East Java. Every week, she travels several hours to reach the village where she conducts health checks, distributes vitamins, and educates locals about hygiene and disease prevention. Unlike nurses in city hospitals, Dina must often make quick decisions without immediate access to medical equipment or specialists.

One of Dina's biggest challenges is persuading elderly residents to seek treatment when they show symptoms of chronic illness. Many of them distrust modern medicine and prefer traditional remedies. Dina approaches this by building trust slowly — she listens carefully, respects their beliefs, and explains the benefits of medical treatment in simple terms they can understand.

Dina also faces the issue of limited medical supplies. Sometimes, essential medications are unavailable in the village, and patients must travel to the city for treatment. To address this, she keeps a basic first aid kit and maintains close communication with the district health office to ensure timely supply deliveries.

Despite the many challenges, Dina finds her work deeply meaningful. She believes that every person in every corner of the country deserves access to quality healthcare, and her dedication reflects the values of compassion, perseverance, and equity that define modern nursing.`;

  const questions = [
    {
      type: 'MAIN IDEA', tujuan: 'Menemukan gagasan utama seluruh teks.',
      question: 'What is the main idea of this passage?',
      options: [
        'The challenges of supplying medicines to rural areas',
        'Nurse Dina\'s work and challenges as a community health nurse in a remote village',
        'How elderly patients should use traditional remedies',
        'The history of nursing in East Java',
      ], correctIdx: 1,
      explanation: 'Keseluruhan teks berfokus pada pekerjaan Dina sebagai perawat komunitas di desa terpencil, termasuk tantangan dan nilai-nilainya.',
    },
    {
      type: 'DETAIL', tujuan: 'Menemukan informasi yang disebutkan secara langsung.',
      question: 'According to paragraph 2, how does Dina approach elderly patients who distrust modern medicine?',
      options: [
        'She forces them to take medication immediately',
        'She ignores their traditional beliefs',
        'She builds trust slowly by listening, respecting their beliefs, and explaining benefits simply',
        'She asks the district doctor to visit them',
      ], correctIdx: 2,
      explanation: 'Paragraf 2 menyebutkan Dina membangun kepercayaan perlahan-lahan dengan mendengarkan, menghormati keyakinan, dan menjelaskan manfaat pengobatan dengan bahasa sederhana.',
    },
    {
      type: 'VOCABULARY IN CONTEXT', tujuan: 'Menentukan makna kata berdasarkan konteksnya.',
      question: 'The word "perseverance" in the last paragraph is closest in meaning to ______.',
      options: ['giving up easily','continued effort despite difficulties','perfect planning','financial success'],
      correctIdx: 1,
      explanation: '"Perseverance" artinya ketekunan/keteguhan — terus berusaha meskipun menghadapi banyak kesulitan.',
    },
    {
      type: 'INFERENCE', tujuan: 'Menyimpulkan informasi yang tidak dinyatakan langsung tapi didukung teks.',
      question: 'What can be inferred about Dina\'s approach to nursing?',
      options: [
        'She thinks technology is the most important tool for nurses',
        'She only cares about completing her administrative duties',
        'She values human connection and cultural sensitivity as much as medical knowledge',
        'She plans to move to a city hospital soon',
      ], correctIdx: 2,
      explanation: 'Dari cara Dina mendengarkan, menghormati keyakinan, dan menjelaskan dengan bahasa sederhana, dapat disimpulkan ia menghargai hubungan manusiawi dan kepekaan budaya.',
    },
  ];

  return (
    <div>
      <div style={{ background: QZ.surface2, border: `1px solid ${QZ.border}`, borderRadius: 10,
        padding: '1.25rem 1.5rem', marginBottom: '1.5rem', lineHeight: 1.75, fontSize: 14,
        whiteSpace: 'pre-line', color: QZ.text }}>
        <div style={{ fontWeight: 700, color: QZ.muted, marginBottom: '0.75rem', fontSize: 12, letterSpacing: 0.5 }}>
          TEKS BACAAN — Nurse Dina (Long Text)
        </div>
        {passage}
      </div>
      <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Contoh Soal & Analisis (klik untuk cek jawaban)</div>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: QZ.primary, marginBottom: 4,
            textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {q.type} — {q.tujuan}
          </div>
          <SampleQuestion num={i + 1}
            question={q.question}
            options={q.options}
            correctIdx={q.correctIdx}
            explanation={q.explanation}
          />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROUTER — petakan topic ID ke komponen
══════════════════════════════════════════════════════════════ */
const TOPIC_COMPONENTS = {
  tenses:       { label: 'Tenses', Component: TopicTenses },
  verbforms:    { label: 'Verb Forms V1–V5', Component: TopicVerbForms },
  modal:        { label: 'Modal Verbs', Component: TopicModal },
  sva:          { label: 'Subject-Verb Agreement', Component: TopicSVA },
  conditional:  { label: 'Conditional Sentences', Component: TopicConditional },
  passive:      { label: 'Passive Voice', Component: TopicPassive },
  gerund:       { label: 'Gerund vs Infinitive', Component: TopicGerund },
  relative:     { label: 'Relative Pronouns', Component: TopicRelative },
  subjunctive:  { label: 'Subjunctive Mood', Component: TopicSubjunctive },
  comparative:  { label: 'Comparative Structures', Component: TopicComparative },
  preposition:  { label: 'Prepositions & Fixed Expressions', Component: TopicPreposition },
  'vocab-campus':  { label: 'Campus Life', Component: () => <TopicVocab category="vocab-campus" /> },
  'vocab-tech':    { label: 'Technology & Digital World', Component: () => <TopicVocab category="vocab-tech" /> },
  'vocab-env':     { label: 'Environment & Sustainable Living', Component: () => <TopicVocab category="vocab-env" /> },
  'vocab-nursing': { label: 'Nursing / Agronursing', Component: () => <TopicVocab category="vocab-nursing" /> },
  'reading-short': { label: 'Short Text Strategy', Component: TopicReadingShort },
  'reading-long':  { label: 'Long Text Strategy', Component: TopicReadingLong },
  'reading-dina':  { label: 'Contoh Long Text & Analisis', Component: TopicReadingDina },
};

/* ══════════════════════════════════════════════════════════════
   DISCLAIMER BANNER
══════════════════════════════════════════════════════════════ */
function MateriDisclaimer() {
  return (
    <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.35)',
      borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem',
      fontSize: 13, color: '#92400e', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
      <span style={{ fontSize: 16 }}>🤖</span>
      <span>
        <strong>Disclaimer AI:</strong> Materi ini disusun dengan bantuan Claude.ai dan ChatGPT
        berdasarkan materi TM 1–7 Semester 1 Angkatan 2026 (Kelas A · B · C · D),
        sesuai dosen pengampu. Gunakan sebagai panduan belajar — tetap verifikasi dengan
        catatan dan materi resmi dari dosenmu.
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LANDING / DASHBOARD
══════════════════════════════════════════════════════════════ */
function LandingDashboard({ onSelectTopic, progress }) {
  const [search, setSearch] = useState('');

  const allTopics = NAV_ITEMS.flatMap(n => n.topics);
  const results = search.length >= 2
    ? allTopics.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div>
      <MateriDisclaimer />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 32 }}>🇬🇧</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0,
          background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' }}>Materi Bahasa Inggris</h1>
      </div>
      <p style={{ color: QZ.muted, marginBottom: '1.5rem', fontSize: 14 }}>
        Pahami konsepnya, kenali polanya, dan pelajari alasan di balik setiap jawaban.
      </p>
      <input
        placeholder="Cari materi, istilah, atau contoh kalimat..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 12,
          border: '1.5px solid #e2e8f0', fontSize: 14, marginBottom: '1rem',
          boxSizing: 'border-box', outline: 'none' }}
      />
      {results.length > 0 && (
        <div style={{ background: QZ.surface2, border: `1px solid ${QZ.border}`, borderRadius: 10,
          padding: '0.5rem 0', marginBottom: '1rem' }}>
          {results.map(t => (
            <button key={t.id} onClick={() => onSelectTopic(t.id)}
              style={{ width: '100%', background: 'none', border: 'none', padding: '0.6rem 1rem',
                textAlign: 'left', cursor: 'pointer', fontSize: 14, color: QZ.text,
                display: 'flex', gap: 8, alignItems: 'center' }}>
              🔍 {t.label} <span style={{ ...S.badge('#64748b'), marginLeft: 4 }}>{t.tm}</span>
            </button>
          ))}
        </div>
      )}
      {/* ── QUICK ACTIONS ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/quiz-eng')}
          style={{ flex: 1, minWidth: 180, background: 'linear-gradient(135deg,#3b82f6,#8b7bff)',
            color: '#fff', border: 'none', borderRadius: 12, padding: '0.85rem 1.2rem',
            cursor: 'pointer', fontWeight: 800, fontSize: 15, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(59,130,246,0.35)' }}>
          ✏️ Langsung ke Kuis
        </button>
        <button onClick={() => onSelectTopic('tenses')}
          style={{ flex: 1, minWidth: 180, background: QZ.surface2, color: QZ.text,
            border: `1px solid ${QZ.border}`, borderRadius: 12, padding: '0.85rem 1.2rem',
            cursor: 'pointer', fontWeight: 700, fontSize: 15, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          📚 Mulai dari Grammar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {NAV_ITEMS.map(n => {
          const done = n.topics.filter(t => progress[t.id]).length;
          return (
            <div key={n.category} style={{ ...S.card, borderTop: `4px solid ${n.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{n.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{n.category}</div>
                </div>
                <span style={{ ...S.badge(n.color) }}>{done}/{n.topics.length}</span>
              </div>
              <p style={{ fontSize: 13, color: QZ.muted, margin: '0.4rem 0 1rem' }}>
                {n.category === 'GRAMMAR' && 'Pelajari aturan dan pola kalimat bahasa Inggris.'}
                {n.category === 'VOCABULARY' && 'Perluas kosakata melalui arti dan contoh penggunaan.'}
                {n.category === 'READING' && 'Belajar menemukan ide pokok, informasi detail, dan kesimpulan dari teks.'}
              </p>
              <button onClick={() => onSelectTopic(n.topics[0].id)}
                style={{ width: '100%', background: n.color, color: '#fff', border: 'none',
                  borderRadius: 10, padding: '0.6rem', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                Mulai Belajar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function BahasaInggrisMateri() {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(null);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bi_materi_progress') || '{}'); }
    catch { return {}; }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  const selectTopic = useCallback((id) => {
    setActiveTopic(id);
    setMobileSidebarOpen(false);
    setProgress(prev => {
      const next = { ...prev, [id]: true };
      try { localStorage.setItem('bi_materi_progress', JSON.stringify(next)); } catch {}
      return next;
    });
    if (mainRef.current) mainRef.current.scrollTo(0, 0);
  }, []);

  const topicInfo = activeTopic ? TOPIC_COMPONENTS[activeTopic] : null;
  const TopicComponent = topicInfo?.Component;

  // find current category color
  const currentCat = NAV_ITEMS.find(n => n.topics.some(t => t.id === activeTopic));
  const catColor = currentCat?.color || '#3b82f6';

  return (
    <div style={S.page}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        ...S.sidebar,
        transform: mobileSidebarOpen ? 'translateX(0)' : undefined,
        '@media (max-width: 768px)': { position: 'fixed', zIndex: 100, transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' },
      }}>
        <div style={{ padding: '0.5rem 1rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
              fontSize: 13, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Kembali
          </button>
          <div style={{ fontWeight: 800, fontSize: 13, marginTop: 6, color: '#1e293b' }}>
            Materi Bahasa Inggris
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>TM 1–7 · Angkatan 2026</div>
        </div>

        <button onClick={() => setActiveTopic(null)}
          style={{ width: '100%', background: !activeTopic ? 'rgba(59,130,246,0.12)' : 'none',
            border: 'none', padding: '0.65rem 1rem', textAlign: 'left', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: !activeTopic ? '#3b82f6' : QZ.muted }}>
          🏠 Dashboard
        </button>

        {NAV_ITEMS.map(n => (
          <div key={n.category}>
            <div style={{ padding: '0.75rem 1rem 0.25rem', fontSize: 10, fontWeight: 800,
              letterSpacing: 1, color: n.color, borderTop: `1px solid ${QZ.border}`, marginTop: 4 }}>
              {n.icon} {n.category}
            </div>
            {n.topics.map(t => (
              <button key={t.id} onClick={() => selectTopic(t.id)}
                style={{
                  width: '100%', background: activeTopic === t.id ? `${n.color}12` : 'none',
                  border: 'none', borderLeft: activeTopic === t.id ? `3px solid ${n.color}` : '3px solid transparent',
                  padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer',
                  fontSize: 12.5, color: activeTopic === t.id ? n.color : '#475569',
                  fontWeight: activeTopic === t.id ? 700 : 400,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                <span>
                  {progress[t.id] && <span style={{ color: '#22c55e', marginRight: 4 }}>✓</span>}
                  {t.label}
                </span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{t.tm}</span>
              </button>
            ))}
          </div>
        ))}

        <div style={{ padding: '1rem', marginTop: '0.5rem' }}>
          <button onClick={() => navigate('/quiz-eng')}
            style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none',
              borderRadius: 10, padding: '0.6rem', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            ✏️ Mulai Kuis
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main ref={mainRef} style={{ ...S.main, overflowY: 'auto' }}>
        {/* Mobile header */}
        <div style={{ display: 'none', '@media (max-width: 768px)': { display: 'flex' },
          justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button onClick={() => setMobileSidebarOpen(o => !o)}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '0.5rem 0.75rem',
              cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ☰ Menu Materi
          </button>
        </div>

        {!activeTopic && (
          <LandingDashboard onSelectTopic={selectTopic} progress={progress} />
        )}

        {activeTopic && topicInfo && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
              <button onClick={() => setActiveTopic(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                  fontSize: 13, padding: 0 }}>
                ← Dashboard
              </button>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <span style={{ fontSize: 13, color: catColor, fontWeight: 600 }}>
                {currentCat?.category}
              </span>
            </div>

            <div style={{ ...S.card, borderTop: `4px solid ${catColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{topicInfo.label}</h2>
                {!progress[activeTopic] && (
                  <button onClick={() => selectTopic(activeTopic)}
                    style={{ ...S.badge(catColor), cursor: 'pointer', border: 'none' }}>
                    Tandai Selesai
                  </button>
                )}
                {progress[activeTopic] && (
                  <span style={{ ...S.badge('#22c55e') }}>✓ Selesai dibaca</span>
                )}
              </div>

              <TopicComponent />
            </div>

            {/* Next topic navigation */}
            {(() => {
              const allFlat = NAV_ITEMS.flatMap(n => n.topics);
              const idx = allFlat.findIndex(t => t.id === activeTopic);
              const next = allFlat[idx + 1];
              const prev = allFlat[idx - 1];
              return (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {prev && (
                    <button onClick={() => selectTopic(prev.id)}
                      style={{ flex: 1, background: '#f1f5f9', border: '1px solid #e2e8f0',
                        borderRadius: 10, padding: '0.7rem', cursor: 'pointer', fontSize: 13,
                        color: '#475569', fontWeight: 600 }}>
                      ← {prev.label}
                    </button>
                  )}
                  {next && (
                    <button onClick={() => selectTopic(next.id)}
                      style={{ flex: 1, background: catColor, color: '#fff', border: 'none',
                        borderRadius: 10, padding: '0.7rem', cursor: 'pointer', fontSize: 13,
                        fontWeight: 600 }}>
                      {next.label} →
                    </button>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </main>
    </div>
  );
}