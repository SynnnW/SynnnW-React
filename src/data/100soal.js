// src/data/100soal.js
// ────────────────────────────────────────────────────────────
// QUIZ CBT KEPERAWATAN — 100 SOAL PEMBELAJARAN
// Paket: Kesehatan Global (1-100) + Falsafah & Teori Keperawatan (101-200)
// ────────────────────────────────────────────────────────────
// 📚 REFERENSI:
// • Kesehatan Global: PPT dosen + buku teks kesehatan global
// • FTK: Buku FTK + contoh soal UTS kakak kelas 2023/2024
// • Sumber: Google Drive https://drive.google.com/drive/folders/1BhECsi2o8spsa_Wbgb9K0p1RJJjUjgKb (KesGlob PPT)
// • Buku: https://drive.google.com/drive/folders/1eIeKFaEAaFrhJqTpPZsWxoUSq42TmUQx
// 🤖 Dibuat dengan AI tapi pola mirip soal tahun-tahun sebelumnya
// ────────────────────────────────────────────────────────────

export const questions = [
  // ════════════════════════════════════════════════
  // KESEHATAN GLOBAL — 100 SOAL (Index 0-99)
  // ════════════════════════════════════════════════

  // Bagian A: Kesehatan Global, Beban Penyakit, Mortalitas, UHH, Demografi
  {
    id: 1,
    text: "Sebuah pemerintah daerah menyusun program kesehatan dengan melibatkan dinas kesehatan, universitas, organisasi masyarakat, dan mitra internasional. Fokus program bukan hanya menurunkan angka kematian di wilayahnya, tetapi juga mengurangi kesenjangan kesehatan dengan kelompok masyarakat di wilayah lain.\n\nKonsep yang paling tepat untuk menggambarkan orientasi program tersebut adalah...",
    options: [
      "Pelayanan klinis individual yang berpusat pada pasien",
      "Kesehatan masyarakat yang terbatas pada wilayah administratif",
      "Promosi kesehatan yang hanya menargetkan perilaku individu",
      "Sistem kesehatan nasional yang berfokus pada pembiayaan",
      "Kesehatan global yang menekankan perbaikan status kesehatan dan keadilan"
    ],
    correctIndex: 4,
    explanation: "Materi menjelaskan global health sebagai bidang studi, riset, dan praktik yang bertujuan meningkatkan status kesehatan dan mencapai equity bagi populasi dunia dengan perhatian pada masalah yang melampaui batas negara."
  },

  {
    id: 2,
    text: "Seorang mahasiswa mengatakan, \"Seseorang disebut sehat selama tidak sedang didiagnosis menderita penyakit.\"\n\nDosen menilai definisi tersebut terlalu sempit. Pernyataan yang paling sesuai dengan definisi kesehatan yang digunakan WHO dalam materi adalah...",
    options: [
      "Sehat berarti mampu bekerja secara produktif setiap hari",
      "Sehat berarti tidak membutuhkan pelayanan medis dalam satu tahun",
      "Sehat merupakan keadaan sejahtera secara fisik, mental, dan sosial, bukan sekadar bebas penyakit",
      "Sehat berarti memiliki hasil pemeriksaan laboratorium yang normal",
      "Sehat berarti tidak mempunyai faktor risiko penyakit kronis"
    ],
    correctIndex: 2,
    explanation: "WHO mendefinisikan kesehatan sebagai keadaan sejahtera secara lengkap pada aspek fisik, mental, dan sosial, bukan hanya tidak adanya penyakit atau kelemahan."
  },

  {
    id: 3,
    text: "Terjadi peningkatan kasus penyakit pernapasan yang menyebar melalui perpindahan manusia antarnegara. Satu negara berupaya mengatasinya sendiri, tetapi negara lain mengalami masalah serupa sehingga pengendalian menjadi tidak optimal.\n\nSituasi tersebut paling menunjukkan alasan mengapa kesehatan global memerlukan...",
    options: [
      "Pengurangan fungsi pemerintah dalam kesehatan",
      "Penghapusan seluruh kebijakan kesehatan nasional",
      "Kerja sama lintas negara dan lintas sektor",
      "Pengalihan seluruh pelayanan kepada sektor swasta",
      "Pemusatan seluruh keputusan kesehatan pada rumah sakit"
    ],
    correctIndex: 2,
    explanation: "Masalah kesehatan yang bersifat transnasional tidak dapat ditangani optimal oleh satu negara saja. Materi menekankan kolaborasi pemerintah, organisasi internasional, masyarakat sipil, dan sektor lain."
  },

  {
    id: 4,
    text: "Pada akhir abad ke-18, seorang dokter mengembangkan metode vaksinasi terhadap penyakit yang sebelumnya menjadi penyebab penting kematian.\n\nTokoh dan peristiwa yang paling sesuai adalah...",
    options: [
      "Alexander Fleming dan penemuan penisilin",
      "Louis Pasteur dan pengembangan teori kuman",
      "Jonas Salk dan vaksin polio",
      "Edward Jenner dan vaksin cacar pada 1796",
      "Albert Sabin dan eradikasi cacar"
    ],
    correctIndex: 3,
    explanation: "Materi secara spesifik menyebut Edward Jenner mengembangkan vaksin smallpox atau cacar pada 1796."
  },

  {
    id: 5,
    text: "Sebuah negara ingin mencapai UHC, tetapi selama ini sebagian besar anggaran diarahkan ke rumah sakit rujukan. Puskesmas di daerah terpencil kekurangan tenaga dan kegiatan pencegahan penyakit belum kuat.\n\nKebijakan yang paling sesuai dengan prinsip Astana adalah...",
    options: [
      "Memperkuat primary health care sebagai fondasi UHC",
      "Memperbanyak rumah sakit tersier di kota besar",
      "Memusatkan layanan pada kasus yang sudah parah",
      "Mengurangi layanan promotif karena tidak menghasilkan pendapatan",
      "Mengganti pelayanan dasar dengan sistem rujukan digital"
    ],
    correctIndex: 0,
    explanation: "Deklarasi Astana menegaskan penguatan primary health care sebagai fondasi universal health coverage dengan layanan yang terintegrasi, inklusif, dan berpusat pada manusia."
  },

  {
    id: 6,
    text: "Dalam evaluasi suatu program kesehatan global, pemerintah menggunakan data kematian, kecacatan, serta dampak kesehatan agar dapat membandingkan beban berbagai penyakit dan menentukan prioritas.\n\nIndikator yang paling tepat untuk menggambarkan beban tersebut adalah...",
    options: [
      "Case fatality rate",
      "Infant mortality rate",
      "Prevalence rate",
      "Life expectancy saja",
      "Disability-adjusted life years"
    ],
    correctIndex: 4,
    explanation: "DALY digunakan untuk menggambarkan beban penyakit dengan menggabungkan tahun hidup yang hilang karena kematian prematur dan tahun hidup dengan disabilitas."
  },

  {
    id: 7,
    text: "Sebuah organisasi masyarakat sipil menjalankan advokasi pengendalian tembakau, kebijakan pangan, serta pemberdayaan masyarakat di tingkat akar rumput. Mereka juga bekerja bersama puluhan lembaga lain untuk memengaruhi kebijakan kesehatan.\n\nPeran seperti ini paling sesuai dengan gambaran peran...",
    options: [
      "Lembaga klinis sebagai penyedia pengobatan",
      "Rumah sakit sebagai pusat rehabilitasi",
      "Perusahaan sebagai penyedia alat kesehatan",
      "Civil society sebagai aktor strategis dalam kesehatan global",
      "Laboratorium sebagai pengendali utama kebijakan"
    ],
    correctIndex: 3,
    explanation: "Materi menempatkan masyarakat sipil sebagai aktor strategis melalui advokasi, pemberdayaan, governance, dan kerja sama lintas institusi."
  },

  {
    id: 8,
    text: "Suatu program menghasilkan 100 tahun kehidupan yang hilang akibat kematian prematur dan 40 tahun kehidupan dengan disabilitas.\n\nNilai DALY yang diperoleh adalah...",
    options: [
      "60",
      "100",
      "140",
      "400",
      "4.000"
    ],
    correctIndex: 2,
    explanation: "DALY = YLL + YLD. Jadi 100 + 40 = 140 DALY."
  },

  {
    id: 9,
    text: "Pada forum internasional, negara-negara menyepakati bahwa penguatan layanan primer harus menjadi dasar sistem kesehatan agar masyarakat dapat memperoleh pelayanan yang lebih dekat dengan kehidupan sehari-hari.\n\nPeristiwa yang paling sesuai dengan uraian tersebut adalah...",
    options: [
      "Pembentukan WHO tahun 1948",
      "Deklarasi Astana tahun 2018",
      "Daftar obat esensial WHO",
      "Penetapan SDG3 tahun 2030",
      "Pembentukan ICRC"
    ],
    correctIndex: 1,
    explanation: "Astana 2018 menegaskan kembali primary health care sebagai fondasi UHC dan menekankan layanan yang human-centered, terintegrasi, inklusif, dan berkualitas."
  },

  {
    id: 10,
    text: "Sebuah tim kemanusiaan memberikan pelayanan kesehatan kepada masyarakat terdampak konflik, pengungsian, dan wabah di berbagai negara.\n\nOrganisasi yang paling sesuai dengan karakteristik tersebut adalah...",
    options: [
      "World Bank",
      "WHO",
      "Médecins Sans Frontières",
      "BPJS Kesehatan",
      "Posyandu"
    ],
    correctIndex: 2,
    explanation: "Materi menjelaskan MSF sebagai organisasi kemanusiaan yang bergerak dalam konflik, bencana, pengungsian, dan epidemi di berbagai negara."
  },

  {
    id: 11,
    text: "Dalam suatu survei persepsi kesehatan global yang tercantum pada materi, responden menempatkan masalah tertentu sebagai kekhawatiran kesehatan nomor satu dengan angka sekitar 44%.\n\nMasalah yang dimaksud adalah...",
    options: [
      "Obesitas",
      "Kesehatan mental",
      "Diabetes",
      "Penyakit jantung",
      "COVID-19"
    ],
    correctIndex: 1,
    explanation: "Data Ipsos GHS 2023 dalam materi mencatat mental health sebagai kekhawatiran kesehatan teratas sebesar 44%."
  },

  {
    id: 12,
    text: "Sebuah kementerian menyusun target pembangunan kesehatan sampai 2030. Salah satu targetnya adalah memastikan masyarakat dapat memperoleh pelayanan kesehatan yang dibutuhkan tanpa kesulitan finansial.\n\nTarget SDG3 yang paling sesuai adalah...",
    options: [
      "Memperluas ekspor alat kesehatan",
      "Meningkatkan jumlah rumah sakit tersier",
      "Menghapus seluruh penyakit infeksi",
      "Mencapai universal health coverage",
      "Meningkatkan jumlah dokter spesialis"
    ],
    correctIndex: 3,
    explanation: "SDG3 dalam materi mencakup pencapaian UHC, di samping pengurangan kematian ibu dan anak serta pengurangan kematian akibat penyakit tidak menular."
  },

  {
    id: 13,
    text: "Seorang pasien membutuhkan pelayanan promotif, preventif, kuratif, rehabilitatif, obat, vaksin, dan diagnostik. Ia juga harus dapat memperoleh pelayanan tersebut tanpa mengalami kesulitan finansial.\n\nKondisi itu paling tepat menggambarkan...",
    options: [
      "Health insurance",
      "Disease elimination",
      "Primary care",
      "Universal health coverage",
      "Health financing"
    ],
    correctIndex: 3,
    explanation: "UHC berarti semua orang memperoleh layanan kesehatan yang dibutuhkan, bermutu, dan tanpa mengalami financial hardship."
  },

  {
    id: 14,
    text: "Mahasiswa A berkata, \"Kalau suatu negara sudah punya BPJS, berarti negara tersebut otomatis sudah mencapai UHC.\"\n\nPernyataan yang paling tepat untuk mengoreksi pendapat tersebut adalah...",
    options: [
      "BPJS hanya berlaku untuk pasien rawat inap",
      "BPJS hanya merupakan program promotif",
      "UHC berarti semua pelayanan harus gratis",
      "UHC hanya mengukur jumlah peserta asuransi",
      "BPJS adalah mekanisme jaminan, sedangkan UHC mencakup akses layanan, mutu, dan perlindungan finansial secara lebih luas"
    ],
    correctIndex: 4,
    explanation: "Materi menegaskan bahwa UHC tidak sama dengan BPJS. BPJS/JKN merupakan salah satu mekanisme pembiayaan/perlindungan sosial, sedangkan UHC memiliki cakupan yang lebih luas."
  },

  {
    id: 15,
    text: "Suatu daerah menilai keberhasilan UHC dengan melihat tiga hal: siapa yang tercakup, pelayanan apa yang diterima, dan seberapa berat beban biaya yang harus ditanggung.\n\nKetiga dimensi tersebut secara berurutan adalah...",
    options: [
      "Mutu, tenaga kesehatan, fasilitas",
      "Diagnosis, terapi, biaya, pulang",
      "Penyakit, pembiayaan, outcome",
      "Populasi, pelayanan, perlindungan finansial",
      "Distribusi, promosi, rehabilitasi"
    ],
    correctIndex: 3,
    explanation: "UHC memiliki tiga dimensi utama: population coverage, service coverage, dan financial protection."
  },

  {
    id: 16,
    text: "Data suatu negara menunjukkan Service Coverage Index (SCI) meningkat dari 42 pada 2010 menjadi 56 pada 2019, kemudian sedikit turun menjadi 55 pada 2021.\n\nInterpretasi paling tepat adalah...",
    options: [
      "Seluruh domain UHC telah mencapai tingkat sangat tinggi",
      "Akses kesehatan pasti sudah merata",
      "Kemajuan ada, tetapi belum konsisten dan masih menyisakan kesenjangan",
      "UHC telah sepenuhnya tercapai sejak 2019",
      "Indeks tersebut hanya mengukur jumlah peserta jaminan"
    ],
    correctIndex: 2,
    explanation: "Angka SCI menunjukkan kemajuan secara umum, tetapi penurunan pada 2021 serta adanya domain yang masih sedang menunjukkan perjalanan menuju UHC belum selesai."
  },

  {
    id: 17,
    text: "Sebuah keluarga harus menggunakan sebagian besar pengeluaran rumah tangga untuk membayar pelayanan kesehatan sehingga kebutuhan dasar rumah tangga terganggu.\n\nIstilah yang paling tepat adalah...",
    options: [
      "Morbidity burden",
      "Service coverage",
      "Catastrophic health expenditure",
      "Social gradient",
      "Health literacy"
    ],
    correctIndex: 2,
    explanation: "Catastrophic expenditure terjadi ketika pengeluaran kesehatan sangat besar sehingga mengganggu kemampuan rumah tangga memenuhi kebutuhan lainnya."
  },

  {
    id: 18,
    text: "Monitoring global menunjukkan bahwa pada 2019 sekitar 2 miliar orang mengalami kesulitan finansial karena biaya kesehatan, dan sebagian terdorong ke kondisi kemiskinan ekstrem.\n\nTemuan tersebut paling menunjukkan bahwa...",
    options: [
      "UHC hanya persoalan jumlah dokter",
      "Perlindungan finansial merupakan komponen penting UHC",
      "Penyakit infeksi adalah satu-satunya hambatan UHC",
      "Peningkatan rumah sakit tersier otomatis menyelesaikan UHC",
      "Semua biaya kesehatan harus ditanggung pemerintah"
    ],
    correctIndex: 1,
    explanation: "Angka tersebut menegaskan bahwa cakupan layanan saja tidak cukup; masyarakat juga harus terlindungi dari dampak finansial akibat kebutuhan kesehatan."
  },

  {
    id: 19,
    text: "Indeks cakupan pelayanan kesehatan suatu negara dibagi ke dalam empat domain. Tiga domain berada pada kategori sedang, sedangkan kesehatan reproduksi, maternal, neonatal, dan anak berada pada kategori sangat tinggi.\n\nKesimpulan yang paling tepat adalah...",
    options: [
      "Semua domain sudah merata",
      "Domain penyakit tidak menular paling tinggi",
      "Capacity/access sudah sangat tinggi",
      "Terdapat ketimpangan capaian antardomain pelayanan kesehatan",
      "Indeks tidak bisa digunakan untuk mengevaluasi UHC"
    ],
    correctIndex: 3,
    explanation: "Materi menunjukkan empat domain SCI dan tidak semuanya memiliki capaian yang sama. Ini menunjukkan adanya area yang perlu diperkuat."
  },

  {
    id: 20,
    text: "Sebuah wilayah ingin mempercepat UHC, tetapi data pelayanan sering terlambat dan tidak terhubung antara puskesmas dengan pengambil kebijakan.\n\nPrioritas penguatan yang paling masuk akal adalah...",
    options: [
      "Memperbanyak kampanye tanpa data",
      "Membangun rumah sakit baru tanpa analisis kebutuhan",
      "Mengurangi pelaporan agar tenaga kesehatan fokus melayani",
      "Menghentikan evaluasi program",
      "Memperkuat sistem informasi kesehatan dan penggunaan data tepat waktu"
    ],
    correctIndex: 4,
    explanation: "Materi menegaskan pentingnya health information systems dan data yang tepat waktu sebagai dasar pengambilan keputusan dan peningkatan sistem kesehatan."
  },

  // Bagian B: Morbiditas, Mortalitas, DALY, UHH, Dependency Ratio
  {
    id: 21,
    text: "Sebuah puskesmas mencatat bahwa pada bulan April terdapat 35 kasus baru hipertensi yang sebelumnya belum terdiagnosis.\n\nUkuran epidemiologis yang sedang dihitung adalah...",
    options: [
      "Incidence",
      "Prevalence",
      "Mortality rate",
      "Case fatality rate",
      "Dependency ratio"
    ],
    correctIndex: 0,
    explanation: "Incidence menghitung kasus baru yang muncul dalam populasi pada periode tertentu."
  },

  {
    id: 22,
    text: "Pada suatu tanggal tertentu, sebuah desa memiliki 120 penduduk yang sedang menderita penyakit X. Sebagian merupakan kasus lama dan sebagian baru.\n\nData tersebut paling sesuai untuk menghitung...",
    options: [
      "Incidence",
      "Prevalence",
      "Mortality",
      "Case fatality rate",
      "Infant mortality"
    ],
    correctIndex: 1,
    explanation: "Prevalence mencakup seluruh kasus yang ada, baik kasus lama maupun baru, pada waktu atau periode tertentu."
  },

  {
    id: 23,
    text: "Dua wilayah memiliki jumlah kasus penyakit yang sama, tetapi wilayah A mengalami lebih banyak kematian karena akses pelayanan buruk.\n\nIndikator yang paling langsung menggambarkan banyaknya kematian dalam populasi dan waktu tertentu adalah...",
    options: [
      "Morbidity",
      "Incidence",
      "Mortality",
      "Prevalence",
      "DALY"
    ],
    correctIndex: 2,
    explanation: "Mortality menggambarkan kematian yang terjadi dalam populasi pada periode tertentu."
  },

  {
    id: 24,
    text: "Dalam satu tahun terdapat 500 pasien yang didiagnosis penyakit tertentu dan 25 di antaranya meninggal karena penyakit tersebut.\n\nUkuran yang paling tepat untuk menggambarkan proporsi kematian di antara kasus yang telah didiagnosis adalah...",
    options: [
      "Mortality rate",
      "Prevalence",
      "Case fatality rate",
      "Incidence rate",
      "Infant mortality rate"
    ],
    correctIndex: 2,
    explanation: "CFR mengukur persentase orang yang meninggal di antara mereka yang telah terkena penyakit dalam periode tertentu."
  },

  {
    id: 25,
    text: "Suatu kabupaten ingin mengetahui berapa banyak bayi yang meninggal sebelum mencapai usia satu tahun dibandingkan dengan jumlah kelahiran hidup.\n\nIndikator yang digunakan adalah...",
    options: [
      "CDR",
      "IMR",
      "MMR",
      "CFR",
      "UHH"
    ],
    correctIndex: 1,
    explanation: "IMR adalah kematian bayi usia di bawah satu tahun per 1.000 kelahiran hidup."
  },

  {
    id: 26,
    text: "Program maternal di suatu provinsi dievaluasi dengan indikator kematian yang berhubungan dengan kehamilan dan persalinan.\n\nPenyebut yang paling sesuai dengan indikator tersebut adalah...",
    options: [
      "Seluruh perempuan usia subur",
      "Jumlah kelahiran hidup",
      "Seluruh penduduk",
      "Seluruh ibu yang berkunjung ke puskesmas",
      "Seluruh ibu hamil"
    ],
    correctIndex: 1,
    explanation: "Maternal mortality ratio dihitung per 100.000 kelahiran hidup."
  },

  {
    id: 27,
    text: "Sebuah penyakit menyerang sangat banyak orang setiap tahun, tetapi sebagian besar pasien pulih. Sebaliknya, penyakit lain menyerang lebih sedikit orang namun proporsi pasien yang meninggal sangat tinggi.\n\nKesimpulan yang paling tepat adalah...",
    options: [
      "Penyakit pertama pasti memiliki CFR lebih tinggi",
      "Penyakit kedua pasti memiliki prevalence lebih tinggi",
      "Morbidity dan mortality selalu berubah searah",
      "Suatu penyakit dapat memiliki morbidity tinggi tetapi mortality relatif rendah, dan sebaliknya",
      "Mortality tidak berhubungan dengan derajat keparahan"
    ],
    correctIndex: 3,
    explanation: "Materi memberi contoh bahwa influenza dapat memiliki morbidity tinggi tetapi mortality relatif rendah, sedangkan penyakit berat seperti kanker paru lanjut dapat memiliki pola sebaliknya."
  },

  {
    id: 28,
    text: "Sebuah kota ingin mengetahui semua kematian yang terjadi pada tahun tertentu tanpa membedakan penyebab, usia, atau jenis kelamin.\n\nIndikator yang paling tepat adalah...",
    options: [
      "Crude death rate",
      "Case fatality rate",
      "Maternal mortality ratio",
      "Infant mortality rate",
      "Prevalence"
    ],
    correctIndex: 0,
    explanation: "CDR mencakup semua kematian dalam populasi per periode tertentu tanpa membedakan kelompok berdasarkan penyebab, usia, atau jenis kelamin."
  },

  {
    id: 29,
    text: "Tim peneliti menghitung beban penyakit dengan menjumlahkan tahun kehidupan yang hilang akibat kematian prematur dan tahun hidup yang dijalani dengan disabilitas.\n\nRumus tersebut adalah...",
    options: [
      "DALY = YLL − YLD",
      "DALY = YLL + YLD",
      "DALY = YLD − YLL",
      "DALY = mortality + prevalence",
      "DALY = incidence × CFR"
    ],
    correctIndex: 1,
    explanation: "DALY terdiri atas Years of Life Lost (YLL) + Years Lived with Disability (YLD)."
  },

  {
    id: 30,
    text: "Sebuah studi ekonomi penyakit stroke menunjukkan biaya langsung sangat besar, dan sebagian besar biaya medis langsung berasal dari rawat inap. Pasien juga memiliki masa rawat yang panjang.\n\nKesimpulan yang paling tepat adalah...",
    options: [
      "Indirect cost selalu lebih tinggi daripada direct cost",
      "Rawat inap tidak memengaruhi beban ekonomi",
      "Biaya stroke terutama hanya berasal dari transportasi",
      "Biaya tidak berkaitan dengan lama rawat",
      "Lama rawat dapat memperbesar beban ekonomi karena biaya medis langsung meningkat"
    ],
    correctIndex: 4,
    explanation: "Materi menyebut sekitar 65% direct medical cost dapat berasal dari hospitalisasi dan lama rawat yang lebih panjang meningkatkan kerugian ekonomi."
  },

  {
    id: 31,
    text: "Sebuah populasi memiliki usia harapan hidup standar 80 tahun. Seorang pasien meninggal pada usia 70 tahun.\n\nYLL pasien tersebut adalah...",
    options: [
      "0 tahun",
      "10 tahun",
      "20 tahun",
      "70 tahun",
      "80 tahun"
    ],
    correctIndex: 1,
    explanation: "YLL = usia harapan hidup standar − usia saat meninggal = 80 − 70 = 10 tahun."
  },

  {
    id: 32,
    text: "Seorang pasien mengalami amputasi pada usia 50 tahun dan hidup sampai usia 80 tahun. Disability weight untuk kondisi tersebut adalah 0,3.\n\nDengan pendekatan sederhana pada materi, YLD pasien adalah...",
    options: [
      "3 tahun",
      "6 tahun",
      "8 tahun",
      "12 tahun",
      "9 tahun"
    ],
    correctIndex: 4,
    explanation: "Durasi disabilitas = 80 − 50 = 30 tahun. YLD = 30 × 0,3 = 9 tahun."
  },

  {
    id: 33,
    text: "Sebuah dinas kesehatan memiliki dana terbatas. Data DALY menunjukkan wilayah tertentu mengalami beban penyakit pernapasan yang sangat besar, terutama terkait lingkungan.\n\nPemanfaatan data DALY yang paling tepat adalah...",
    options: [
      "Menghapus semua program penyakit lain",
      "Menentukan diagnosis individual pasien",
      "Membantu menetapkan prioritas dan alokasi sumber daya",
      "Menghitung jumlah dokter secara otomatis",
      "Mengganti seluruh surveilans penyakit"
    ],
    correctIndex: 2,
    explanation: "DALY dapat digunakan untuk menetapkan prioritas masalah, mengalokasikan anggaran dan tenaga, mengevaluasi program, serta memantau tren."
  },

  {
    id: 34,
    text: "Sebuah wilayah memiliki masalah diare pada anak dan diketahui banyak keluarga belum memiliki sanitasi dan air yang aman.\n\nIntervensi yang paling berhubungan langsung dengan pengurangan beban tersebut adalah...",
    options: [
      "Pembangunan rumah sakit tersier",
      "Peningkatan penggunaan obat mahal",
      "Penambahan dokter spesialis",
      "Pengurangan kegiatan surveilans",
      "Perbaikan WASH"
    ],
    correctIndex: 4,
    explanation: "Materi mengaitkan beban diare yang besar dengan kondisi water, sanitation, and hygiene yang buruk."
  },

  {
    id: 35,
    text: "Dalam evaluasi faktor risiko global, peneliti ingin menargetkan salah satu faktor metabolik yang memiliki kontribusi besar terhadap beban penyakit.\n\nPilihan paling sesuai dengan materi adalah...",
    options: [
      "Tingkat pendidikan tinggi",
      "Akses transportasi",
      "Marital status",
      "Tekanan darah tinggi",
      "Aktivitas sosial"
    ],
    correctIndex: 3,
    explanation: "Faktor risiko utama yang disebut antara lain tekanan darah tinggi, merokok, glukosa darah tinggi, dan obesitas/high BMI."
  },

  {
    id: 36,
    text: "Rumah sakit A mampu memulangkan pasien stroke lebih cepat tanpa menurunkan mutu pelayanan dibanding rumah sakit B.\n\nMenurut perspektif beban ekonomi pada materi, kondisi rumah sakit A dapat memberikan keuntungan karena...",
    options: [
      "Direct non-medical cost menjadi nol",
      "Indirect cost tidak pernah ada",
      "Lama rawat yang lebih singkat dapat menurunkan biaya dan kehilangan produktivitas",
      "Semua biaya stroke berasal dari obat",
      "Biaya stroke tidak dipengaruhi lama rawat"
    ],
    correctIndex: 2,
    explanation: "Lama rawat merupakan komponen penting dalam beban ekonomi stroke. Pengurangan lama rawat yang aman dapat menekan biaya langsung dan kehilangan produktivitas."
  },

  {
    id: 37,
    text: "Suatu daerah melaporkan usia harapan hidup meningkat setelah kematian bayi dan balita menurun.\n\nPenjelasan paling tepat adalah...",
    options: [
      "UHH hanya dipengaruhi jumlah orang lanjut usia",
      "UHH tidak dipengaruhi mortalitas",
      "Peningkatan UHH hanya terjadi akibat peningkatan pendapatan",
      "Penurunan mortalitas, terutama pada usia muda, dapat meningkatkan UHH",
      "UHH hanya bergantung pada jumlah kelahiran"
    ],
    correctIndex: 3,
    explanation: "Materi menegaskan bahwa kematian tinggi, terutama pada bayi, anak, dan usia produktif, menurunkan UHH."
  },

  {
    id: 38,
    text: "Sebuah kabupaten memiliki 3 juta penduduk usia 0–14 tahun, 5 juta penduduk usia 15–64 tahun, dan 1 juta penduduk usia 65 tahun ke atas.\n\nKelompok yang digunakan sebagai pembagi dependency ratio adalah...",
    options: [
      "Penduduk usia 15–64 tahun",
      "Penduduk usia 0–14 tahun",
      "Penduduk usia 65 tahun ke atas",
      "Seluruh penduduk",
      "Hanya laki-laki usia produktif"
    ],
    correctIndex: 0,
    explanation: "Dependency ratio membandingkan penduduk nonproduktif muda dan tua dengan penduduk usia produktif 15–64 tahun."
  },

  {
    id: 39,
    text: "Suatu daerah memiliki 4,5 juta penduduk muda, 1,5 juta lansia, dan 10 juta penduduk usia produktif.\n\nTotal dependency ratio daerah tersebut adalah...",
    options: [
      "15%",
      "30%",
      "45%",
      "55%",
      "60%"
    ],
    correctIndex: 4,
    explanation: "DR = (4,5 + 1,5) / 10 × 100 = 60%. Artinya, setiap 100 penduduk produktif secara demografis menanggung 60 penduduk nonproduktif."
  },

  {
    id: 40,
    text: "Suatu negara sedang menikmati bonus demografi. Namun pertumbuhan lapangan kerja tidak mampu mengejar jumlah penduduk usia produktif.\n\nRisiko yang paling sesuai dengan materi adalah...",
    options: [
      "Bonus demografi dapat berubah menjadi masalah pengangguran dan instabilitas sosial",
      "Dependency ratio akan otomatis menjadi nol",
      "Jumlah lansia langsung turun",
      "Produktivitas otomatis meningkat",
      "Seluruh pendapatan rumah tangga otomatis naik"
    ],
    correctIndex: 0,
    explanation: "Bonus demografi bersifat \"double-edged\". Tanpa lapangan kerja, pendidikan, dan produktivitas yang baik, dominasi usia produktif justru dapat menimbulkan pengangguran dan masalah sosial."
  },

  {
    id: 41,
    text: "Setelah 2045, proporsi lansia di Indonesia diperkirakan meningkat sehingga beban kelompok usia tua terhadap penduduk produktif ikut meningkat.\n\nMasalah sistemik yang paling mungkin muncul adalah...",
    options: [
      "Meningkatnya tekanan terhadap perlindungan sosial dan pembiayaan kesehatan",
      "Hilangnya seluruh populasi produktif",
      "Penurunan kebutuhan pelayanan kesehatan",
      "Hilangnya semua penyakit kronis",
      "Otomatis turunnya dependency ratio"
    ],
    correctIndex: 0,
    explanation: "Materi menempatkan penuaan penduduk sebagai tantangan terhadap jaminan sosial, pelayanan kesehatan, dan old-age dependency ratio."
  },

  {
    id: 42,
    text: "Sebuah kabupaten mengalami peningkatan kematian maternal dan bayi. Dalam beberapa tahun berikutnya, UHH daerah tersebut justru menurun.\n\nPenjelasan yang paling sesuai adalah...",
    options: [
      "Kematian ibu tidak memengaruhi UHH",
      "UHH hanya dipengaruhi penyakit lansia",
      "UHH hanya dipengaruhi kebijakan pendidikan",
      "Peningkatan mortalitas pada usia muda dapat menurunkan UHH",
      "UHH hanya dipengaruhi jumlah kelahiran"
    ],
    correctIndex: 3,
    explanation: "Kematian pada usia muda membawa kehilangan tahun hidup yang besar sehingga berdampak pada penurunan usia harapan hidup."
  },

  {
    id: 43,
    text: "Sebuah keluarga mulai membiasakan aktivitas fisik, memperbanyak buah dan sayur, berhenti merokok, menjaga kebersihan lingkungan, dan menggunakan jamban.\n\nKombinasi perilaku tersebut paling sesuai dengan...",
    options: [
      "GERMAS",
      "Three Delays",
      "PATUH",
      "5A",
      "Health in All Policies"
    ],
    correctIndex: 0,
    explanation: "GERMAS mencakup aktivitas fisik, konsumsi buah dan sayur, tidak merokok, tidak mengonsumsi alkohol, pemeriksaan kesehatan, lingkungan bersih, dan penggunaan jamban."
  },

  {
    id: 44,
    text: "Seorang peneliti ingin menghitung UHH secara lebih tepat dengan memanfaatkan pola kematian berdasarkan kelompok umur.\n\nDasar perhitungan yang paling sesuai adalah...",
    options: [
      "Jumlah seluruh kasus baru",
      "Prevalence setiap penyakit",
      "Age-specific death rate dan life table",
      "Dependency ratio",
      "CFR"
    ],
    correctIndex: 2,
    explanation: "Materi menyebut perhitungan UHH memanfaatkan age-specific death rate (ASDR) dan life table."
  },

  {
    id: 45,
    text: "Sebuah wilayah meningkatkan pendidikan, kondisi sosial-ekonomi, lingkungan, teknologi medis, serta menurunkan mortalitas bayi.\n\nDampak yang paling masuk akal terhadap UHH adalah...",
    options: [
      "UHH cenderung meningkat",
      "UHH pasti menurun",
      "UHH tidak berubah",
      "Hanya mortality rate yang berubah",
      "Hanya dependency ratio yang berubah"
    ],
    correctIndex: 0,
    explanation: "Materi mengaitkan peningkatan UHH dengan kondisi sosial-ekonomi yang lebih baik, pendidikan, teknologi medis, lingkungan, dan penurunan mortalitas."
  },

  {
    id: 46,
    text: "Dalam membahas faktor yang memengaruhi panjang umur, seorang mahasiswa hanya menyebut faktor genetik.\n\nDosen mengoreksi bahwa faktor tersebut tidak berdiri sendiri. Variabel lain yang juga disebut dalam materi adalah...",
    options: [
      "Pendidikan dan status sosial-ekonomi",
      "Warna pakaian",
      "Jenis tempat tinggal sementara",
      "Frekuensi pemeriksaan laboratorium",
      "Ukuran fasilitas kesehatan"
    ],
    correctIndex: 0,
    explanation: "Materi menyebut faktor jenis kelamin, genetik, kondisi prenatal/masa kanak-kanak, pendidikan, status sosial-ekonomi, status perkawinan, gaya hidup, dan teknologi medis."
  },

  {
    id: 47,
    text: "Seseorang sejak kecil hidup dalam kondisi kurang gizi, kemudian pada usia dewasa menghadapi lingkungan kerja berisiko dan akses pelayanan kesehatan rendah.\n\nKonsep yang paling sesuai dengan situasi tersebut adalah...",
    options: [
      "Cumulative risk sepanjang daur kehidupan",
      "Equality",
      "Crude mortality",
      "Primary care",
      "Service coverage"
    ],
    correctIndex: 0,
    explanation: "Pendekatan life-course melihat bahwa paparan biologis, sosial, ekonomi, dan lingkungan dapat terakumulasi sepanjang kehidupan dan memengaruhi kesehatan berikutnya."
  },

  {
    id: 48,
    text: "Seorang bayi berada pada fase sejak konsepsi hingga ulang tahun keduanya. Materi menganggap fase tersebut sangat penting karena merupakan masa kritis perkembangan.\n\nFase tersebut disebut...",
    options: [
      "500 HPK",
      "730 HPK",
      "1000 HPK",
      "2000 HPK",
      "Fase lansia"
    ],
    correctIndex: 2,
    explanation: "1000 HPK mencakup sekitar 270 hari dalam kandungan ditambah 365 hari tahun pertama dan 365 hari tahun kedua kehidupan."
  },

  {
    id: 49,
    text: "Ibu hamil pada trimester pertama mengalami kekurangan folat dan tidak mendapatkan intervensi nutrisi yang memadai.\n\nDampak yang paling sesuai dengan materi adalah peningkatan risiko...",
    options: [
      "Diabetes tipe 2 pada ibu secara langsung",
      "Hipertensi kronis pada usia lanjut",
      "Arthritis pada anak",
      "Neural tube defects",
      "Gangguan pendengaran karena infeksi"
    ],
    correctIndex: 3,
    explanation: "Materi mengaitkan trimester pertama, saat organ mulai terbentuk, dengan kebutuhan folat dan risiko neural tube defects bila terjadi defisiensi."
  },

  {
    id: 50,
    text: "Seorang petugas kesehatan ingin menganalisis kasus ibu hamil berisiko. Ia terlebih dahulu menentukan siapa kelompok yang terdampak, kemudian masalah klinis, akar determinan, dan rencana intervensi.\n\nKerangka berpikir yang paling sesuai adalah...",
    options: [
      "5A",
      "PATUH",
      "WHO–WHAT–WHY–WHAT NEXT",
      "CERAMAH",
      "YLL–YLD"
    ],
    correctIndex: 2,
    explanation: "WHO = siapa/kelompok sasaran, WHAT = masalah/komplikasi, WHY = determinan dan akar masalah, WHAT NEXT = rencana tindakan."
  },

  // Soal KesGlob 51–100 (Three Delays, Life Course, PTM, AMR, NTD, PHC/UHC lanjutan)

  {
    id: 51,
    text: "Seorang ibu hamil mengalami tanda bahaya, tetapi keluarga lambat menyadari bahwa kondisi tersebut membutuhkan pertolongan segera.\n\nDalam Three Delays Model, peristiwa tersebut termasuk...",
    options: [
      "Delay 3",
      "Delay 2",
      "Keterlambatan administratif",
      "Keterlambatan diagnosis laboratorium",
      "Delay 1"
    ],
    correctIndex: 4,
    explanation: "Delay 1 adalah keterlambatan mengenali bahaya dan mengambil keputusan mencari pertolongan."
  },

  {
    id: 52,
    text: "Seorang perempuan di daerah terpencil sudah menyadari kehamilannya berisiko, tetapi suaminya yang mengontrol keputusan finansial tidak segera menyetujui perjalanan ke fasilitas kesehatan.\n\nHambatan tersebut paling menggambarkan...",
    options: [
      "Delay 3",
      "Delay 2",
      "Delay 1",
      "Clinical failure",
      "Service coverage"
    ],
    correctIndex: 2,
    explanation: "Ketika masalahnya adalah keterlambatan dalam mengambil keputusan atau memperoleh izin untuk mencari pelayanan, itu termasuk Delay 1 dan dapat dipengaruhi gender serta kekuasaan dalam keluarga."
  },

  {
    id: 53,
    text: "Seorang remaja mengalami perubahan biologis, tekanan psikososial, pola makan buruk, dan mulai melakukan perilaku berisiko.\n\nMengapa fase remaja penting dalam pendekatan life-course?",
    options: [
      "Hanya karena tinggi badan bertambah",
      "Karena paparan pada fase ini dapat memengaruhi kesehatan saat dewasa",
      "Karena semua penyakit kronis dimulai pada masa remaja",
      "Karena UHH hanya dihitung dari masa remaja",
      "Karena kelompok ini tidak membutuhkan promosi kesehatan"
    ],
    correctIndex: 1,
    explanation: "Pubertas merupakan critical period. Perilaku, kesehatan mental, dan faktor risiko pada masa remaja dapat memengaruhi penyakit dan perilaku kesehatan di masa dewasa."
  },

  {
    id: 54,
    text: "Seorang lansia secara bersamaan memiliki hipertensi dan diabetes serta membutuhkan pemantauan beberapa obat.\n\nIstilah yang paling sesuai adalah...",
    options: [
      "Multimorbidity",
      "Comorbidity-free state",
      "Acute outbreak",
      "Health disparity",
      "Primary prevention"
    ],
    correctIndex: 0,
    explanation: "Multimorbidity didefinisikan sebagai adanya dua atau lebih kondisi kesehatan pada satu orang secara bersamaan."
  },

  {
    id: 55,
    text: "Seorang pengguna kursi roda sebenarnya mampu menjalankan banyak aktivitas, tetapi tidak dapat memasuki gedung publik karena tidak tersedia ramp dan aksesibilitas.\n\nMenurut social model of disability, masalah utama bukan semata-mata kondisi individu, melainkan...",
    options: [
      "Rendahnya kepatuhan",
      "Hambatan lingkungan dan sosial",
      "Kurangnya obat",
      "Ketidakmampuan keluarga",
      "Diagnosis klinis semata"
    ],
    correctIndex: 1,
    explanation: "Social model memandang disabilitas sebagai hasil interaksi kondisi individu dengan hambatan lingkungan dan sosial, sehingga aksesibilitas dan penghilangan stigma menjadi penting."
  },

  {
    id: 56,
    text: "Dua pasien membutuhkan pelayanan yang berbeda karena tingkat kebutuhan dan hambatannya berbeda. Petugas tidak memberikan intervensi identik kepada keduanya, tetapi menyesuaikannya dengan kebutuhan masing-masing.\n\nPrinsip tersebut merupakan...",
    options: [
      "Equality",
      "Standardisasi",
      "Uniformity",
      "Equity",
      "Universality"
    ],
    correctIndex: 3,
    explanation: "Equality berarti semua diperlakukan sama, sedangkan equity berarti dukungan disesuaikan dengan kebutuhan dan hambatan agar hasil kesehatan lebih adil."
  },

  {
    id: 57,
    text: "Sebuah keluarga miskin tidak mampu memperbaiki sanitasi, kemudian lebih sering mengalami penyakit. Biaya berobat dan kehilangan pendapatan membuat keluarga semakin miskin.\n\nFenomena tersebut menggambarkan...",
    options: [
      "Social gradient",
      "Poverty-health trap",
      "Health promotion",
      "Primary prevention",
      "Population coverage"
    ],
    correctIndex: 1,
    explanation: "Materi menggambarkan hubungan dua arah: kemiskinan meningkatkan risiko sakit, sementara sakit menambah biaya dan kehilangan pendapatan sehingga memperburuk kemiskinan."
  },

  {
    id: 58,
    text: "Seorang anak mendapat nutrisi baik sejak masa kehamilan hingga usia dua tahun, kemudian memasuki masa pubertas.\n\nDalam pendekatan life-course, kedua periode tersebut penting karena...",
    options: [
      "1000 HPK dan pubertas merupakan critical periods",
      "Keduanya hanya berhubungan dengan pertumbuhan tulang",
      "Hanya pubertas yang memengaruhi kesehatan dewasa",
      "1000 HPK tidak berpengaruh terhadap kesehatan jangka panjang",
      "Keduanya merupakan masa tanpa risiko"
    ],
    correctIndex: 0,
    explanation: "Materi menyebut 1000 HPK dan pubertas sebagai fase dengan sensitivitas tinggi terhadap paparan kesehatan dan sosial."
  },

  {
    id: 59,
    text: "Bayi usia 8 bulan mulai mendapatkan makanan pendamping, tetapi keluarganya tidak memberikan perhatian terhadap asupan zat besi.\n\nRisiko yang paling sesuai dengan materi adalah...",
    options: [
      "Hipertensi primer",
      "Arthritis",
      "Penyakit hati kronis",
      "Anemia defisiensi besi dan gangguan perkembangan",
      "Stroke"
    ],
    correctIndex: 3,
    explanation: "Pada usia 6–12 bulan, kebutuhan zat besi meningkat; kekurangannya dikaitkan dengan anemia serta gangguan perkembangan."
  },

  {
    id: 60,
    text: "Anak usia 18 bulan mengalami kurang gizi sekaligus minim stimulasi dan mengalami hambatan pertumbuhan.\n\nMenurut materi life-course, dampak yang paling dikhawatirkan adalah...",
    options: [
      "Peningkatan tinggi badan",
      "Stunting dengan dampak jangka panjang terhadap perkembangan",
      "Peningkatan UHH",
      "Penurunan dependency ratio",
      "Peningkatan service coverage"
    ],
    correctIndex: 1,
    explanation: "Materi mengaitkan usia 12–24 bulan dengan perkembangan bahasa dan motorik. Gizi buruk dan stimulasi yang kurang dapat berkontribusi pada stunting dan gangguan perkembangan yang menetap."
  },

  {
    id: 61,
    text: "Sebuah penyakit berkembang perlahan, tidak ditularkan antarorang, dan berkaitan dengan kombinasi faktor genetik, fisiologis, perilaku, dan lingkungan.\n\nKlasifikasi yang paling tepat adalah...",
    options: [
      "Penyakit tidak menular",
      "Penyakit menular",
      "Outbreak disease",
      "Zoonosis akut",
      "Emerging infection"
    ],
    correctIndex: 0,
    explanation: "PTM bersifat noncommunicable dan umumnya kronis dengan penyebab multifaktor."
  },

  {
    id: 62,
    text: "Sebuah program nasional memprioritaskan penyakit jantung dan stroke, kanker, diabetes, serta penyakit pernapasan kronis.\n\nKeempatnya merupakan kelompok utama...",
    options: [
      "Penyakit tropis terabaikan",
      "Infeksi emerging",
      "Penyakit tidak menular utama",
      "Penyakit akibat vektor",
      "Penyakit zoonosis"
    ],
    correctIndex: 2,
    explanation: "Materi menempatkan cardiovascular disease, cancer, diabetes, dan chronic respiratory disease sebagai kelompok utama PTM."
  },

  {
    id: 63,
    text: "Puskesmas membuat intervensi yang menggabungkan berhenti merokok, aktivitas fisik, pola makan seimbang, pemeriksaan tekanan darah dan gula darah, serta pengendalian stres.\n\nPendekatan ini paling sesuai dengan...",
    options: [
      "Pencegahan PTM",
      "Surveilans wabah",
      "Pengendalian NTD",
      "Pengobatan kuratif tersier saja",
      "Outbreak response"
    ],
    correctIndex: 0,
    explanation: "Pencegahan PTM dalam materi berfokus pada perilaku sehat, pengendalian faktor risiko, dan deteksi dini melalui screening."
  },

  {
    id: 64,
    text: "Seorang dewasa melakukan pengukuran tekanan darah dan memperoleh 146/92 mmHg secara berulang.\n\nBerdasarkan ambang dalam materi, kondisi tersebut memenuhi definisi...",
    options: [
      "Hipotensi",
      "Normal",
      "Prehipertensi",
      "Hipertensi",
      "Anemia"
    ],
    correctIndex: 3,
    explanation: "Materi menggunakan ambang tekanan sistolik ≥140 mmHg dan/atau diastolik ≥90 mmHg untuk hipertensi."
  },

  {
    id: 65,
    text: "Seorang pasien hipertensi berhenti minum obat karena tidak merasakan sakit atau keluhan apa pun.\n\nPenilaian yang paling tepat adalah...",
    options: [
      "Keputusan tersebut aman karena hipertensi selalu bergejala",
      "Obat hanya dibutuhkan saat sakit kepala",
      "Hipertensi tidak menyebabkan komplikasi",
      "Ketiadaan gejala tidak berarti tekanan darah terkendali",
      "Terapi cukup saat tekanan darah sangat tinggi"
    ],
    correctIndex: 3,
    explanation: "Hipertensi sering tidak menimbulkan gejala spesifik. Tekanan yang tidak terkontrol tetap dapat menyebabkan stroke, penyakit jantung, gangguan ginjal, dan komplikasi lain."
  },

  {
    id: 66,
    text: "Petugas mengajarkan pasien mengukur tekanan darah di rumah: duduk tenang, menggunakan manset tervalidasi di lengan atas, melakukan pengukuran berulang, dan memantau secara teratur.\n\nPendekatan tersebut sesuai dengan prinsip...",
    options: [
      "PATUH",
      "5A",
      "DALY",
      "Three Delays",
      "CERAMAH"
    ],
    correctIndex: 4,
    explanation: "CERAMAH pada materi menjelaskan teknik pengukuran tekanan darah di rumah, termasuk posisi rileks dan pengukuran berulang."
  },

  {
    id: 67,
    text: "Di antara berikut, faktor manakah yang termasuk faktor risiko hipertensi yang dapat dimodifikasi?",
    options: [
      "Usia",
      "Jenis kelamin",
      "Riwayat keluarga",
      "Faktor genetik",
      "Obesitas"
    ],
    correctIndex: 4,
    explanation: "Usia, jenis kelamin, dan riwayat keluarga merupakan faktor yang tidak dapat diubah, sedangkan obesitas, konsumsi garam, merokok, kurang aktivitas, dan stres merupakan faktor yang dapat dimodifikasi."
  },

  {
    id: 68,
    text: "Seorang pasien penyakit jantung koroner diberi pesan untuk memeriksa kesehatan secara rutin, mengatasi penyakit secara teratur, menjaga pola makan, melakukan aktivitas aman, dan menghindari rokok.\n\nKerangka edukasi tersebut adalah...",
    options: [
      "CERAMAH",
      "GERMAS",
      "5A",
      "PATUH",
      "PBL"
    ],
    correctIndex: 3,
    explanation: "PATUH merupakan mnemonic dalam materi untuk pengendalian penyakit kardiovaskular."
  },

  {
    id: 69,
    text: "Pasien mengeluh sering haus, sering buang air kecil, mudah lelah, dan mengalami penyembuhan luka yang lambat.\n\nGambaran tersebut paling sesuai dengan...",
    options: [
      "Hipertensi",
      "Arthritis",
      "Gangguan tidur",
      "Penyakit hati",
      "Diabetes"
    ],
    correctIndex: 4,
    explanation: "Gejala seperti rasa haus berlebih, sering berkemih, lelah, dan penyembuhan luka lambat tercantum sebagai gambaran diabetes dalam materi."
  },

  {
    id: 70,
    text: "Seorang pekerja terpapar asap rokok, asap biomassa, dan memiliki aktivitas fisik rendah. Dalam jangka panjang ia mengalami gejala sesak dan batuk kronis.\n\nFaktor tersebut paling berhubungan dengan kelompok...",
    options: [
      "Diabetes",
      "Chronic respiratory disease",
      "Congenital disorder",
      "Arthritis",
      "Thalassemia"
    ],
    correctIndex: 1,
    explanation: "Paparan asap rokok, asap lingkungan, bahan bakar biomassa, aktivitas tidak sehat, dan obesitas merupakan faktor yang disebut dalam chronic respiratory disease."
  },

  {
    id: 71,
    text: "Pasien mengalami penyempitan pembuluh koroner sehingga aliran darah dan oksigen ke miokardium berkurang.\n\nMekanisme tersebut paling sesuai dengan...",
    options: [
      "Coronary heart disease",
      "Diabetes",
      "Liver disease",
      "Arthritis",
      "IBD"
    ],
    correctIndex: 0,
    explanation: "Penyakit jantung koroner berkaitan dengan penyempitan atau penyumbatan arteri koroner yang menyebabkan iskemia miokardium."
  },

  {
    id: 72,
    text: "Dalam edukasi berhenti merokok, petugas menjelaskan adanya zat nikotin, karbon monoksida, dan tar.\n\nPernyataan yang paling tepat adalah...",
    options: [
      "Seluruh komponen tersebut hanya menimbulkan gangguan pencernaan",
      "Nikotin bersifat adiktif, karbon monoksida mengganggu transport oksigen, dan tar berhubungan dengan zat karsinogenik",
      "Semua zat tersebut hanya menyebabkan batuk",
      "Karbon monoksida tidak memengaruhi sistem kardiovaskular",
      "Tar tidak berkaitan dengan kanker"
    ],
    correctIndex: 1,
    explanation: "Materi menguraikan fungsi toksik ketiga komponen tersebut secara khusus dan mengaitkannya dengan dampak kesehatan."
  },

  {
    id: 73,
    text: "Sebuah rumah sudah bebas dari aktivitas merokok di dalam ruangan, tetapi anggota keluarga tetap terpapar residu asap yang menempel pada pakaian, rambut, atau permukaan benda.\n\nSituasi tersebut paling sesuai dengan...",
    options: [
      "Primary exposure",
      "Occupational asthma",
      "Active smoking",
      "Thirdhand smoke",
      "Second disease"
    ],
    correctIndex: 3,
    explanation: "Thirdhand smoke merupakan residu asap tembakau yang tertinggal pada pakaian, rambut, permukaan, dan lingkungan."
  },

  {
    id: 74,
    text: "Menurut materi PTM, rekomendasi aktivitas fisik minimum yang digunakan dalam pencegahan adalah...",
    options: [
      "Sekitar 30 menit per hari selama 3–5 kali per minggu",
      "5 menit sekali seminggu",
      "60 menit sekali sebulan",
      "15 menit setiap dua minggu",
      "Hanya aktivitas olahraga kompetitif"
    ],
    correctIndex: 0,
    explanation: "Materi menyebut aktivitas fisik minimum sekitar 30 menit per hari, 3–5 kali per minggu."
  },

  {
    id: 75,
    text: "Sebuah keluarga ingin menerapkan pembagian piring sehat berdasarkan materi. Mereka menambah porsi sayur dan buah dibanding sebelumnya.\n\nKomposisi yang paling sesuai adalah...",
    options: [
      "Sayur 1/6 dan buah 1/3",
      "Sayur dan buah hanya sebagai garnish",
      "Sayur sekitar 1/3 piring dan buah sekitar 1/6 piring",
      "Buah seluruh piring",
      "Sayur hanya dikonsumsi saat makan malam"
    ],
    correctIndex: 2,
    explanation: "Materi memberi panduan sayuran sekitar sepertiga piring dan buah sekitar seperenam piring."
  },

  {
    id: 76,
    text: "Remaja mengalami insomnia karena penggunaan perangkat hingga larut malam. Ia juga memiliki jadwal tidur tidak teratur.\n\nIntervensi yang paling sesuai dengan materi adalah...",
    options: [
      "Memperbaiki sleep schedule, relaksasi, mengurangi penggunaan perangkat sebelum tidur, dan aktivitas fisik",
      "Memperpanjang penggunaan gawai agar cepat mengantuk",
      "Mengonsumsi makanan berat sebelum tidur",
      "Tidur siang sepanjang sore",
      "Mengabaikan gangguan tidur"
    ],
    correctIndex: 0,
    explanation: "Sleep hygiene yang baik meliputi jadwal tidur teratur, relaksasi, membatasi perangkat, dan kebiasaan hidup sehat."
  },

  {
    id: 77,
    text: "Sebuah komunitas mempunyai prevalensi perokok tinggi dan paparan bahan kimia lingkungan. Program pencegahan kanker disusun.\n\nStrategi yang paling tepat sesuai materi adalah...",
    options: [
      "Meningkatkan konsumsi obat tanpa indikasi",
      "Hanya menyediakan layanan rawat inap",
      "Menghentikan semua kegiatan screening",
      "Mengurangi rokok dan paparan toksin serta memperhatikan nutrisi dan screening",
      "Menunggu pasien menunjukkan gejala berat"
    ],
    correctIndex: 3,
    explanation: "Materi menekankan berhenti merokok, mengurangi paparan toksin lingkungan, pola makan sehat, dan screening sebagai langkah pencegahan kanker."
  },

  {
    id: 78,
    text: "Pasien mengalami hipertensi, mual, pembengkakan, nafsu makan menurun, dan kram.\n\nOrgan yang paling perlu dicurigai mengalami gangguan adalah...",
    options: [
      "Paru",
      "Otak",
      "Pankreas",
      "Ginjal",
      "Telinga"
    ],
    correctIndex: 3,
    explanation: "Gejala seperti hipertensi, edema, mual, penurunan nafsu makan, dan kram tercantum pada gambaran penyakit ginjal."
  },

  {
    id: 79,
    text: "Seorang pasien memiliki faktor risiko penyakit hati dan ingin melakukan pencegahan.\n\nPilihan yang paling sesuai dengan materi adalah...",
    options: [
      "Meningkatkan konsumsi alkohol",
      "Menghindari semua vaksin",
      "Menggunakan obat tanpa memperhatikan dosis",
      "Mengurangi aktivitas fisik",
      "Menjaga berat badan, memperhatikan penggunaan obat, dan melakukan pencegahan sesuai faktor penyebab"
    ],
    correctIndex: 4,
    explanation: "Pencegahan penyakit hati dalam materi mencakup gaya hidup sehat, menghindari alkohol, vaksinasi, dan penggunaan obat secara hati-hati."
  },

  {
    id: 80,
    text: "Data nasional menunjukkan prevalensi obesitas meningkat dari sekitar 8% menjadi 21,8% dalam periode yang tercantum di materi.\n\nMakna utama data tersebut adalah...",
    options: [
      "Obesitas hanya menjadi masalah usia tua",
      "Obesitas bukan masalah kesehatan masyarakat",
      "Obesitas hanya ditentukan genetik",
      "Obesitas pasti akan turun tanpa intervensi",
      "Obesitas merupakan masalah PTM yang meningkat dan memerlukan strategi multifaktor"
    ],
    correctIndex: 4,
    explanation: "Materi menunjukkan peningkatan obesitas yang besar dan menjelaskannya sebagai kondisi kronis kompleks yang berkaitan dengan diet, aktivitas, stres, tidur, penyakit, obat, dan faktor lainnya."
  },

  {
    id: 81,
    text: "Pasien mengatakan, \"Tubuh saya sudah kebal terhadap antibiotik karena obatnya sudah tidak ampuh.\"\n\nPernyataan yang paling tepat adalah...",
    options: [
      "Tubuh manusia memang menjadi resisten terhadap antibiotik",
      "Semua virus otomatis kebal terhadap antibiotik",
      "Resistensi hanya muncul karena usia",
      "Mikroorganisme dapat menjadi resisten sehingga antimikroba yang sebelumnya efektif tidak lagi bekerja",
      "Antibiotik selalu bekerja terhadap semua jenis mikroorganisme"
    ],
    correctIndex: 3,
    explanation: "AMR terjadi ketika mikroorganisme—seperti bakteri, virus, fungi, atau parasit—tidak lagi responsif terhadap antimikroba yang sebelumnya efektif."
  },

  {
    id: 82,
    text: "Seorang pasien terkena influenza dan meminta antibiotik karena menganggap semua infeksi memerlukan antibiotik.\n\nRespons paling tepat adalah...",
    options: [
      "Antibiotik selalu diperlukan saat demam",
      "Antibiotik diberikan untuk semua penyakit pernapasan",
      "Antibiotik digunakan agar gejala hilang lebih cepat pada semua infeksi",
      "Antibiotik diberikan jika pasien memintanya",
      "Antibiotik ditujukan terutama untuk bakteri, sehingga penggunaannya pada penyakit virus seperti influenza tidak tepat"
    ],
    correctIndex: 4,
    explanation: "Materi membedakan antibiotik untuk bakteri, antivirus untuk virus, antifungi untuk jamur, dan antiparasit untuk parasit."
  },

  {
    id: 83,
    text: "Sebuah bakteri memproduksi enzim yang menonaktifkan obat antimikroba sehingga obat tersebut tidak lagi efektif.\n\nMekanisme resistensi yang dimaksud adalah...",
    options: [
      "Perubahan target",
      "Enzymatic inactivation",
      "Peningkatan absorpsi obat",
      "Peningkatan sensitivitas",
      "Aktivasi sistem imun"
    ],
    correctIndex: 1,
    explanation: "Enzymatic inactivation, misalnya melalui beta-lactamase, merupakan salah satu mekanisme resistensi yang disebut dalam materi."
  },

  {
    id: 84,
    text: "Sebuah rumah sakit menemukan banyak kasus organisme resisten. Audit menunjukkan penggunaan antibiotik berulang, rawat inap lama, dan kepatuhan hand hygiene yang rendah.\n\nInterpretasi paling tepat adalah...",
    options: [
      "Terdapat faktor risiko pasien dan fasilitas yang dapat meningkatkan AMR",
      "AMR hanya dipengaruhi genetika pasien",
      "Hand hygiene tidak berkaitan dengan AMR",
      "Lama rawat tidak berpengaruh",
      "Penggunaan antibiotik berulang justru selalu mencegah resistensi"
    ],
    correctIndex: 0,
    explanation: "Materi menyebut penggunaan antibiotik berulang, hospitalisasi lama, serta buruknya hand hygiene dan IPC sebagai faktor yang meningkatkan risiko AMR."
  },

  {
    id: 85,
    text: "Rumah sakit ingin menekan AMR. Mereka memperbaiki ketepatan diagnosis, penggunaan antibiotik, pencegahan infeksi, dan edukasi.\n\nStrategi tersebut paling tepat karena...",
    options: [
      "Pengendalian AMR membutuhkan stewardship, IPC, diagnosis yang tepat, dan edukasi",
      "AMR cukup ditangani dengan antibiotik generasi baru",
      "AMR hanya masalah laboratorium",
      "Pendidikan masyarakat tidak diperlukan",
      "Isolasi tidak berhubungan dengan penyebaran organisme resisten"
    ],
    correctIndex: 0,
    explanation: "Materi menekankan empat pilar penting: antimicrobial stewardship, infection prevention and control, diagnosis akurat, dan edukasi publik."
  },

  {
    id: 86,
    text: "Sebuah penyakit disebut \"neglected\" bukan karena gejalanya selalu ringan, tetapi karena secara tidak proporsional memengaruhi komunitas miskin, terpencil, dan memiliki sanitasi buruk.\n\nDefinisi yang paling tepat adalah...",
    options: [
      "Penyakit yang pasti tidak menular",
      "Neglected tropical disease",
      "Penyakit yang hanya muncul pada negara tropis",
      "Penyakit yang selalu tanpa gejala",
      "Penyakit yang hanya ditularkan nyamuk"
    ],
    correctIndex: 1,
    explanation: "NTD disebut neglected karena ketimpangan sosial, ekonomi, geografis, sanitasi, dan lemahnya akses serta representasi politik, bukan karena penyakitnya ringan."
  },

  {
    id: 87,
    text: "Materi Indonesia menyebut sekitar puluhan juta penduduk terdampak dan sejumlah penyakit NTD endemik nasional.\n\nPernyataan yang paling tepat adalah...",
    options: [
      "Indonesia bebas dari NTD",
      "Hanya ada satu NTD endemik",
      "Sekitar 80 juta penduduk dan 11 dari 21 jenis NTD global yang tercantum mengalami endemisitas",
      "Semua NTD Indonesia berasal dari hewan",
      "NTD hanya terjadi di perkotaan"
    ],
    correctIndex: 2,
    explanation: "Materi menyebut sekitar 80 juta penduduk Indonesia dan 11 dari 21 tipe NTD global yang tercantum sebagai endemik."
  },

  {
    id: 88,
    text: "Sebuah kabupaten menerima sertifikat eliminasi penyakit tertentu. Pemerintah kemudian menghentikan seluruh surveilans karena menganggap penyakit tersebut sudah tidak mungkin muncul lagi.\n\nPenilaian yang benar adalah...",
    options: [
      "Keputusan tersebut tepat karena eliminasi berarti penghapusan seluruh risiko",
      "Surveilans hanya diperlukan sebelum eliminasi",
      "Setelah eliminasi, surveilans tetap diperlukan",
      "Eliminasi berarti tidak perlu kolaborasi lintas sektor",
      "Sertifikat eliminasi berarti semua faktor risiko hilang"
    ],
    correctIndex: 2,
    explanation: "Materi secara tegas menekankan bahwa eliminasi bukan berarti akhir. Mobilitas, lingkungan, urbanisasi, perubahan iklim, dan kesenjangan akses tetap dapat menjadi ancaman."
  },

  {
    id: 89,
    text: "Sebuah sekolah berada di daerah dengan prevalensi soil-transmitted helminths tinggi. Program yang paling sesuai adalah...",
    options: [
      "Sanitasi, air bersih, cuci tangan, penggunaan jamban, dan deworming berkala",
      "Hanya pembangunan rumah sakit",
      "Vaksinasi influenza sebagai intervensi utama",
      "Pembatasan kegiatan sekolah",
      "Hanya pemberian analgesik"
    ],
    correctIndex: 0,
    explanation: "Pengendalian cacing tanah dalam materi menekankan WASH, sanitasi, kebersihan tangan, jamban, dan pemberian obat cacing berkala di sekolah."
  },

  {
    id: 90,
    text: "Sebuah pemerintah melihat NTD hanya sebagai persoalan angka kasus dan ingin mengabaikan stigma, produktivitas, kemiskinan, serta ketimpangan.\n\nPendekatan yang paling sesuai dengan materi justru adalah...",
    options: [
      "NTD hanya dinilai dengan mortality",
      "NTD hanya berkaitan dengan parasit",
      "Pengendalian NTD harus dipahami sebagai isu health equity sekaligus epidemiologi",
      "Stigma tidak termasuk masalah kesehatan",
      "Faktor sosial tidak relevan"
    ],
    correctIndex: 2,
    explanation: "Materi menekankan bahwa pengendalian NTD merupakan persoalan equity karena berkaitan dengan disabilitas, stigma, produktivitas, biaya keluarga, dan ketimpangan."
  },

  {
    id: 91,
    text: "Petugas melakukan tracing terhadap sumber penyakit dengan urutan: agen, reservoir, portal keluar, cara penularan, portal masuk, kemudian host rentan.\n\nKonsep yang sedang diterapkan adalah...",
    options: [
      "Social gradient",
      "Dependency ratio",
      "Health financing",
      "Five building blocks",
      "Chain of infection"
    ],
    correctIndex: 4,
    explanation: "Materi menyajikan enam mata rantai penularan tersebut dalam chain of infection."
  },

  {
    id: 92,
    text: "Puskesmas mengumpulkan data kasus, menganalisisnya, menafsirkan hasil, lalu menggunakan informasi tersebut untuk menentukan tindakan.\n\nUrutan tersebut menunjukkan fungsi...",
    options: [
      "Rehabilitasi",
      "Surveillance",
      "Financing",
      "Referral",
      "Staffing"
    ],
    correctIndex: 1,
    explanation: "Siklus surveilans dalam materi adalah collect → analyze → interpret → use for action."
  },

  {
    id: 93,
    text: "Pada saat terjadi wabah, petugas menyampaikan informasi secara cepat, jelas, konsisten, berbasis bukti, namun tetap transparan mengenai ketidakpastian.\n\nPrinsip tersebut merupakan...",
    options: [
      "Equity",
      "Primary care",
      "DALY",
      "Risk communication",
      "Dependency ratio"
    ],
    correctIndex: 3,
    explanation: "Risk communication harus cepat, jelas, konsisten, evidence-based, transparan terhadap ketidakpastian, sensitif budaya, serta membantu mengurangi misinformation dan stigma."
  },

  {
    id: 94,
    text: "Suatu penyakit baru atau penyakit lama menunjukkan peningkatan kasus dan penyebaran geografis secara cepat. Pada saat bersamaan, kelompok anak kecil dan lansia menjadi lebih berisiko mengalami penyakit berat.\n\nKarakteristik tersebut paling sesuai dengan pembahasan...",
    options: [
      "UHC",
      "Emerging/re-emerging disease",
      "Social gradient",
      "Disability model",
      "Dependency ratio"
    ],
    correctIndex: 1,
    explanation: "Emerging disease adalah penyakit yang baru muncul atau meningkat cepat dalam kasus/geografi; re-emerging adalah penyakit lama yang kembali meningkat setelah sebelumnya menurun atau terkendali."
  },

  {
    id: 95,
    text: "Sebuah wilayah mengalami peningkatan penyakit yang diduga berhubungan dengan interaksi manusia, hewan, dan perubahan lingkungan. Tim kesehatan menggandeng sektor pertanian dan kesehatan hewan.\n\nPendekatan yang paling tepat adalah...",
    options: [
      "One Health",
      "Equality",
      "DALY",
      "GERMAS",
      "PATUH"
    ],
    correctIndex: 0,
    explanation: "One Health memandang keterkaitan kesehatan manusia, hewan, pangan, dan lingkungan sehingga membutuhkan kolaborasi lintas sektor."
  },

  {
    id: 96,
    text: "Sebuah sistem kesehatan dinilai dari pelayanan, tenaga kesehatan, informasi kesehatan, obat/teknologi, pembiayaan, dan kepemimpinan/tata kelola.\n\nKerangka yang digunakan adalah...",
    options: [
      "Three Delays Model",
      "5A",
      "CERDIK",
      "PATUH",
      "WHO Six Building Blocks"
    ],
    correctIndex: 4,
    explanation: "Enam building blocks WHO adalah service delivery, health workforce, health information, medicines/technology, health financing, serta leadership/governance."
  },

  {
    id: 97,
    text: "Mahasiswa menyamakan primary care dengan primary health care.\n\nPernyataan yang paling tepat untuk membedakan keduanya adalah...",
    options: [
      "Primary care selalu mencakup kebijakan nasional",
      "Primary care cenderung berfokus pada kontak klinis pertama, sedangkan PHC lebih luas sebagai pendekatan sistem dan masyarakat",
      "PHC hanya berupa layanan rumah sakit",
      "Primary care tidak berhubungan dengan individu",
      "Keduanya merupakan istilah yang sepenuhnya identik"
    ],
    correctIndex: 1,
    explanation: "Primary care menekankan layanan klinis kontak pertama, sedangkan PHC lebih luas, mencakup individu, populasi, promotif hingga palliative, kebijakan, multisektor, dan pemberdayaan masyarakat."
  },

  {
    id: 98,
    text: "Sebuah fasilitas tersedia secara fisik, tetapi berada jauh dari rumah pasien. Masyarakat tidak mudah mencapainya karena masalah transportasi.\n\nDimensi akses 5A yang paling bermasalah adalah...",
    options: [
      "Acceptability",
      "Availability",
      "Accessibility",
      "Affordability",
      "Quality"
    ],
    correctIndex: 2,
    explanation: "Accessibility berkaitan dengan kemampuan masyarakat mencapai fasilitas secara fisik."
  },

  {
    id: 99,
    text: "Pemerintah mengevaluasi UHC dengan melihat jumlah penduduk yang tercakup, jenis pelayanan yang efektif tersedia, serta beban biaya yang harus ditanggung.\n\nKerangka tersebut menilai...",
    options: [
      "Workforce, financing, referral",
      "Prevalence, mortality, incidence",
      "Equity, equality, stigma",
      "Primary, secondary, tertiary",
      "Population, service coverage, financial protection"
    ],
    correctIndex: 4,
    explanation: "Tiga dimensi UHC adalah cakupan populasi, cakupan pelayanan, dan perlindungan finansial."
  },

  {
    id: 100,
    text: "Sebanyak 95% penduduk sebuah wilayah telah memiliki jaminan kesehatan. Namun puskesmas sangat jauh, tenaga terbatas, obat sering kosong, dan biaya perjalanan tinggi.\n\nKesimpulan paling tepat adalah...",
    options: [
      "Coverage kartu belum berarti effective UHC telah tercapai",
      "UHC sudah pasti sempurna karena cakupan >90%",
      "Masalah hanya terletak pada kepatuhan pasien",
      "Kualitas pelayanan tidak terkait UHC",
      "Akses geografis tidak termasuk komponen UHC"
    ],
    correctIndex: 0,
    explanation: "Materi menekankan bahwa coverage bukan sekadar kepemilikan kartu. UHC juga membutuhkan ketersediaan layanan, tenaga, obat, akses fisik, mutu, affordability, dan equity."
  },

  // ════════════════════════════════════════════════
  // FALSAFAH & TEORI KEPERAWATAN — 100 SOAL (Index 100-199)
  // ════════════════════════════════════════════════

  {
    id: 101,
    text: "Seorang pasien yang kompeten menolak suatu tindakan karena merasa belum memahami manfaat dan risikonya. Perawat tidak langsung menganggap pasien tidak kooperatif. Ia memastikan kapasitas pasien, menjelaskan informasi yang relevan, lalu mendengarkan alasan pasien sebelum mencari pilihan yang aman.\n\nPendekatan tersebut paling mencerminkan...",
    options: [
      "Reduksi masalah menjadi aspek biologis",
      "Dominasi tenaga kesehatan",
      "Pengabaian keputusan pasien",
      "Penggantian keputusan pasien oleh keluarga",
      "Penghormatan terhadap nilai, otonomi, dan martabat manusia"
    ],
    correctIndex: 4,
    explanation: "Falsafah keperawatan memberi arah nilai dalam tindakan. Dalam kasus ini, keputusan tidak hanya dinilai dari manfaat klinis, tetapi juga dari penghormatan terhadap pasien sebagai manusia."
  },

  {
    id: 102,
    text: "Seorang mahasiswa bertanya, \"Dalam keperawatan, sebenarnya apa hakikat manusia yang menjadi objek perhatian profesi?\" Pertanyaan tersebut terutama termasuk ranah...",
    options: [
      "Aksiologi",
      "Ontologi",
      "Epistemologi",
      "Metodologi",
      "Statistik"
    ],
    correctIndex: 1,
    explanation: "Ontologi membahas apa yang dianggap nyata atau hakikat sesuatu. Pertanyaan tentang hakikat manusia termasuk ontologi."
  },

  {
    id: 103,
    text: "Seorang peneliti keperawatan ingin mengetahui bagaimana pengalaman pasien dapat dianggap sebagai pengetahuan yang dapat dipertanggungjawabkan. Ia membahas riset, pengalaman klinis, refleksi, dan pengetahuan pasien sebagai sumber pengetahuan.\n\nRanah yang sedang dikaji adalah...",
    options: [
      "Ontologi",
      "Aksiologi",
      "Epistemologi",
      "Morfologi",
      "Etnografi"
    ],
    correctIndex: 2,
    explanation: "Epistemologi membahas bagaimana pengetahuan diperoleh, dibenarkan, dan dianggap sah. Karena fokusnya adalah sumber dan validitas pengetahuan, jawabannya epistemologi."
  },

  {
    id: 104,
    text: "Rumah sakit memiliki sumber daya terbatas. Dua pasien membutuhkan layanan yang sama, sehingga perawat harus menentukan prioritas tanpa membedakan pasien berdasarkan status ekonomi atau latar belakang.\n\nPertimbangan utama tersebut paling dekat dengan...",
    options: [
      "Ontologi",
      "Humanisme",
      "Aksiologi",
      "Epistemologi",
      "Fisiologi"
    ],
    correctIndex: 2,
    explanation: "Aksiologi berhubungan dengan nilai dan tujuan tindakan. Nilai keadilan dalam pembagian layanan merupakan contoh penerapan aksiologi."
  },

  {
    id: 105,
    text: "Perawat menyusun pengkajian bukan hanya berdasarkan tekanan darah dan hasil laboratorium, tetapi juga mempertimbangkan ketakutan, hubungan keluarga, keyakinan, kebiasaan, dan kondisi lingkungan pasien.\n\nCara pandang ini menunjukkan bahwa pasien dipahami sebagai...",
    options: [
      "Kumpulan tanda dan gejala",
      "Objek biologis semata",
      "Manusia secara utuh",
      "Diagnosis medis",
      "Hasil pemeriksaan"
    ],
    correctIndex: 2,
    explanation: "Falsafah keperawatan menempatkan manusia sebagai pribadi utuh dengan tubuh, pengalaman, hubungan, harapan, dan lingkungan."
  },

  {
    id: 106,
    text: "Manakah situasi yang paling jelas menunjukkan ranah aksiologi dalam praktik keperawatan?",
    options: [
      "Menentukan apakah manusia merupakan sistem terbuka",
      "Menentukan bagaimana data diperoleh",
      "Mengidentifikasi jenis pengalaman pasien",
      "Memilih tindakan dengan mempertimbangkan keadilan dan tidak merugikan",
      "Mengelompokkan data menurut diagnosis"
    ],
    correctIndex: 3,
    explanation: "Aksiologi berfokus pada nilai, tujuan, dan pertimbangan moral dalam tindakan. Keadilan dan tidak merugikan merupakan nilai yang disebut dalam materi."
  },

  {
    id: 107,
    text: "Seorang dosen mengatakan bahwa sebelum mengukur \"kualitas hidup\", perawat harus memiliki pemahaman mengenai apa yang dimaksud dengan hidup yang berkualitas.\n\nPernyataan tersebut menunjukkan bahwa falsafah berfungsi sebagai...",
    options: [
      "Dasar bagi konsep dan pengukuran dalam ilmu keperawatan",
      "Pengganti penelitian",
      "Pengganti prosedur klinis",
      "Penghapus nilai pasien",
      "Pembatas komunikasi"
    ],
    correctIndex: 0,
    explanation: "Falsafah memberi dasar bagi konsep, teori, penelitian, pendidikan, dan kebijakan. Pengukuran tidak berdiri sendiri karena konsep yang diukur harus memiliki makna."
  },

  {
    id: 108,
    text: "Dalam penelitian mengenai pasien kanker, peneliti menggunakan wawancara mendalam untuk mengetahui bagaimana pasien memaknai sakit yang dialaminya.\n\nSecara epistemologis, data tersebut terutama bermanfaat untuk...",
    options: [
      "Mengukur tekanan darah",
      "Menghitung dosis obat",
      "Menentukan kadar hemoglobin",
      "Mengukur suhu",
      "Memahami pengalaman dan makna sakit"
    ],
    correctIndex: 4,
    explanation: "Data kualitatif digunakan untuk memahami pengalaman dan makna. Data tersebut bukan terutama ditujukan untuk pengukuran kuantitatif."
  },

  {
    id: 109,
    text: "Sebuah teori keperawatan yang dikembangkan dalam konteks negara lain akan diterapkan pada masyarakat Indonesia. Dosen meminta mahasiswa tidak menyalinnya secara mentah, melainkan mempertimbangkan konteks budaya dan bukti yang tersedia.\n\nSikap tersebut paling sesuai dengan prinsip...",
    options: [
      "Menghapus teori lama",
      "Menolak teori asing",
      "Menggunakan teori tanpa perubahan",
      "Menafsirkan teori sesuai konteks budaya dan bukti",
      "Mengutamakan opini pribadi"
    ],
    correctIndex: 3,
    explanation: "Materi menekankan bahwa penerapan teori perlu peka budaya. Teori dapat digunakan, tetapi perlu ditafsirkan dalam konteks masyarakat tempat teori diterapkan."
  },

  {
    id: 110,
    text: "Pasien kompeten mengatakan, \"Saya belum setuju dengan tindakan ini.\" Perawat menjawab, \"Saya akan menjelaskan kembali manfaat, risiko, dan alternatifnya. Setelah itu kita tentukan pilihan yang aman bersama.\"\n\nSikap tersebut terutama menunjukkan...",
    options: [
      "Penghormatan terhadap otonomi pasien",
      "Dominasi perawat",
      "Paternalistik murni",
      "Pengalihan tanggung jawab",
      "Pengabaian keputusan pasien"
    ],
    correctIndex: 0,
    explanation: "Pendekatan yang menghormati otonomi memastikan informasi, mendengarkan alasan pasien, dan merundingkan pilihan yang aman."
  },

  {
    id: 111,
    text: "Menurut materi, falsafah keperawatan terutama berisi keyakinan profesi tentang...",
    options: [
      "Obat, diagnosis, dan laboratorium",
      "Manusia, kesehatan, lingkungan, dan tanggung jawab perawat",
      "Rumah sakit dan dokter",
      "Administrasi keuangan",
      "Teknologi informasi saja"
    ],
    correctIndex: 1,
    explanation: "Empat hal tersebut merupakan inti keyakinan profesi dalam falsafah keperawatan."
  },

  {
    id: 112,
    text: "Seorang mahasiswa menyimpulkan bahwa falsafah keperawatan hanya berkaitan dengan \"pendapat pribadi\".\n\nPernyataan mana yang paling tepat untuk membantah kesimpulan tersebut?",
    options: [
      "Falsafah tidak berkaitan dengan praktik",
      "Falsafah hanya digunakan dalam filsafat umum",
      "Falsafah dapat bersifat pribadi, institusional, maupun disipliner",
      "Falsafah hanya digunakan untuk penelitian",
      "Falsafah tidak berhubungan dengan nilai"
    ],
    correctIndex: 2,
    explanation: "Materi menyebutkan bahwa falsafah dapat bersifat pribadi, institusional, maupun disipliner. Jadi ruang lingkupnya lebih luas daripada opini pribadi."
  },

  {
    id: 113,
    text: "Dalam materi, ilmu dipahami memiliki unsur proses, produk, dan metode. Contoh yang paling tepat untuk menggambarkan metode adalah...",
    options: [
      "Hasil pengetahuan yang telah ditemukan",
      "Pengalaman pribadi perawat",
      "Kumpulan fakta yang tersimpan",
      "Langkah-langkah sistematis yang digunakan untuk memperoleh pengetahuan",
      "Keyakinan individu"
    ],
    correctIndex: 3,
    explanation: "Metode merupakan tata cara, teknik, dan prosedur yang dirancang secara sistematis dalam proses pengembangan pengetahuan."
  },

  {
    id: 114,
    text: "Keperawatan disebut sebagai ilmu aplikasi karena...",
    options: [
      "Hanya berisi teori abstrak",
      "Tidak menggunakan ilmu lain",
      "Hanya berhubungan dengan laboratorium",
      "Hanya berfokus pada penyakit",
      "Ilmu tersebut digunakan untuk membantu manusia melalui praktik profesional"
    ],
    correctIndex: 4,
    explanation: "Materi menempatkan keperawatan sebagai ilmu aplikasi yang berfokus pada menolong orang lain dan diwujudkan dalam praktik."
  },

  {
    id: 115,
    text: "Setelah memberikan tindakan, seorang perawat mengevaluasi dirinya: \"Apakah tindakan saya sudah sesuai dengan martabat pasien? Apakah saya terlalu memaksakan keputusan?\"\n\nAktivitas ini paling tepat dipahami sebagai...",
    options: [
      "Pengukuran efektivitas obat",
      "Pengumpulan data epidemiologi",
      "Penghitungan kebutuhan tenaga",
      "Pemeriksaan laboratorium",
      "Refleksi filosofis terhadap nilai dan makna praktik"
    ],
    correctIndex: 4,
    explanation: "Refleksi filosofis membantu perawat menilai apakah keterampilan klinis digunakan secara manusiawi dan etis."
  },

  {
    id: 116,
    text: "Ketika perawat menggunakan suatu kerangka berpikir untuk menentukan data apa yang penting, pertanyaan apa yang perlu diajukan, serta bagaimana data ditafsirkan, perawat sedang menggunakan...",
    options: [
      "Diagnosis medis",
      "Prosedur standar",
      "Teori tunggal",
      "Paradigma",
      "Checklist"
    ],
    correctIndex: 3,
    explanation: "Paradigma berfungsi seperti lensa yang menentukan apa yang terlihat penting, pertanyaan yang diajukan, dan cara data dipahami."
  },

  {
    id: 117,
    text: "Dalam metaparadigma keperawatan, empat konsep utama yang menjadi payung berbagai teori adalah...",
    options: [
      "Dokter, obat, rumah sakit, pasien",
      "Diagnosis, terapi, biaya, pulang",
      "Individu, obat, keluarga, penyakit",
      "Fisik, psikologis, sosial, spiritual",
      "Manusia, kesehatan, lingkungan, keperawatan"
    ],
    correctIndex: 4,
    explanation: "Empat metaparadigma adalah manusia, kesehatan, lingkungan, dan keperawatan."
  },

  {
    id: 118,
    text: "Seorang pasien hipertensi tetap mampu bekerja, berinteraksi dengan keluarga, dan memiliki hidup bermakna walaupun penyakitnya bersifat kronis.\n\nDalam pandangan kesehatan yang luas, situasi tersebut menunjukkan...",
    options: [
      "Kesehatan tidak selalu identik dengan bebas penyakit",
      "Pasien sebenarnya tidak sakit",
      "Penyakit kronis selalu berarti tidak sehat",
      "Kesehatan hanya ditentukan laboratorium",
      "Pasien harus sembuh total lebih dahulu"
    ],
    correctIndex: 0,
    explanation: "Dalam paradigma keperawatan, kesehatan dapat dipahami sebagai kemampuan berfungsi, beradaptasi, merasa sejahtera, dan menjalani hidup bermakna meski terdapat penyakit kronis."
  },

  {
    id: 119,
    text: "Seorang petani mengalami keluhan setelah bekerja di sawah. Dalam perspektif metaparadigma lingkungan, data yang paling tepat diprioritaskan adalah...",
    options: [
      "Warna pakaian",
      "Jumlah anggota keluarga saja",
      "Golongan darah",
      "Tinggi badan",
      "Paparan lingkungan kerja yang relevan terhadap kesehatan"
    ],
    correctIndex: 4,
    explanation: "Lingkungan dapat berupa fisik, sosial, budaya, ekonomi, bahkan kondisi kerja. Faktor lingkungan yang relevan terhadap kesehatan perlu dikaji."
  },

  {
    id: 120,
    text: "Seorang perawat menganggap pasien sebagai sistem terbuka yang terus menerima pengaruh sekaligus memengaruhi lingkungan.\n\nPandangan tersebut sesuai dengan konsep manusia sebagai...",
    options: [
      "Sistem terbuka",
      "Objek pasif",
      "Organ biologis",
      "Sistem tertutup",
      "Diagnosis"
    ],
    correctIndex: 0,
    explanation: "Materi paradigma secara eksplisit menjelaskan manusia sebagai sistem terbuka yang memengaruhi dan dipengaruhi oleh lingkungan."
  },

  {
    id: 121,
    text: "Pasien yang sama mengalami perubahan perilaku setelah lingkungan rumahnya berubah.\n\nPerubahan tersebut menunjukkan karakteristik manusia sebagai...",
    options: [
      "Sistem tertutup",
      "Objek statis",
      "Struktur anatomi",
      "Sistem adaptif",
      "Prosedur"
    ],
    correctIndex: 3,
    explanation: "Sistem adaptif merespons perubahan yang terjadi pada lingkungan atau kondisi sekitarnya."
  },

  {
    id: 122,
    text: "Sebuah penelitian ingin mengetahui bagaimana pasien memaknai pengalaman menjalani hemodialisis. Peneliti tidak terutama mengejar angka generalisasi, tetapi berusaha memahami pengalaman subjektif pasien.\n\nParadigma yang paling sesuai adalah...",
    options: [
      "Interpretif",
      "Positivistik",
      "Administratif",
      "Kritis",
      "Eksperimental murni"
    ],
    correctIndex: 0,
    explanation: "Paradigma interpretif menekankan makna pengalaman. Sebaliknya, positivistik lebih menekankan pengukuran dan sebab-akibat."
  },

  {
    id: 123,
    text: "Peneliti lain ingin mengetahui hubungan antara suatu faktor dan kejadian tertentu dengan menggunakan pengukuran yang dapat digeneralisasi.\n\nOrientasi tersebut paling dekat dengan paradigma...",
    options: [
      "Interpretif",
      "Humanistik",
      "Pragmatis",
      "Positivistik",
      "Spiritual"
    ],
    correctIndex: 3,
    explanation: "Positivistik menekankan pengukuran, hubungan sebab-akibat, dan generalisasi."
  },

  {
    id: 124,
    text: "Jika seorang peneliti mempertanyakan ketimpangan akses layanan kesehatan serta relasi kekuasaan yang membuat sebagian kelompok lebih dirugikan, paradigma yang paling sesuai adalah...",
    options: [
      "Positivistik",
      "Interpretif",
      "Pragmatis",
      "Biomedis",
      "Kritis"
    ],
    correctIndex: 4,
    explanation: "Paradigma kritis digunakan untuk menilai kekuasaan, ketidakadilan, dan kondisi yang menghasilkan ketimpangan."
  },

  {
    id: 125,
    text: "Seorang perawat mengumpulkan data fisik lengkap, tetapi tidak mengkaji pengalaman pasien, relasi keluarga, ataupun kondisi lingkungan.\n\nKelemahan utama pendekatan tersebut adalah...",
    options: [
      "Terlalu banyak data",
      "Terlalu menekankan budaya",
      "Pengkajian menjadi terlalu sempit",
      "Terlalu berorientasi sosial",
      "Terlalu banyak memperhatikan pasien"
    ],
    correctIndex: 2,
    explanation: "Paradigma dapat memperluas pengkajian. Pendekatan yang terlalu sempit berisiko melewatkan faktor penting bagi respons manusia."
  },

  {
    id: 126,
    text: "Perawat menemukan pasien tinggal di dekat kawasan industri. Ia tidak langsung menyimpulkan bahwa lingkungan tersebut pasti menjadi penyebab penyakit. Langkah berikutnya adalah mengkaji paparan lingkungan yang relevan terhadap kondisi pasien.\n\nHal ini menunjukkan fungsi paradigma sebagai...",
    options: [
      "Alat mengganti diagnosis",
      "Pengganti tindakan",
      "Penentu obat",
      "Penghapus data",
      "Landasan memilih masalah dan data yang relevan"
    ],
    correctIndex: 4,
    explanation: "Paradigma membantu menentukan apa yang harus dilihat dan dikaji tanpa membuat kesimpulan secara sembarangan."
  },

  {
    id: 127,
    text: "Ketika paradigma digunakan dalam penelitian, salah satu pengaruhnya adalah...",
    options: [
      "Menjamin hasil selalu benar",
      "Menghapus seluruh bias",
      "Menentukan pertanyaan dan cara menafsirkan data",
      "Menentukan sponsor penelitian",
      "Menggantikan etika penelitian"
    ],
    correctIndex: 2,
    explanation: "Paradigma memengaruhi pertanyaan penelitian, metode, dan interpretasi hasil."
  },

  {
    id: 128,
    text: "Seorang perawat memandang kesehatan pasien sebagai kombinasi kemampuan beradaptasi, merasa nyaman, menjalankan peran, dan memiliki kesejahteraan.\n\nPandangan tersebut menunjukkan pemahaman kesehatan yang...",
    options: [
      "Sempit",
      "Hanya biologis",
      "Hanya psikologis",
      "Hanya bebas penyakit",
      "Multidimensional"
    ],
    correctIndex: 4,
    explanation: "Dalam paradigma keperawatan, kesehatan memiliki banyak bentuk dan tidak terbatas pada tidak adanya penyakit."
  },

  {
    id: 129,
    text: "Ketika perawat menggabungkan aspek biologis, psikologis, sosial, budaya, dan lingkungan dalam pengkajian, tujuan utama penggunaan paradigma tersebut adalah...",
    options: [
      "Menambah data tanpa tujuan",
      "Menyulitkan proses pengkajian",
      "Menghapus fokus klinis",
      "Menggantikan semua teori",
      "Memperoleh pemahaman fenomena secara lebih bermakna"
    ],
    correctIndex: 4,
    explanation: "Paradigma membantu menyatukan data yang beragam sehingga tidak menjadi sekadar daftar fakta yang terpisah."
  },

  {
    id: 130,
    text: "Pasien dilibatkan dalam penentuan target pemulihan. Perawat tidak hanya menentukan angka laboratorium yang harus dicapai, tetapi bertanya, \"Apa yang ingin Bapak bisa lakukan kembali setelah pulang?\"\n\nPendekatan ini paling dekat dengan...",
    options: [
      "Pelayanan berpusat pada tenaga kesehatan",
      "Biomedis murni",
      "Person-centred",
      "Keputusan sepihak",
      "Pengkajian fisik semata"
    ],
    correctIndex: 2,
    explanation: "Pendekatan person-centred menempatkan tujuan dan nilai pasien sebagai bagian penting dalam penetapan sasaran perawatan."
  },

  {
    id: 131,
    text: "Seorang pasien mengalami penurunan kondisi fisik sekaligus menjadi cemas dan menarik diri dari keluarga.\n\nPerawat memahami bahwa perubahan fisik dapat berdampak pada emosi dan hubungan sosial. Cara berpikir tersebut paling tepat disebut...",
    options: [
      "Reduksionisme",
      "Fragmentasi",
      "Mekanisme",
      "Holisme",
      "Spesialisasi"
    ],
    correctIndex: 3,
    explanation: "Holisme memandang manusia sebagai satu kesatuan, sehingga perubahan satu dimensi dapat memengaruhi dimensi lainnya."
  },

  {
    id: 132,
    text: "Dalam konsep holisme, manusia dipandang sebagai...",
    options: [
      "Satu kesatuan utuh dengan berbagai dimensi yang saling terhubung",
      "Sekumpulan organ yang berdiri sendiri",
      "Diagnosis yang harus dikoreksi",
      "Objek biologis",
      "Penerima tindakan pasif"
    ],
    correctIndex: 0,
    explanation: "Holisme menempatkan manusia sebagai whole person. Dimensi fisik, psikologis, sosial, budaya, spiritual, dan lingkungan saling berkaitan."
  },

  {
    id: 133,
    text: "Seorang perawat bertanya kepada pasien, \"Apa yang paling penting bagi Anda selama menjalani perawatan?\"\n\nPertanyaan tersebut paling sesuai dengan prinsip...",
    options: [
      "Kemitraan dan penetapan prioritas bersama",
      "Dominasi profesional",
      "Pengkajian tertutup",
      "Pembatasan data",
      "Keputusan sepihak"
    ],
    correctIndex: 0,
    explanation: "Materi menekankan dialog terbuka untuk mengetahui prioritas pasien sehingga tujuan dapat ditetapkan secara bersama."
  },

  {
    id: 134,
    text: "Manakah tindakan yang paling mencerminkan humanisme dalam praktik?",
    options: [
      "Mengutamakan prosedur walaupun pasien takut",
      "Hanya mengikuti hasil laboratorium",
      "Memutuskan semua tindakan sendiri",
      "Menyamakan semua pasien tanpa konteks",
      "Menghormati martabat, kebebasan, pilihan, dan pengalaman pasien"
    ],
    correctIndex: 4,
    explanation: "Humanisme menempatkan manusia sebagai individu yang memiliki nilai, martabat, kebebasan, dan kemampuan berkembang."
  },

  {
    id: 135,
    text: "Seorang perawat akan melakukan tindakan pada pasien lansia. Sebelum membuka area tubuh pasien, ia menjelaskan tindakan dan meminta izin. Ia juga menjaga agar area yang tidak diperlukan tetap tertutup.\n\nPrinsip humanisme yang paling menonjol adalah...",
    options: [
      "Efisiensi",
      "Produktivitas",
      "Generalisasi",
      "Martabat manusia",
      "Reduksi"
    ],
    correctIndex: 3,
    explanation: "Menjaga privasi dan meminta izin merupakan bentuk penghormatan terhadap martabat pasien."
  },

  {
    id: 136,
    text: "Seorang pasien merasa takut menghadapi diagnosis baru. Perawat tidak hanya berkata \"jangan takut\", tetapi mendengarkan pengalaman pasien dan mencoba memahami perasaan yang muncul.\n\nTindakan tersebut terutama menunjukkan...",
    options: [
      "Otonomi",
      "Individualitas",
      "Empati dan caring",
      "Efisiensi",
      "Kontrol"
    ],
    correctIndex: 2,
    explanation: "Empati dan caring berarti berusaha memahami pengalaman pasien serta menunjukkan kepedulian nyata."
  },

  {
    id: 137,
    text: "Pasien mengatakan, \"Saya ingin tetap beribadah meski sedang dirawat.\"\n\nRespons perawat yang paling sesuai pendekatan holistik adalah...",
    options: [
      "Mengkaji kebutuhan spiritual dan mendukung sesuai keyakinan pasien",
      "Mengatakan masalah spiritual bukan bagian keperawatan",
      "Mengganti keyakinan pasien",
      "Melarang karena tidak relevan",
      "Meminta pasien tidak membahas agama"
    ],
    correctIndex: 0,
    explanation: "Dimensi spiritual mencakup keyakinan, makna, tujuan, harapan, dan sumber kekuatan pasien."
  },

  {
    id: 138,
    text: "Seorang perawat memilih intervensi komplementer karena sedang populer di media sosial.\n\nKesalahan utama keputusan tersebut adalah...",
    options: [
      "Intervensi terlalu sederhana",
      "Pasien terlalu banyak dilibatkan",
      "Biaya terlalu rendah",
      "Tidak menggunakan teknologi",
      "Pemilihan tidak didasarkan pada bukti, risiko, kompetensi, dan preferensi pasien"
    ],
    correctIndex: 4,
    explanation: "Terapi komplementer tidak dipilih hanya karena popularitas. Keselamatan, bukti, kompetensi, dan preferensi harus dipertimbangkan."
  },

  {
    id: 139,
    text: "Pasien menggunakan obat resep sekaligus jamu.\n\nPerawat paling tepat...",
    options: [
      "Mengkaji jenis, penggunaan, manfaat, risiko, dan kemungkinan interaksi",
      "Langsung melarang seluruh jamu",
      "Menjamin semuanya aman",
      "Mengabaikan informasi tersebut",
      "Mengganti obat resep dengan jamu"
    ],
    correctIndex: 0,
    explanation: "Pendekatan holistik tidak berarti menerima semua terapi begitu saja. Perawat tetap mempertahankan keselamatan dan penilaian berbasis bukti."
  },

  {
    id: 140,
    text: "Dimensi spiritual dalam holistic care terutama berkaitan dengan...",
    options: [
      "Keyakinan, makna hidup, tujuan, harapan, dan sumber kekuatan",
      "Tekanan darah dan nadi",
      "Hubungan kerja",
      "Pendapatan keluarga",
      "Kualitas udara"
    ],
    correctIndex: 0,
    explanation: "Spiritual tidak sekadar kegiatan agama formal, tetapi juga makna, harapan, tujuan, dan sumber kekuatan seseorang."
  },

  {
    id: 141,
    text: "Manakah yang paling tepat menggambarkan perbedaan holisme dan humanisme?",
    options: [
      "Holisme hanya membahas spiritual; humanisme hanya membahas fisik",
      "Keduanya berarti hal yang sama",
      "Holisme menilai obat, humanisme menilai diagnosis",
      "Holisme hanya digunakan dokter",
      "Holisme membantu memahami manusia secara menyeluruh, sedangkan humanisme menekankan cara memperlakukan manusia secara bermartabat"
    ],
    correctIndex: 4,
    explanation: "Holisme terutama menjawab bagaimana memahami keseluruhan manusia, sedangkan humanisme menekankan nilai dan cara memperlakukan manusia."
  },

  {
    id: 142,
    text: "Pasien kanker mengalami nyeri, kecemasan, masalah hubungan keluarga, dan kehilangan harapan.\n\nPerawat mengkaji seluruh aspek tersebut kemudian berkolaborasi dengan tenaga terkait. Hal ini paling tepat menggambarkan...",
    options: [
      "Fokus diagnosis medis",
      "Holistik-humanistik",
      "Reduksionisme",
      "Pengobatan alternatif saja",
      "Fragmentasi pelayanan"
    ],
    correctIndex: 1,
    explanation: "Pengkajian menyeluruh dan kolaborasi menunjukkan pendekatan holistik. Cara memperlakukan pasien sebagai manusia yang memiliki pengalaman dan harapan menunjukkan humanisme."
  },

  {
    id: 143,
    text: "Dalam konsep holistic care, dimensi yang mencakup keluarga, jaringan sosial, ekonomi, dan akses layanan adalah...",
    options: [
      "Fisik",
      "Psikologis",
      "Sosial",
      "Spiritual",
      "Biologis"
    ],
    correctIndex: 2,
    explanation: "Dukungan keluarga, relasi, ekonomi, pekerjaan, dan akses layanan termasuk dimensi sosial."
  },

  {
    id: 144,
    text: "Seorang perawat mengetahui bahwa kebutuhan pasien melebihi kompetensi yang dimilikinya.\n\nSikap paling sesuai pendekatan holistik adalah...",
    options: [
      "Berkolaborasi atau merujuk kepada tenaga yang sesuai",
      "Memaksakan diri menangani semua",
      "Mengabaikan kebutuhan",
      "Menghentikan seluruh asuhan",
      "Menyerahkan pasien tanpa koordinasi"
    ],
    correctIndex: 0,
    explanation: "Holistic care memungkinkan kolaborasi dengan berbagai tenaga kesehatan karena kebutuhan manusia tidak selalu dapat ditangani satu profesi."
  },

  {
    id: 145,
    text: "Dalam konteks humanisme, \"individualitas pasien\" berarti...",
    options: [
      "Semua pasien harus diperlakukan persis sama",
      "Setiap pasien memiliki nilai, pengalaman, kebutuhan, dan latar belakang yang dapat berbeda",
      "Pasien bebas menentukan semua tindakan tanpa informasi",
      "Perawat tidak boleh memberikan rekomendasi",
      "Keluarga tidak perlu dilibatkan"
    ],
    correctIndex: 1,
    explanation: "Individualitas berarti menghargai perbedaan nilai, budaya, pengalaman, dan kebutuhan setiap pasien."
  },

  {
    id: 146,
    text: "Seorang pasien meminta keluarga dilibatkan dalam perawatan karena menurutnya keputusan kesehatan selalu dibicarakan bersama keluarga.\n\nPerawat tidak langsung menganggap pasien tidak mandiri. Ia mencari bentuk dukungan yang tetap mempertahankan pilihan pasien.\n\nPendekatan ini sesuai dengan...",
    options: [
      "Humanisme dan patient-centred care",
      "Dominasi keluarga",
      "Penghapusan otonomi",
      "Keputusan sepihak",
      "Paternalistik"
    ],
    correctIndex: 0,
    explanation: "Pendekatan humanistik menghargai pilihan pasien. Dalam konteks budaya, dukungan keluarga tidak otomatis berarti hilangnya otonomi."
  },

  {
    id: 147,
    text: "Tujuan akhir holistic care yang paling sesuai dengan materi adalah...",
    options: [
      "Memastikan pasien tidak pernah menggunakan obat",
      "Membuat semua pasien mandiri total",
      "Mencapai pelayanan yang menyeluruh, bermakna, dan berpusat pada pasien",
      "Menghilangkan seluruh masalah hidup pasien",
      "Memprioritaskan penyakit di atas pengalaman manusia"
    ],
    correctIndex: 2,
    explanation: "Tujuan holistic care adalah pelayanan yang komprehensif, bermakna, berpusat pada pasien, serta meningkatkan kualitas hidup dan kesejahteraan."
  },

  {
    id: 148,
    text: "Sekumpulan konsep dan proposisi yang memberikan pandangan sistematis terhadap suatu fenomena disebut...",
    options: [
      "Diagnosis",
      "Protokol",
      "Teori",
      "Prosedur",
      "Checklist"
    ],
    correctIndex: 2,
    explanation: "Teori merupakan susunan konsep dan proposisi yang memberikan pandangan sistematis terhadap fenomena tertentu."
  },

  {
    id: 149,
    text: "Seorang mahasiswa mengatakan bahwa \"adaptasi\" merupakan contoh gagasan yang mewakili suatu fenomena, sedangkan hubungan antara \"dukungan\" dan \"kepatuhan\" merupakan hubungan yang dijelaskan dalam teori.\n\nUrutan konsep tersebut adalah...",
    options: [
      "Teori dan model",
      "Asumsi dan konsep",
      "Model dan teori",
      "Definisi dan instrumen",
      "Konsep dan proposisi"
    ],
    correctIndex: 4,
    explanation: "Konsep merupakan gagasan seperti adaptasi. Proposisi menjelaskan hubungan antarkonsep."
  },

  {
    id: 150,
    text: "Pernyataan dasar yang diterima sebagai titik awal dalam suatu teori disebut...",
    options: [
      "Konsep",
      "Variabel",
      "Asumsi",
      "Indikator",
      "Hipotesis"
    ],
    correctIndex: 2,
    explanation: "Asumsi merupakan pernyataan dasar yang diterima sebagai titik awal dalam pengembangan teori."
  },

  {
    id: 151,
    text: "Sebuah model konseptual memperlihatkan domain luas dan hubungan umum antar gagasan, sedangkan teori memberikan penjelasan yang lebih terperinci tentang hubungan antarkonsep.\n\nKesimpulan yang paling tepat adalah...",
    options: [
      "Model selalu lebih spesifik daripada teori",
      "Model dan teori sama",
      "Teori lebih spesifik dalam menjelaskan hubungan antarkonsep",
      "Teori tidak membutuhkan konsep",
      "Model tidak memiliki hubungan dengan teori"
    ],
    correctIndex: 2,
    explanation: "Materi membedakan model sebagai gambaran hubungan konsep secara umum, sementara teori menjelaskan hubungan dengan lebih spesifik."
  },

  {
    id: 152,
    text: "Seorang perawat memilih teori hanya karena teori tersebut paling terkenal.\n\nDosen menilai dasar pemilihannya lemah karena seharusnya teori dipilih berdasarkan...",
    options: [
      "Jumlah halaman buku",
      "Negara asal teori",
      "Popularitas tokoh",
      "Tahun teori ditemukan",
      "Kesesuaian teori dengan fenomena, tujuan, populasi, dan konteks"
    ],
    correctIndex: 4,
    explanation: "Pemilihan teori harus logis dan sesuai masalah yang dihadapi, bukan sekadar berdasarkan popularitas."
  },

  {
    id: 153,
    text: "Teori dengan cakupan luas dan tingkat abstraksi tinggi disebut...",
    options: [
      "Practice theory",
      "Checklist",
      "Middle-range theory",
      "Grand theory",
      "Protokol"
    ],
    correctIndex: 3,
    explanation: "Grand theory memiliki cakupan luas dan tingkat abstraksi tinggi."
  },

  {
    id: 154,
    text: "Teori yang lebih konkret, memiliki fokus lebih terbatas, dan lebih dekat dengan praktik disebut...",
    options: [
      "Middle-range theory",
      "Grand theory",
      "Metatheory",
      "Filsafat",
      "Paradigma"
    ],
    correctIndex: 0,
    explanation: "Middle-range theory memiliki cakupan lebih sempit, konsep lebih konkret, dan lebih dekat dengan praktik serta dapat diuji."
  },

  {
    id: 155,
    text: "Sebuah teori digunakan hanya pada kelompok tertentu dan situasi yang sangat spesifik, misalnya proses edukasi untuk meningkatkan kepatuhan pada konteks tertentu.\n\nTingkatan teori tersebut adalah...",
    options: [
      "Grand theory",
      "Middle-range theory",
      "Metaparadigma",
      "Practice theory",
      "Paradigma"
    ],
    correctIndex: 3,
    explanation: "Practice theory sangat spesifik dan dekat dengan proses klinis atau kelompok serta situasi tertentu."
  },

  {
    id: 156,
    text: "Seorang perawat mengubah konsep abstrak \"kenyamanan\" menjadi indikator fisik, psikospiritual, sosiokultural, dan lingkungan yang dapat dinilai.\n\nProses tersebut disebut...",
    options: [
      "Randomisasi",
      "Generalisasi",
      "Terminasi",
      "Validasi",
      "Operasionalisasi"
    ],
    correctIndex: 4,
    explanation: "Operasionalisasi menghubungkan konsep abstrak dengan indikator yang dapat dikaji atau diukur."
  },

  {
    id: 157,
    text: "Ketika suatu teori diuji dalam penelitian dan hasil penelitian dapat mendukung, memodifikasi, atau mengkritik teori tersebut, kondisi ini menunjukkan hubungan antara...",
    options: [
      "Diagnosis dan obat",
      "Teori dan perkembangan ilmu",
      "Teori dan administrasi",
      "Teori dan politik",
      "Teori dan prosedur manual"
    ],
    correctIndex: 1,
    explanation: "Teori dan penelitian bekerja dalam siklus pengembangan pengetahuan. Penelitian dapat memperkuat atau memodifikasi teori."
  },

  {
    id: 158,
    text: "Seorang dosen bertanya, \"Apa hubungan antara variabel A dan B dalam teori ini?\"\n\nBagian teori yang paling mungkin sedang diminta adalah...",
    options: [
      "Definisi operasional",
      "Populasi",
      "Proposisi",
      "Instrumen",
      "Sampel"
    ],
    correctIndex: 2,
    explanation: "Proposisi menjelaskan hubungan antarkonsep dalam suatu teori."
  },

  {
    id: 159,
    text: "Perawat menggabungkan dua teori untuk menangani pasien, tetapi tidak menjelaskan mengapa konsep dari kedua teori dapat dihubungkan.\n\nMasalah utama dalam penerapan tersebut adalah...",
    options: [
      "Teori terlalu lama",
      "Teori terlalu modern",
      "Pasien terlalu kompleks",
      "Tidak ada logika hubungan yang jelas",
      "Terlalu banyak data biologis"
    ],
    correctIndex: 3,
    explanation: "Dua teori dapat digunakan bersama, tetapi hubungan antar konsep dan alasan penggabungannya harus logis."
  },

  {
    id: 160,
    text: "Seorang pasien dirawat menggunakan pendekatan hubungan interpersonal. Pada awal pertemuan, perawat membantu pasien mengenali masalah dan mencari bantuan profesional.\n\nFase yang paling sesuai adalah...",
    options: [
      "Eksploitasi",
      "Resolusi",
      "Orientasi",
      "Terminasi",
      "Identifikasi"
    ],
    correctIndex: 2,
    explanation: "Dalam contoh UTS pada materi, fase orientasi menggambarkan pasien mulai dibantu mengenali masalah dan mencari bantuan perawat."
  },

  {
    id: 161,
    text: "Pada teori interpersonal Peplau, perawat dan pasien melewati rangkaian fase.\n\nUrutan empat fase yang dikenal dalam materi adalah...",
    options: [
      "Orientasi - identifikasi - eksploitasi - resolusi",
      "Identifikasi - orientasi - resolusi - eksploitasi",
      "Eksploitasi - orientasi - identifikasi - resolusi",
      "Orientasi - resolusi - identifikasi - eksploitasi",
      "Resolusi - eksploitasi - identifikasi - orientasi"
    ],
    correctIndex: 0,
    explanation: "Urutan fase yang dicantumkan dalam contoh materi adalah orientasi, identifikasi, eksploitasi, dan resolusi."
  },

  {
    id: 162,
    text: "Perawat yang menerapkan pendekatan The Philosophy and Sciences of Caring paling menekankan...",
    options: [
      "Tindakan teknis tanpa hubungan",
      "Hubungan kepedulian yang melibatkan aspek interpersonal dan transpersonal",
      "Pengurangan komunikasi",
      "Diagnosis medis",
      "Kontrol pasien"
    ],
    correctIndex: 1,
    explanation: "Materi UTS mengaitkan teori Watson dengan caring dan aspek interpersonal-transpersonal."
  },

  {
    id: 163,
    text: "Florence Nightingale paling dikenal dalam perkembangan keperawatan modern terutama karena...",
    options: [
      "Menghapus seluruh pengaruh lingkungan",
      "Menggabungkan perawatan, lingkungan, kebersihan, data, dan reformasi sistem",
      "Menciptakan teori komunikasi",
      "Menolak statistik",
      "Hanya mengembangkan obat"
    ],
    correctIndex: 1,
    explanation: "Materi menekankan kontribusi Nightingale dalam lingkungan, sanitasi, organisasi, dokumentasi, statistik, pendidikan, dan reformasi rumah sakit."
  },

  {
    id: 164,
    text: "Dalam kisah Nightingale, salah satu keadaan yang memprihatinkan di rumah sakit masa itu adalah...",
    options: [
      "Rumah sakit bersih tetapi kekurangan dokter",
      "Terlalu banyak teknologi",
      "Terlalu banyak penelitian",
      "Rumah sakit kotor dan dikelola dengan buruk",
      "Pasien terlalu mandiri"
    ],
    correctIndex: 3,
    explanation: "PPT Nightingale menampilkan kondisi rumah sakit yang kotor, pengelolaan buruk, dan keperawatan yang belum terorganisasi dengan baik."
  },

  {
    id: 165,
    text: "Nightingale memandang lingkungan sebagai sesuatu yang dapat...",
    options: [
      "Diabaikan jika obat tersedia",
      "Dipertahankan tanpa perubahan",
      "Hanya menjadi faktor sosial",
      "Membantu atau menghambat proses penyembuhan",
      "Hanya relevan dalam perang"
    ],
    correctIndex: 3,
    explanation: "Inti teori lingkungan Nightingale adalah bahwa lingkungan dapat mendukung maupun menghambat pemulihan pasien."
  },

  {
    id: 166,
    text: "Pasien mengeluh sulit tidur karena ruangan sangat bising dan pencahayaan berlebihan.\n\nTindakan yang paling sesuai prinsip Nightingale adalah...",
    options: [
      "Mengurangi kebisingan dan cahaya yang tidak diperlukan",
      "Menambah alat di sekitar pasien",
      "Membatasi udara masuk",
      "Menambah jumlah pengunjung",
      "Mengabaikan kondisi ruangan"
    ],
    correctIndex: 0,
    explanation: "Ketenangan, pencahayaan yang sesuai, dan lingkungan yang mendukung tidur merupakan bagian penting dari pengelolaan lingkungan."
  },

  {
    id: 167,
    text: "Manakah yang termasuk unsur lingkungan yang ditekankan Nightingale?",
    options: [
      "Hanya tempat tidur",
      "Hanya obat",
      "Udara bersih, air, cahaya, kebersihan, ketenangan, drainase, dan nutrisi",
      "Hanya pemeriksaan laboratorium",
      "Hanya komunikasi"
    ],
    correctIndex: 2,
    explanation: "Materi menyebut berbagai elemen lingkungan yang harus diperhatikan untuk mendukung proses penyembuhan."
  },

  {
    id: 168,
    text: "Dalam PPT Nightingale, konsep lingkungan utama dijelaskan dalam sejumlah subkonsep, antara lain ventilasi, pencahayaan, kebersihan, pengamatan pasien, makanan, dan...",
    options: [
      "Diagnosis genetik",
      "Terapi radiasi",
      "Noise",
      "Farmakologi",
      "Ventilator mekanik"
    ],
    correctIndex: 2,
    explanation: "PPT mencantumkan noise sebagai salah satu subkonsep lingkungan Nightingale."
  },

  {
    id: 169,
    text: "Seorang perawat melakukan pencatatan perubahan kondisi lingkungan dan kondisi pasien, kemudian menggunakan pola data tersebut untuk mengambil tindakan.\n\nHal ini terutama menunjukkan pentingnya...",
    options: [
      "Intuisi",
      "Observasi dan dokumentasi",
      "Opini keluarga",
      "Popularitas",
      "Promosi"
    ],
    correctIndex: 1,
    explanation: "Nightingale menekankan observasi, pencatatan, dan penggunaan data sebagai dasar tindakan keperawatan."
  },

  {
    id: 170,
    text: "Kontribusi Nightingale terhadap kebijakan kesehatan semakin kuat karena ia menggunakan...",
    options: [
      "Rumor",
      "Data dan statistik",
      "Tradisi semata",
      "Keputusan keluarga",
      "Iklan"
    ],
    correctIndex: 1,
    explanation: "Statistik digunakan sebagai alat advokasi untuk memengaruhi kebijakan dan menunjukkan pentingnya reformasi lingkungan."
  },

  {
    id: 171,
    text: "Di daerah pertanian, perawat menemukan pekerja terpapar panas, pestisida, debu, alat tajam, dan kurang akses air.\n\nBerdasarkan prinsip Nightingale, fokus utamanya adalah...",
    options: [
      "Mengganti pekerjaan pasien",
      "Memberikan obat tanpa mengubah lingkungan",
      "Mengidentifikasi dan memodifikasi faktor lingkungan yang dapat dikelola",
      "Mengabaikan kondisi kerja",
      "Fokus pada genetika"
    ],
    correctIndex: 2,
    explanation: "Materi agronursing mengembangkan prinsip lingkungan Nightingale ke kondisi kerja pertanian, termasuk panas, pestisida, debu, alat kerja, posisi, dan akses air."
  },

  {
    id: 172,
    text: "Rumah pasien memiliki ventilasi buruk. Keluarga tidak memiliki dana untuk renovasi besar.\n\nTindakan paling sesuai dengan prinsip Nightingale kontemporer adalah...",
    options: [
      "Menyalahkan keluarga",
      "Mencari pilihan realistis untuk memperbaiki kondisi lingkungan dengan sumber daya yang ada",
      "Mengabaikan kondisi",
      "Memerintahkan renovasi mahal",
      "Hanya memberikan obat"
    ],
    correctIndex: 1,
    explanation: "Rekomendasi lingkungan harus realistis dan memperhatikan sumber daya yang dimiliki keluarga."
  },

  {
    id: 173,
    text: "Penerapan teori Nightingale pada era digital dapat terlihat ketika perawat...",
    options: [
      "Melarang semua penggunaan gawai",
      "Mengabaikan informasi internet",
      "Membantu pasien memilah informasi kesehatan yang akurat",
      "Hanya fokus pada data laboratorium",
      "Menghapus seluruh media sosial pasien"
    ],
    correctIndex: 2,
    explanation: "Materi memasukkan lingkungan informasi sebagai bagian lingkungan modern. Informasi palsu dapat menimbulkan kecemasan dan kekeliruan."
  },

  {
    id: 174,
    text: "Salah satu kritik terhadap teori Nightingale adalah...",
    options: [
      "Terlalu sedikit membahas lingkungan",
      "Terlalu menekankan lingkungan fisik sehingga pilihan pasien perlu diperhatikan lebih lanjut",
      "Tidak menganggap lingkungan penting",
      "Terlalu fokus pada teknologi digital",
      "Tidak membahas kebersihan"
    ],
    correctIndex: 1,
    explanation: "Materi menyebut teori Nightingale dapat terlalu menekankan lingkungan fisik sehingga perlu dipadukan dengan person-centred care dan determinan sosial."
  },

  {
    id: 175,
    text: "Mengapa teori Nightingale masih relevan dalam konteks perubahan iklim?",
    options: [
      "Karena hanya membahas perang",
      "Karena tidak berkaitan dengan lingkungan",
      "Karena hubungan lingkungan dan kesehatan tetap menjadi masalah penting",
      "Karena hanya membahas sanitasi rumah sakit",
      "Karena menggantikan semua teori modern"
    ],
    correctIndex: 2,
    explanation: "Perubahan iklim, polusi, bencana, dan penyakit baru menunjukkan bahwa lingkungan tetap memengaruhi kesehatan."
  },

  {
    id: 176,
    text: "Pasien mengalami perbaikan kualitas tidur setelah perawat mengurangi gangguan suara dan mengatur pencahayaan ruangan.\n\nKesimpulan yang paling sesuai adalah...",
    options: [
      "Obat tidak diperlukan lagi",
      "Diagnosis medis salah",
      "Pasien hanya mengalami masalah psikologis",
      "Modifikasi lingkungan dapat mendukung pemulihan",
      "Lingkungan tidak penting"
    ],
    correctIndex: 3,
    explanation: "Perubahan kondisi lingkungan yang diikuti perbaikan tidur menunjukkan lingkungan dapat memengaruhi proses pemulihan."
  },

  {
    id: 177,
    text: "Julukan Florence Nightingale yang berkaitan dengan kebiasaannya berkeliling rumah sakit pada malam hari adalah...",
    options: [
      "Lady of Science",
      "Lady with the Lamp",
      "Mother of Medicine",
      "Nurse of Europe",
      "Queen of Hospitals"
    ],
    correctIndex: 1,
    explanation: "PPT secara eksplisit memperkenalkan Nightingale sebagai \"the Lady with the lamp\"."
  },

  {
    id: 178,
    text: "Menurut teori Henderson, inti bantuan keperawatan adalah membantu individu melakukan aktivitas yang akan dilakukan sendiri apabila memiliki...",
    options: [
      "Uang, keluarga, dan fasilitas",
      "Obat dan dokter",
      "Motivasi dan lingkungan",
      "Kekuatan, kemauan, dan pengetahuan",
      "Teknologi dan alat kesehatan"
    ],
    correctIndex: 3,
    explanation: "Tiga unsur inti yang disebut Henderson adalah kekuatan, kemauan, dan pengetahuan."
  },

  {
    id: 179,
    text: "Pasien stroke masih mampu makan sendiri tetapi membutuhkan bantuan saat berpindah tempat.\n\nPerawat tidak mengambil alih seluruh aktivitas pasien, melainkan memberikan bantuan pada bagian yang memang tidak mampu dilakukan.\n\nPendekatan ini paling sesuai dengan prinsip...",
    options: [
      "Meningkatkan kemandirian secara bertahap",
      "Mengambil alih seluruh aktivitas",
      "Membatasi semua aktivitas",
      "Menyerahkan pasien pada keluarga",
      "Mengutamakan ketergantungan"
    ],
    correctIndex: 0,
    explanation: "Henderson menekankan kemandirian. Bantuan diberikan sesuai kebutuhan, bukan mengambil alih semua aktivitas."
  },

  {
    id: 180,
    text: "Dokumentasi manakah yang paling sesuai dengan pendekatan Henderson?",
    options: [
      "\"Pasien dibantu mandi.\"",
      "\"Pasien tidak mandiri.\"",
      "\"Pasien harus selalu dibantu.\"",
      "\"Pasien mampu mencuci wajah sendiri, membutuhkan bantuan pada punggung, dan mampu berdiri selama 2 menit dengan alat bantu.\"",
      "\"Pasien tergantung.\""
    ],
    correctIndex: 3,
    explanation: "Dokumentasi seharusnya menggambarkan kemampuan aktual, tingkat bantuan, alat bantu, serta perkembangan kemandirian."
  },

  {
    id: 181,
    text: "Pasien tidak sadar dan tidak mampu memenuhi kebutuhan dasar.\n\nPerawat harus mengambil alih aktivitas tertentu sampai pasien mampu berpartisipasi.\n\nPeran tersebut paling sesuai dengan konsep...",
    options: [
      "Pengganti",
      "Mitra",
      "Penasihat",
      "Konselor",
      "Koordinator"
    ],
    correctIndex: 0,
    explanation: "Peran pengganti sesuai ketika pasien belum mampu melakukan aktivitas karena keterbatasan berat, seperti tidak sadar."
  },

  {
    id: 182,
    text: "Pasien memahami edukasi yang diberikan tetapi belum percaya diri melakukan aktivitas sendiri.\n\nPerawat mendampingi dan membantu seperlunya.\n\nPeran yang paling sesuai adalah...",
    options: [
      "Pengganti",
      "Penolong",
      "Dokter",
      "Administrator",
      "Peneliti"
    ],
    correctIndex: 1,
    explanation: "Penolong berarti perawat membantu pasien melakukan aktivitas yang belum dapat dilakukan secara optimal."
  },

  {
    id: 183,
    text: "Seorang pasien sudah mampu melakukan aktivitas dasar, tetapi ia meminta keluarga terus melakukan semuanya karena takut gagal.\n\nPerawat kemudian memberikan kesempatan pasien mencoba sambil didampingi.\n\nPendekatan ini paling sesuai dengan pemahaman Henderson tentang...",
    options: [
      "Ketergantungan",
      "Penggantian total",
      "Ketidakmampuan permanen",
      "Pembatasan aktivitas",
      "Kemandirian sebagai kapasitas berpartisipasi sesuai kemampuan"
    ],
    correctIndex: 4,
    explanation: "Kemandirian menurut materi tidak berarti \"harus melakukan semuanya sendiri\", tetapi mampu berpartisipasi dan memiliki pilihan sesuai kemampuan."
  },

  {
    id: 184,
    text: "Manakah yang termasuk kebutuhan dasar Henderson?",
    options: [
      "Mempertahankan tekanan darah di bawah angka tertentu",
      "Menjalani semua tindakan medis",
      "Mengonsumsi obat sesuai resep",
      "Berkomunikasi dengan orang lain",
      "Mengikuti semua keputusan tenaga kesehatan"
    ],
    correctIndex: 3,
    explanation: "Berkomunikasi dengan orang lain merupakan salah satu dari 14 kebutuhan dasar Henderson."
  },

  {
    id: 185,
    text: "Pasien mengatakan, \"Saya tidak bisa mandi sendiri karena tangan saya lemah.\"\n\nKebutuhan Henderson yang paling langsung terkait adalah...",
    options: [
      "Belajar",
      "Rekreasi",
      "Kebersihan diri dan penampilan rapi",
      "Bekerja",
      "Beribadah"
    ],
    correctIndex: 2,
    explanation: "Kebutuhan kebersihan diri mencakup kemampuan menjaga kebersihan tubuh, kulit, rambut, dan penampilan."
  },

  {
    id: 186,
    text: "Pasien tidak mampu memilih pakaian yang sesuai dengan kondisi dan cuaca.\n\nKebutuhan yang paling relevan adalah...",
    options: [
      "Eliminasi",
      "Komunikasi",
      "Berpakaian dengan tepat",
      "Bekerja",
      "Belajar"
    ],
    correctIndex: 2,
    explanation: "Memilih, mengenakan, dan melepaskan pakaian termasuk kebutuhan dasar Henderson."
  },

  {
    id: 187,
    text: "Seorang pasien memiliki masalah buang air kecil dan buang air besar.\n\nDalam kerangka Henderson, masalah tersebut masuk kebutuhan...",
    options: [
      "Bergerak",
      "Eliminasi",
      "Belajar",
      "Bekerja",
      "Rekreasi"
    ],
    correctIndex: 1,
    explanation: "Eliminasi merupakan kebutuhan ketiga dan mencakup mempertahankan pengeluaran urine serta feses secara normal."
  },

  {
    id: 188,
    text: "Pasien mengalami kesulitan mempertahankan suhu tubuh karena lingkungan sangat dingin.\n\nPengkajian Henderson terutama mengarah pada kebutuhan...",
    options: [
      "Komunikasi",
      "Bekerja",
      "Rekreasi",
      "Beribadah",
      "Mempertahankan suhu tubuh dalam batas normal"
    ],
    correctIndex: 4,
    explanation: "Kebutuhan ketujuh mencakup kemampuan mempertahankan suhu tubuh normal melalui pakaian dan penyesuaian lingkungan."
  },

  {
    id: 189,
    text: "Pasien mengaku tidak memahami penyakitnya dan tidak mengetahui bagaimana mencegah komplikasi setelah pulang.\n\nDalam kerangka Henderson, kebutuhan yang paling berhubungan adalah...",
    options: [
      "Belajar dan memuaskan rasa ingin tahu",
      "Eliminasi",
      "Tidur",
      "Rekreasi",
      "Berpakaian"
    ],
    correctIndex: 0,
    explanation: "Belajar merupakan kebutuhan dasar ke-14 dan berhubungan dengan memperoleh pengetahuan baru serta memenuhi rasa ingin tahu."
  },

  {
    id: 190,
    text: "Seorang pasien mengatakan bahwa aktivitas yang membuatnya merasa berguna sangat penting setelah sakit.\n\nKebutuhan Henderson yang paling relevan adalah...",
    options: [
      "Bekerja dan merasa bermanfaat",
      "Tidur",
      "Bernapas",
      "Eliminasi",
      "Berpakaian"
    ],
    correctIndex: 0,
    explanation: "Bekerja dan merasa bermanfaat merupakan salah satu dari 14 kebutuhan dasar."
  },

  {
    id: 191,
    text: "Pasien ingin tetap menjalankan ibadah selama dirawat.\n\nPerawat menilai kebutuhan tersebut tanpa menghakimi keyakinan pasien.\n\nKebutuhan Henderson yang sedang dikaji adalah...",
    options: [
      "Rekreasi",
      "Beribadah sesuai keyakinan",
      "Bekerja",
      "Komunikasi",
      "Mobilitas"
    ],
    correctIndex: 1,
    explanation: "Beribadah sesuai dengan keyakinan termasuk kebutuhan dasar ke-11."
  },

  {
    id: 192,
    text: "Pasien ingin mengikuti kegiatan hiburan yang ringan setelah kondisi stabil.\n\nKebutuhan Henderson yang sesuai adalah...",
    options: [
      "Eliminasi",
      "Berpakaian",
      "Bermain dan rekreasi",
      "Suhu tubuh",
      "Makan dan minum"
    ],
    correctIndex: 2,
    explanation: "Bermain dan rekreasi termasuk kebutuhan dasar ke-13."
  },

  {
    id: 193,
    text: "Pasien memiliki gangguan mobilitas sehingga tidak dapat menjaga postur tubuh dengan baik.\n\nKebutuhan yang paling sesuai adalah...",
    options: [
      "Bergerak dan menjaga postur tubuh",
      "Komunikasi",
      "Belajar",
      "Kebersihan",
      "Spiritual"
    ],
    correctIndex: 0,
    explanation: "Kebutuhan keempat berhubungan dengan kemampuan bergerak, mempertahankan postur, dan melakukan aktivitas fisik."
  },

  {
    id: 194,
    text: "Perawat menilai kebutuhan makan seorang pasien, tetapi tidak hanya melihat apakah pasien sudah makan.\n\nIa menanyakan kemampuan memilih makanan, mengonsumsi, dan menikmati makanan sesuai kebutuhan tubuh.\n\nPendekatan ini menunjukkan bahwa pengkajian kebutuhan Henderson harus...",
    options: [
      "Sekadar checklist",
      "Menilai kemampuan pasien secara nyata dalam memenuhi kebutuhan",
      "Hanya menilai jumlah makanan",
      "Berfokus pada diagnosis medis",
      "Mengabaikan konteks pasien"
    ],
    correctIndex: 1,
    explanation: "Kebutuhan Henderson harus dikaji berdasarkan kemampuan aktual, hambatan, sumber daya, serta tingkat bantuan yang diperlukan."
  },

  {
    id: 195,
    text: "Dalam budaya yang sangat menekankan keluarga, kemandirian menurut Henderson seharusnya...",
    options: [
      "Berarti pasien tidak boleh dibantu",
      "Berarti keluarga harus dikeluarkan",
      "Dianggap tidak relevan",
      "Dimaknai sebagai kemampuan dan pilihan dalam hubungan dukungan yang sehat",
      "Berarti perawat mengambil alih"
    ],
    correctIndex: 3,
    explanation: "Materi menegaskan bahwa ketergantungan atau dukungan keluarga tidak selalu buruk. Tujuan tetap mengoptimalkan kemampuan dan pilihan pasien."
  },

  {
    id: 196,
    text: "Seorang perawat mendidik keluarga agar membantu pasien tanpa mengambil alih seluruh aktivitasnya.\n\nTujuan utama tindakan tersebut adalah...",
    options: [
      "Meningkatkan ketergantungan",
      "Mendukung perkembangan kemandirian pasien",
      "Mengurangi komunikasi",
      "Menggantikan semua peran pasien",
      "Meniadakan keluarga"
    ],
    correctIndex: 1,
    explanation: "Keluarga dapat menjadi sumber dukungan, tetapi bantuan hendaknya tidak menghambat peningkatan kemampuan pasien."
  },

  {
    id: 197,
    text: "Seorang pasien pascaoperasi belum mampu bergerak sendiri.\n\nPerawat membantu pasien bangun, kemudian mengurangi bantuan secara bertahap ketika kemampuan meningkat.\n\nStrategi tersebut paling tepat karena...",
    options: [
      "Pasien tidak perlu belajar",
      "Keluarga harus mengambil alih",
      "Perawat harus selalu melakukan semuanya",
      "Henderson menolak bantuan",
      "Bantuan keperawatan diarahkan menuju kemampuan optimal pasien"
    ],
    correctIndex: 4,
    explanation: "Bantuan keperawatan bukan tujuan akhir. Tujuannya adalah membantu pasien mencapai tingkat kemandirian atau kemampuan optimal."
  },

  {
    id: 198,
    text: "Dalam teori Henderson, kematian yang damai...",
    options: [
      "Tidak berhubungan dengan keperawatan",
      "Hanya menjadi tanggung jawab dokter",
      "Termasuk salah satu tujuan yang dapat diperhatikan dalam keperawatan",
      "Hanya berkaitan dengan keluarga",
      "Bukan bagian teori"
    ],
    correctIndex: 2,
    explanation: "Materi secara eksplisit menyebutkan bahwa kematian damai termasuk tujuan keperawatan."
  },

  {
    id: 199,
    text: "Pasien mampu menggunakan alat bantu jalan tetapi masih ragu.\n\nPerawat memberikan edukasi, mendampingi latihan, lalu mengevaluasi kembali kemampuan pasien.\n\nPeran perawat yang paling tepat adalah...",
    options: [
      "Pengganti total",
      "Penolong menuju kemandirian",
      "Mengambil seluruh aktivitas",
      "Membatasi gerak",
      "Menyerahkan pada keluarga"
    ],
    correctIndex: 1,
    explanation: "Pasien sudah memiliki sebagian kemampuan sehingga perawat berperan membantu dan memperkuat kemampuan tersebut."
  },

  {
    id: 200,
    text: "Pernyataan yang paling tepat mengenai 14 kebutuhan Henderson adalah...",
    options: [
      "Hanya digunakan untuk pasien bedah",
      "Hanya menilai kondisi fisik",
      "Harus digunakan sebagai checklist tanpa konteks",
      "Menggantikan diagnosis keperawatan",
      "Menjadi struktur pengkajian yang harus dibaca secara saling berhubungan dan sesuai konteks pasien"
    ],
    correctIndex: 4,
    explanation: "Empat belas kebutuhan memberikan struktur, tetapi bukan checklist mekanis. Kebutuhan saling memengaruhi dan harus dikaitkan dengan tujuan serta kondisi pasien."
  }
];

export default questions;
