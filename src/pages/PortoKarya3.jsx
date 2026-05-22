import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ============================================================
   DATA
   ============================================================ */

const FILMS = [
  {
    id: 1,
    number: "Film #01",
    year: 2023,
    title: "Pramu Rasa",
    subtitle: "Cerita Pendek · 2023 · Produksi Perdana Sinematura",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2023" },
      { icon: "fa-solid fa-film", text: "Film Pendek" },
      { icon: "fa-solid fa-user-graduate", text: "Tanpa Pembina" },
    ],
    youtubeId: "7BBXPscn8cA",
    synopsisLabel: "Sinopsis",
    synopsis:
      "Pak Rehan adalah seorang pramukebun di sebuah SMA yang berusia 35 tahun, memiliki seorang istri dan tiga anak. Meski hidup sederhana, ia berjuang keras demi pendidikan anak-anaknya. Suatu hari, ia tergerak untuk mendaftar CPNS — namun keterbatasan kemampuan mengoperasikan ponsel menjadi hambatan. Dengan bantuan para siswa, Pak Rehan belajar menguasai teknologi, mengenal berbagai aplikasi, dan akhirnya berhasil mengisi formulir pendaftaran secara daring. Meski pendaftarannya dinyatakan gagal karena beberapa syarat yang tidak terpenuhi, Pak Rehan tetap bersyukur — ia kini lebih melek teknologi, dan itu adalah kemenangan tersendiri.",
    prodChips: [
      { label: "Editor", value: "Akhdan Hafiz Anugrah" },
      { label: "Sutradara", value: "Robith Bil Haq Zidni Ilma" },
    ],
    crew: [
      { role: "Production Manager", name: "Trizha Nur Hidayah Putri" },
      { role: "Sutradara", name: "Robith Bil Haq Zidni Ilma" },
      { role: "DOP", name: "Ibni Geo Vanni Yafi" },
      { role: "Kameramen", name: "Hermawan Ibra Wicaksono" },
      { role: "Asisten Kameramen", name: "Aldo Leo Saputra" },
      { role: "Penulis Naskah", name: "Fikriyyah Putri Salsabila" },
      { role: "Make Up Artist", name: "Qomariyah Agustin" },
      { role: "Lightingman", name: "Ahmad Faiz Raihan Aleghani" },
      { role: "Script Supervisor", name: "Emelie Naura Ramadhani" },
      { role: "Editor", name: "Akhdan Hafiz Anugrah" },
      { role: "Art Director", name: "Dina Putri Yani" },
    ],
    cast: [
      { role: "Mr. Rehan", name: "Tatag Dwi Prasetya" },
      { role: "Mrs. Dini", name: "Naura Lintang Aliandya" },
      { role: "Aldo", name: "Royfando Bryanda Arkananta" },
      { role: "Mega", name: "Erika Puspita Sari" },
      { role: "Sari", name: "Ummi Zamzamah Firdausyah" },
    ],
  },
  {
    id: 2,
    number: "Film #02",
    year: 2023,
    title: "SARKA",
    subtitle: "Film Pendek — TANOS SMA 2023 · SMAN 1 Kraksaan",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2023" },
      { icon: "fa-solid fa-film", text: "Film Pendek" },
      { icon: "fa-solid fa-chalkboard-teacher", text: "Pembina: Moh. Adibillah" },
    ],
    youtubeId: "VkqqE4hoP_U",
    synopsisLabel: "Sinopsis",
    synopsis:
      "Raka, seorang siswa SMA, memiliki ketertarikan mendalam di bidang lingkungan — khususnya pengolahan sampah dan barang bekas. Pemikirannya yang visioner dan pengetahuannya tentang teknologi pengolahan sampah di negara-negara maju membuatnya penuh semangat untuk menyuarakan gagasannya di kelas. Namun respons teman-temannya jauh dari yang diharapkan. Mereka mendebati, mengolok-olok, bahkan menaruh sampah di tasnya dan melemparinya dengan botol bekas. Raka jengkel dan marah — tapi ia tidak menyerah. Ia terus berdiri untuk apa yang ia percayai, karena harapannya terhadap masa depan lingkungan lebih besar dari rasa sakit yang ia terima.",
    prodChips: [
      { label: "Pembina", value: "Mohammad Adibillah, S.Psi., Gr." },
      { label: "Editor", value: "Aldo Leo Saputra" },
    ],
    igLink: "https://www.instagram.com/sine_matura?igsh=MWQ1MXptNHp6cm0xNw==",
    crew: [
      { role: "Ketua Produksi", name: "Robith Bil Haq Zidni Ilma" },
      { role: "Sutradara", name: "Diva Triwahyuningsih" },
      { role: "DOP", name: "Trizha Nur Hidayah Putri" },
      { role: "Kameramen", name: "Akhdan Hafiz Anugrah" },
      { role: "Asisten Kameramen", name: "Ibni Gio Vanni Yafi" },
      { role: "Editor", name: "Muhammad Rajendra R.A & Aldo Leo Saputra" },
      { role: "Pencatat Adegan", name: "Emelie Naura Ramadhani & Wadillah Callysta Widya Dhana" },
      { role: "Lightningman", name: "Alvarel Bagasdika Pratama & Zafa Islamay Pratama Putra" },
      { role: "Audioman", name: "Hermawan Ibra Wicaksono & Ahmad Faiz Aleghani" },
      { role: "Make Up Artist", name: "Dina Putri Yani & Shahwah Nabila Anadi" },
      { role: "Penata Artistik", name: "Emeilia Nurul Faida, Qomariya Agustin, Erika Puspita Sari, Valerian Ismail" },
    ],
  },
  {
    id: 3,
    number: "Film #03",
    year: 2024,
    title: "Jalan Tengah",
    subtitle: "Video Moderasi Beragama · #VidioPAISLoveFestival2024 · SMAN 1 Kraksaan",
    awards: [{ label: "Urutan 5 — VidioPAIS Love Festival 2024", type: "silver" }],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2024" },
      { icon: "fa-solid fa-film", text: "Film Pendek" },
      { icon: "fa-solid fa-chalkboard-teacher", text: "Pembina: Moh. Adibillah" },
    ],
    youtubeId: "2pENr32dagY",
    synopsisLabel: "Sinopsis",
    synopsis:
      "Di sebuah sekolah menengah, Alvin — ketua kelompok minoritas — berjuang mewujudkan impian mengadakan acara Natal bersama sahabatnya, Andik. Namun langkah mereka terhambat ketika Romo, pemimpin agama sekolah yang menyimpan trauma konflik masa lalu, menolak proposal mereka dengan tegas. Alvin, yang frustrasi, menuliskan surat curahan hati kepada kepala sekolah — namun surat itu justru jatuh ke tangan Fika, ketua ROHIS, yang tersentuh membacanya. Fika pun mengajak timnya berkolaborasi menyusun proposal yang lebih inklusif, merayakan Natal sekaligus mempromosikan toleransi antar umat beragama. Hasil akhirnya adalah sebuah perayaan yang menghangatkan hati, membuktikan bahwa persatuan lebih kuat dari perbedaan.",
    prodChips: [
      { label: "Pembina", value: "Mohammad Adibillah, S.Psi., Gr." },
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Sutradara", value: "Qomariya Agustin" },
    ],
    crew: [
      { role: "Penulis Naskah", name: "Moch Teguh Dwi Yulianto" },
      { role: "Ketua Produksi", name: "Wadilah Callysta Widya Dhana" },
      { role: "Location Manager", name: "Mochammad Ariel Yusuf" },
      { role: "Pembantu Umum", name: "Sabrina Zerlinda R.P & Fikriyyah Putri Salsabila" },
      { role: "Sutradara", name: "Qomariyah Agustin" },
      { role: "Asisten Sutradara", name: "Muh Bayu Firdaus Hidayatullah" },
      { role: "DOP", name: "Rafika Amelia & Hermawan Wicaksono" },
      { role: "Kameramen", name: "Azzam Wicaksono, Zonda Rossi Nugroho, Syaiful Ma'arif Al-Aziz" },
      { role: "Visual Continuity", name: "Moh Rafli" },
      { role: "Lightman", name: "Andes Diwantari Dermawan, Hendriyanto, Erika Puspita Sari" },
      { role: "Penata Artistik", name: "Adika Atharian Kusuma, Dicky Wahyudi, Aci Benaya Ongko L.S., M. Zaki Ihsas A.H., Siti Nur Azizah Abdullah" },
      { role: "Pencatat Adegan", name: "Aina Amelia" },
      { role: "Cliper", name: "Raja Hasan Maroko" },
      { role: "Editor", name: "Aldo Leo Saputra" },
      { role: "Sound Designer", name: "Zafa Islamay Putra & Abane" },
      { role: "Wardrobe", name: "Celena Zora Sasmita & Dwi Elistiana & Ibni Gio Vanni Yafi" },
      { role: "Make Up Artist", name: "Almira Syauqiya Ananza & Efrizal Rikita Abdullah" },
    ],
  },
  {
    id: 4,
    number: "Film #04",
    year: 2024,
    title: "Ruang Kepala",
    subtitle: "Film Pendek · Sinematura 2024 · SMAN 1 Kraksaan",
    awards: [
      { label: "🥈 FLS2N Juara 2 Kabupaten Probolinggo", type: "silver" },
      { label: "🏆 Film Festival Cendana Juara 1 Nasional 2025", type: "national" },
    ],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2024" },
      { icon: "fa-solid fa-trophy", text: "Juara 1 Nasional 2025" },
      { icon: "fa-solid fa-chalkboard-teacher", text: "Pembina: Moh. Adibillah" },
    ],
    youtubeId: "7fHmmcc5mBA",
    synopsisLabel: "Sinopsis",
    synopsis:
      "Arka, remaja 16 tahun dari keluarga berada, merasa jauh dari orang tua yang sibuk bekerja. Di sekolah, ia terlibat perkelahian dan harus menghadap kepala sekolah bersama orang tuanya. Kecewa dengan dirinya sendiri, Arka menemukan jalan baru ketika melihat latihan seni bela diri di sekolah. Dengan tekad yang kuat, ia berlatih keras — bahkan mengikuti kejuaraan tanpa sepengetahuan orang tua dan sekolah. Meski babak belur, ia berhasil memenangkan pertandingan, membawa pulang kemenangan dan kebanggaan yang mengubah pandangan semua orang terhadapnya.",
    prodChips: [
      { label: "Pembina", value: "Mohammad Adibillah, S.Psi., Gr." },
      { label: "Editor", value: "Aldo Leo Saputra" },
    ],
    crew: [
      { role: "Ketua Produksi", name: "Shahwa Nabila Anadi" },
      { role: "Sutradara", name: "Hermawan Ibra Wicaksono" },
      { role: "Penulis", name: "Hermawan Wicaksono & Mohammad Adibillah, S.Psi., Gr." },
      { role: "Kesekretariatan", name: "Robith Bil Haq Zidni Ilma" },
      { role: "Asisten Sutradara", name: "Erika Puspita Sari" },
      { role: "Editor", name: "Aldo Leo Saputra" },
      { role: "Penata Suara", name: "Aci Benaya Ongko Lutfi Saputra & Moch Teguh Dwi Y." },
      { role: "Penata Artistik", name: "Dwi Elistiana, Wadilah Callysta Widyadhana, Emelie Naura Ramadhani" },
      { role: "Wardrobe", name: "Diva Triwahyuningsih" },
      { role: "DOP", name: "Fikriyah Putri Salsabiila" },
      { role: "Make Up", name: "Qomariyah Agustin & Trizha Nur Hidayah Putri" },
      { role: "Pencatat Adegan", name: "M. Brilian Alief Hidayat" },
      { role: "Cliper", name: "Emelie Nurul Faida" },
      { role: "Penata Cahaya", name: "Royfando Bryanda Arkanta" },
      { role: "Kameramen", name: "Zafa Islamay Pratama P. & Alvarel Bagas Dika P." },
    ],
    cast: [
      { role: "—", name: "Muhammad Emir Pandiga, Muhammad Cholili, Eva Early Nur Hidayati S.T.M.Pd., Almarhum Hari Sampurno S.Pd., Nining Jumariyati S.Si., Juhari M.Pd., Raditya Aryasatya Ramadhani" },
    ],
  },
  {
    id: 5,
    number: "Film #05",
    year: 2024,
    title: "Teaser ALTERIO — MPLS 2024",
    subtitle: "Teaser Film · OSIS SMAN 1 Kraksaan · 2024",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2024" },
      { icon: "fa-solid fa-video", text: "Teaser / Short" },
      { icon: "fa-solid fa-user", text: "Editor: Aldo Leo Saputra" },
    ],
    youtubeId: "PhxxqPwSyw8",
    synopsisLabel: "Sinopsis",
    synopsis:
      'Di SMAN 1 Kraksaan, Alvin menemukan sebuah jam misterius yang mampu memutar waktu. Tanpa sengaja mengaktifkannya, ia terkejut melihat tanggal di ponselnya berubah menjadi 8 Juli 2022. Ia keluar dan mendapati dirinya dari masa lalu sedang bersembunyi. Alvin mengintip rapat OSIS yang tengah mendiskusikan nama angkatan baru — dan dengan penuh keyakinan, ia mencoret tembok dengan tulisan "ALTERIO 47." Pembina OSIS pun bertanya-tanya, siapa yang berani mencoret tembok itu...',
    prodChips: [
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Kameramen", value: "Aldo Leo Saputra & Hermawan Ibra Wicaksono" },
    ],
  },
  {
    id: 6,
    number: "Film #06",
    year: 2024,
    title: "Rantai",
    subtitle: "Festival Video Pendek Piala Kepala Dinas Pendidikan Provinsi Jawa Timur · SMAN 1 Kraksaan 2024",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2024" },
      { icon: "fa-solid fa-film", text: "Film Pendek" },
      { icon: "fa-solid fa-chalkboard-teacher", text: "Pembina: Moh. Adibillah" },
    ],
    youtubeId: "knoG-bgwTZU",
    synopsisLabel: "Sinopsis",
    synopsis:
      "Saka, siswa kelas X berusia 15 tahun, mengandalkan sepedanya sebagai satu-satunya transportasi menuju sekolah. Suatu pagi, rantai sepedanya kendor dan akhirnya lepas di tengah perjalanan. Satu per satu pengendara berlalu tanpa peduli — hingga sebuah mobil pick-up berhenti dan mengantarnya ke sekolah, namun Saka sudah terlambat. Para guru menyuruhnya segera memperbaiki sepeda dan bertemu kesiswaan. Di antara mereka, ada satu guru yang hanya tersenyum — tanpa kata-kata. Keesokan harinya, guru itu menarik tangan Saka saat rantai lepas lagi agar ia tak terlambat, dan sepulang sekolah, membelikannya rantai baru. Kebaikan yang nyata tidak selalu berbentuk kata-kata.",
    prodChips: [
      { label: "Pembina", value: "Mohammad Adibillah, S.Psi., Gr." },
      { label: "Editor", value: "Aldo Leo Saputra" },
    ],
    crew: [
      { role: "Produser", name: "Mohammad Adibillah" },
      { role: "Sutradara", name: "Robith Bil Haq Zidni Ilma" },
      { role: "Asisten Sutradara", name: "Dwi Elistiana" },
      { role: "DOP", name: "M. Brilian Alief Hidayat" },
      { role: "Juru Kamera", name: "Zafa Islamay Pratama Putra & Alvarel Bagas Dika Pratama" },
      { role: "Soundman", name: "Aci Benaya Sasongko & Erika Puspita Sari" },
      { role: "Divisi Artistik", name: "Hermawan Ibra Wicaksono, Fikriyyah Putri Salsabila, Diva Triwahyuningsih" },
      { role: "Make Up & Wardrobe", name: "Qomariya Agustin" },
      { role: "Pencatat Adegan", name: "Emelie Naura Ramadhani & Shahwah Nabila Anadi" },
      { role: "Lightingman", name: "Royfando Bryanda Arkananta" },
      { role: "Editor", name: "Aldo Leo Saputra" },
    ],
    cast: [
      { role: "Saka", name: "Robith Bil Haq Zidni Ilma" },
      { role: "Pak Egar", name: "Mohammad Adibillah" },
      { role: "Guru A", name: "Santi Novita" },
      { role: "Guru B", name: "Awan Wijanarko" },
      { role: "Supir Pick-up", name: "Dwi Agus Prasetyo" },
      { role: "Extras", name: "Diva Triwahyuningsih, Erika Puspita Sari, Trizha Nur Hidayah Putri" },
    ],
    crewLabel: "Tim Produksi & Cast",
  },
  {
    id: 7,
    number: "Film #07",
    year: 2024,
    title: "Luka Menjadi Lukisan",
    subtitle: "Short Movie · SMAN 1 Kraksaan · 2024",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2024" },
      { icon: "fa-solid fa-palette", text: "Film Pendek" },
      { icon: "fa-solid fa-user", text: "Aldo Leo Saputra" },
    ],
    youtubeId: "X7caHNtjNcQ",
    synopsisLabel: "Sinopsis",
    synopsis:
      "Seorang murid dengan kegemaran di bidang seni kerap mendapat celotehan dan kata-kata yang tidak menyenangkan dari orang-orang di sekitarnya. Namun alih-alih terpuruk, ia menjadikan setiap luka sebagai bahan bakar — motivasi untuk terus berkarya hingga mendapat pengakuan dari semua orang. Karena setiap luka, pada akhirnya, bisa menjadi lukisan yang indah.",
    prodChips: [
      { label: "Editor / Penulis / Kameramen", value: "Aldo Leo Saputra" },
    ],
  },
  {
    id: 8,
    number: "Film #08",
    year: 2024,
    title: "Duta Pelajar Putri",
    subtitle: "Jawa Pos SMA Awards 2024 · SMAN 1 Kraksaan · Kabupaten Probolinggo",
    awards: [{ label: "Jawa Pos SMA Awards 2024", type: "default" }],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2024" },
      { icon: "fa-solid fa-star", text: "Kompetisi" },
      { icon: "fa-solid fa-user", text: "Editor: Aldo Leo Saputra" },
    ],
    youtubeId: "8UfW9KasQGc",
    synopsisLabel: "Deskripsi",
    synopsis:
      "Video profil Duta Pelajar Putri Award 2024 SMAN 1 Kraksaan, menampilkan Bilqis Zahratus Syita yang siap mewakili sekolah dalam ajang bergengsi Jawa Pos SMA Awards 2024. Dengan semangat dan tekad yang membara, ia menyampaikan visinya tentang perjalanan menuju masa depan — bahwa sejatinya hidup bukan tentang melangkah sempurna, tetapi tentang terus bergerak dan menemukan irama di setiap tantangan.",
    prodChips: [
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Kameramen", value: "Hermawan Ibra Wicaksono" },
    ],
  },
  {
    id: 9,
    number: "Film #09",
    year: 2024,
    title: "Sinematografi — Jawa Pos SMA Awards 2024",
    subtitle: "Kompetisi Sinematografi Tingkat SMA · SMAN 1 Kraksaan",
    awards: [{ label: "Jawa Pos SMA Awards 2024 — Sinematografi", type: "default" }],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2024" },
      { icon: "fa-solid fa-video", text: "Sinematografi" },
      { icon: "fa-solid fa-chalkboard-teacher", text: "Pembina: Moh. Adibillah" },
    ],
    youtubeId: "dMVt_0GQabw",
    synopsisLabel: "Logline",
    synopsis:
      "Sebuah eksplorasi mengenai perbedaan — hal-hal yang tidak semua orang sadari — tentang bagaimana setiap anak memiliki kepribadian uniknya sendiri, yang tercermin bahkan dari benda-benda kecil yang mereka miliki dan bawa sehari-hari.",
    prodChips: [
      { label: "Pembina", value: "Mohammad Adibillah, S.Psi., Gr." },
      { label: "Editor", value: "Aldo Leo Saputra" },
    ],
    crew: [
      { role: "Produser", name: "Wadilah Callysta W. D." },
      { role: "Sutradara", name: "Hermawan Ibra W." },
      { role: "Asisten Sutradara", name: "Erika Puspita Sari" },
      { role: "DOP", name: "Fikriyyah Putri Salsabila, Siti Nur Azizah Abdullah, Moh. Rafli, Mochammad Ariel Yusuf, Sabrina Zerlinda R.P." },
      { role: "Kameramen", name: "Zafa Islamay Pratama P., Zonda Rosi Nugroho, Ibni Gio Vanni Yafi" },
      { role: "Tata Artistik", name: "Qomariya Agustin & Moch. Teguh Dwi Yulianto" },
      { role: "Make Up Artistik", name: "M. Zaki Ihsas A.H., Raja Hasan Maroko, Muh Bayu Firdaus Hidayatull." },
      { role: "Audioman Team", name: "Aci Benaya Ongko L.S., Hendriyanto, Syaiful Ma'arif Al-Aziz, Adika Atharian Kusuma" },
      { role: "Lightning Team", name: "Moh Ravel Widjiat Miko & Andes Diwantri Dermawan" },
      { role: "Editor", name: "Aldo Leo Saputra Abidin" },
    ],
    cast: [
      { role: "—", name: "Febrina Khanza A.W. & Prety Try Wulandar" },
    ],
  },
  {
    id: 10,
    number: "Film #10",
    year: 2025,
    title: "Guru Kita yang Jahat",
    subtitle: "Film Pendek · Jawa Pos SMA Awards 2025 · SMAN 1 Kraksaan",
    awards: [{ label: "Jawa Pos SMA Awards 2025 — Sinematografi", type: "default" }],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2025" },
      { icon: "fa-solid fa-film", text: "Film Pendek" },
      { icon: "fa-solid fa-chalkboard-teacher", text: "Pembina: Moh. Adibillah" },
    ],
    youtubeId: "lhXj51BA4RU",
    synopsisLabel: "Deskripsi",
    synopsis:
      "Sekolah bukan sekadar ruang penyaluran pengetahuan — ia adalah ruang perjumpaan antara siswa, pengajar, dan teknologi yang terus berevolusi. Di tengah arus digitalisasi yang kian deras, film ini menyoroti eksistensi guru: bukan hanya sebagai pengajar, tetapi sebagai figur moral yang menanamkan karakter, tata krama, dan kreativitas, sekaligus menyeimbangkan ketergantungan siswa terhadap teknologi yang semakin merasuk ke dalam kehidupan mereka.",
    prodChips: [
      { label: "Pembina", value: "Mohammad Adibillah, S.Psi., Gr." },
      { label: "Sutradara", value: "Qomariya Agustin" },
      { label: "Editor", value: "Hermawan Ibra Wicaksono, Den Bagus Putra, Aldo Leo Saputra" },
    ],
    crew: [
      { role: "Produser", name: "Fikriyyah Putri Salsabila" },
      { role: "Sutradara", name: "Qomariya Agustin" },
      { role: "Penulis Naskah", name: "Qomariya Agustin" },
      { role: "Asisten Sutradara", name: "Zian Nafisah Sukri" },
      { role: "Sinematografer", name: "Aldo Leo Saputra, Raja Hasan Maroko, M. Aditya Shafi" },
      { role: "Penyunting Gambar", name: "Hermawan Ibra Wicaksono, Den Bagus Putra Mustofa, Aldo Leo Saputra" },
      { role: "Penata Artistik", name: "Siti Nur Azizah Abdullah" },
      { role: "Juru Kamera", name: "Moh Ravel Wijiad Miko, Moh Bayu Firdaus H., Aldo Leo Saputra" },
      { role: "Kerabat Kerja", name: "Elya Nabila, Erika Puspita Sari, Rafika Amelia, Zafa Islamay Putra, Syaiful Maarif Al Aziz, Alfan Faiz Fadloli, M. Syamsul Arifin, Raihan Nur Arifin, Ananda Wulan Kristianti, Efridzal Rizajta A., Dwi Elistiana, Naufal Ahmad Gibran B., Farel Satya Ramdhan, Much. Teguh Dwi Yulianto" },
    ],
    cast: [
      { role: "Rendi", name: "Januar Rendi Afdilla" },
      { role: "Keke", name: "Keysa Najwa Aliandya" },
      { role: "Bu Nesia", name: "Najla'ayu Nesia" },
      { role: "Ketua Kelas", name: "Moh Bayu Firdaus H." },
    ],
  },
  {
    id: 11,
    number: "Film #11",
    year: 2025,
    title: "Suara Sumbang Angin Utara",
    subtitle: "Film Pendek · SMAN 1 Kraksaan · Kabupaten Probolinggo, Jawa Timur",
    awards: [{ label: "🏆 Festival Film Cendana 2025 — Juara 2 Nasional", type: "national" }],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2025" },
      { icon: "fa-solid fa-trophy", text: "Juara 2 Nasional 2025" },
      { icon: "fa-solid fa-chalkboard-teacher", text: "Pembina: Moh. Adibillah" },
    ],
    youtubeId: "o9KUUXqLvvA",
    synopsisLabel: "Sinopsis",
    synopsis:
      "Mira, seorang gadis remaja dengan kecintaan besar terhadap musik tradisional — khususnya saronèn — hidup dalam keterbatasan ekonomi bersama ibunya, namun tetap gigih mengekspresikan bakatnya meski kerap mendapat cibiran. Di sekolah, potensinya diakui hingga membuka kesempatan emas mengikuti lomba musik tradisional yang menawarkan tiket masuk ke perguruan tinggi seni. Namun di saat yang sama, ibunya memberikan cincin sebagai simbol rencana pernikahan yang terasa memotong mimpinya. Dalam pergolakan batin antara tradisi dan impian, Mira memilih untuk berdiri teguh dan membuktikan kemampuannya — memenangkan lomba tersebut. Kemenangan yang datang bersama dilema hidup yang belum selesai.",
    prodChips: [
      { label: "Pembina", value: "Mohammad Adibillah, S.Psi., Gr." },
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Sutradara", value: "Zonda Rosi Nugroho" },
    ],
    crew: [
      { role: "Produser", name: "Celena Zora Sasmita" },
      { role: "Sutradara", name: "Zonda Rosi Nugroho" },
      { role: "Penulis", name: "Celena Zora Sasmita & Zonda Rosi Nugroho" },
      { role: "Sinematografer", name: "Zonda Rosi Nugroho & Adika Atharian Kusuma" },
      { role: "Penyunting Gambar", name: "Adika Atharian Kusuma & Aldo Leo Saputra" },
      { role: "Penata Artistik", name: "Celena Zora Sasmita" },
      { role: "Kerabat Kerja", name: "Qomariya Agustin, Azzam Wicaksono, Zafa Islamay Pratama Putra, Syaiful Ma'arif Al-Aziz, Raja Hasan Maroko, Fikriyyah Putri Salsabila, Aldo Leo Saputra, Muh. Bayu Firdaus H., Moh. Ravel Wijatmoko, Erika Puspita Sari, Siti Nur Azizah Abdullah, Wadilah Callysta Widya Dhana, Efridzal Rizqita A., M. Zaki Ihsas A.H., Andes Diwantri Dermawan, Hermawan Ibra Wicaksono" },
    ],
    cast: [
      { role: "Mira", name: "Khoirotul Bariyah" },
      { role: "Mira Kecil", name: "Anindya Radya Almira" },
      { role: "Bapak Mira", name: "Mohammad Eksan" },
      { role: "Ibu Mira", name: "Umi Annisa" },
    ],
  },
  {
    id: 12,
    number: "Video #12",
    year: 2025,
    title: "Lomba Senam Anak Indonesia Hebat 2025",
    subtitle: "SMA Negeri 1 Kraksaan · Provinsi Jawa Timur · 2025",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2025" },
      { icon: "fa-solid fa-video", text: "Video Lomba" },
    ],
    youtubeId: "k_8ENCZiayc",
  },
  {
    id: 13,
    number: "Video #13",
    year: 2025,
    title: "Video Profil Pembelajaran — Uswatun Hasanah",
    subtitle: "EJIES 2025 · SMAN 1 Kraksaan",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2025" },
      { icon: "fa-solid fa-video", text: "Video Profil" },
      { icon: "fa-solid fa-user", text: "Editor: Aldo Leo Saputra" },
    ],
    youtubeId: "8tVQRuOXEWY",
    synopsisLabel: "Deskripsi",
    synopsis:
      "Video profil pembelajaran ini menampilkan Uswatun Hasanah, seorang guru Bahasa Inggris di SMAN 1 Kraksaan, dalam ajang EJIES 2025. Video ini menghadirkan gambaran autentik tentang pendekatan dan metode pengajaran beliau yang interaktif dan penuh semangat — mencerminkan dedikasi seorang pendidik yang tidak sekadar mentransfer ilmu, tetapi juga menginspirasi dan membangun kepercayaan diri siswa dalam berkomunikasi menggunakan bahasa Inggris.",
    prodChips: [
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Kameramen", value: "Aldo Leo Saputra & Hermawan Ibra Wicaksono" },
    ],
  },
  {
    id: 14,
    number: "Video #14",
    year: 2025,
    title: "Video Profil — Iwan Cahyadi",
    subtitle: "EJIES 2025 · SMAN 1 Kraksaan · Probolinggo",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2025" },
      { icon: "fa-solid fa-video", text: "Video Profil" },
      { icon: "fa-solid fa-user", text: "Editor: Aldo Leo Saputra" },
    ],
    youtubeId: "4X7L-7vHtZk",
    synopsisLabel: "Deskripsi",
    synopsis:
      "Video profil ini menampilkan Iwan Cahyadi dalam ajang EJIES 2025, dengan fokus pada pengenalan sistem teknologi sidik jari yang diterapkan di SMAN 1 Kraksaan. Sistem ini digunakan sebagai alat presensi modern yang menggantikan absensi manual — sebuah inovasi yang meningkatkan efisiensi administrasi sekolah sekaligus memperkenalkan siswa pada pemanfaatan teknologi biometrik dalam kehidupan sehari-hari. Video ini menjelaskan cara kerja, manfaat, dan implementasi sistem tersebut di lingkungan sekolah secara menyeluruh dan informatif.",
    prodChips: [
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Kameramen", value: "Aldo Leo Saputra & Hermawan Ibra Wicaksono" },
    ],
  },
  {
    id: 15,
    number: "Video #15",
    year: 2025,
    title: "Caleg Parlemen Remaja 2025 — Faza Abdi Mahalila",
    subtitle: "Dapil Jawa Timur II · 2025",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2025" },
      { icon: "fa-solid fa-video", text: "Video Profil Kampanye" },
      { icon: "fa-solid fa-user", text: "Editor: Aldo Leo Saputra" },
    ],
    synopsisLabel: "Deskripsi",
    synopsis:
      "Video kampanye Parlemen Remaja 2025 ini menampilkan Faza Abdi Mahalila, calon legislatif dari Dapil Jawa Timur II, yang mengusung isu transisi energi sebagai agenda utamanya. Dengan latar belakang dampak PLTU Paiton di Kabupaten Probolinggo terhadap lingkungan warga sekitar — dari debu di sawah hingga ekosistem laut yang terganggu — Faza menggagas program GENSIA (Generasi Energi Bersih Indonesia), yang mencakup pelatihan teknis di bidang energi bersih, advokasi berbasis data lokal, hingga aksi nyata seperti pemasangan panel surya di fasilitas publik dan pemulihan ekosistem pesisir. Targetnya jelas: menjadikan pemuda sebagai garda terdepan menuju Indonesia bebas emisi 2045.",
    prodChips: [
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Kameramen", value: "Aldo Leo Saputra" },
    ],
  },
  {
    id: 16,
    number: "Video #16",
    year: 2025,
    title: "Video Kreatif Anti Korupsi",
    subtitle: "Video Kreatif Non-AI · SMAN 1 Kraksaan",
    awards: [],
    meta: [
      { icon: "fa-solid fa-calendar", text: "2025" },
      { icon: "fa-brands fa-instagram", text: "Instagram Reel" },
      { icon: "fa-solid fa-user", text: "Editor: Aldo Leo Saputra" },
    ],
    igReel: "https://www.instagram.com/reel/DOOPBvqgGu5/",
    synopsisLabel: "Deskripsi",
    synopsis:
      "Video kreatif bertema anti-korupsi ini diproduksi tanpa bantuan kecerdasan buatan, sebagai bentuk komitmen pada kreativitas murni. Pesan yang disampaikan tegas dan menggugah: korupsi merugikan semua orang — suap, gratifikasi, penyalahgunaan fasilitas, dan nepotisme adalah musuh bersama. Perubahan dimulai dari diri sendiri: jujur, berani menolak, dan berkomitmen untuk hidup bersih. Bersama, kita bisa wujudkan Indonesia tanpa korupsi.",
    prodChips: [
      { label: "Editor", value: "Aldo Leo Saputra" },
      { label: "Kameramen", value: "Aldo Leo Saputra & Hermawan Ibra Wicaksono" },
    ],
  },
];

