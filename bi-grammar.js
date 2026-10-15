// src/data/bi-grammar.js — Soal Grammar Bahasa Inggris (50 soal)
export const grammarQuestions = [
  {
    id: 1,
    text: "The nurses on the night shift ______ the patients' vital signs every two hours.",
    options: [
    "is checking",
    "check",
    "have checking",
    "checks"
    ],
    correctIndex: 1,
    explanation: "Subjek 'The nurses' itu jamak, jadi kata kerjanya memakai bentuk tanpa -s, yaitu 'check', bukan 'checks'.",
  },
  {
    id: 2,
    text: "The use of wearable health devices ______ very common in rural clinics nowadays.",
    options: [
    "has become",
    "become",
    "are",
    "have"
    ],
    correctIndex: 0,
    explanation: "Subjek sebenarnya adalah 'The use' (tunggal), bukan 'devices'. Maka kata kerjanya 'has become', bukan 'have become'.",
  },
  {
    id: 3,
    text: "Several digital platforms ______ students to access online learning materials for free.",
    options: [
    "allows",
    "has allowed",
    "allow",
    "is allowing"
    ],
    correctIndex: 2,
    explanation: "'Several digital platforms' adalah subjek jamak, jadi gunakan 'allow' tanpa -s.",
  },
  {
    id: 4,
    text: "Most hospitals in big cities ______ advanced telemedicine systems already.",
    options: [
    "is having",
    "has",
    "was having",
    "have"
    ],
    correctIndex: 3,
    explanation: "'Most hospitals' jamak, jadi gunakan 'have', bukan 'has'.",
  },
  {
    id: 5,
    text: "Wearable devices that ______ a patient's heart rate are now widely used in ICUs.",
    options: [
    "monitors",
    "is monitoring",
    "has monitored",
    "monitor"
    ],
    correctIndex: 3,
    explanation: "Kata kerja dalam relative clause mengikuti subjeknya, yaitu 'devices' (jamak), jadi 'monitor' tanpa -s.",
  },
  {
    id: 6,
    text: "Each patient in this ward ______ responsible for following the daily medication schedule.",
    options: [
    "have been",
    "is",
    "are",
    "were"
    ],
    correctIndex: 1,
    explanation: "'Each' selalu dianggap tunggal, walaupun berbicara tentang banyak pasien, jadi kata kerjanya 'is'.",
  },
  {
    id: 7,
    text: "The number of chronic disease cases in the village ______ increased significantly this year.",
    options: [
    "have",
    "has",
    "are",
    "were"
    ],
    correctIndex: 1,
    explanation: "Frasa 'The number of' diikuti kata kerja tunggal ('has'), beda dengan 'A number of' yang diikuti kata kerja untuk subjek jamak.",
  },
  {
    id: 8,
    text: "A number of farmworkers in this area ______ regular check-ups due to pesticide exposure.",
    options: [
    "is needing",
    "needs",
    "need",
    "has needed"
    ],
    correctIndex: 2,
    explanation: "'A number of' (= beberapa) diikuti kata kerja untuk subjek jamak, jadi 'need' tanpa -s.",
  },
  {
    id: 9,
    text: "Neither the doctor nor the nurses ______ aware of the new hospital policy yet.",
    options: [
    "was",
    "are",
    "has",
    "is"
    ],
    correctIndex: 1,
    explanation: "Pada pola 'neither...nor', kata kerja mengikuti subjek yang terdekat, yaitu 'the nurses' (jamak), jadi pakai 'are'.",
  },
  {
    id: 10,
    text: "The information about the patient's allergy history ______ critical for the treatment plan.",
    options: [
    "have been",
    "are",
    "were",
    "is"
    ],
    correctIndex: 3,
    explanation: "'Information' adalah uncountable noun dan selalu dianggap tunggal, jadi kata kerjanya 'is'.",
  },
  {
    id: 11,
    text: "By the time the ambulance arrives, the paramedic team ______ first aid to the victim already.",
    options: [
    "will have given",
    "will give",
    "gives",
    "is giving"
    ],
    correctIndex: 0,
    explanation: "Pola 'By the time + present, ... will have + V3' menunjukkan satu aksi selesai sebelum aksi lain terjadi di masa depan (future perfect).",
  },
  {
    id: 12,
    text: "My academic advisor ______ me choose my courses every semester since I became a freshman.",
    options: [
    "is helping",
    "helped",
    "has helped",
    "helps"
    ],
    correctIndex: 2,
    explanation: "Kata 'since' menunjukkan Present Perfect, karena aksi dimulai di masa lalu dan masih berlanjut: 'has helped'.",
  },
  {
    id: 13,
    text: "Last semester, our research team ______ a community health survey in three rural villages.",
    options: [
    "conducted",
    "has conducted",
    "conducts",
    "is conducting"
    ],
    correctIndex: 0,
    explanation: "Ada penanda waktu 'last semester' (masa lalu spesifik), jadi gunakan Simple Past: 'conducted'.",
  },
  {
    id: 14,
    text: "By 2030, many hospitals ______ most of their routine administrative tasks using AI.",
    options: [
    "will automate",
    "will have automated",
    "automate",
    "have automated"
    ],
    correctIndex: 1,
    explanation: "'By 2030' (titik waktu tertentu di masa depan) menunjukkan Future Perfect: 'will have automated'.",
  },
  {
    id: 15,
    text: "While the nurse ______ the patient's blood pressure, the doctor reviewed the medical chart.",
    options: [
    "measures",
    "has measured",
    "was measuring",
    "measured"
    ],
    correctIndex: 2,
    explanation: "Dua aksi terjadi bersamaan di masa lalu; aksi yang sedang berlangsung pakai Past Continuous: 'was measuring'.",
  },
  {
    id: 16,
    text: "The patient had already recovered before he ______ discharged from the hospital.",
    options: [
    "was",
    "will be",
    "is",
    "has been"
    ],
    correctIndex: 0,
    explanation: "Kalimat ini menggunakan Past Perfect ('had already recovered') yang berpasangan dengan Simple Past: 'was discharged'.",
  },
  {
    id: 17,
    text: "This time next week, our team ______ a health education program in the village.",
    options: [
    "will be presenting",
    "presents",
    "will present",
    "has presented"
    ],
    correctIndex: 0,
    explanation: "Frasa 'this time next week' menunjukkan aksi yang sedang berlangsung di titik tertentu masa depan, yaitu Future Continuous.",
  },
  {
    id: 18,
    text: "She ______ as a community health volunteer since she was a second-year student.",
    options: [
    "worked",
    "is working",
    "works",
    "has worked"
    ],
    correctIndex: 3,
    explanation: "'Since + waktu spesifik di masa lalu' menunjukkan Present Perfect: 'has worked', karena aksinya berlanjut sampai sekarang.",
  },
  {
    id: 19,
    text: "Patient confidentiality ______ protected at all times, according to hospital regulations.",
    options: [
    "must been",
    "must being",
    "must be",
    "must"
    ],
    correctIndex: 2,
    explanation: "Modal + passive voice: 'must be + V3'. Di sini 'must be protected' artinya harus dilindungi.",
  },
  {
    id: 20,
    text: "All healthcare workers ______ wear a mask in the isolation ward.",
    options: [
    "have",
    "must",
    "are must",
    "must to"
    ],
    correctIndex: 1,
    explanation: "Modal 'must' langsung diikuti V1 tanpa 'to': 'must wear'.",
  },
  {
    id: 21,
    text: "The nurse ______ have reported the unusual symptom earlier; now the infection has spread.",
    options: [
    "should have",
    "must",
    "can",
    "should"
    ],
    correctIndex: 3,
    explanation: "Kalimatnya membutuhkan 'should have + V3' untuk menyatakan sesuatu yang seharusnya dilakukan sebelumnya, tetapi tidak dilakukan. Karena bagian 'have reported' sudah ada setelah titik kosong, pilihan yang tepat adalah 'should'.",
  },
  {
    id: 22,
    text: "He ______ have forgotten to take his medicine; that would explain his symptoms today.",
    options: [
    "must",
    "should",
    "can",
    "will"
    ],
    correctIndex: 0,
    explanation: "'Must have + V3' dipakai untuk dugaan kuat tentang sesuatu yang terjadi di masa lalu.",
  },
  {
    id: 23,
    text: "New sanitation regulations ______ implemented in the village next month.",
    options: [
    "will have",
    "will be",
    "will",
    "will being"
    ],
    correctIndex: 1,
    explanation: "Passive voice dengan modal 'will': 'will be implemented'.",
  },
  {
    id: 24,
    text: "______ you mind checking the patient's temperature again before the doctor arrives?",
    options: [
    "Could",
    "Shall",
    "Must",
    "Would"
    ],
    correctIndex: 3,
    explanation: "'Would you mind + V-ing' adalah pola sopan untuk meminta tolong, bukan 'could you mind'.",
  },
  {
    id: 25,
    text: "With early screening, the outbreak in the village ______ prevented.",
    options: [
    "could been",
    "could be have",
    "could have been",
    "could had been"
    ],
    correctIndex: 2,
    explanation: "Modal perfect passive: 'could have been + V3' menunjukkan sesuatu yang sebenarnya mungkin terjadi di masa lalu tapi tidak terjadi.",
  },
  {
    id: 26,
    text: "Starting next semester, the university ______ students to access the online learning platform using their campus email.",
    options: [
    "has allowed",
    "will allow",
    "allows",
    "allowed"
    ],
    correctIndex: 1,
    explanation: "Keterangan 'starting next semester' menunjukkan rencana yang berlaku pada masa depan. Karena itu, bentuk yang paling tepat adalah 'will allow'.",
  },
  {
    id: 27,
    text: "If a nurse ______ unusual symptoms in a patient, she will inform the doctor immediately.",
    options: [
    "notices",
    "noticed",
    "will notice",
    "had noticed"
    ],
    correctIndex: 0,
    explanation: "First Conditional: if-clause pakai Present Simple ('notices'), bukan 'will notice', meskipun artinya masa depan.",
  },
  {
    id: 28,
    text: "If the local government invested more in rural clinics, access to healthcare ______ improve.",
    options: [
    "can",
    "will",
    "would",
    "would have"
    ],
    correctIndex: 2,
    explanation: "Second Conditional (pengandaian tidak nyata sekarang): if + Past Simple, main clause pakai 'would + V1'.",
  },
  {
    id: 29,
    text: "If the medical team had arrived earlier, the outbreak ______ controlled sooner.",
    options: [
    "will be",
    "would have been",
    "was",
    "would be"
    ],
    correctIndex: 1,
    explanation: "Third Conditional (pengandaian masa lalu): if + Past Perfect, main clause pakai 'would have + V3'.",
  },
  {
    id: 30,
    text: "______ you sterilize the equipment properly, infection may spread among patients.",
    options: [
    "Because",
    "If",
    "Unless",
    "When"
    ],
    correctIndex: 2,
    explanation: "'Unless' berarti 'if...not', jadi kalimat ini berarti 'If you do not sterilize the equipment...'.",
  },
  {
    id: 31,
    text: "If the temperature of a patient rises above 38°C, it ______ a fever.",
    options: [
    "indicated",
    "would indicate",
    "indicates",
    "will indicate"
    ],
    correctIndex: 2,
    explanation: "Zero Conditional (fakta umum/SOP medis): kedua klausa memakai Present Simple.",
  },
  {
    id: 32,
    text: "The patient would not have developed complications if she ______ her medication regularly.",
    options: [
    "took",
    "had taken",
    "takes",
    "would take"
    ],
    correctIndex: 1,
    explanation: "Karena main clause memakai 'would not have developed' (Third Conditional), if-clause harus memakai Past Perfect: 'had taken'.",
  },
  {
    id: 33,
    text: "The success of a rural health program depends on ______ accurate data from the community.",
    options: [
    "to collect",
    "collect",
    "collected",
    "collecting"
    ],
    correctIndex: 3,
    explanation: "Setelah preposisi ('depends on'), kata kerja berubah menjadi gerund (V-ing): 'collecting'.",
  },
  {
    id: 34,
    text: "Many nurses find it challenging ______ up with rapidly changing medical technology.",
    options: [
    "kept",
    "to keep",
    "keeping",
    "keep"
    ],
    correctIndex: 1,
    explanation: "Pola 'find it + adjective + to-infinitive' adalah struktur standar: 'find it challenging to keep up'.",
  },
  {
    id: 35,
    text: "Hospital staff are encouraged ______ their hands thoroughly before every procedure.",
    options: [
    "to wash",
    "washing",
    "wash",
    "washed"
    ],
    correctIndex: 0,
    explanation: "Setelah 'be encouraged', kata kerja berikutnya memakai to-infinitive: 'to wash'.",
  },
  {
    id: 36,
    text: "The community health worker avoided ______ about the patient's condition in public.",
    options: [
    "talked",
    "talk",
    "talking",
    "to talk"
    ],
    correctIndex: 2,
    explanation: "Kata kerja 'avoid' selalu diikuti gerund: 'avoided talking'.",
  },
  {
    id: 37,
    text: "It is necessary ______ clean water access in every rural health post.",
    options: [
    "ensure",
    "ensured",
    "ensuring",
    "to ensure"
    ],
    correctIndex: 3,
    explanation: "Pola 'It is + adjective + to-infinitive' adalah struktur standar formal: 'It is necessary to ensure'.",
  },
  {
    id: 38,
    text: "The lecturer suggested ______ the vocabulary list before the reading quiz.",
    options: [
    "to review",
    "reviewing",
    "reviewed",
    "review"
    ],
    correctIndex: 1,
    explanation: "Kata kerja 'suggest' selalu diikuti gerund (V-ing), bukan to-infinitive: 'suggested reviewing'.",
  },
  {
    id: 39,
    text: "Nurses ______ work in rural areas often face limited access to medical equipment.",
    options: [
    "whom",
    "whose",
    "which",
    "who"
    ],
    correctIndex: 3,
    explanation: "'Who' dipakai untuk menerangkan orang sebagai subjek klausa, di sini merujuk pada 'nurses'.",
  },
  {
    id: 40,
    text: "AI systems, ______ analyze large amounts of patient data, can help predict health risks early.",
    options: [
    "which",
    "who",
    "where",
    "whom"
    ],
    correctIndex: 0,
    explanation: "'Which' dipakai untuk benda/sistem (bukan orang) dalam non-restrictive clause (diapit koma).",
  },
  {
    id: 41,
    text: "The village ______ the new health post was built lacks a reliable clean water supply.",
    options: [
    "which",
    "that",
    "where",
    "who"
    ],
    correctIndex: 2,
    explanation: "'Where' dipakai untuk merujuk pada tempat ('the village').",
  },
  {
    id: 42,
    text: "A patient ______ medical chart is incomplete should be flagged for a follow-up review.",
    options: [
    "whom",
    "which",
    "whose",
    "who"
    ],
    correctIndex: 2,
    explanation: "'Whose' menunjukkan kepemilikan ('the patient's chart'), jadi 'whose medical chart'.",
  },
  {
    id: 43,
    text: "The lecturer explained ______ to calculate a patient's body mass index correctly.",
    options: [
    "which",
    "what",
    "where",
    "how"
    ],
    correctIndex: 3,
    explanation: "'How' dipakai untuk menerangkan cara/metode melakukan sesuatu.",
  },
  {
    id: 44,
    text: "The wound ______ twice a day to prevent infection.",
    options: [
    "is cleaned",
    "has clean",
    "cleaning",
    "cleans"
    ],
    correctIndex: 0,
    explanation: "Karena fokusnya pada tindakan yang dilakukan terhadap luka (bukan siapa yang melakukan), pakai passive voice: 'is cleaned'.",
  },
  {
    id: 45,
    text: "The results of the blood test ______ to the patient by the lab technician yesterday.",
    options: [
    "were explained",
    "have explained",
    "was explained",
    "explained"
    ],
    correctIndex: 0,
    explanation: "Subjek 'the results' jamak dan kejadian terjadi 'yesterday' (lampau), jadi passive past: 'were explained'.",
  },
  {
    id: 46,
    text: "The doctor insisted that the patient ______ for two more days before being discharged.",
    options: [
    "resting",
    "rest",
    "rests",
    "rested"
    ],
    correctIndex: 1,
    explanation: "Subjunctive mood setelah 'insisted that': kata kerja memakai bentuk dasar (V1) tanpa -s, yaitu 'rest'.",
  },
  {
    id: 47,
    text: "Hospital policy requires that every staff member ______ an ID badge at all times.",
    options: [
    "wear",
    "wearing",
    "wore",
    "wears"
    ],
    correctIndex: 0,
    explanation: "Subjunctive mood setelah 'requires that': memakai V1 dasar ('wear'), bukan 'wears'.",
  },
  {
    id: 48,
    text: "The more technology develops, the ______ healthcare services become for rural communities.",
    options: [
    "accessible more",
    "accessibler",
    "most accessible",
    "more accessible"
    ],
    correctIndex: 3,
    explanation: "Pola 'The + comparative, the + comparative': 'the more accessible', bukan superlative atau bentuk salah lainnya.",
  },
  {
    id: 49,
    text: "The older people get, the ______ familiar they usually are with new digital health apps.",
    options: [
    "less",
    "more less",
    "least",
    "fewer"
    ],
    correctIndex: 0,
    explanation: "Pola comparative ganda 'the + comparative, the + comparative': 'the less familiar'.",
  },
  {
    id: 50,
    text: "Despite ______, the volunteer nurse still visits the village clinic every weekend.",
    options: [
    "she has a busy schedule",
    "to have a busy schedule",
    "have a busy schedule",
    "having a busy schedule"
    ],
    correctIndex: 3,
    explanation: "Setelah 'despite', kita bisa memakai kata benda atau bentuk V-ing. Dari pilihan yang tersedia, 'having a busy schedule' yang pas secara tata bahasa. ################################################################ # BAGIAN B — VOCABULARY (50 Soal) ################################################################",
  }
];
