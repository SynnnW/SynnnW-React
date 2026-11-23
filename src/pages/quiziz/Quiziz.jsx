// src/pages/quiziz/Quiziz.jsx — route: /quiziz
// Beranda ruang belajar: chat Leo di atas, "Lanjutkan" bila ada bacaan terakhir yang tersimpan, lalu katalog mata kuliah.
// Materi dan Latsol adalah FILTER pada katalog yang sama, bukan halaman terpisah. Alias lama tetap valid:
//   /quiziz?view=quiz -> filter Latsol,  /quiziz?view=materi (dan /quiziz/materi, dialihkan di App.jsx) -> filter Materi.
// Status tiap matkul dibaca dari registry (data/quiziz/registry.js), tidak ditulis tangan. Komentar dan saran ada di akhir.
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SubjectComments from '../../components/SubjectComments';
import SaranWebsite from '../../components/SaranWebsite';
import useQuizAuth from '../../components/quiz/useQuizAuth';
import QuizShell from '../../components/quiz/QuizShell';
import LeoHomeChat from '../../components/quiz/LeoHomeChat';
import { ContinueCard, CourseRow, FilterChips, SearchButton, UasRow } from '../../components/quiz/Catalog';
import { FILTERS, SUBJECTS, resolveLastRead } from '../../data/quiziz/registry';
import { FILTER_VIEW, filterFromView } from '../../data/quiziz/routes';

export default function Quiziz() {
  const user = useQuizAuth();
  const [params, setParams] = useSearchParams();
  const [last] = useState(resolveLastRead);
  const filter = filterFromView(params.get('view'));
  const rows = SUBJECTS.filter(FILTERS.find((f) => f.id === filter).test);

  const setFilter = (id) => setParams(id === 'semua' ? {} : { view: FILTER_VIEW[id] }, { replace: true });

  return (
    <QuizShell maxWidth={1180}>
      <div className="qz-home">
        <LeoHomeChat />
        {last && <ContinueCard item={last} />}

        <section className="qz-catalog" aria-labelledby="qz-catalog-title">
          <div className="qz-catalog-head">
            <div>
              <h2 id="qz-catalog-title" className="qz-catalog-title">Mata kuliah</h2>
              <p className="qz-catalog-lead">Pilih matkul untuk baca materi atau latihan soal. Status tiap matkul sesuai isi website sekarang.</p>
            </div>
            <SearchButton />
          </div>
          <FilterChips value={filter} onChange={setFilter} />
          <p className="qz-aibar">
            <i className="fa-solid fa-robot" aria-hidden="true" />
            <span><b>Disclaimer AI:</b> semua soal, penjelasan, dan penyusunan materi dibuat dengan bantuan AI. Gunakan sebagai bahan latihan mandiri, bukan pengganti materi resmi dari dosen pengampu.</span>
          </p>
          <ul className="qz-rows">
            {rows.map((s) => <CourseRow key={s.slug} subject={s} filter={filter} />)}
            {filter === 'semua' && <UasRow />}
          </ul>
        </section>

        <div className="qz-section"><SubjectComments subjectKey="quizizLatsol" user={user} /></div>
        <div className="qz-section"><SaranWebsite user={user} /></div>
      </div>
    </QuizShell>
  );
}
