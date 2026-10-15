// src/data/quiziz/komdas/generate-soal.prompt.js
// Prompt siap pakai untuk generate soal Komunikasi Dasar Keperawatan per TM.
// Cara pakai: salin salah satu PROMPT di bawah, lampirkan PPT/materi
// TM terkait (dan, untuk 50 soal, contoh soal ujian tahun lalu),
// lalu kirim ke sesi AI yang akan membuatkan soalnya.

export const PROMPT_100_SOAL = `Buatkan saya 100 soal latihan yang mencakup SELURUH materi di PPT/materi Komunikasi Dasar Keperawatan TM ini yang saya lampirkan (lewat ZIP). Soal tidak boleh keluar dari materi PPT tersebut — semua jawaban harus sesuai isi PPT.

Ketentuan:
1. Semua soal berbentuk STUDI KASUS, bukan pertanyaan teori biasa.
2. Setiap soal wajib disertai PEMBAHASAN di bawahnya yang menjelaskan alasan jawaban benar (dan kenapa opsi lain salah kalau perlu).
3. Panjang tiap pilihan jawaban harus seimbang — jangan ada satu opsi yang jauh lebih panjang dari yang lain.
4. Posisi jawaban benar harus diacak merata di semua pilihan (A/B/C/D/E), jangan menumpuk di satu huruf saja.
5. Tingkat kesulitan setara soal UTBK/TKA — sulit, menuntut analisis, bukan hafalan langsung.
6. Ikuti kerangka/format soal dari contoh soal tahun sebelumnya yang saya lampirkan.
7. Ketik langsung di chat, JANGAN dibuat sebagai file.

Lampiran: [materi/PPT Komunikasi Dasar Keperawatan TM terkait — upload ZIP di sini]`;

export const PROMPT_50_SOAL = `Buatkan saya 50 soal latihan serius Komunikasi Dasar Keperawatan yang formatnya mengikuti CONTOH SOAL TAHUN LALU yang saya lampirkan (bukan semata dari PPT, tapi digabung dengan pola soal ujian yang sebenarnya). Campur studi kasus dan non-studi kasus — jangan 50 soal studi kasus semua.

Ketentuan sama seperti 100 soal: pembahasan di tiap soal, opsi jawaban seimbang panjangnya, posisi jawaban benar diacak merata, tingkat kesulitan setara UTBK/TKA, ketik langsung di chat (jangan file).

Lampiran: [contoh soal ujian tahun lalu + materi terkait — upload di sini]`;
