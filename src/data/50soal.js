// src/data/50soal.js
// ────────────────────────────────────────────────────────────
// QUIZ CBT KEPERAWATAN — 50 SOAL SIMULASI UJIAN
// Paket: Kesehatan Global (1-50) + Falsafah & Teori Keperawatan (51-100)
// Mode: Timed 60 menit (HARD MODE)
// ────────────────────────────────────────────────────────────
// 📚 REFERENSI:
// • Kesehatan Global: PPT dosen + WHO documents + literatur kesehatan global
// • FTK: Buku FTK + contoh UTS/prediksi ujian kakak kelas 2023/2024
// • Sumber buku: https://drive.google.com/drive/folders/1eIeKFaEAaFrhJqTpPZsWxoUSq42TmUQx
// • PPT: https://drive.google.com/drive/folders/1BhECsi2o8spsa_Wbgb9K0p1RJJjUjgKb
// 🤖 Soal ini dibuat dengan AI namun pola mirip tahun-tahun sebelumnya
// ⚠️ DISCLAIMER: Soal ini BUKAN soal resmi ujian. Gunakan sebagai bahan latihan.
// ────────────────────────────────────────────────────────────

export const questions = [
  // ════════════════════════════════════════════════
  // SIMULASI — KESEHATAN GLOBAL 50 SOAL (Index 0-49)
  // ════════════════════════════════════════════════

  {
    id: 1,
    text: "Sebuah desa memiliki 98% penduduk yang telah terdaftar dalam jaminan kesehatan. Namun fasilitas terdekat berjarak puluhan kilometer, transportasi mahal, tenaga kesehatan terbatas, dan beberapa obat esensial sering tidak tersedia.\n\nPernyataan yang paling tepat adalah...",
    options: [
      "Masalah utama hanya financial protection",
      "Cakupan kepesertaan tinggi belum menjamin effective UHC",
      "UHC sudah tercapai karena angka kepesertaan tinggi",
      "Masalah tersebut hanya termasuk primary prevention",
      "Seluruh persoalan dapat diselesaikan dengan kartu jaminan"
    ],
    correctIndex: 1,
    explanation: "UHC tidak berhenti pada kepemilikan jaminan. Materi menekankan population coverage, service coverage, accessibility, availability, quality, dan financial protection."
  },

  {
    id: 2,
    text: "Sebuah penyakit menyebabkan kematian 20 tahun lebih awal dibanding usia harapan hidup standar pada 100 orang. Selain itu, 50 orang hidup dengan disabilitas selama 4 tahun dengan disability weight 0,5.\n\nNilai total DALY berdasarkan data tersebut adalah...",
    options: [
      "2.100",
      "2.000",
      "1.900",
      "1.100",
      "500"
    ],
    correctIndex: 0,
    explanation: "YLL = 100 × 20 = 2.000. YLD = 50 × 4 × 0,5 = 100. DALY = 2.000 + 100 = 2.100."
  },

  {
    id: 3,
    text: "Dalam satu kecamatan, jumlah kasus penyakit X meningkat drastis. Namun angka kematian tetap sangat rendah karena sebagian besar pasien pulih.\n\nUkuran yang kemungkinan paling besar dibanding penyakit lain adalah...",
    options: [
      "CFR",
      "Mortality",
      "Morbidity",
      "MMR",
      "YLL"
    ],
    correctIndex: 2,
    explanation: "Banyaknya kasus menunjukkan beban morbidity. Rendahnya kematian tidak berarti morbidity juga rendah."
  },

  {
    id: 4,
    text: "Suatu wilayah berhasil menurunkan mortalitas bayi dan balita secara konsisten, memperbaiki pendidikan, sanitasi, serta akses pelayanan kesehatan. Beberapa tahun kemudian UHH meningkat.\n\nAlasan yang paling kuat adalah...",
    options: [
      "Dependency ratio otomatis turun",
      "Hanya jumlah lansia yang bertambah",
      "Jumlah kelahiran meningkat",
      "Semua penyakit kronis hilang",
      "Penurunan mortalitas terutama pada usia muda meningkatkan harapan hidup"
    ],
    correctIndex: 4,
    explanation: "UHH sangat dipengaruhi pola mortalitas. Perbaikan survival bayi, anak, dan kelompok usia lain meningkatkan expected years of life."
  },

  {
    id: 5,
    text: "Sebuah keluarga berpenghasilan rendah tinggal di rumah dengan sanitasi buruk. Anak sering mengalami diare, biaya berobat meningkat, dan orang tua kehilangan pendapatan karena merawat anak.\n\nAkar masalah yang paling tepat dianalisis terlebih dahulu adalah...",
    options: [
      "Social determinants of health",
      "Case fatality rate",
      "Tertiary care",
      "DALY",
      "Hospital governance"
    ],
    correctIndex: 0,
    explanation: "SDOH mencakup kondisi ekonomi, tempat tinggal, lingkungan, pendidikan, akses pelayanan, dan faktor sosial yang membentuk peluang kesehatan."
  },

  {
    id: 6,
    text: "Seorang ibu mengetahui bahwa kehamilannya bermasalah. Ia ingin segera mencari bantuan, tetapi keluarga memerlukan waktu lama untuk mengambil keputusan karena suami memegang kendali finansial.\n\nMenurut Three Delays Model, intervensi pertama yang paling strategis adalah...",
    options: [
      "Memperbaiki pengambilan keputusan dalam keluarga",
      "Membangun rumah sakit tersier",
      "Memperbanyak dokter spesialis",
      "Mengganti semua alat diagnostik",
      "Memperpanjang waktu tunggu rujukan"
    ],
    correctIndex: 0,
    explanation: "Hambatan tersebut merupakan Delay 1: terlambat mengenali bahaya atau mengambil keputusan mencari pertolongan. Faktor gender dan kontrol finansial dapat berperan."
  },

  {
    id: 7,
    text: "Seorang anak sejak dalam kandungan sampai usia dua tahun memperoleh nutrisi optimal, stimulasi cukup, dan perlindungan kesehatan yang baik.\n\nMengapa fase ini dianggap sangat menentukan dalam life-course approach?",
    options: [
      "Karena semua penyakit kronis pasti selesai pada usia dua tahun",
      "Karena masa ini hanya memengaruhi berat badan",
      "Karena hanya perkembangan motorik yang berlangsung",
      "Karena UHH dihitung dari masa tersebut",
      "Karena 1000 HPK merupakan critical period perkembangan fisik, otak, dan sistem imun"
    ],
    correctIndex: 4,
    explanation: "Materi menempatkan 1000 HPK sebagai masa kritis dengan perkembangan otak, tulang, dan sistem imun yang sangat intensif serta pengaruh jangka panjang."
  },

  {
    id: 8,
    text: "Seorang pasien memiliki tekanan darah 150/94 mmHg. Ia jarang berolahraga, sering mengonsumsi makanan tinggi garam, dan mengalami obesitas.\n\nIntervensi yang paling tepat adalah...",
    options: [
      "Hanya mengurangi pemeriksaan kesehatan",
      "Menunggu gejala muncul",
      "Mengendalikan berat badan, meningkatkan aktivitas fisik, dan mengurangi faktor diet berisiko",
      "Menghentikan seluruh pengobatan",
      "Hanya mengobati saat sakit kepala"
    ],
    correctIndex: 2,
    explanation: "Faktor tersebut merupakan risiko hipertensi yang dapat dimodifikasi. Pengendalian gaya hidup dan pengobatan yang tepat menjadi bagian pengelolaan hipertensi."
  },

  {
    id: 9,
    text: "Seorang laki-laki berusia lanjut memiliki riwayat keluarga penyakit jantung, hipertensi, obesitas, dan kebiasaan merokok.\n\nDalam kerangka materi, pendekatan pencegahan paling logis adalah...",
    options: [
      "Hanya memeriksa gejala ketika muncul",
      "Hanya menurunkan kadar gula",
      "Pengendalian tekanan darah, gaya hidup, berhenti merokok, dan pemeriksaan rutin",
      "Menghilangkan semua aktivitas fisik",
      "Fokus pada antibiotik"
    ],
    correctIndex: 2,
    explanation: "Risiko penyakit kardiovaskular bersifat multifaktor. Materi menganjurkan pengendalian faktor risiko, aktivitas, diet, tidak merokok, dan pemeriksaan rutin."
  },

  {
    id: 10,
    text: "Sebuah rumah dinyatakan \"bebas rokok\", tetapi anggota keluarga masih sering terpapar residu tembakau yang menempel pada sofa, pakaian, dan rambut.\n\nPenjelasan paling tepat adalah...",
    options: [
      "Active smoking",
      "Droplet transmission",
      "Airborne transmission",
      "Social gradient",
      "Thirdhand smoke"
    ],
    correctIndex: 4,
    explanation: "Thirdhand smoke merujuk pada residu asap yang menetap di permukaan dan benda sekitar meskipun aktivitas merokok sedang tidak berlangsung."
  },

  {
    id: 11,
    text: "Rumah sakit sering mengganti antibiotik lini pertama karena kegagalan terapi. Audit menunjukkan kultur mikrobiologis jarang dilakukan dan antibiotik sering diberikan tanpa evaluasi ulang.\n\nPrioritas yang paling tepat adalah...",
    options: [
      "Menambah lama rawat semua pasien",
      "Menggunakan antibiotik lebih kuat pada semua kasus",
      "Memperkuat antimicrobial stewardship dan diagnosis yang akurat",
      "Menghentikan surveillance",
      "Meniadakan hand hygiene"
    ],
    correctIndex: 2,
    explanation: "Stewardship mengharuskan penggunaan antimikroba secara rasional, termasuk indikasi, obat, dosis, rute, durasi, evaluasi respons, dan diagnosis yang tepat."
  },

  {
    id: 12,
    text: "Seorang perawat menemukan pasien mendapat antibiotik yang tidak sesuai indikasi, tetapi pasien juga memiliki alat invasif dan dirawat dalam waktu lama.\n\nMengapa strategi pengendalian AMR tidak boleh hanya berfokus pada obat?",
    options: [
      "Karena AMR hanya dipengaruhi faktor lingkungan",
      "Karena antibiotik tidak pernah menyebabkan resistensi",
      "Karena IPC, pengelolaan alat, diagnosis, dan stewardship saling berkaitan",
      "Karena semua alat invasif selalu aman",
      "Karena hand hygiene hanya penting pada wabah"
    ],
    correctIndex: 2,
    explanation: "AMR dipengaruhi pemakaian antimikroba dan transmisi organisme resisten. IPC serta evaluasi alat invasif merupakan bagian penting dari pencegahan."
  },

  {
    id: 13,
    text: "Sebuah kabupaten menerima sertifikat eliminasi filariasis. Dua tahun kemudian terjadi peningkatan mobilitas penduduk dan perubahan lingkungan.\n\nKebijakan yang paling rasional adalah...",
    options: [
      "Menghentikan seluruh program",
      "Melanjutkan surveillance pasca-eliminasi",
      "Menghapus pencatatan kasus",
      "Mengurangi koordinasi lintas sektor",
      "Menganggap penyakit mustahil muncul kembali"
    ],
    correctIndex: 1,
    explanation: "Eliminasi tidak berarti risiko hilang selamanya. Materi menekankan perlunya surveillance berkelanjutan setelah eliminasi."
  },

  {
    id: 14,
    text: "Di daerah endemis cacing, sekolah hanya memberikan obat cacing tetapi tidak memperbaiki sanitasi dan kebiasaan cuci tangan.\n\nKelemahan strategi tersebut adalah...",
    options: [
      "Obat cacing tidak pernah berguna",
      "Semua kasus harus dirujuk",
      "Sumber paparan lingkungan tetap ada sehingga intervensi seharusnya mencakup WASH",
      "Penyakit cacing hanya dipengaruhi faktor genetik",
      "Sekolah tidak berperan dalam pengendalian NTD"
    ],
    correctIndex: 2,
    explanation: "Pengendalian helminths membutuhkan kombinasi pengobatan dan perbaikan air, sanitasi, kebersihan, dan perilaku."
  },

  {
    id: 15,
    text: "Di ruang tunggu puskesmas, beberapa pasien dengan gejala infeksi saluran pernapasan datang dalam waktu berdekatan. Ruangan sempit dan ventilasi buruk.\n\nIntervensi yang paling langsung memutus salah satu mata rantai adalah...",
    options: [
      "Menambah jumlah kursi tunggu",
      "Mengurangi pencatatan kasus",
      "Menghapus edukasi",
      "Memperbaiki ventilasi dan menerapkan tindakan pencegahan penularan",
      "Menutup seluruh layanan permanen"
    ],
    correctIndex: 3,
    explanation: "Ventilasi dan transmission-based precautions dapat memutus jalur penularan. Materi menempatkan perbaikan ventilasi sebagai bagian dari pengendalian transmisi."
  },

  {
    id: 16,
    text: "Dalam satu minggu muncul sejumlah kasus penyakit yang melebihi jumlah yang diperkirakan untuk wilayah dan periode tersebut.\n\nPernyataan paling tepat adalah...",
    options: [
      "Selalu disebut sporadic",
      "Otomatis menjadi pandemic",
      "Pasti merupakan cluster",
      "Dapat digolongkan sebagai outbreak/epidemic sesuai konteks populasi dan wilayah",
      "Pasti merupakan NTD"
    ],
    correctIndex: 3,
    explanation: "Outbreak/epidemic berkaitan dengan peningkatan kasus di atas yang diharapkan. Perbedaan istilah ditentukan oleh konteks wilayah dan populasi."
  },

  {
    id: 17,
    text: "Suatu negara membangun sistem surveilans, laboratorium, tenaga terlatih, komunikasi risiko, serta koordinasi lintas sektor untuk menghadapi ancaman penyakit yang berdampak lintas batas.\n\nKonsep utama yang sedang diperkuat adalah...",
    options: [
      "Disease burden",
      "Primary care",
      "Equality",
      "Social gradient",
      "Health security"
    ],
    correctIndex: 4,
    explanation: "Health security mencakup kemampuan mencegah, mendeteksi, menilai, melaporkan, dan merespons ancaman kesehatan yang dapat berdampak luas."
  },

  {
    id: 18,
    text: "Saat wabah, petugas menyampaikan: \"Data awal menunjukkan risiko meningkat, tetapi besarnya dampak masih belum pasti. Kami akan memperbarui informasi setelah data tambahan masuk.\"\n\nMengapa cara komunikasi tersebut sesuai materi?",
    options: [
      "Karena informasi harus dibuat menakutkan",
      "Karena petugas seharusnya menyembunyikan ketidakpastian",
      "Karena transparansi ketidakpastian meningkatkan komunikasi risiko yang kredibel",
      "Karena semua informasi harus singkat tanpa konteks",
      "Karena rumor lebih mudah dihadapi dengan ancaman"
    ],
    correctIndex: 2,
    explanation: "Materi menegaskan komunikasi risiko harus evidence-based sekaligus transparan terhadap ketidakpastian, cepat, jelas, konsisten, dan sensitif terhadap budaya."
  },

  {
    id: 19,
    text: "Di suatu daerah terjadi perubahan lingkungan, interaksi manusia-hewan meningkat, populasi vektor berubah, dan terdapat peluang mutasi mikroba.\n\nGabungan faktor tersebut paling sesuai dengan...",
    options: [
      "UHC failure",
      "Dependency ratio",
      "Social equality",
      "DALY calculation",
      "Drivers of emerging and re-emerging infectious diseases"
    ],
    correctIndex: 4,
    explanation: "Materi menyebut urbanisasi, kerusakan habitat, perubahan iklim/ekosistem, perubahan reservoir atau vektor, dan mutasi mikroba sebagai pendorong penting."
  },

  {
    id: 20,
    text: "Pada awal 2025 terjadi peningkatan penyakit pernapasan di suatu kawasan. Kelompok yang paling diperhatikan adalah balita, lansia, dan individu dengan komorbid.\n\nKasus tersebut paling sesuai dengan fokus materi mengenai...",
    options: [
      "Filariasis",
      "Schistosomiasis",
      "HMPV",
      "Thalassemia",
      "IBD"
    ],
    correctIndex: 2,
    explanation: "Materi HMPV menekankan penyakit pernapasan yang berisiko lebih berat pada balita, lansia, dan pasien dengan komorbid."
  },

  {
    id: 21,
    text: "Sebuah wabah diduga berasal dari interaksi peternakan, lingkungan, dan manusia. Pengendalian hanya dilakukan oleh dinas kesehatan dan gagal menurunkan risiko.\n\nKesimpulan paling tepat adalah...",
    options: [
      "Dibutuhkan pendekatan One Health lintas sektor",
      "Cukup menambah rumah sakit",
      "Hanya dokter spesialis yang perlu dilibatkan",
      "Masalah pasti hanya berasal dari perilaku individu",
      "Surveilans hewan tidak relevan"
    ],
    correctIndex: 0,
    explanation: "Emerging diseases sering melibatkan hubungan manusia-hewan-lingkungan sehingga pengendalian membutuhkan One Health."
  },

  {
    id: 22,
    text: "Puskesmas memberikan pelayanan dokter umum kepada pasien yang datang untuk diagnosis dan pengobatan. Di saat yang sama, sistem kesehatan juga menjalankan program pencegahan penyakit, pemberdayaan masyarakat, dan kerja lintas sektor.\n\nPernyataan yang paling tepat adalah...",
    options: [
      "Semuanya merupakan tertiary care",
      "Semuanya hanya disebut hospital care",
      "Primary care dan PHC pasti identik",
      "Pelayanan dokter adalah primary care, sedangkan pendekatan yang lebih luas tersebut merupakan PHC",
      "PHC hanya mencakup tindakan kuratif"
    ],
    correctIndex: 3,
    explanation: "Primary care berfokus pada layanan klinis kontak pertama. PHC memiliki cakupan lebih luas sampai tingkat masyarakat, kebijakan, promotif-preventif, dan pemberdayaan."
  },

  {
    id: 23,
    text: "Sebuah fasilitas kesehatan tersedia dan pelayanannya bermutu, tetapi pasien dari pulau terpencil kesulitan mencapai fasilitas karena transportasi tidak memadai.\n\nDalam 5A, masalah utama adalah...",
    options: [
      "Acceptability",
      "Affordability",
      "Quality",
      "Accessibility",
      "Availability"
    ],
    correctIndex: 3,
    explanation: "Accessibility berkaitan dengan kemampuan fisik masyarakat mencapai fasilitas. Masalah transportasi dan jarak merupakan contoh utamanya."
  },

  {
    id: 24,
    text: "Sebuah rumah sakit memiliki tenaga medis cukup, tetapi sistem informasi kesehatan buruk dan stok obat sering tidak terkendali.\n\nKomponen building block yang perlu diperkuat terutama adalah...",
    options: [
      "Service delivery saja",
      "Health information dan medicines/technology",
      "Social determinants",
      "Dependency ratio",
      "Life expectancy"
    ],
    correctIndex: 1,
    explanation: "WHO Six Building Blocks mencakup health information dan medicines/technology, selain empat komponen lainnya."
  },

  {
    id: 25,
    text: "Daerah perkotaan memiliki konsentrasi tenaga kesehatan tinggi, sedangkan wilayah rural kekurangan tenaga meskipun kebutuhan penyakit kronis tinggi.\n\nMasalah sistem kesehatan tersebut paling tepat disebut...",
    options: [
      "Maldistribusi tenaga kesehatan yang menimbulkan access gap",
      "Kelebihan primary prevention",
      "Kegagalan diagnosis laboratorium saja",
      "Kurangnya prevalence",
      "Rendahnya DALY"
    ],
    correctIndex: 0,
    explanation: "Materi menekankan workforce bukan hanya soal jumlah, tetapi juga distribusi, kompetensi, perlindungan, motivasi, dan pemerataan geografis."
  },

  {
    id: 26,
    text: "Dua desa memiliki jumlah penduduk yang sama. Desa A memiliki banyak tenaga kesehatan, jalan baik, dan pendapatan rata-rata tinggi. Desa B memiliki akses jalan buruk, kemiskinan tinggi, serta tenaga kesehatan terbatas.\n\nMemberikan intervensi yang identik kepada kedua desa belum tentu adil karena...",
    options: [
      "Equality selalu lebih baik",
      "Equity menuntut respons sesuai kebutuhan dan hambatan",
      "Semua desa harus menerima jumlah sumber daya sama persis",
      "Akses geografis tidak penting",
      "Faktor sosial tidak menentukan kesehatan"
    ],
    correctIndex: 1,
    explanation: "Equity berarti dukungan disesuaikan dengan kebutuhan dan hambatan, bukan sekadar distribusi identik."
  },

  {
    id: 27,
    text: "Pemerintah berhasil meningkatkan jumlah peserta jaminan kesehatan, tetapi kualitas layanan di fasilitas dasar tetap rendah dan pengeluaran dari kantong sendiri masih besar.\n\nDimensi UHC yang paling jelas belum tercapai adalah...",
    options: [
      "Population coverage saja",
      "Service coverage dan financial protection",
      "Population coverage dan life expectancy",
      "Dependency ratio",
      "Disease surveillance"
    ],
    correctIndex: 1,
    explanation: "UHC harus mencakup layanan bermutu serta perlindungan finansial. Kepesertaan saja tidak cukup."
  },

  {
    id: 28,
    text: "Pemantauan global menunjukkan kemajuan service coverage UHC melambat dan beban pengeluaran kesehatan dari kantong sendiri tetap tinggi.\n\nMakna kebijakan yang paling tepat adalah...",
    options: [
      "UHC tidak lagi diperlukan",
      "Sistem cukup fokus pada rumah sakit",
      "Semua pengeluaran kesehatan harus nol",
      "Kartu jaminan harus menjadi satu-satunya indikator",
      "Investasi pada primary care, data, mutu layanan, dan perlindungan finansial tetap diperlukan"
    ],
    correctIndex: 4,
    explanation: "Materi menunjukkan progres UHC belum sesuai target sehingga diperlukan investasi berkelanjutan pada sistem dasar, data, layanan, dan perlindungan finansial."
  },

  {
    id: 29,
    text: "Menurut materi statistik kesehatan global, pada 2023 sekitar 1,495 miliar orang masih memerlukan intervensi NTD. Angka tersebut menurun dibanding 2010, tetapi target penurunan 90% pada 2030 belum berada pada jalur yang memadai.\n\nInterpretasi yang paling tepat adalah...",
    options: [
      "NTD hampir seluruhnya sudah dieliminasi",
      "NTD tidak lagi relevan",
      "Penurunan kasus berarti surveillance tidak dibutuhkan",
      "NTD sudah menjadi masalah kecil di semua kawasan",
      "Kemajuan telah terjadi, tetapi percepatan tetap diperlukan untuk mencapai target"
    ],
    correctIndex: 4,
    explanation: "Materi menyebut penurunan jumlah orang yang membutuhkan intervensi, tetapi target 2030 tetap belum on track."
  },

  {
    id: 30,
    text: "Data global menunjukkan healthy life expectancy meningkat cukup besar dari 2000 hingga 2019, tetapi pandemi menyebabkan kehilangan besar pada periode 2019–2021.\n\nInterpretasi yang paling tepat adalah...",
    options: [
      "Semua indikator kesehatan dunia selalu meningkat",
      "HALE hanya dipengaruhi penyakit kronis",
      "Pandemi tidak memengaruhi healthy life expectancy",
      "Penurunan mortalitas sebelumnya dapat terhapus sebagian oleh dampak krisis besar seperti COVID-19",
      "HALE tidak berkaitan dengan mortalitas"
    ],
    correctIndex: 3,
    explanation: "Materi WHO World Health Statistics 2025 menunjukkan HALE meningkat 2000–2019, lalu 2019–2021 mengalami kehilangan besar yang hampir seluruhnya terkait mortalitas COVID-19."
  },

  {
    id: 31,
    text: "WHO menggunakan kerangka target global yang kemudian direvisi untuk periode berikutnya. Salah satu sasaran utamanya terkait kehidupan yang lebih sehat, UHC, dan perlindungan dari keadaan darurat kesehatan.\n\nPaket sasaran tersebut merujuk pada...",
    options: [
      "GERMAS",
      "Three Delays",
      "Triple Billion",
      "PATUH",
      "5A"
    ],
    correctIndex: 2,
    explanation: "Materi mencantumkan Triple Billion dan revisinya menuju target global: healthier lives, UHC tanpa financial hardship, dan perlindungan terhadap health emergencies."
  },

  {
    id: 32,
    text: "Sebuah penelitian menemukan ketimpangan cakupan imunisasi lebih tinggi pada wilayah dengan ketimpangan gender yang lebih besar.\n\nMakna kebijakan yang paling tepat adalah...",
    options: [
      "Gender tidak berkaitan dengan imunisasi",
      "Cakupan imunisasi hanya ditentukan oleh ekonomi",
      "Semua wilayah memiliki hambatan yang identik",
      "Determinan sosial dan gender dapat memengaruhi akses serta pemanfaatan layanan kesehatan",
      "Masalah hanya dapat diselesaikan dengan menambah vaksin"
    ],
    correctIndex: 3,
    explanation: "Materi statistik WHO menunjukkan hubungan ketimpangan gender dengan cakupan imunisasi dan zero-dose vaccination, sehingga determinan sosial perlu diperhitungkan."
  },

  {
    id: 33,
    text: "Suatu negara mengalami penurunan kematian akibat infeksi, tetapi proporsi kematian akibat PTM meningkat.\n\nPerubahan tersebut paling tepat disebut sebagai...",
    options: [
      "Epidemiological transition",
      "Eradikasi penyakit",
      "Health security",
      "Social gradient",
      "Dependency transition"
    ],
    correctIndex: 0,
    explanation: "Materi menjelaskan pergeseran pola penyakit dari dominasi penyakit infeksi menuju peningkatan beban PTM seiring perubahan sosial dan epidemiologis."
  },

  {
    id: 34,
    text: "Pemerintah berfokus pada pengendalian obesitas karena pola makan buruk, aktivitas rendah, stres, tidur buruk, dan faktor sosial ekonomi.\n\nMengapa pendekatan tersebut harus multifaktor?",
    options: [
      "Obesitas hanya akibat makanan",
      "Obesitas hanya ditentukan genetik",
      "Obesitas adalah penyakit infeksi",
      "Obesitas hanya disebabkan hormon",
      "Obesitas merupakan kondisi kronis kompleks dengan banyak determinan"
    ],
    correctIndex: 4,
    explanation: "Materi menekankan obesitas sebagai chronic complex condition yang dipengaruhi diet, aktivitas, genetik, stres, penyakit, obat, tidur, dan faktor lain."
  },

  {
    id: 35,
    text: "Seorang pasien memiliki gejala haus, sering berkemih, lelah, dan penyembuhan luka lambat. Keluarga menganggap penyakit tersebut hanya sementara karena gejalanya dapat membaik.\n\nPenilaian yang paling tepat adalah...",
    options: [
      "Diabetes membutuhkan pengelolaan jangka panjang dan pengendalian faktor risiko",
      "Diabetes hanya muncul saat pasien lapar",
      "Diabetes termasuk penyakit menular",
      "Diabetes selalu sembuh tanpa intervensi",
      "Diabetes tidak berhubungan dengan gaya hidup"
    ],
    correctIndex: 0,
    explanation: "Diabetes merupakan PTM kronis dan pengendaliannya membutuhkan perubahan gaya hidup, pemantauan, serta pengobatan yang sesuai."
  },

  {
    id: 36,
    text: "Seorang pekerja tinggal dekat sumber polusi, terpapar asap rokok, dan mengalami obesitas. Ia kemudian mengalami batuk kronis dan sesak.\n\nKombinasi faktor tersebut paling konsisten dengan...",
    options: [
      "Thalassemia",
      "NTD",
      "IBD",
      "Chronic respiratory disease",
      "Measles"
    ],
    correctIndex: 3,
    explanation: "Materi chronic respiratory disease menyebut merokok, asap lingkungan, biomassa, obesitas, dan gaya hidup sebagai faktor penting."
  },

  {
    id: 37,
    text: "Seseorang ingin menurunkan risiko penyakit hati kronis. Ia berniat memperbaiki pola hidup dan berhati-hati menggunakan obat.\n\nStrategi yang paling tepat menurut materi adalah...",
    options: [
      "Menghindari alkohol, memperhatikan obat, menjaga berat badan, dan menerapkan gaya hidup sehat",
      "Mengonsumsi obat apa pun selama tidak merasa sakit",
      "Mengabaikan vaksinasi",
      "Meningkatkan konsumsi alkohol agar stres berkurang",
      "Hanya memeriksa tekanan darah"
    ],
    correctIndex: 0,
    explanation: "Pencegahan penyakit hati mencakup penghindaran alkohol, vaksinasi sesuai penyebab, penggunaan obat hati-hati, serta pola hidup sehat."
  },

  {
    id: 38,
    text: "Pasien dengan diabetes dan hipertensi berisiko mengalami gangguan fungsi ginjal.\n\nHubungan yang paling sesuai dengan materi adalah...",
    options: [
      "Ginjal tidak berhubungan dengan penyakit metabolik",
      "Diabetes dan hipertensi merupakan penyebab penting masalah ginjal",
      "Penyakit ginjal hanya disebabkan infeksi",
      "Penyakit ginjal hanya terjadi karena trauma",
      "Pengendalian gula dan tekanan darah tidak penting"
    ],
    correctIndex: 1,
    explanation: "Materi menyebut diabetes dan hipertensi sebagai penyebab penting chronic kidney disease/kidney failure, sehingga pengendalian keduanya penting."
  },

  {
    id: 39,
    text: "Seorang remaja mengalami kecemasan, tekanan sosial, pola makan buruk, dan mulai merokok. Ia dianggap \"belum perlu diperhatikan karena masih muda\".\n\nPernyataan yang paling tepat menurut life-course approach adalah...",
    options: [
      "Perilaku remaja tidak memengaruhi masa dewasa",
      "PTM selalu hanya muncul pada lansia",
      "Remaja tidak termasuk kelompok prioritas",
      "Masa remaja merupakan critical period yang dapat membentuk risiko kesehatan di masa dewasa",
      "Kesehatan mental tidak termasuk faktor kesehatan global"
    ],
    correctIndex: 3,
    explanation: "Materi menempatkan pubertas sebagai critical period. Kesehatan mental, perilaku berisiko, dan gaya hidup dapat memengaruhi risiko jangka panjang."
  },

  {
    id: 40,
    text: "Seorang pengguna kursi roda tidak dapat menggunakan fasilitas umum karena tidak tersedia akses fisik dan informasi yang dapat diakses.\n\nMenurut pendekatan social/human-rights model, kebijakan yang paling tepat adalah...",
    options: [
      "Menghilangkan hambatan lingkungan dan meningkatkan aksesibilitas",
      "Hanya fokus pada diagnosis medis",
      "Meminta individu menyesuaikan diri sepenuhnya",
      "Mengurangi akses ke fasilitas publik",
      "Memisahkan semua pengguna disabilitas"
    ],
    correctIndex: 0,
    explanation: "Social model menekankan bahwa hambatan lingkungan, komunikasi, stigma, dan desain layanan dapat menciptakan disability; karena itu lingkungan harus dibuat inklusif."
  },

  {
    id: 41,
    text: "Sebuah desa berjarak jauh dari rumah sakit rujukan. Puskesmas memiliki keterbatasan tenaga dan obat. Pasien hipertensi dan diabetes sering tidak kontrol karena ongkos perjalanan, jam layanan tidak sesuai jam kerja, dan keluarga menganggap pengobatan tidak penting bila tidak ada gejala.\n\nTim kesehatan ingin mencari solusi.\n\nKesimpulan paling tepat adalah...",
    options: [
      "Masalah utamanya hanya ketidakpatuhan pasien",
      "Solusi harus memadukan akses, tenaga, obat, edukasi, keluarga, pembiayaan, dan penguatan PHC",
      "Solusi terbaik hanya membangun rumah sakit tersier",
      "Cukup memberikan kartu jaminan kesehatan",
      "Cukup meningkatkan jumlah brosur"
    ],
    correctIndex: 1,
    explanation: "Ini contoh system thinking. Materi menunjukkan bahwa masalah kesehatan tidak boleh disederhanakan sebagai \"pasien tidak patuh\"; ada hambatan transportasi, biaya, jam pelayanan, tenaga, obat, health literacy, dan dukungan keluarga. PHC menjadi titik penting untuk memperbaiki akses, kesinambungan, edukasi, koordinasi, dan rujukan."
  },

  // ════════════════════════════════════════════════
  // SIMULASI — FALSAFAH & TEORI KEPERAWATAN 50 SOAL (Index 50-99)
  // ════════════════════════════════════════════════

  {
    id: 51,
    text: "Seorang perawat memiliki dua pilihan intervensi yang secara klinis sama-sama efektif. Pilihan pertama lebih cepat, tetapi mengabaikan preferensi pasien. Pilihan kedua membutuhkan dialog lebih lama tetapi sesuai nilai dan tujuan pasien.\n\nDalam sudut pandang falsafah keperawatan, pilihan kedua lebih tepat terutama karena mempertimbangkan...",
    options: [
      "Nilai dan makna tindakan",
      "Kecepatan prosedur",
      "Jumlah tenaga",
      "Hasil laboratorium saja",
      "Efisiensi administrasi"
    ],
    correctIndex: 0,
    explanation: "Falsafah memberi arah nilai dan makna. Tindakan yang efektif secara teknis tetap perlu mempertimbangkan manusia yang menerima tindakan tersebut."
  },

  {
    id: 52,
    text: "Seorang mahasiswa menyebut pertanyaan \"Bagaimana seseorang mengetahui bahwa informasi kesehatan itu benar?\" sebagai ontologi.\n\nKoreksi paling tepat adalah...",
    options: [
      "Pertanyaan tersebut membahas martabat",
      "Pertanyaan tersebut termasuk epistemologi",
      "Pertanyaan tersebut termasuk aksiologi",
      "Pertanyaan tersebut merupakan diagnosis",
      "Pertanyaan tersebut hanya statistik"
    ],
    correctIndex: 1,
    explanation: "Epistemologi membahas bagaimana pengetahuan diperoleh dan dibenarkan. Ini berbeda dari ontologi yang membahas hakikat sesuatu."
  },

  {
    id: 53,
    text: "Dalam rapat etik, perawat berkata, \"Walaupun tindakan ini bermanfaat secara medis, kita harus mempertimbangkan apakah pasien memahami pilihan dan apakah keputusan tersebut menghormati dirinya.\"\n\nCara berpikir tersebut terutama merupakan penerapan...",
    options: [
      "Fisiologi",
      "Aksiologi",
      "Morfologi",
      "Anatomi",
      "Statistik"
    ],
    correctIndex: 1,
    explanation: "Aksiologi menilai nilai dan tujuan tindakan serta persoalan moral seperti martabat, keadilan, berbuat baik, dan tidak merugikan."
  },

  {
    id: 54,
    text: "Peneliti ingin mengetahui apakah pasien merasa hidupnya tetap bermakna setelah diagnosis kronis. Agar pengukuran tidak kehilangan arah, langkah filosofis yang paling mendasar adalah...",
    options: [
      "Langsung menentukan ukuran laboratorium",
      "Mengganti semua data kualitatif dengan angka",
      "Menjelaskan terlebih dahulu makna konsep \"hidup berkualitas\"",
      "Meminta keluarga menentukan definisi",
      "Menghapus aspek subjektif"
    ],
    correctIndex: 2,
    explanation: "Materi menekankan bahwa konsep harus jelas sebelum diukur. Falsafah membantu memberi makna terhadap konsep tersebut."
  },

  {
    id: 55,
    text: "Manakah pasangan yang paling tepat?",
    options: [
      "Ontologi - nilai moral",
      "Epistemologi - sumber dan pembenaran pengetahuan",
      "Aksiologi - hakikat manusia",
      "Ontologi - cara memperoleh data",
      "Aksiologi - metode penelitian"
    ],
    correctIndex: 1,
    explanation: "Epistemologi berkaitan dengan bagaimana pengetahuan diperoleh dan dibenarkan."
  },

  {
    id: 56,
    text: "Perawat mengetahui bahwa keputusan klinisnya dipengaruhi oleh kekuasaan profesional. Ia kemudian memastikan hubungan dengan pasien tidak berubah menjadi dominasi.\n\nHal tersebut merupakan bentuk penerapan...",
    options: [
      "Reduksionisme",
      "Paradigma positivistik",
      "Pengukuran kuantitatif",
      "Pengembangan prosedur",
      "Aksiologi dan refleksi etis"
    ],
    correctIndex: 4,
    explanation: "Materi menyebut aksiologi juga menuntut perawat memahami kekuasaan dalam hubungan klinis agar bantuan tidak berubah menjadi dominasi."
  },

  {
    id: 57,
    text: "Manakah pernyataan yang paling kuat menjelaskan mengapa falsafah dibutuhkan meskipun perawat telah memiliki keterampilan klinis?",
    options: [
      "Falsafah memberi arah agar keterampilan digunakan secara manusiawi dan etis",
      "Falsafah menggantikan keterampilan klinis",
      "Falsafah menghapus kebutuhan bukti",
      "Falsafah membuat prosedur tidak diperlukan",
      "Falsafah mengganti diagnosis"
    ],
    correctIndex: 0,
    explanation: "Falsafah tidak menggantikan keterampilan klinis. Fungsinya memberi arah moral dan makna pada penggunaan keterampilan."
  },

  {
    id: 58,
    text: "Seorang perawat menggunakan hasil wawancara pasien bersama data kuantitatif untuk memahami suatu masalah.\n\nPendekatan ini menunjukkan bahwa pengetahuan keperawatan...",
    options: [
      "Hanya berasal dari statistik",
      "Hanya berasal dari pengalaman",
      "Dapat berasal dari beragam sumber sesuai tujuan pengetahuan",
      "Tidak memerlukan bukti",
      "Hanya berasal dari dokter"
    ],
    correctIndex: 2,
    explanation: "Materi menyebut riset, pengalaman klinis, refleksi etik, pengetahuan pasien, dan konteks budaya sebagai sumber pengetahuan."
  },

  {
    id: 59,
    text: "Seorang peneliti ingin memahami pengalaman pasien ketika kehilangan kemampuan bekerja setelah sakit kronis. Ia fokus pada makna pengalaman tersebut, bukan pada hubungan sebab-akibat statistik.\n\nParadigma yang paling sesuai adalah...",
    options: [
      "Positivistik",
      "Kritis",
      "Pragmatis",
      "Biomedis",
      "Interpretif"
    ],
    correctIndex: 4,
    explanation: "Interpretif menekankan makna pengalaman yang dialami manusia."
  },

  {
    id: 60,
    text: "Ketika peneliti memilih metode berdasarkan jenis masalah yang hendak diselesaikan, tanpa terikat pada satu metode tertentu, ia menggunakan orientasi...",
    options: [
      "Kritis",
      "Positivistik",
      "Pragmatis",
      "Spiritual",
      "Reduksionistik"
    ],
    correctIndex: 2,
    explanation: "Paradigma pragmatis memilih metode berdasarkan masalah yang dihadapi."
  },

  {
    id: 61,
    text: "Seorang perawat memandang manusia sebagai individu yang sekaligus dapat dipengaruhi keluarga, masyarakat, budaya, dan lingkungan.\n\nKonsep tersebut menunjukkan manusia sebagai...",
    options: [
      "Objek tertutup",
      "Diagnosis biologis",
      "Unit statis",
      "Sistem tertutup",
      "Sistem terbuka"
    ],
    correctIndex: 4,
    explanation: "Manusia sebagai sistem terbuka berarti terus berinteraksi dengan lingkungan dan menerima maupun memberi pengaruh."
  },

  {
    id: 62,
    text: "Perawat menemukan bahwa kecemasan pasien meningkat setelah keluarga datang membawa informasi yang salah.\n\nDalam perspektif metaparadigma, keluarga dalam situasi ini terutama dipandang sebagai bagian dari...",
    options: [
      "Organ",
      "Sistem fisiologis",
      "Lingkungan",
      "Diagnosis",
      "Prosedur"
    ],
    correctIndex: 2,
    explanation: "Lingkungan dalam paradigma keperawatan dapat mencakup lingkungan sosial, termasuk hubungan dan pengaruh keluarga."
  },

  {
    id: 63,
    text: "Seorang pasien kronis memiliki penyakit yang tidak dapat hilang sepenuhnya tetapi mampu bekerja, bersosialisasi, dan mengendalikan gejalanya.\n\nPernyataan yang paling sesuai dengan paradigma keperawatan adalah...",
    options: [
      "Pasien pasti tidak sehat",
      "Kesehatan hanya ditentukan diagnosis",
      "Fungsi tidak berhubungan dengan kesehatan",
      "Kesehatan dapat tetap dipahami sebagai proses adaptasi dan kesejahteraan",
      "Kesehatan hanya ditentukan laboratorium"
    ],
    correctIndex: 3,
    explanation: "Materi menyatakan kesehatan dapat dipahami sebagai kemampuan berfungsi, beradaptasi, kenyamanan, integrasi, dan kesejahteraan."
  },

  {
    id: 64,
    text: "Paradigma terutama memberi fungsi sebagai...",
    options: [
      "Daftar prosedur teknis",
      "Pengganti teori",
      "Pengganti evidence",
      "Alat menentukan dosis",
      "Lensa untuk memilih masalah, data, dan cara mengetahui"
    ],
    correctIndex: 4,
    explanation: "Paradigma berfungsi seperti lensa yang membentuk pertanyaan, konsep, metode, dan cara menafsirkan data."
  },

  {
    id: 65,
    text: "Peneliti menilai apakah pembagian layanan tertentu membuat kelompok masyarakat miskin memiliki akses lebih buruk. Fokus pada ketidakadilan tersebut paling dekat dengan paradigma...",
    options: [
      "Positivistik",
      "Interpretif",
      "Pragmatis",
      "Biomedis",
      "Kritis"
    ],
    correctIndex: 4,
    explanation: "Paradigma kritis digunakan untuk menilai kekuasaan dan ketidakadilan."
  },

  {
    id: 66,
    text: "Empat konsep metaparadigma dapat dibedakan dari konsep \"paradigma\" karena...",
    options: [
      "Metaparadigma merupakan alat ukur",
      "Metaparadigma berisi empat konsep payung dalam disiplin keperawatan",
      "Metaparadigma sama dengan diagnosis",
      "Metaparadigma hanya membahas pasien",
      "Metaparadigma merupakan teori klinis spesifik"
    ],
    correctIndex: 1,
    explanation: "Metaparadigma mencakup manusia, kesehatan, lingkungan, dan keperawatan sebagai konsep paling luas dalam disiplin."
  },

  {
    id: 67,
    text: "Pasien menunjukkan nyeri yang makin berat setelah berkonflik dengan keluarganya. Perawat menyadari perubahan emosional dan sosial tersebut dapat berhubungan dengan keluhan fisik.\n\nCara berpikir paling tepat adalah...",
    options: [
      "Mekanistik",
      "Biomedis murni",
      "Holistik",
      "Administratif",
      "Reduksionistik"
    ],
    correctIndex: 2,
    explanation: "Holisme melihat keterhubungan antar dimensi. Kondisi fisik, psikologis, dan sosial tidak dipisahkan secara kaku."
  },

  {
    id: 68,
    text: "Dalam konsep humanisme, pasien terutama dipandang sebagai...",
    options: [
      "Objek intervensi",
      "Diagnosis",
      "Manusia dengan nilai, martabat, kebebasan, dan pengalaman",
      "Penerima prosedur",
      "Kumpulan gejala"
    ],
    correctIndex: 2,
    explanation: "Humanisme menekankan manusia sebagai individu bermartabat, bukan sekadar objek pelayanan."
  },

  {
    id: 69,
    text: "Perawat berkata, \"Bapak yang paling tahu apa yang paling bermakna bagi Bapak. Saya akan memberi informasi agar kita bisa memilih dengan aman.\"\n\nPernyataan tersebut paling kuat menunjukkan...",
    options: [
      "Dominasi profesional",
      "Pengganti pasien",
      "Otonomi dan kemitraan",
      "Penghapusan peran perawat",
      "Keluarga sebagai pengambil keputusan utama"
    ],
    correctIndex: 2,
    explanation: "Humanisme menekankan otonomi, pilihan pasien, dan hubungan kemitraan."
  },

  {
    id: 70,
    text: "Sebuah intervensi komplementer memiliki bukti terbatas tetapi banyak diminati pasien.\n\nTindakan perawat yang paling tepat adalah...",
    options: [
      "Mengkaji manfaat, risiko, kompetensi, dan preferensi pasien sebelum mengambil keputusan",
      "Langsung menyatakan aman",
      "Langsung melarang tanpa penjelasan",
      "Mengikuti tren",
      "Membiarkan pasien mencoba tanpa pengkajian"
    ],
    correctIndex: 0,
    explanation: "Holistic care tetap harus mempertahankan keselamatan dan integritas ilmiah. Popularitas bukan dasar tunggal pemilihan intervensi."
  },

  {
    id: 71,
    text: "Pasien mengatakan, \"Saya takut penyakit saya membuat saya tidak lagi berguna bagi keluarga.\"\n\nRespons awal perawat yang paling sesuai dengan humanisme adalah...",
    options: [
      "Mengeksplorasi perasaan dan makna pengalaman pasien",
      "Segera mengganti topik",
      "Memberi nasihat tanpa mendengarkan",
      "Hanya mengukur tanda vital",
      "Meminta keluarga menjawab"
    ],
    correctIndex: 0,
    explanation: "Humanisme membutuhkan empati, caring, dan perhatian pada makna pengalaman pasien."
  },

  {
    id: 72,
    text: "Seorang pasien memiliki kebutuhan fisik yang kompleks, tetapi juga membutuhkan dukungan sosial dan spiritual. Mengapa pendekatan kolaboratif diperlukan?",
    options: [
      "Karena perawat tidak boleh melakukan pengkajian",
      "Karena kebutuhan manusia yang multidimensional dapat membutuhkan kompetensi berbagai profesi",
      "Karena keluarga tidak diperlukan",
      "Karena perawat hanya boleh bekerja administratif",
      "Karena seluruh tindakan harus dialihkan"
    ],
    correctIndex: 1,
    explanation: "Materi menjelaskan bahwa kebutuhan pasien dapat melibatkan dokter, ahli gizi, psikolog, pekerja sosial, rohaniwan, dan tenaga lain."
  },

  {
    id: 73,
    text: "Pasangan konsep yang paling tepat untuk membedakan fokus holisme dan humanisme adalah...",
    options: [
      "Memahami keseluruhan manusia - memperlakukan manusia secara bermartabat",
      "Obat - laboratorium",
      "Diagnosis - terapi",
      "Keluarga - rumah sakit",
      "Spiritual - biologis"
    ],
    correctIndex: 0,
    explanation: "Holisme menjawab bagaimana memahami keseluruhan manusia, sedangkan humanisme menekankan bagaimana manusia diperlakukan."
  },

  {
    id: 74,
    text: "Pasien memilih untuk melibatkan keluarga dalam pengambilan keputusan. Perawat tetap memastikan pasien memahami informasi dan memiliki suara dalam keputusan.\n\nHal ini paling sesuai dengan...",
    options: [
      "Otonomi yang tetap dipahami dalam konteks sosial dan budaya",
      "Penghapusan otonomi",
      "Keputusan keluarga",
      "Paternalistik",
      "Ketergantungan mutlak"
    ],
    correctIndex: 0,
    explanation: "Humanisme tidak berarti pasien harus terpisah dari keluarga. Yang penting adalah pilihan pasien tetap dihormati."
  },

  {
    id: 75,
    text: "Dalam holistic care, lingkungan tidak hanya berarti suhu dan kebersihan. Lingkungan juga dapat memengaruhi...",
    options: [
      "Hanya diagnosis",
      "Hanya tekanan darah",
      "Hanya spiritualitas",
      "Keputusan kesehatan, kenyamanan, dan proses pemulihan",
      "Hanya fungsi organ"
    ],
    correctIndex: 3,
    explanation: "Materi memuat lingkungan fisik, sosial, budaya, bahkan lingkungan informasi dan digital."
  },

  {
    id: 76,
    text: "Perawat menghadapi pasien dengan masalah yang melampaui kemampuan profesionalnya. Ia menolak memberikan tindakan di luar kompetensi dan mengatur kolaborasi yang tepat.\n\nIni paling mencerminkan prinsip...",
    options: [
      "Efisiensi",
      "Individualitas",
      "Popularitas",
      "Paternalistik",
      "Keselamatan dan profesionalisme dalam holistic care"
    ],
    correctIndex: 4,
    explanation: "Holistic care tidak berarti perawat mengerjakan semuanya sendiri. Keselamatan dan kompetensi tetap menjadi batas."
  },

  {
    id: 77,
    text: "Sebuah teori terdiri dari konsep-konsep yang berkaitan, tetapi mahasiswa menjelaskan hubungan di antaranya tanpa menyebut aturan atau prosedur.\n\nKomponen yang menjelaskan hubungan antarkonsep tersebut adalah...",
    options: [
      "Asumsi",
      "Proposisi",
      "Indikator",
      "Definisi",
      "Metode"
    ],
    correctIndex: 1,
    explanation: "Proposisi menjelaskan hubungan antarkonsep dalam suatu teori."
  },

  {
    id: 78,
    text: "Perawat memilih grand theory untuk membantu orientasi umum terhadap pasien, kemudian menggunakan teori rentang menengah untuk fokus pada fenomena yang lebih spesifik.\n\nKeputusan tersebut tepat karena...",
    options: [
      "Tingkat teori dapat disesuaikan dengan kebutuhan dan konteks fenomena",
      "Grand theory selalu lebih benar",
      "Middle-range selalu lebih unggul",
      "Teori tidak perlu dipilih",
      "Semua teori harus digunakan sekaligus"
    ],
    correctIndex: 0,
    explanation: "Materi menyebut grand theory berguna untuk orientasi umum, sedangkan middle-range lebih dekat ke fenomena spesifik."
  },

  {
    id: 79,
    text: "Konsep abstrak \"kenyamanan\" diubah menjadi beberapa indikator yang dapat dinilai.\n\nHal tersebut disebut...",
    options: [
      "Generalisasi",
      "Observasi",
      "Operasionalisasi",
      "Terminasi",
      "Interpretasi"
    ],
    correctIndex: 2,
    explanation: "Operasionalisasi menjadikan konsep abstrak lebih konkret agar dapat digunakan dalam pengkajian atau evaluasi."
  },

  {
    id: 80,
    text: "Sebuah penelitian menemukan bahwa hubungan antara konsep dalam teori tidak sesuai dengan data lapangan.\n\nSikap ilmiah terhadap teori adalah...",
    options: [
      "Teori harus dianggap selalu benar",
      "Data harus dibuang",
      "Teori tidak boleh berubah",
      "Temuan dapat digunakan untuk memodifikasi atau mengkritik teori",
      "Penelitian harus dihentikan"
    ],
    correctIndex: 3,
    explanation: "Hubungan teori dan penelitian bersifat siklik. Hasil penelitian dapat mendukung, memodifikasi, atau mengkritik teori."
  },

  {
    id: 81,
    text: "Teori yang paling tepat digunakan ketika perawat menghadapi proses edukasi yang sangat spesifik pada kelompok tertentu adalah...",
    options: [
      "Grand theory",
      "Practice theory",
      "Metaparadigma",
      "Falsafah",
      "Paradigma"
    ],
    correctIndex: 1,
    explanation: "Practice theory memiliki fokus sangat spesifik dan dekat dengan proses klinis."
  },

  {
    id: 82,
    text: "Seorang perawat memilih teori tertentu hanya karena tokohnya terkenal.\n\nMengapa alasan tersebut dianggap tidak memadai?",
    options: [
      "Semua teori harus ditolak",
      "Teori tidak boleh digunakan",
      "Teori hanya untuk penelitian",
      "Popularitas selalu salah",
      "Teori harus dipilih berdasarkan kesesuaian dengan fenomena dan tujuan"
    ],
    correctIndex: 4,
    explanation: "Popularitas tokoh bukan kriteria utama. Yang penting adalah kesesuaian teori dengan masalah dan konteks."
  },

  {
    id: 83,
    text: "Perawat menggabungkan konsep dukungan keluarga dari satu teori dengan konsep adaptasi dari teori lain. Agar penggabungan tidak menjadi sekadar tempelan, perawat harus...",
    options: [
      "Menghapus salah satu teori",
      "Menggunakan teori yang lebih terkenal",
      "Menjelaskan hubungan logis antarkonsep",
      "Menghindari evaluasi",
      "Memakai keduanya tanpa alasan"
    ],
    correctIndex: 2,
    explanation: "Penggabungan teori membutuhkan alasan dan logika hubungan yang jelas."
  },

  {
    id: 84,
    text: "Teori disebut memiliki keterujian bila...",
    options: [
      "Teori tidak pernah boleh dikritik",
      "Teori selalu menghasilkan hasil yang sama",
      "Teori dapat dinilai melalui observasi atau penelitian",
      "Teori harus berusia puluhan tahun",
      "Teori wajib menjadi hukum"
    ],
    correctIndex: 2,
    explanation: "Keterujian berarti konsep atau hubungan dalam teori dapat dinilai melalui observasi atau penelitian."
  },

  {
    id: 85,
    text: "Pasien tinggal di rumah yang lembap dan penuh jamur. Perawat tidak sekadar memberikan obat, tetapi mengidentifikasi sumber kelembapan dan membahas pilihan perbaikan yang realistis bersama keluarga.\n\nPendekatan tersebut paling kuat mencerminkan...",
    options: [
      "Teori interpersonal",
      "Teori lingkungan Nightingale",
      "Teori humanisme saja",
      "Teori kebutuhan Henderson",
      "Teori adaptasi"
    ],
    correctIndex: 1,
    explanation: "Nightingale menempatkan lingkungan sebagai faktor yang dapat membantu atau menghambat penyembuhan."
  },

  {
    id: 86,
    text: "Dalam konsep Nightingale, tindakan berikut yang paling jelas merupakan manajemen lingkungan adalah...",
    options: [
      "Mengubah diagnosis medis",
      "Menambah obat tanpa pengkajian",
      "Menentukan jenis kelamin pasien",
      "Memperbaiki ventilasi dan menjaga kebersihan",
      "Mengurangi komunikasi"
    ],
    correctIndex: 3,
    explanation: "Ventilasi dan kebersihan merupakan bagian penting lingkungan menurut Nightingale."
  },

  {
    id: 87,
    text: "Setelah perawat menurunkan kebisingan dan mengatur pencahayaan, kualitas tidur pasien membaik.\n\nYang paling tepat disimpulkan adalah...",
    options: [
      "Semua masalah pasien berasal dari lingkungan",
      "Lingkungan dapat menjadi faktor yang memengaruhi pemulihan",
      "Diagnosis medis tidak penting",
      "Obat tidak lagi dibutuhkan",
      "Psikologi pasien tidak relevan"
    ],
    correctIndex: 1,
    explanation: "Teori Nightingale tidak mengatakan semua masalah berasal dari lingkungan. Intinya adalah lingkungan dapat membantu atau menghambat kondisi pasien."
  },

  {
    id: 88,
    text: "Mengapa statistik penting dalam kontribusi Nightingale?",
    options: [
      "Sebagai alat untuk mendukung advokasi perubahan dan kebijakan kesehatan",
      "Untuk menggantikan observasi",
      "Untuk menentukan kepribadian pasien",
      "Untuk menilai budaya",
      "Untuk menghilangkan kebutuhan dokumentasi"
    ],
    correctIndex: 0,
    explanation: "Nightingale menggunakan statistik dan dokumentasi untuk memperlihatkan dampak kondisi pelayanan serta mendorong reformasi."
  },

  {
    id: 89,
    text: "Di daerah pertanian, perawat menemukan pekerja terpapar panas, pestisida, debu, alat kerja, dan kurang akses air.\n\nBerdasarkan prinsip Nightingale, fokus utamanya adalah...",
    options: [
      "Mengganti pekerjaan pasien",
      "Memberikan obat tanpa mengubah lingkungan",
      "Mengidentifikasi dan memodifikasi faktor lingkungan yang dapat dikelola",
      "Mengabaikan kondisi kerja",
      "Fokus pada genetika"
    ],
    correctIndex: 2,
    explanation: "Materi agronursing mengembangkan prinsip lingkungan Nightingale ke kondisi kerja pertanian."
  },

  {
    id: 90,
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
    id: 91,
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
    id: 92,
    text: "Kritik terhadap Nightingale justru menunjukkan bahwa teori tersebut dalam konteks modern perlu dipadukan dengan...",
    options: [
      "Penghapusan lingkungan",
      "Person-centred care dan determinan sosial",
      "Farmakologi saja",
      "Teori penyakit",
      "Diagnosis medis"
    ],
    correctIndex: 1,
    explanation: "Materi menyebut keterbatasan penekanan pada lingkungan fisik perlu dilengkapi dengan pendekatan yang lebih berpusat pada pasien dan determinan sosial."
  },

  {
    id: 93,
    text: "Seorang pasien stroke mampu mandi sendiri, tetapi perlu bantuan saat mengenakan pakaian karena kelemahan satu tangan.\n\nPrinsip Henderson yang paling tepat adalah...",
    options: [
      "Mengganti semua aktivitas pasien",
      "Membiarkan pasien tanpa bantuan",
      "Menyerahkan seluruh perawatan kepada keluarga",
      "Fokus hanya pada penyakit",
      "Memberikan bantuan pada bagian yang belum mampu dilakukan pasien"
    ],
    correctIndex: 4,
    explanation: "Bantuan Henderson bersifat sesuai kebutuhan. Perawat tidak mengambil alih aktivitas yang masih dapat dilakukan pasien."
  },

  {
    id: 94,
    text: "Pasien dapat berjalan dengan alat bantu, tetapi keluarga selalu mendorong kursi roda agar pasien tidak perlu berusaha.\n\nDari sudut pandang Henderson, risiko utama tindakan keluarga tersebut adalah...",
    options: [
      "Peningkatan kemampuan",
      "Pemulihan lebih cepat",
      "Peningkatan otonomi",
      "Ketergantungan yang tidak perlu",
      "Peningkatan kemampuan adaptasi"
    ],
    correctIndex: 3,
    explanation: "Mengambil alih aktivitas yang sebenarnya masih dapat dilakukan pasien dapat menghambat perkembangan kemandirian."
  },

  {
    id: 95,
    text: "Dalam pengkajian Henderson, seorang pasien mengatakan belum memahami penyakit dan cara menggunakan alat bantu.\n\nMasalah paling dekat dengan konsep...",
    options: [
      "Gangguan eliminasi",
      "Gangguan suhu",
      "Defisit pengetahuan",
      "Masalah rekreasi",
      "Masalah spiritual"
    ],
    correctIndex: 2,
    explanation: "Henderson menempatkan pengetahuan sebagai salah satu unsur inti kemandirian. Kekurangan pengetahuan dapat menghambat kemampuan pasien."
  },

  {
    id: 96,
    text: "Seorang pasien memahami seluruh instruksi, tetapi secara fisik belum mampu melakukan aktivitas tertentu.\n\nMenurut kerangka Henderson, kekurangan yang paling dominan adalah...",
    options: [
      "Kekuatan",
      "Kemauan",
      "Spiritual",
      "Budaya",
      "Komunikasi"
    ],
    correctIndex: 0,
    explanation: "Henderson membedakan kekuatan, kemauan, dan pengetahuan. Bila informasi sudah dipahami tetapi kemampuan fisik tidak mencukupi, masalah terutama berkaitan dengan kekuatan."
  },

  {
    id: 97,
    text: "Pasien mengatakan, \"Saya tahu caranya dan sebenarnya saya bisa, tetapi saya tidak mau mencoba karena merasa percuma.\"\n\nFokus pengkajian Henderson yang paling perlu diperhatikan adalah...",
    options: [
      "Kekuatan",
      "Kemauan",
      "Pengetahuan",
      "Suhu",
      "Eliminasi"
    ],
    correctIndex: 1,
    explanation: "Pengetahuan dan kemampuan mungkin ada, tetapi kemauan menjadi hambatan utama."
  },

  {
    id: 98,
    text: "Pasien diajarkan menggunakan alat bantu sebelum pulang, kemudian diminta mendemonstrasikan kembali.\n\nAlasan tindakan tersebut paling sesuai dengan Henderson adalah...",
    options: [
      "Mengurangi keterlibatan pasien",
      "Menggantikan keluarga",
      "Memperkuat kemampuan pasien untuk melakukan aktivitas secara mandiri",
      "Menghilangkan kebutuhan evaluasi",
      "Meningkatkan ketergantungan"
    ],
    correctIndex: 2,
    explanation: "Edukasi dan latihan diarahkan untuk meningkatkan kemampuan pasien, bukan membuat pasien semakin tergantung."
  },

  {
    id: 99,
    text: "Dalam budaya kekeluargaan, pasien memilih tetap dibantu anggota keluarga untuk beberapa aktivitas.\n\nInterpretasi paling tepat adalah...",
    options: [
      "Pasien pasti tidak mandiri",
      "Keluarga harus dilarang membantu",
      "Teori Henderson tidak dapat digunakan",
      "Kemandirian harus berarti melakukan semuanya sendiri",
      "Dukungan keluarga dapat menjadi bagian dari kemandirian bila pasien tetap memiliki kemampuan dan pilihan"
    ],
    correctIndex: 4,
    explanation: "Materi secara khusus menekankan bahwa kemandirian perlu ditafsirkan sesuai budaya. Hubungan saling mendukung tidak otomatis bertentangan dengan kemandirian."
  },

  {
    id: 100,
    text: "Pasien pascaoperasi awalnya membutuhkan bantuan penuh saat berpindah. Tiga hari kemudian ia dapat berdiri dengan bantuan minimal. Perawat mencatat perubahan tersebut dan mengurangi bantuan secara bertahap.\n\nFokus utama tindakan tersebut adalah...",
    options: [
      "Perkembangan menuju kemandirian",
      "Meningkatkan ketergantungan",
      "Menghapus peran perawat",
      "Mengganti semua aktivitas pasien",
      "Mengutamakan tindakan medis saja"
    ],
    correctIndex: 0,
    explanation: "Dalam Henderson, perkembangan tingkat bantuan perlu didokumentasikan karena tujuan utama keperawatan adalah membantu pasien mencapai kemampuan optimal dan semakin mandiri."
  }
];

export default questions;