/* ============================================================
   FILM CARD COMPONENT
   ============================================================ */
function FilmCard({ film }) {
  const [crewOpen, setCrewOpen] = useState(false);

  return (
    <div className="film-card reveal">
      {/* HEADER */}
      <div className="film-card-header">
        <div className="film-card-top">
          <span className="film-number">{film.number}</span>
          {film.awards &&
            film.awards.map((aw, i) => (
              <span
                key={i}
                className={`film-award${aw.type === "national" ? " national" : aw.type === "silver" ? " silver" : ""}`}
              >
                {aw.label}
              </span>
            ))}
        </div>
        <h2 className="film-title">{film.title}</h2>
        <p className="film-subtitle">{film.subtitle}</p>
        <div className="film-meta-row">
          {film.meta.map((m, i) => (
            <span key={i} className="film-meta-chip">
              <i className={m.icon}></i> {m.text}
            </span>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="film-card-body">
        {/* YouTube embed */}
        {film.youtubeId && (
          <div className="film-video-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${film.youtubeId}`}
              title={film.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {/* Synopsis */}
        {film.synopsis && (
          <>
            <span className="synopsis-label">{film.synopsisLabel}</span>
            <p className="synopsis-text">{film.synopsis}</p>
          </>
        )}

        {/* Production chips */}
        {film.prodChips && film.prodChips.length > 0 && (
          <div className="prod-info-row">
            {film.prodChips.map((chip, i) => (
              <div key={i} className="prod-chip">
                <strong>{chip.label}:</strong>&nbsp;{chip.value}
              </div>
            ))}
            {film.igLink && (
              <div className="prod-chip">
                <i className="fa-brands fa-instagram" style={{ color: "#e1306c" }}></i>&nbsp;
                <a href={film.igLink} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                  @sine_matura
                </a>
              </div>
            )}
          </div>
        )}

        {/* Instagram reel link */}
        {film.igReel && (
          <a href={film.igReel} target="_blank" rel="noreferrer" className="ig-link-btn">
            <i className="fa-brands fa-instagram"></i> Tonton di Instagram
          </a>
        )}

        {/* Crew toggle */}
        {(film.crew || film.cast) && (
          <>
            <button
              className={`crew-toggle-btn${crewOpen ? " open" : ""}`}
              aria-expanded={crewOpen}
              onClick={() => setCrewOpen(!crewOpen)}
            >
              <span className="toggle-left">
                <i className="fa-solid fa-users"></i>&nbsp; {film.crewLabel || "Tim Produksi"}
              </span>
              <i className="fa-solid fa-chevron-down chevron"></i>
            </button>
            <div className={`crew-panel${crewOpen ? " open" : ""}`}>
              <div className="crew-panel-inner">
                {film.crew &&
                  film.crew.map((row, i) => (
                    <div key={i} className="crew-row">
                      <span className="crew-role">{row.role}</span>
                      <span className="crew-name">{row.name}</span>
                    </div>
                  ))}
                {film.cast && film.cast.length > 0 && (
                  <div className="cast-section">
                    <span className="cast-label">Pemeran</span>
                    {film.cast.map((row, i) => (
                      <div key={i} className="crew-row">
                        <span className="crew-role">{row.role}</span>
                        <span className="crew-name">{row.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   YEAR DIVIDER
   ============================================================ */
function YearDivider({ year }) {
  return (
    <div className="year-divider reveal">
      <div className="year-divider-line"></div>
      <span className="year-divider-label">{year}</span>
      <div className="year-divider-line"></div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function PortoKarya3({ t = {} }) {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [copyMsg, setCopyMsg] = useState(false);

  /* ── Reveal on scroll ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    const items = document.querySelectorAll(".reveal");
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Share handlers ── */
  const handleTwitterShare = (e) => {
    e.preventDefault();
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Karya Sinematura SMAN 1 Kraksaan — Portofolio Video Editing");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const handleLinkedInShare = (e) => {
    e.preventDefault();
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyMsg(true);
      setTimeout(() => setCopyMsg(false), 2000);
    });
  };

  /* ── Group films by year ── */
  const years = [2023, 2024, 2025];

  return (
    <>
      <style>{`
        /* ============================================================
           KARYA3 PAGE STYLES
           ============================================================ */

        .karya3-wrap {
          min-height: 100vh;
          background: var(--bg);
        }

        /* BREADCRUMB */
        .breadcrumb-container {
          padding: 100px 60px 40px;
          border-bottom: 1px solid var(--border);
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          color: var(--text-dim);
          max-width: 1400px;
          margin: 0 auto;
        }
        .breadcrumb a {
          color: var(--text-dim);
          text-decoration: none;
          transition: color 0.3s;
        }
        .breadcrumb a:hover { color: var(--accent2); }

        /* HERO */
        .k3-hero {
          padding: 80px 60px;
          background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
          border-bottom: 1px solid var(--border);
        }
        .k3-hero-inner {
          max-width: 1400px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-block;
          background: var(--glass2);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--gborder2);
          border-radius: 99px;
          padding: 8px 20px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent2);
          margin-bottom: 28px;
        }
        .article-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 300;
          line-height: 1.15;
          margin-bottom: 40px;
          color: var(--text);
        }
        .article-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          max-width: 700px;
        }
        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .meta-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .meta-value {
          font-size: 0.85rem;
          color: var(--text);
        }

        /* ARTICLE CONTAINER */
        .article-container {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 60px;
          padding: 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* INTRO BLOCK */
        .intro-block {
          background: var(--glass);
          border: 1px solid var(--gborder);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 10px;
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
        }
        .intro-block p {
          font-size: 0.92rem;
          line-height: 1.88;
          color: var(--text-dim);
          margin-bottom: 14px;
        }
        .intro-block p:last-child { margin-bottom: 0; }

        /* YEAR DIVIDER */
        .year-divider {
          display: flex;
          align-items: center;
          gap: 18px;
          margin: 60px 0 40px;
        }
        .year-divider-line {
          flex: 1;
          height: 1px;
          background: var(--border2);
        }
        .year-divider-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 300;
          color: var(--text-dim);
          white-space: nowrap;
        }

        /* FILM CARD */
        .film-card {
          background: var(--glass);
          border: 1px solid var(--gborder);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          transition: border-color 0.35s, box-shadow 0.35s;
          margin-bottom: 40px;
        }
        .film-card:hover {
          border-color: rgba(139, 92, 246, 0.35);
          box-shadow: 0 12px 48px rgba(139, 92, 246, 0.08);
        }

        .film-card-header {
          padding: 28px 32px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid var(--border);
        }
        .film-card-top {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .film-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent2);
          background: var(--glass2);
          border: 1px solid var(--gborder);
          border-radius: 99px;
          padding: 4px 14px;
        }
        .film-award {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.28);
          border-radius: 99px;
          padding: 4px 12px;
        }
        .film-award.silver {
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.1);
          border-color: rgba(148, 163, 184, 0.25);
        }
        .film-award.national {
          color: #22d3ee;
          background: rgba(34, 211, 238, 0.1);
          border-color: rgba(34, 211, 238, 0.25);
        }
        .film-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 2.8vw, 2rem);
          font-weight: 600;
          color: var(--text);
          line-height: 1.2;
          margin: 0;
        }
        .film-subtitle {
          font-size: 0.78rem;
          color: var(--text-dim);
          letter-spacing: 0.04em;
        }
        .film-meta-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .film-meta-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .film-meta-chip i { color: var(--accent2); font-size: 0.65rem; }

        .film-card-body { padding: 0 32px 28px; }

        .film-video-wrap {
          margin: 24px 0;
          background: var(--bg2);
          border: 1px solid var(--gborder);
          border-radius: 14px;
          overflow: hidden;
        }
        .film-video-wrap iframe {
          width: 100%;
          aspect-ratio: 16/9;
          display: block;
          border: none;
        }

        .synopsis-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent2);
          margin-bottom: 10px;
          margin-top: 20px;
          display: block;
        }
        .synopsis-text {
          font-size: 0.88rem;
          line-height: 1.8;
          color: var(--text-dim);
        }

        .prod-info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 18px 0 0;
        }
        .prod-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--glass2);
          border: 1px solid var(--gborder);
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .prod-chip strong { color: var(--text); font-weight: 600; }

        /* CREW TOGGLE */
        .crew-toggle-btn {
          width: 100%;
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--glass2);
          border: 1px solid var(--gborder);
          border-radius: 10px;
          padding: 12px 18px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.3s;
        }
        .crew-toggle-btn:hover { border-color: var(--accent2); color: var(--text); }
        .crew-toggle-btn .toggle-left { display: flex; align-items: center; gap: 8px; }
        .crew-toggle-btn .chevron {
          font-size: 0.7rem;
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .crew-toggle-btn.open .chevron { transform: rotate(180deg); }

        .crew-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s;
          opacity: 0;
        }
        .crew-panel.open { max-height: 4000px; opacity: 1; }

        .crew-panel-inner {
          margin-top: 14px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .crew-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 6px 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.78rem;
        }
        .crew-row:last-child { border-bottom: none; }
        .crew-role {
          color: var(--text-dim);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          min-width: 160px;
          flex-shrink: 0;
          padding-top: 1px;
        }
        .crew-name { color: var(--text); line-height: 1.55; }

        .cast-section {
          margin-top: 14px;
          border-top: 1px dashed var(--border2);
          padding-top: 14px;
        }
        .cast-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent2);
          margin-bottom: 10px;
          display: block;
        }

        /* IG LINK BTN */
        .ig-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          margin-top: 16px;
          transition: opacity 0.3s, transform 0.3s;
        }
        .ig-link-btn:hover { opacity: 0.85; transform: translateY(-2px); }

        /* SIDEBAR */
        .article-sidebar {
          position: sticky;
          top: 90px;
          align-self: start;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sidebar-widget {
          background: var(--glass);
          border: 1px solid var(--gborder);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          transition: all 0.3s ease;
        }
        .sidebar-widget:hover {
          border-color: rgba(139, 92, 246, 0.3);
          background: var(--glass2);
        }
        .widget-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 18px;
          color: var(--text);
        }
        .widget-content {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .info-item:last-child { border-bottom: none; padding-bottom: 0; }
        .info-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .info-value { font-size: 0.8rem; color: var(--text); }

        .related-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0;
          margin: 0;
        }
        .related-links a {
          font-size: 0.8rem;
          color: var(--accent2);
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
          display: inline-block;
          text-decoration: none;
        }
        .related-links a:hover { background: var(--glass2); color: var(--accent3); }

        .share-buttons { display: flex; gap: 12px; }
        .share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--glass2);
          border: 1px solid var(--gborder);
          color: var(--text-dim);
          transition: all 0.3s ease;
          text-decoration: none;
          cursor: pointer;
          position: relative;
        }
        .share-btn:hover {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
          transform: translateY(-3px);
        }

        .copy-toast {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--text);
          color: var(--bg);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
        }

        /* ARTICLE NAV */
        .article-nav {
          padding: 40px 60px;
          border-top: 1px solid var(--border);
          max-width: 1400px;
          margin: 0 auto;
        }
        .article-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: calc(1400px - 320px - 60px);
        }
        .nav-prev-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--glass2);
          border: 1px solid var(--gborder);
          border-radius: 10px;
          padding: 12px 22px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
        }
        .nav-prev-btn:hover { border-color: var(--accent2); color: var(--text); }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .breadcrumb-container { padding: 100px 40px 40px; }
          .k3-hero { padding: 60px 40px; }
          .article-container { padding: 50px 40px; gap: 40px; grid-template-columns: 1fr 280px; }
        }
        @media (max-width: 768px) {
          .breadcrumb-container { padding: 80px 20px 24px; }
          .k3-hero { padding: 40px 20px; }
          .article-title { font-size: clamp(1.8rem, 4vw, 2.5rem); }
          .article-meta { grid-template-columns: 1fr; gap: 14px; }
          .article-container { grid-template-columns: 1fr; gap: 30px; padding: 30px 20px; }
          .article-sidebar { position: static; }
          .film-card-header { padding: 20px 18px 14px; }
          .film-card-body { padding: 0 18px 20px; }
          .crew-role { min-width: 110px; }
          .film-title { font-size: 1.3rem; }
          .year-divider-label { font-size: 2.2rem; }
          .article-nav { padding: 30px 20px; }
        }
      `}</style>

      <div className="karya3-wrap" ref={pageRef}>
        {/* BREADCRUMB */}
        <div className="breadcrumb-container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/journal">Journal</Link>
            <span>/</span>
            <span>Sinematura SMAN 1 Kraksaan</span>
          </div>
        </div>

        {/* HERO */}
        <div className="k3-hero">
          <div className="k3-hero-inner">
            <div className="hero-badge reveal">Portofolio Karya</div>
            <h1 className="article-title reveal rv-d1">
              Karya Sinematura
              <br />
              SMAN 1 Kraksaan
            </h1>
            <div className="article-meta reveal rv-d2">
              <div className="meta-item">
                <span className="meta-label">Editor</span>
                <span className="meta-value">Aldo Leo Saputra</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Pembina</span>
                <span className="meta-value">Mohammad Adibillah, S.Psi., Gr.</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Ekstrakurikuler</span>
                <span className="meta-value">Sinematura — SMAN 1 Kraksaan</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Periode</span>
                <span className="meta-value">2023 — Sekarang</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main>
          <div className="article-container">
            {/* ARTICLE BODY */}
            <article className="article-body">
              {/* INTRO */}
              <div className="intro-block reveal">
                <p>
                  Sinematura adalah ekstrakurikuler sinematografi di SMA Negeri 1 Kraksaan, Probolinggo, yang menjadi ruang kreatif bagi para pelajar untuk mengeksplorasi seni bertutur melalui gambar bergerak. Di bawah bimbingan Mohammad Adibillah, S.Psi., Gr., komunitas ini telah melahirkan berbagai karya — mulai dari film pendek naratif, video profil, dokumentasi lomba, hingga produksi bertema sosial dan moderasi beragama.
                </p>
                <p>
                  Halaman ini mendokumentasikan seluruh karya yang lahir dari Sinematura secara kronologis, sebagai arsip perjalanan kreatif bersama. Setiap film membawa cerita, perjuangan, dan pesan yang berbeda — semuanya dicipta dengan semangat yang sama: berkarya tanpa henti.
                </p>
              </div>

              {/* FILMS GROUPED BY YEAR */}
              {years.map((year) => {
                const filmsInYear = FILMS.filter((f) => f.year === year);
                if (filmsInYear.length === 0) return null;
                return (
                  <div key={year}>
                    <YearDivider year={year} />
                    {filmsInYear.map((film) => (
                      <FilmCard key={film.id} film={film} />
                    ))}
                  </div>
                );
              })}
            </article>

            {/* SIDEBAR */}
            <aside className="article-sidebar">
              {/* Tentang */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Tentang Sinematura</h3>
                <div className="widget-content">
                  <div className="info-item">
                    <span className="info-label">Koordinator & Editor</span>
                    <span className="info-value">Aldo Leo Saputra</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Pembina</span>
                    <span className="info-value">Mohammad Adibillah, S.Psi., Gr.</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ekstrakurikuler</span>
                    <span className="info-value">Sinematografi — SMAN 1 Kraksaan</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Karya</span>
                    <span className="info-value">16 Video / Film</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Periode</span>
                    <span className="info-value">2023 — Sekarang</span>
                  </div>
                </div>
              </div>

              {/* Prestasi */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Prestasi</h3>
                <div className="widget-content">
                  <div className="info-item">
                    <span className="info-label" style={{ color: "#22d3ee" }}>
                      🏆 Juara 1 Nasional
                    </span>
                    <span className="info-value">Film Festival Cendana 2025 — Ruang Kepala</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label" style={{ color: "#22d3ee" }}>
                      🥈 Juara 2 Nasional
                    </span>
                    <span className="info-value">Festival Film Cendana 2025 — Suara Sumbang Angin Utara</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label" style={{ color: "#f59e0b" }}>
                      🥈 Juara 2 Kabupaten
                    </span>
                    <span className="info-value">FLS2N — Ruang Kepala</span>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Instagram Sinematura</h3>
                <div className="widget-content">
                  <a
                    href="https://www.instagram.com/sine_matura?igsh=MWQ1MXptNHp6cm0xNw=="
                    target="_blank"
                    rel="noreferrer"
                    className="ig-link-btn"
                    style={{ width: "100%", justifyContent: "center", marginTop: 0 }}
                  >
                    <i className="fa-brands fa-instagram"></i> @sine_matura
                  </a>
                </div>
              </div>

              {/* Navigasi */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Navigasi</h3>
                <div className="widget-content">
                  <ul className="related-links">
                    <li>
                      <Link to="/journal">← Kembali ke Journal</Link>
                    </li>
                    <li>
                      <Link to="/porto">Lihat Portfolio</Link>
                    </li>
                    <li>
                      <Link to="/contact">Get In Touch</Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Share */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Bagikan</h3>
                <div className="widget-content">
                  <div className="share-buttons">
                    {/* Twitter */}
                    <a href="#" className="share-btn" onClick={handleTwitterShare} title="Share on Twitter">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" className="share-btn" onClick={handleLinkedInShare} title="Share on LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    {/* Copy link */}
                    <a
                      href="#"
                      className="share-btn"
                      onClick={handleCopyLink}
                      title="Copy Link"
                      style={{ position: "relative" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                      </svg>
                      {copyMsg && <span className="copy-toast">Tersalin!</span>}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* BOTTOM NAV */}
          <div className="article-nav">
            <div className="article-nav-inner">
              <Link to="/porto" className="nav-prev-btn">
                <><i className="fa-solid fa-arrow-left"></i> {t.karyaNavBackLabel || 'Back to Work'}</>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}