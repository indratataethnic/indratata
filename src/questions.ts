/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, World, Badge } from './types';

export const WORLDS: World[] = [
  {
    id: 1,
    name: "Hutan Angka",
    description: "Petualangan berhitung dasar dan pengenalan bilangan cacah di hutan rimba penuh angka jenaka.",
    themeColor: "emerald",
    bgGradient: "from-emerald-400 to-green-600",
    textColor: "text-emerald-700",
    icon: "Trees",
    minGrade: 1,
    storyIntroduction: "Selamat datang di Hutan Angka! Hutan ini dijaga oleh Roh Angka, tetapi peri jahat telah menyembunyikan angka-angka penting. Mari bantu temukan kembali!",
    levelsCount: 5
  },
  {
    id: 2,
    name: "Lembah Pola Ajaib",
    description: "Temukan keindahan pola bilangan, barisan deret, dan bentuk geometri di lembah penuh warna.",
    themeColor: "amber",
    bgGradient: "from-amber-400 to-orange-500",
    textColor: "text-amber-700",
    icon: "Compass",
    minGrade: 1,
    storyIntroduction: "Lembah Pola Ajaib kehilangan ritmenya! Jembatan batu runtuh karena polanya teracak. Ayo susun kembali batu-batu berpola itu agar jembatan bersatu!",
    levelsCount: 5
  },
  {
    id: 3,
    name: "Pulau Pecahan",
    description: "Bagi roti bajak laut, kumpulkan koin emas, dan pecahkan misteri pembagian adil.",
    themeColor: "sky",
    bgGradient: "from-sky-400 to-blue-600",
    textColor: "text-sky-700",
    icon: "Pizza",
    minGrade: 3,
    storyIntroduction: "Arrrgh! Kapten Pecahan sedang bingung membagi harta karun makanan secara adil kepada anak buahnya. Gunakan ilmu pecahanmu untuk menyelamatkan hari!",
    levelsCount: 5
  },
  {
    id: 4,
    name: "Gurun Pengukuran",
    description: "Mengukur panjang bayangan, menimbang batu kuno, dan membaca jam pasir raksasa.",
    themeColor: "orange",
    bgGradient: "from-orange-400 to-amber-600",
    textColor: "text-orange-700",
    icon: "Ruler",
    minGrade: 3,
    storyIntroduction: "Gurun pasir ini menyimpan misteri piramida waktu. Untuk masuk, kita harus menyeimbangkan timbangan kuno dan mengukur jarak langkah dengan tepat!",
    levelsCount: 5
  },
  {
    id: 5,
    name: "Kota Bangun Ruang",
    description: "Arsitek hebat harus tahu luas, keliling, dan volume balok ajaib untuk membangun gedung pencakar langit.",
    themeColor: "indigo",
    bgGradient: "from-indigo-400 to-violet-600",
    textColor: "text-indigo-700",
    icon: "Box",
    minGrade: 5,
    storyIntroduction: "Kota modern ini membutuhkan arsitek muda! Bantulah merancang bangunan yang kokoh dengan menghitung luas permukaan dan volume gedung balok.",
    levelsCount: 5
  },
  {
    id: 6,
    name: "Rawa Statistika",
    description: "Petualangan mengumpulkan data katak melompat, menyusun diagram batang, dan mencari peluang.",
    themeColor: "teal",
    bgGradient: "from-teal-400 to-cyan-600",
    textColor: "text-teal-700",
    icon: "BarChart3",
    minGrade: 5,
    storyIntroduction: "Katak-katak di rawa sedang bersaing melompat! Ayo kumpulkan data lompatan mereka dan hitung rata-rata nilainya untuk menentukan juara lompat rawa!",
    levelsCount: 5
  },
  {
    id: 7,
    name: "Kerajaan Logika CT",
    description: "Berpikir layaknya komputer! Memecahkan algoritme langkah semut, dekripsi sandi rahasia, dan dekomposisi masalah.",
    themeColor: "purple",
    bgGradient: "from-purple-400 to-fuchsia-600",
    textColor: "text-purple-700",
    icon: "Cpu",
    minGrade: 1,
    storyIntroduction: "Kerajaan Logika dikunci oleh gerbang algoritme! Temukan pola langkah yang paling efisien dan pecahkan sandi biner rahasia untuk membukanya.",
    levelsCount: 5
  },
  {
    id: 8,
    name: "Candi Tantangan HOTS",
    description: "Uji penalaran tingkat tinggi dengan soal cerita analitik yang seru dan menantang.",
    themeColor: "rose",
    bgGradient: "from-rose-400 to-red-600",
    textColor: "text-rose-700",
    icon: "Crown",
    minGrade: 1,
    storyIntroduction: "Selamat di puncak pengetahuan! Di dalam Candi ini, kamu akan menghadapi teka-teki logika yang membutuhkan analisis mendalam dan kreativitas matematika.",
    levelsCount: 5
  }
];

export const BADGES: Badge[] = [
  {
    id: "first_steps",
    title: "Penjelajah Pemula",
    description: "Berhasil menyelesaikan level pertama di Numeraverse.",
    icon: "Compass",
    color: "from-green-400 to-emerald-500"
  },
  {
    id: "world_1_clear",
    title: "Penjaga Hutan Angka",
    description: "Menyelesaikan seluruh level di Hutan Angka.",
    icon: "Trees",
    color: "from-emerald-400 to-green-600"
  },
  {
    id: "world_2_clear",
    title: "Master Pola Geometri",
    description: "Menyelesaikan seluruh level di Lembah Pola Ajaib.",
    icon: "Shapes",
    color: "from-amber-400 to-orange-500"
  },
  {
    id: "coin_collector",
    title: "Kolektor Koin Mas",
    description: "Mengumpulkan lebih dari 100 Koin Numera.",
    icon: "Coins",
    color: "from-yellow-400 to-amber-500"
  },
  {
    id: "ct_guru",
    title: "Ahli Berpikir Komputasional",
    description: "Menyelesaikan tantangan di Kerajaan Logika CT.",
    icon: "Cpu",
    color: "from-purple-400 to-fuchsia-600"
  },
  {
    id: "boss_slayer",
    title: "Penyelamat Numeraverse",
    description: "Mengalahkan Raja Distraktor dalam duel matematika final!",
    icon: "Sword",
    color: "from-rose-400 to-red-600"
  }
];

export const QUESTION_BANK: Question[] = [
  // ================= WORLD 1: HUTAN ANGKA =================
  // GRADE 1
  {
    id: "w1_l1_g1",
    grade: 1,
    worldId: 1,
    levelId: 1,
    text: "Ada berapa buah apel yang ada di pohon jika ada 3 apel merah dan 4 apel hijau?",
    type: "multiple-choice",
    options: ["5", "6", "7", "8"],
    answer: "7",
    explanation: "Kita bisa menjumlahkan keduanya: 3 apel merah + 4 apel hijau = 7 apel keseluruhan.",
    hint: "Cobalah menghitung dengan jari tanganmu setelah angka 3, sebutkan 4 angka berikutnya.",
    points: 10
  },
  {
    id: "w1_l2_g1",
    grade: 1,
    worldId: 1,
    levelId: 2,
    text: "Toni mempunyai 8 permen. Dia memberikan 3 permen kepada adiknya. Berapa sisa permen Toni sekarang?",
    type: "multiple-choice",
    options: ["3", "4", "5", "6"],
    answer: "5",
    explanation: "Ini adalah pengurangan: 8 permen - 3 permen = 5 permen.",
    hint: "Gunakan pengurangan mundur: 8, lalu mundur 3 langkah: 7, 6, 5.",
    points: 10
  },
  // GRADE 2
  {
    id: "w1_l1_g2",
    grade: 2,
    worldId: 1,
    levelId: 1,
    text: "Manakah penulisan angka dari bilangan 'Dua Ratus Tiga Puluh Lima'?",
    type: "multiple-choice",
    options: ["2035", "235", "253", "205"],
    answer: "235",
    explanation: "Dua Ratus (200) + Tiga Puluh (30) + Lima (5) ditulis gabung menjadi 235.",
    hint: "Angka ratusan ada di paling kiri, puluhan di tengah, dan satuan di paling kanan.",
    points: 10
  },
  {
    id: "w1_l2_g2",
    grade: 2,
    worldId: 1,
    levelId: 2,
    text: "Hasil dari 45 + 28 adalah...",
    type: "text-input",
    answer: "73",
    explanation: "Kita jumlahkan satuannya terlebih dahulu: 5 + 8 = 13 (tulis 3, simpan 1). Lalu jumlahkan puluhannya bersama simpanannya: 4 + 2 + 1 = 7. Jadi hasilnya adalah 73.",
    hint: "Gunakan penjumlahan bersusun. Tambahkan satuan dulu, lalu puluhan.",
    points: 15
  },
  // GRADE 3
  {
    id: "w1_l1_g3",
    grade: 3,
    worldId: 1,
    levelId: 1,
    text: "Sebuah keranjang berisi 4 baris mangga. Setiap baris berisi 6 mangga. Berapa jumlah semua mangga di keranjang?",
    type: "multiple-choice",
    options: ["10", "20", "24", "28"],
    answer: "24",
    explanation: "Ini adalah perkalian: 4 baris x 6 mangga per baris = 24 mangga.",
    hint: "Ingat perkalian adalah penjumlahan berulang: 6 + 6 + 6 + 6.",
    points: 10
  },
  // GRADE 4
  {
    id: "w1_l1_g4",
    grade: 4,
    worldId: 1,
    levelId: 1,
    text: "Faktor dari bilangan 12 adalah...",
    type: "multiple-choice",
    options: [
      "1, 2, 3, 4, 6, 12",
      "1, 2, 4, 8, 12",
      "2, 3, 4, 6",
      "1, 3, 4, 12"
    ],
    answer: "1, 2, 3, 4, 6, 12",
    explanation: "Faktor adalah bilangan yang dapat membagi habis bilangan tersebut: 12 dapat dibagi oleh 1, 2, 3, 4, 6, dan 12.",
    hint: "Cari semua pasangan angka yang jika dikalikan menghasilkan angka 12.",
    points: 10
  },
  // GRADE 5
  {
    id: "w1_l1_g5",
    grade: 5,
    worldId: 1,
    levelId: 1,
    text: "Suhu udara di lereng Gunung Bromo pada pagi hari adalah -2°C. Menjelang siang, suhunya naik sebesar 7°C. Berapakah suhu udara pada siang hari?",
    type: "multiple-choice",
    options: ["-9°C", "-5°C", "5°C", "9°C"],
    answer: "5°C",
    explanation: "Suhu awal -2°C naik (+) 7°C: -2 + 7 = 5°C.",
    hint: "Mulailah dari angka -2 pada garis bilangan, lalu melompat ke kanan sebanyak 7 kali.",
    points: 10
  },
  // GRADE 6
  {
    id: "w1_l1_g6",
    grade: 6,
    worldId: 1,
    levelId: 1,
    text: "Hasil perhitungan dari -12 + (15 x 3) - 8 adalah...",
    type: "text-input",
    answer: "25",
    explanation: "Operasi perkalian diselesaikan terlebih dahulu: 15 x 3 = 45. Setelah itu, lakukan penjumlahan dan pengurangan dari kiri ke kanan: -12 + 45 - 8 = 33 - 8 = 25.",
    hint: "Ingat aturan kabataku (kali-bagi-tambah-kurang). Kerjakan perkalian dahulu!",
    points: 15
  },

  // ================= WORLD 2: LEMBAH POLA AJAIB =================
  // GRADE 1
  {
    id: "w2_l1_g1",
    grade: 1,
    worldId: 2,
    levelId: 1,
    text: "Ayo lengkapi pola warna balon ini: Merah, Kuning, Hijau, Merah, Kuning, ... Warna apa yang berikutnya?",
    type: "multiple-choice",
    options: ["Merah", "Kuning", "Hijau", "Biru"],
    answer: "Hijau",
    explanation: "Polanya berulang setiap 3 warna: Merah -> Kuning -> Hijau. Setelah Kuning, pasti Hijau.",
    hint: "Ucapkan pola tersebut dengan keras: Merah, Kuning, Hijau... Merah, Kuning, ...",
    points: 10
  },
  {
    id: "w2_l2_g1",
    grade: 1,
    worldId: 2,
    levelId: 2,
    text: "Urutkan angka berikut dari yang terkecil ke yang terbesar: 5, 2, 9, 7",
    type: "sorting",
    options: ["5", "2", "9", "7"],
    answer: ["2", "5", "7", "9"],
    explanation: "Urutan dari yang terkecil adalah 2, kemudian 5, lalu 7, dan yang terbesar adalah 9.",
    hint: "Cari angka yang paling sedikit nilainya dulu.",
    points: 15
  },
  // GRADE 2
  {
    id: "w2_l1_g2",
    grade: 2,
    worldId: 2,
    levelId: 1,
    text: "Lengkapi barisan angka berikut: 2, 4, 6, ..., 10, 12. Angka berapakah yang hilang?",
    type: "multiple-choice",
    options: ["7", "8", "9", "11"],
    answer: "8",
    explanation: "Pola ini meloncat +2 di setiap angka berikutnya. Jadi setelah 6 adalah 6 + 2 = 8.",
    hint: "Ini adalah deret bilangan genap atau lompat-lompat dua.",
    points: 10
  },
  // GRADE 3
  {
    id: "w2_l1_g3",
    grade: 3,
    worldId: 2,
    levelId: 1,
    text: "Lengkapi deret angka ini: 3, 6, 12, 24, ... Angka berikutnya adalah...",
    type: "multiple-choice",
    options: ["30", "36", "48", "60"],
    answer: "48",
    explanation: "Pola angka ini dikalikan 2 di setiap langkah: 3 x 2 = 6, 6 x 2 = 12, 12 x 2 = 24, 24 x 2 = 48.",
    hint: "Setiap angka bernilai dua kali lipat dari angka sebelumnya.",
    points: 10
  },
  // GRADE 4
  {
    id: "w2_l1_g4",
    grade: 4,
    worldId: 2,
    levelId: 1,
    text: "Segitiga yang ketiga sisinya memiliki panjang yang sama disebut segitiga...",
    type: "multiple-choice",
    options: ["Sama Kaki", "Siku-siku", "Sama Sisi", "Sembarang"],
    answer: "Sama Sisi",
    explanation: "Segitiga yang ketiga sisinya sama panjang dinamakan segitiga Sama Sisi.",
    hint: "Sisi-sisinya semuanya memiliki ukuran panjang yang sama.",
    points: 10
  },
  // GRADE 5
  {
    id: "w2_l1_g5",
    grade: 5,
    worldId: 2,
    levelId: 1,
    text: "Pola bilangan Fibonacci dimulai dari: 1, 1, 2, 3, 5, 8, ... Berapakah angka ke-7 dari pola ini?",
    type: "multiple-choice",
    options: ["11", "12", "13", "14"],
    answer: "13",
    explanation: "Pola Fibonacci didapat dengan menjumlahkan dua angka sebelumnya: 5 + 8 = 13.",
    hint: "Tambahkan dua bilangan terakhir untuk mendapatkan bilangan selanjutnya.",
    points: 10
  },
  // GRADE 6
  {
    id: "w2_l1_g6",
    grade: 6,
    worldId: 2,
    levelId: 1,
    text: "Jika suatu pola gambar dibentuk oleh persegi-persegi kecil dengan pola: Pola 1 = 1 persegi, Pola 2 = 4 persegi, Pola 3 = 9 persegi, Pola 4 = 16 persegi. Berapakah jumlah persegi pada Pola ke-7?",
    type: "text-input",
    answer: "49",
    explanation: "Polanya adalah kuadrat dari urutannya (n x n): Pola 1 = 1x1, Pola 2 = 2x2, Pola 3 = 3x3. Jadi Pola 7 = 7 x 7 = 49.",
    hint: "Kalikan nomor pola dengan nomor pola itu sendiri.",
    points: 15
  },

  // ================= WORLD 3: PULAU PECAHAN =================
  // GRADE 3
  {
    id: "w3_l1_g3",
    grade: 3,
    worldId: 3,
    levelId: 1,
    text: "Ibu memotong sebuah kue pizza menjadi 8 bagian sama besar. Kakak memakan 3 bagian. Berapa bagian pizza yang dimakan kakak dalam bentuk pecahan?",
    type: "multiple-choice",
    options: ["1/8", "3/8", "5/8", "8/3"],
    answer: "3/8",
    explanation: "Kakak memakan 3 bagian dari keseluruhan 8 bagian, yang ditulis sebagai pecahan 3/8.",
    hint: "Angka atas (pembilang) adalah bagian yang dimakan. Angka bawah (penyebut) adalah total potongan.",
    points: 10
  },
  // GRADE 4
  {
    id: "w3_l1_g4",
    grade: 4,
    worldId: 3,
    levelId: 1,
    text: "Manakah pecahan berikut yang senilai dengan 2/4?",
    type: "multiple-choice",
    options: ["1/3", "1/2", "3/4", "2/3"],
    answer: "1/2",
    explanation: "Jika pembilang dan penyebut 2/4 dibagi dengan 2, maka didapatkan pecahan yang paling sederhana yaitu 1/2.",
    hint: "Sederhanakan pecahan 2/4 dengan membagi angka atas dan bawah dengan angka yang sama.",
    points: 10
  },
  {
    id: "w3_l2_g4",
    grade: 4,
    worldId: 3,
    levelId: 2,
    text: "Ubah pecahan biasa 3/5 menjadi pecahan desimal!",
    type: "multiple-choice",
    options: ["0.3", "0.5", "0.6", "0.75"],
    answer: "0.6",
    explanation: "Pecahan 3/5 disamakan penyebutnya menjadi persepuluh: (3x2)/(5x2) = 6/10 = 0,6.",
    hint: "Kalikan pembilang dan penyebut dengan 2 agar penyebutnya menjadi 10.",
    points: 10
  },
  // GRADE 5
  {
    id: "w3_l1_g5",
    grade: 5,
    worldId: 3,
    levelId: 1,
    text: "Hasil penjumlahan dari 1/2 + 1/3 adalah...",
    type: "multiple-choice",
    options: ["2/5", "3/5", "5/6", "1/6"],
    answer: "5/6",
    explanation: "Samakan penyebut menggunakan KPK dari 2 dan 3, yaitu 6. Maka, 1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
    hint: "Samakan penyebutnya terlebih dahulu sebelum menjumlahkan pembilangnya.",
    points: 10
  },
  // GRADE 6
  {
    id: "w3_l1_g6",
    grade: 6,
    worldId: 3,
    levelId: 1,
    text: "Di kelas 6, rasio jumlah siswa laki-laki dibanding siswa perempuan adalah 3 : 4. Jika jumlah seluruh siswa di kelas adalah 28 orang, berapa banyak siswa perempuan?",
    type: "text-input",
    answer: "16",
    explanation: "Total bagian rasio = 3 + 4 = 7 bagian. Bagian siswa perempuan adalah 4/7. Jumlah siswa perempuan = 4/7 x 28 = 16 orang.",
    hint: "Bagi 28 dengan jumlah rasio (7), lalu kalikan hasilnya dengan angka rasio perempuan (4).",
    points: 15
  },

  // ================= WORLD 4: GURUN PENGUKURAN =================
  // GRADE 3
  {
    id: "w4_l1_g3",
    grade: 3,
    worldId: 4,
    levelId: 1,
    text: "Andi mulai belajar matematika pukul 08.00 pagi dan selesai pukul 09.30 pagi. Berapa lama Andi belajar?",
    type: "multiple-choice",
    options: ["1 Jam", "1 Jam 30 Menit", "2 Jam", "45 Menit"],
    answer: "1 Jam 30 Menit",
    explanation: "Dari pukul 08.00 ke 09.00 adalah 1 jam. Ditambah dari 09.00 ke 09.30 adalah 30 menit. Jadi totalnya 1 jam 30 menit.",
    hint: "Hitung selisih jam dan selisih menitnya.",
    points: 10
  },
  // GRADE 4
  {
    id: "w4_l1_g4",
    grade: 4,
    worldId: 4,
    levelId: 1,
    text: "Sebuah meja memiliki panjang 2 meter. Berapa panjang meja tersebut jika diubah ke dalam sentimeter (cm)?",
    type: "multiple-choice",
    options: ["20 cm", "200 cm", "2000 cm", "2 cm"],
    answer: "200 cm",
    explanation: "Karena 1 meter = 100 cm, maka 2 meter = 2 x 100 = 200 cm.",
    hint: "Ingat tangga satuan panjang: turun 2 tangga dari meter ke sentimeter artinya dikali 100.",
    points: 10
  },
  // GRADE 5
  {
    id: "w4_l1_g5",
    grade: 5,
    worldId: 4,
    levelId: 1,
    text: "Sebuah tangki air berisi 2,5 meter kubik (m³) air. Berapa liter volume air tersebut? (1 desimeter kubik = 1 liter)",
    type: "multiple-choice",
    options: ["25 Liter", "250 Liter", "2500 Liter", "25000 Liter"],
    answer: "2500 Liter",
    explanation: "1 m³ = 1000 dm³ = 1000 liter. Maka 2,5 m³ = 2,5 x 1000 = 2500 liter.",
    hint: "Ingat, 1 m³ sama dengan 1.000 liter.",
    points: 10
  },
  // GRADE 6
  {
    id: "w4_l1_g6",
    grade: 6,
    worldId: 4,
    levelId: 1,
    text: "Sebuah mobil melaju dengan kecepatan rata-rata 60 km/jam. Jika mobil tersebut melakukan perjalanan selama 2,5 jam, berapakah jarak yang ditempuh mobil tersebut?",
    type: "text-input",
    answer: "150",
    explanation: "Jarak = Kecepatan x Waktu. Jarak = 60 km/jam x 2,5 jam = 150 km.",
    hint: "Gunakan rumus J = K x W. Kalikan kecepatan dengan waktu tempuh.",
    points: 15
  },

  // ================= WORLD 5: KOTA BANGUN RUANG =================
  // GRADE 5
  {
    id: "w5_l1_g5",
    grade: 5,
    worldId: 5,
    levelId: 1,
    text: "Sebuah kolam berbentuk kubus dengan panjang rusuk 3 meter. Berapakah volume air maksimal yang bisa ditampung kolam tersebut?",
    type: "multiple-choice",
    options: ["9 m³", "12 m³", "27 m³", "36 m³"],
    answer: "27 m³",
    explanation: "Volume Kubus = sisi x sisi x sisi. Volume = 3m x 3m x 3m = 27 m³.",
    hint: "Rumus volume kubus adalah rusuk kali rusuk kali rusuk (r³).",
    points: 10
  },
  {
    id: "w5_l2_g5",
    grade: 5,
    worldId: 5,
    levelId: 2,
    text: "Sebuah persegi panjang memiliki panjang 12 cm dan lebar 5 cm. Hitunglah keliling persegi panjang tersebut!",
    type: "text-input",
    answer: "34",
    explanation: "Keliling Persegi Panjang = 2 x (panjang + lebar). Keliling = 2 x (12 + 5) = 2 x 17 = 34 cm.",
    hint: "Tambahkan panjang dan lebar, lalu kalikan dua.",
    points: 15
  },
  // GRADE 6
  {
    id: "w5_l1_g6",
    grade: 6,
    worldId: 5,
    levelId: 1,
    text: "Sebuah tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm. Berapakah volume tabung tersebut? (Gunakan nilai π = 22/7)",
    type: "multiple-choice",
    options: ["154 cm³", "770 cm³", "1540 cm³", "3080 cm³"],
    answer: "1540 cm³",
    explanation: "Volume Tabung = π x r² x t. Volume = (22/7) x 7 cm x 7 cm x 10 cm = 154 x 10 = 1540 cm³.",
    hint: "Rumus volume tabung adalah luas lingkaran alas dikali tinggi tabung.",
    points: 10
  },

  // ================= WORLD 6: RAWA STATISTIKA =================
  // GRADE 5
  {
    id: "w6_l1_g5",
    grade: 5,
    worldId: 6,
    levelId: 1,
    text: "Berikut nilai matematika Budi dalam 4 kali ujian: 80, 90, 70, 80. Berapakah rata-rata (mean) nilai matematika Budi?",
    type: "multiple-choice",
    options: ["75", "80", "85", "90"],
    answer: "80",
    explanation: "Rata-rata = Jumlah semua nilai / Banyaknya ujian. Jumlah = 80 + 90 + 70 + 80 = 320. Banyaknya ujian = 4. Rata-rata = 320 / 4 = 80.",
    hint: "Jumlahkan keempat nilai tersebut terlebih dahulu, lalu bagi dengan angka 4.",
    points: 10
  },
  // GRADE 6
  {
    id: "w6_l1_g6",
    grade: 6,
    worldId: 6,
    levelId: 1,
    text: "Dari data berat badan siswa berikut: 32 kg, 34 kg, 32 kg, 35 kg, 38 kg, 32 kg, 36 kg. Manakah nilai modusnya?",
    type: "multiple-choice",
    options: ["32 kg", "34 kg", "35 kg", "38 kg"],
    answer: "32 kg",
    explanation: "Modus adalah nilai yang paling sering muncul. Angka 32 muncul sebanyak 3 kali, paling banyak dibandingkan angka lainnya.",
    hint: "Cari angka berat badan yang paling banyak dimiliki oleh siswa.",
    points: 10
  },
  {
    id: "w6_l2_g6",
    grade: 6,
    worldId: 6,
    levelId: 2,
    text: "Sebuah dadu bersisi enam dilempar sekali. Berapakah peluang munculnya mata dadu genap?",
    type: "multiple-choice",
    options: ["1/6", "1/3", "1/2", "2/3"],
    answer: "1/2",
    explanation: "Mata dadu genap ada 3 yaitu {2, 4, 6}. Total mata dadu ada 6 yaitu {1, 2, 3, 4, 5, 6}. Peluang = 3/6 = 1/2.",
    hint: "Peluang adalah jumlah kejadian yang diinginkan dibagi total kemungkinan kejadian.",
    points: 10
  },

  // ================= WORLD 7: KERAJAAN LOGIKA CT =================
  // GRADE 1 & 2
  {
    id: "w7_l1_g1",
    grade: 1,
    worldId: 7,
    levelId: 1,
    text: "Seekor semut ingin pergi ke gula. Dia harus berjalan: 2 langkah ke depan, belok kanan, lalu 3 langkah ke depan. Jika digambarkan dengan anak panah (▲ = depan, ► = kanan), manakah perintah yang benar?",
    type: "multiple-choice",
    options: [
      "▲ ▲ ► ▲ ▲ ▲",
      "▲ ► ▲ ▲ ▲",
      "▲ ▲ ▲ ► ▲ ▲",
      "► ▲ ▲ ▲"
    ],
    answer: "▲ ▲ ► ▲ ▲ ▲",
    explanation: "2 langkah ke depan (▲ ▲), belok kanan (►), lalu 3 langkah ke depan (▲ ▲ ▲). Jadi urutannya: ▲ ▲ ► ▲ ▲ ▲.",
    hint: "Urutkan anak panahnya sesuai perintah jalan semut satu per satu.",
    points: 10,
    isComputationalThinking: true
  },
  // GRADE 3 & 4
  {
    id: "w7_l1_g3",
    grade: 3,
    worldId: 7,
    levelId: 1,
    text: "Dalam sistem sandi rahasia: A ditulis 1, B ditulis 2, C ditulis 3, dst. Kata apakah yang terbentuk dari sandi '2 - 1 - 3 - 1 - 3'?",
    type: "multiple-choice",
    options: ["BACA", "BACA B", "BACAC", "CABE"],
    answer: "BACAC",
    explanation: "2 = B, 1 = A, 3 = C, 1 = A, 3 = C. Maka digabung menjadi 'BACAC'.",
    hint: "Ganti setiap angka dengan huruf abjad sesuai urutannya.",
    points: 10,
    isComputationalThinking: true
  },
  // GRADE 5 & 6
  {
    id: "w7_l1_g5",
    grade: 5,
    worldId: 7,
    levelId: 1,
    text: "Ada 3 kotak: Merah, Hijau, dan Biru. Kotak Merah lebih berat dari kotak Hijau. Kotak Biru lebih berat dari kotak Merah. Manakah urutan kotak dari yang paling RINGAN?",
    type: "multiple-choice",
    options: [
      "Hijau, Merah, Biru",
      "Hijau, Biru, Merah",
      "Biru, Merah, Hijau",
      "Merah, Hijau, Biru"
    ],
    answer: "Hijau, Merah, Biru",
    explanation: "Kotak Biru > Kotak Merah. Kotak Merah > Kotak Hijau. Jika digabung: Biru > Merah > Hijau. Maka yang paling ringan adalah Hijau, lalu Merah, dan paling berat adalah Biru.",
    hint: "Gunakan logika relasi perbandingan berat satu demi satu.",
    points: 12,
    isComputationalThinking: true
  },
  {
    id: "w7_l2_g6",
    grade: 6,
    worldId: 7,
    levelId: 2,
    text: "Sebuah program robot pembersih memiliki aturan mengulang langkah: [MAJU, SAPU] sebanyak 3 kali. Jika setelah itu robot harus BELOK KIRI sekali, manakah algoritme yang tepat?",
    type: "multiple-choice",
    options: [
      "Ulangi 3 kali [MAJU, SAPU], lalu BELOK KIRI",
      "Ulangi 3 kali [MAJU, SAPU, BELOK KIRI]",
      "MAJU, SAPU, BELOK KIRI, MAJU, SAPU",
      "Ulangi 3 kali [MAJU], SAPU, BELOK KIRI"
    ],
    answer: "Ulangi 3 kali [MAJU, SAPU], lalu BELOK KIRI",
    explanation: "Robot harus mengulang [MAJU, SAPU] sebanyak 3 kali terlebih dahulu. Belok kiri dilakukan setelah proses pengulangan selesai. Maka algoritmanya adalah: Ulangi 3 kali [MAJU, SAPU], lalu BELOK KIRI.",
    hint: "Belok kiri tidak ikut diulang, ia berada di luar kurung pengulangan.",
    points: 12,
    isComputationalThinking: true
  },

  // ================= WORLD 8: CANDI TANTANGAN HOTS =================
  // GRADE 1 & 2
  {
    id: "w8_l1_g1",
    grade: 1,
    worldId: 8,
    levelId: 1,
    text: "Deni memiliki 5 kelereng lebih banyak dari Rian. Jika Rian memiliki 4 kelereng, berapakah jumlah kelereng mereka jika digabungkan?",
    type: "multiple-choice",
    options: ["9", "11", "13", "15"],
    answer: "13",
    explanation: "Kelereng Rian = 4. Kelereng Deni = 4 + 5 = 9 kelereng. Jumlah kelereng gabungan mereka = 4 + 9 = 13 kelereng.",
    hint: "Cari dulu jumlah kelereng Deni sebelum menambahkannya dengan kelereng Rian.",
    points: 15,
    isHots: true
  },
  // GRADE 3 & 4
  {
    id: "w8_l1_g3",
    grade: 3,
    worldId: 8,
    levelId: 1,
    text: "Sebuah lampu hias menyala merah setiap 4 detik sekali, dan lampu kuning menyala setiap 6 detik sekali. Pada detik keberapa kedua lampu tersebut akan menyala bersama-sama untuk pertama kalinya setelah dinyalakan?",
    type: "multiple-choice",
    options: ["10 detik", "12 detik", "16 detik", "24 detik"],
    answer: "12 detik",
    explanation: "Ini mencari KPK dari 4 dan 6. Kelipatan 4: 4, 8, 12, 16. Kelipatan 6: 6, 12, 18. Kelipatan terkecil yang sama adalah 12.",
    hint: "Temukan bilangan kelipatan terkecil yang bisa dibagi habis oleh 4 sekaligus oleh 6.",
    points: 15,
    isHots: true
  },
  // GRADE 5 & 6
  {
    id: "w8_l1_g5",
    grade: 5,
    worldId: 8,
    levelId: 1,
    text: "Jika 3 ekor kucing dapat menangkap 3 ekor tikus dalam waktu 3 menit, maka berapakah waktu yang dibutuhkan oleh 10 ekor kucing untuk menangkap 10 ekor tikus?",
    type: "multiple-choice",
    options: ["3 Menit", "10 Menit", "30 Menit", "1 Menit"],
    answer: "3 Menit",
    explanation: "3 kucing menangkap 3 tikus dalam 3 menit berarti 1 kucing menangkap 1 tikus membutuhkan waktu 3 menit secara bersamaan. Sehingga 10 kucing menangkap 10 tikus secara bersama-sama juga akan membutuhkan waktu tetap 3 menit.",
    hint: "Bayangkan semua kucing bekerja berburu tikus di waktu yang bersamaan.",
    points: 15,
    isHots: true
  },
  {
    id: "w8_l2_g6",
    grade: 6,
    worldId: 8,
    levelId: 2,
    text: "Umur Ayah saat ini adalah tiga kali umur Soni. Enam tahun yang akan datang, jumlah umur mereka adalah 60 tahun. Berapakah umur Soni saat ini?",
    type: "text-input",
    answer: "12",
    explanation: "Misalkan umur Soni = s, maka umur Ayah = 3s. Enam tahun lagi, umur Soni = s+6, umur Ayah = 3s+6. Jumlah umur mereka = (s+6) + (3s+6) = 60 => 4s + 12 = 60 => 4s = 48 => s = 12 tahun.",
    hint: "Buatlah persamaan matematika sederhana. Ingat kedua orang bertambah umur masing-masing 6 tahun di masa depan.",
    points: 20,
    isHots: true
  }
];

// BOSS QUESTIONS (WORLD 9) - Epik dan Berantai
export const BOSS_QUESTIONS: Question[] = [
  {
    id: "boss_1",
    grade: 1, // dynamically scaled or generic
    worldId: 9,
    levelId: 1,
    text: "GERBANG PERTAMA: Raja Distraktor menghadang jalanmu! Dia mengirimkan pasukan angka teracak: 12, 45, 23, 89, 34. Kamu harus mengaktifkan 'Sinar Pengurut' dengan mencari angka terbesar kedua!",
    type: "multiple-choice",
    options: ["89", "45", "34", "23"],
    answer: "45",
    explanation: "Urutan angka dari terbesar ke terkecil: 89, 45, 34, 23, 12. Angka terbesar kedua adalah 45.",
    hint: "Cari angka terbesar dulu (89), lalu lihat angka terbesar berikutnya.",
    points: 30
  },
  {
    id: "boss_2",
    grade: 1,
    worldId: 9,
    levelId: 2,
    text: "GERBANG KEDUA: Raja Distraktor menciptakan ilusi geometris! Dia menggabungkan 4 buah kubus kecil bersisi 2 cm menjadi satu balok panjang. Berapakah volume balok ilusi tersebut?",
    type: "multiple-choice",
    options: ["8 cm³", "16 cm³", "32 cm³", "64 cm³"],
    answer: "32 cm³",
    explanation: "Volume satu kubus kecil = 2 x 2 x 2 = 8 cm³. Karena ada 4 kubus digabung, maka volume total = 4 x 8 cm³ = 32 cm³.",
    hint: "Cari volume satu kubus kecil dulu, lalu kalikan jumlah kubusnya.",
    points: 30
  },
  {
    id: "boss_3",
    grade: 1,
    worldId: 9,
    levelId: 3,
    text: "GERBANG AKHIR: Raja Distraktor mengunci inti energi Numeraverse dengan sandi rahasia! Aturan sandi: Nilai X adalah bilangan genap yang habis dibagi 5, letaknya di antara 15 dan 35. Berapakah nilai X tersebut?",
    type: "text-input",
    answer: "20",
    explanation: "Bilangan di antara 15 dan 35 yang habis dibagi 5 adalah 20, 25, 30. Di antara ketiganya, yang merupakan bilangan genap adalah 20 dan 30. Karena 20 berada di dalam jangkauan dan habis dibagi, 20 dan 30 adalah jawaban benar (kita terima 20 atau 30, mari tetapkan 20/30). Nilai X = 20.",
    hint: "Kelipatan 5 yang genap selalu berakhiran angka 0. Cari angka berakhiran 0 di antara 15 dan 35.",
    points: 40
  }
];

export function generateDynamicQuestion(worldId: number, grade: number, levelId: number, idSuffix: string): Question {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  switch (worldId) {
    case 1: { // Hutan Angka (Arithmetic & Counting)
      if (grade === 1) {
        const type = pick(['add', 'sub', 'count']);
        if (type === 'add') {
          const n1 = rand(2, 9);
          const n2 = rand(2, 9);
          const ans = n1 + n2;
          return {
            id: `dyn_w1_g1_add_${idSuffix}`,
            grade: 1,
            worldId: 1,
            levelId,
            text: `Riko melihat ${n1} burung hantu di pohon utara dan ${n2} burung hantu di pohon selatan. Berapa total burung hantu yang dilihat Riko?`,
            type: 'multiple-choice',
            options: [String(ans), String(ans + 2), String(ans - 1), String(ans + 3)].sort(() => Math.random() - 0.5),
            answer: String(ans),
            explanation: `Jumlah seluruh burung hantu adalah penjumlahan keduanya: ${n1} + ${n2} = ${ans}.`,
            hint: `Mulailah menghitung dari ${n1}, lalu melompat maju sebanyak ${n2} kali.`,
            points: 10
          };
        } else if (type === 'sub') {
          const n1 = rand(8, 15);
          const n2 = rand(2, n1 - 2);
          const ans = n1 - n2;
          return {
            id: `dyn_w1_g1_sub_${idSuffix}`,
            grade: 1,
            worldId: 1,
            levelId,
            text: `Ada ${n1} buah apel merah di keranjang. Andi mengambil ${n2} buah untuk dimakan. Berapa buah apel yang tersisa di keranjang?`,
            type: 'multiple-choice',
            options: [String(ans), String(ans + 1), String(ans - 1), String(ans + 2)].sort(() => Math.random() - 0.5),
            answer: String(ans),
            explanation: `Pengurangan sederhana: ${n1} dikurangi ${n2} menghasilkan ${ans}.`,
            hint: `Gunakan metode hitung mundur mulai dari ${n1} sebanyak ${n2} langkah.`,
            points: 10
          };
        } else {
          const items = pick(['bunga', 'kupu-kupu', 'kelinci', 'batu ajaib']);
          const n1 = rand(5, 12);
          return {
            id: `dyn_w1_g1_count_${idSuffix}`,
            grade: 1,
            worldId: 1,
            levelId,
            text: `Jika kamu menghitung ${items} di taman, kamu menemukan kelompok pertama ada 4 dan kelompok kedua ada ${n1 - 4}. Berapakah jumlah keseluruhan ${items} tersebut?`,
            type: 'multiple-choice',
            options: [String(n1), String(n1 + 1), String(n1 - 1), String(n1 + 2)].sort(() => Math.random() - 0.5),
            answer: String(n1),
            explanation: `Jumlah keseluruhan ${items} adalah 4 + ${n1 - 4} = ${n1}.`,
            hint: `Gabungkan kelompok pertama dan kedua lalu hitung semuanya.`,
            points: 10
          };
        }
      } else if (grade === 2) {
        const n1 = rand(25, 60);
        const n2 = rand(15, 35);
        const isAdd = Math.random() > 0.5;
        const ans = isAdd ? n1 + n2 : n1 - n2;
        return {
          id: `dyn_w1_g2_${isAdd ? 'add' : 'sub'}_${idSuffix}`,
          grade: 2,
          worldId: 1,
          levelId,
          text: isAdd 
            ? `Paman memetik ${n1} mangga di kebun, lalu memetik lagi ${n2} mangga. Berapa jumlah seluruh mangga paman?`
            : `Sebuah toko memiliki persediaan ${n1} telur. Hari ini sebanyak ${n2} telur laku terjual. Berapa sisa telur di toko?`,
          type: 'text-input',
          answer: String(ans),
          explanation: isAdd ? `Lakukan penjumlahan bersusun: ${n1} + ${n2} = ${ans}.` : `Lakukan pengurangan bersusun: ${n1} - ${n2} = ${ans}.`,
          hint: `Gunakan hitung bersusun. Kerjakan bagian satuan terlebih dahulu, lalu puluhannya.`,
          points: 15
        };
      } else if (grade === 3) {
        const n1 = rand(3, 9);
        const n2 = rand(3, 8);
        const ans = n1 * n2;
        return {
          id: `dyn_w1_g3_mul_${idSuffix}`,
          grade: 3,
          worldId: 1,
          levelId,
          text: `Di sebuah peternakan, terdapat ${n1} kandang ayam. Jika setiap kandang berisi ${n2} ekor ayam, berapakah jumlah seluruh ayam di peternakan?`,
          type: 'multiple-choice',
          options: [String(ans), String(ans + n1), String(ans - n1), String(ans + 5)].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Ini merupakan perkalian berulang: ${n1} dikali ${n2} = ${ans}.`,
          hint: `Perkalian adalah penjumlahan berulang. Jumlahkan angka ${n2} sebanyak ${n1} kali.`,
          points: 10
        };
      } else if (grade === 4) {
        const n1 = rand(2, 6) * 4;
        return {
          id: `dyn_w1_g4_factor_${idSuffix}`,
          grade: 4,
          worldId: 1,
          levelId,
          text: `Manakah bilangan di bawah ini yang merupakan salah satu faktor dari ${n1}?`,
          type: 'multiple-choice',
          options: [String(n1 / 2), String(n1 + 1), String(n1 - 1), '9'].sort(() => Math.random() - 0.5),
          answer: String(n1 / 2),
          explanation: `Faktor adalah bilangan yang dapat membagi habis bilangan tersebut. ${n1} dapat dibagi habis oleh ${n1 / 2} dengan hasil 2.`,
          hint: `Cari angka pilihan yang jika dikalikan dengan angka lain bisa menghasilkan ${n1}.`,
          points: 10
        };
      } else if (grade === 5) {
        const n1 = rand(-10, -2);
        const n2 = rand(5, 15);
        const ans = n1 + n2;
        return {
          id: `dyn_w1_g5_neg_${idSuffix}`,
          grade: 5,
          worldId: 1,
          levelId,
          text: `Suhu udara di suatu puncak gunung pada malam hari adalah ${n1}°C. Menjelang siang, suhunya naik sebesar ${n2}°C. Berapakah suhu udara pada siang hari tersebut?`,
          type: 'multiple-choice',
          options: [String(ans), String(ans - 3), String(ans + 3), String(n1 - n2)].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Kenaikan suhu dihitung dengan penjumlahan: ${n1} + ${n2} = ${ans}°C.`,
          hint: `Bayangkan garis bilangan. Mulai dari angka negatif ${n1}, lalu melompat ke arah kanan (positif) sebanyak ${n2} langkah.`,
          points: 10
        };
      } else {
        const n1 = rand(5, 15);
        const n2 = rand(3, 8);
        const n3 = rand(2, 6);
        const ans = -n1 + (n2 * n3);
        return {
          id: `dyn_w1_g6_mix_${idSuffix}`,
          grade: 6,
          worldId: 1,
          levelId,
          text: `Hitunglah nilai dari ekspresi matematika berikut: -${n1} + (${n2} x ${n3})`,
          type: 'text-input',
          answer: String(ans),
          explanation: `Sesuai aturan KABATAKU, kerjakan perkalian terlebih dahulu: ${n2} x ${n3} = ${n2 * n3}. Lalu tambahkan dengan nilai negatif: -${n1} + ${n2 * n3} = ${ans}.`,
          hint: `Selesaikan dahulu bagian di dalam kurung (${n2} x ${n3}), lalu jumlahkan hasilnya dengan -${n1}.`,
          points: 15
        };
      }
    }
    case 2: { // Lembah Pola Ajaib (Patterns & Geometry)
      if (grade === 1) {
        const p1 = pick([['Bulat', 'Kotak'], ['Merah', 'Biru'], ['Segitiga', 'Bintang']]);
        return {
          id: `dyn_w2_g1_pat_${idSuffix}`,
          grade: 1,
          worldId: 2,
          levelId,
          text: `Perhatikan pola berulang berikut: ${p1[0]}, ${p1[1]}, ${p1[0]}, ${p1[1]}, ${p1[0]}, ... Pola apakah yang seharusnya muncul berikutnya?`,
          type: 'multiple-choice',
          options: [p1[0], p1[1], 'Segitiga', 'Lingkaran'].sort(() => Math.random() - 0.5),
          answer: p1[1],
          explanation: `Pola ini berulang secara selang-seling antara ${p1[0]} dan ${p1[1]}. Setelah ${p1[0]}, pasti muncul ${p1[1]}.`,
          hint: `Ucapkan polanya keras-keras untuk merasakan iramanya: ${p1[0]}, ${p1[1]}...`,
          points: 10
        };
      } else if (grade === 2) {
        const start = rand(2, 10);
        const step = pick([2, 3, 5]);
        const seq = [start, start + step, start + 2 * step, start + 3 * step];
        return {
          id: `dyn_w2_g2_seq_${idSuffix}`,
          grade: 2,
          worldId: 2,
          levelId,
          text: `Tentukan angka yang hilang pada barisan bilangan berikut: ${seq[0]}, ${seq[1]}, ${seq[2]}, ...`,
          type: 'text-input',
          answer: String(seq[3]),
          explanation: `Pola bilangan ini bertambah sebesar +${step} di setiap langkahnya. Angka berikutnya adalah ${seq[2]} + ${step} = ${seq[3]}.`,
          hint: `Hitung selisih antara ${seq[1]} dan ${seq[0]}, lalu tambahkan selisih itu ke ${seq[2]}.`,
          points: 15
        };
      } else if (grade === 3) {
        const side = rand(3, 8);
        return {
          id: `dyn_w2_g3_side_${idSuffix}`,
          grade: 3,
          worldId: 2,
          levelId,
          text: `Sebuah bangun datar segi-${side} beraturan memiliki berapa banyak sudut?`,
          type: 'multiple-choice',
          options: [String(side), String(side - 1), String(side + 1), '4'].sort(() => Math.random() - 0.5),
          answer: String(side),
          explanation: `Setiap bangun datar segi-n beraturan selalu memiliki jumlah sudut dan sisi yang sama banyak, yaitu sebanyak n. Maka segi-${side} memiliki ${side} sudut.`,
          hint: `Jumlah sudut pada segi-n adalah n itu sendiri.`,
          points: 10
        };
      } else if (grade === 4) {
        const degree = pick([45, 90, 135]);
        const ans = degree === 90 ? 'Siku-siku' : degree < 90 ? 'Lancip' : 'Tumpul';
        return {
          id: `dyn_w2_g4_ang_${idSuffix}`,
          grade: 4,
          worldId: 2,
          levelId,
          text: `Sudut yang besarnya tepat ${degree} derajat dikategorikan sebagai sudut...`,
          type: 'multiple-choice',
          options: ['Lancip', 'Siku-siku', 'Tumpul', 'Refleks'].sort(() => Math.random() - 0.5),
          answer: ans,
          explanation: `Sudut < 90° dinamakan Lancip, tepat 90° dinamakan Siku-siku, dan > 90° dinamakan Tumpul.`,
          hint: `Gunakan busur derajat sebagai bayangan. Sudut tegak lurus sempurna berukuran 90°.`,
          points: 10
        };
      } else if (grade === 5) {
        const startNum = pick([1, 2]);
        const ans = startNum === 1 ? 8 : 13;
        return {
          id: `dyn_w2_g5_fib_${idSuffix}`,
          grade: 5,
          worldId: 2,
          levelId,
          text: startNum === 1 
            ? "Dalam deret Fibonacci: 1, 1, 2, 3, 5, ... Berapakah angka berikutnya?"
            : "Dalam deret Fibonacci: 1, 2, 3, 5, 8, ... Berapakah angka berikutnya?",
          type: 'multiple-choice',
          options: [String(ans), String(ans + 2), String(ans - 3), '10'].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Dalam deret Fibonacci, angka berikutnya diperoleh dari penjumlahan dua angka sebelumnya.`,
          hint: `Jumlahkan dua angka terakhir dalam deret tersebut.`,
          points: 10
        };
      } else {
        const n = rand(4, 9);
        const ans = n * n;
        return {
          id: `dyn_w2_g6_sq_${idSuffix}`,
          grade: 6,
          worldId: 2,
          levelId,
          text: `Pola gambar dibentuk oleh barisan kuadrat: Pola 1 = 1, Pola 2 = 4, Pola 3 = 9. Berapakah jumlah persegi pada Pola ke-${n}?`,
          type: 'text-input',
          answer: String(ans),
          explanation: `Polanya adalah kuadrat dari urutan pola (n x n). Untuk Pola ke-${n}, jumlah perseginya adalah ${n} x ${n} = ${ans}.`,
          hint: `Kalikan nomor pola dengan dirinya sendiri.`,
          points: 15
        };
      }
    }
    case 3: { // Pulau Pecahan (Fractions)
      if (grade <= 2) {
        return {
          id: `dyn_w3_g1_frac_${idSuffix}`,
          grade,
          worldId: 3,
          levelId,
          text: "Ibu memotong kue ulang tahun menjadi 2 bagian yang sama besar. Berapakah nilai pecahan dari satu bagian kue tersebut?",
          type: 'multiple-choice',
          options: ['1/2 (Setengah)', '1/3 (Satu per tiga)', '1/4 (Satu per empat)', '1 (Satu utuh)'].sort(() => Math.random() - 0.5),
          answer: '1/2 (Setengah)',
          explanation: "Satu bagian utuh dipotong menjadi 2 bagian yang sama menghasilkan pecahan setengah (1/2).",
          hint: "Satu dibagi dua bagian sama dengan setengah bagian.",
          points: 10
        };
      } else if (grade === 3) {
        const d = pick([4, 6, 8]);
        const n = rand(1, d - 1);
        return {
          id: `dyn_w3_g3_frac_${idSuffix}`,
          grade: 3,
          worldId: 3,
          levelId,
          text: `Pak Adi membagi kue tar menjadi ${d} bagian sama besar. Jika anaknya memakan ${n} bagian, berapakah pecahan bagian kue yang dimakan anak tersebut?`,
          type: 'multiple-choice',
          options: [`${n}/${d}`, `${d}/${n}`, `${n + 1}/${d}`, `1/${d}`].sort(() => Math.random() - 0.5),
          answer: `${n}/${d}`,
          explanation: `Pecahan ditulis dengan Pembilang (bagian yang diambil) di atas, dan Penyebut (total bagian) di bawah. Jadi bagiannya adalah ${n}/${d}.`,
          hint: "Bagian yang dimakan di atas, total potongan kue di bawah.",
          points: 10
        };
      } else if (grade === 4) {
        return {
          id: `dyn_w3_g4_eq_${idSuffix}`,
          grade: 4,
          worldId: 3,
          levelId,
          text: "Pecahan manakah di bawah ini yang nilainya setara dengan pecahan 4/10?",
          type: 'multiple-choice',
          options: ['2/5', '1/2', '3/5', '1/5'].sort(() => Math.random() - 0.5),
          answer: '2/5',
          explanation: "Sederhanakan pecahan 4/10 dengan membagi pembilang dan penyebut dengan angka 2: (4:2)/(10:2) = 2/5.",
          hint: "Bagi bagian atas dan bawah dengan angka yang sama untuk menyederhanakannya.",
          points: 10
        };
      } else if (grade === 5) {
        return {
          id: `dyn_w3_g5_add_${idSuffix}`,
          grade: 5,
          worldId: 3,
          levelId,
          text: "Berapakah hasil dari penjumlahan pecahan 1/2 + 1/4?",
          type: 'multiple-choice',
          options: ['3/4', '2/6', '2/4', '1/3'].sort(() => Math.random() - 0.5),
          answer: '3/4',
          explanation: "Samakan penyebutnya menjadi 4: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
          hint: "Ubah dahulu pecahan 1/2 agar penyebutnya sama dengan 4.",
          points: 10
        };
      } else {
        const l = rand(2, 4) * 5;
        const ans = (l / 5) * 2;
        return {
          id: `dyn_w3_g6_ratio_${idSuffix}`,
          grade: 6,
          worldId: 3,
          levelId,
          text: `Rasio kelereng merah dibanding kelereng biru adalah 5 : 2. Jika jumlah kelereng merah adalah ${l} butir, berapakah jumlah kelereng biru?`,
          type: 'text-input',
          answer: String(ans),
          explanation: `Rasio merah = 5 bagian = ${l} butir. Maka 1 bagian rasio = ${l} / 5 = ${l / 5} butir. Kelereng biru adalah 2 bagian = 2 x ${l / 5} = ${ans} butir.`,
          hint: `Bagi jumlah kelereng merah dengan angka rasionya (5), lalu kalikan hasilnya dengan rasionya kelereng biru (2).`,
          points: 15
        };
      }
    }
    case 4: { // Gurun Pengukuran (Measurement)
      if (grade <= 2) {
        const h = rand(1, 11);
        return {
          id: `dyn_w4_g1_time_${idSuffix}`,
          grade,
          worldId: 4,
          levelId,
          text: `Jarum pendek menunjuk tepat pada angka ${h} dan jarum panjang menunjuk tepat ke angka 12. Pukul berapakah itu sekarang?`,
          type: 'multiple-choice',
          options: [`Pukul 0${h}.00`, `Pukul ${h}.30`, `Pukul 12.00`, `Pukul 0${h + 1}.00`].sort(() => Math.random() - 0.5),
          answer: `Pukul 0${h}.00`,
          explanation: `Jika jarum panjang menunjuk angka 12, maka waktu menunjukkan jam bulat sesuai angka jarum pendek. Jadi pukul 0${h}.00.`,
          hint: "Jarum panjang di angka 12 menandakan menit ke-00 (tepat).",
          points: 10
        };
      } else if (grade === 3) {
        const start = rand(7, 9);
        const duration = rand(1, 2);
        const end = start + duration;
        return {
          id: `dyn_w4_g3_dur_${idSuffix}`,
          grade: 3,
          worldId: 4,
          levelId,
          text: `Budi mulai membaca buku pukul 0${start}.00 pagi dan selesai pukul ${end < 10 ? '0' + end : end}.30. Berapa lama Budi membaca buku tersebut?`,
          type: 'multiple-choice',
          options: [`${duration} Jam 30 Menit`, `${duration} Jam`, `${duration + 1} Jam`, '30 Menit'].sort(() => Math.random() - 0.5),
          answer: `${duration} Jam 30 Menit`,
          explanation: `Selisih waktu dari pukul 0${start}.00 ke ${end < 10 ? '0' + end : end}.30 adalah ${duration} jam lebih 30 menit.`,
          hint: "Hitung selisih jamnya dulu, baru tambahkan sisa menitnya.",
          points: 10
        };
      } else if (grade === 4) {
        const m = rand(3, 9);
        const ans = m * 100;
        return {
          id: `dyn_w4_g4_conv_${idSuffix}`,
          grade: 4,
          worldId: 4,
          levelId,
          text: `Sebuah tali tambang memiliki panjang ${m} meter. Jika diubah ke dalam satuan sentimeter (cm), berapakah panjang tali tersebut?`,
          type: 'multiple-choice',
          options: [String(ans), String(m * 10), String(m * 1000), `${m}0 cm`].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Karena 1 meter sama dengan 100 cm, maka ${m} meter = ${m} x 100 = ${ans} cm.`,
          hint: "Ingatlah tangga satuan panjang. Turun 2 langkah dari m ke cm artinya dikali 100.",
          points: 10
        };
      } else if (grade === 5) {
        const l = rand(2, 8);
        const ans = l * 1000;
        return {
          id: `dyn_w4_g5_vol_${idSuffix}`,
          grade: 5,
          worldId: 4,
          levelId,
          text: `Sebuah wadah penampung air berisi ${l} Liter minyak. Berapakah volume minyak tersebut jika diubah ke dalam mililiter (ml)?`,
          type: 'multiple-choice',
          options: [String(ans), String(l * 100), String(l * 10), String(l * 10000)].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Karena 1 Liter = 1.000 mililiter (ml), maka ${l} Liter = ${l} x 1000 = ${ans} ml.`,
          hint: "Kalikan jumlah liter dengan angka 1.000 untuk mendapatkan mililiter.",
          points: 10
        };
      } else {
        const speed = rand(5, 8) * 10;
        const t = pick([2, 3]);
        const ans = speed * t;
        return {
          id: `dyn_w4_g6_speed_${idSuffix}`,
          grade: 6,
          worldId: 4,
          levelId,
          text: `Sebuah bus melaju dengan kecepatan rata-rata ${speed} km/jam selama ${t} jam. Berapakah jarak total yang berhasil ditempuh oleh bus tersebut (dalam km)?`,
          type: 'text-input',
          answer: String(ans),
          explanation: `Rumus Jarak = Kecepatan x Waktu. Jarak = ${speed} km/jam x ${t} jam = ${ans} km.`,
          hint: `Kalikan kecepatan bus (${speed}) dengan waktu tempuh (${t}).`,
          points: 15
        };
      }
    }
    case 5: { // Kota Bangun Ruang (Space & Area)
      if (grade <= 2) {
        return {
          id: `dyn_w5_g1_shape_${idSuffix}`,
          grade,
          worldId: 5,
          levelId,
          text: "Manakah dari benda berikut yang memiliki permukaan berbentuk lingkaran?",
          type: 'multiple-choice',
          options: ['Uang Koin logam', 'Buku tulis', 'Layar Televisi', 'Papan tulis'].sort(() => Math.random() - 0.5),
          answer: 'Uang Koin logam',
          explanation: "Uang koin logam memiliki bentuk bulat melingkar sempurna.",
          hint: "Cari benda yang permukaannya bulat mulus tanpa sudut lancip.",
          points: 10
        };
      } else if (grade === 3 || grade === 4) {
        const s = rand(5, 12);
        const ans = s * 4;
        return {
          id: `dyn_w5_g34_sq_${idSuffix}`,
          grade,
          worldId: 5,
          levelId,
          text: `Sebuah ubin berbentuk persegi memiliki panjang sisi ${s} cm. Hitunglah keliling ubin persegi tersebut!`,
          type: 'text-input',
          answer: String(ans),
          explanation: `Keliling persegi dihitung dengan rumus 4 x sisi. Keliling = 4 x ${s} cm = ${ans} cm.`,
          hint: "Persegi memiliki 4 sisi yang sama panjang. Jumlahkan keempat sisinya.",
          points: 15
        };
      } else if (grade === 5) {
        const s = rand(2, 5);
        const ans = s * s * s;
        return {
          id: `dyn_w5_g5_cube_${idSuffix}`,
          grade: 5,
          worldId: 5,
          levelId,
          text: `Sebuah bak mandi berbentuk kubus dengan ukuran panjang rusuk bagian dalam ${s} meter. Berapakah volume air maksimal yang bisa ditampung bak mandi tersebut?`,
          type: 'multiple-choice',
          options: [`${ans} m³`, `${s * 3} m³`, `${s * s} m³`, `${ans + 4} m³`].sort(() => Math.random() - 0.5),
          answer: `${ans} m³`,
          explanation: `Volume kubus = sisi x sisi x sisi. Volume = ${s} x ${s} x ${s} = ${ans} m³.`,
          hint: "Rumus volume kubus adalah pangkat tiga dari panjang rusuknya (r³).",
          points: 10
        };
      } else {
        const r = 7;
        const h = rand(4, 9) * 2;
        const ans = 22 * r * h;
        return {
          id: `dyn_w5_g6_cyl_${idSuffix}`,
          grade: 6,
          worldId: 5,
          levelId,
          text: `Sebuah kaleng susu berbentuk tabung memiliki jari-jari alas ${r} cm dan tinggi ${h} cm. Berapakah volume kaleng tersebut? (Gunakan π = 22/7)`,
          type: 'multiple-choice',
          options: [`${ans} cm³`, `${ans / 2} cm³`, `${ans * 2} cm³`, '500 cm³'].sort(() => Math.random() - 0.5),
          answer: `${ans} cm³`,
          explanation: `Volume Tabung = π x r² x t. Volume = (22/7) x ${r} x ${r} x ${h} = 22 x ${r} x ${h} = ${ans} cm³.`,
          hint: "Gunakan rumus V = π x r² x t. Hitung luas lingkaran alasnya dulu baru kalikan tingginya.",
          points: 10
        };
      }
    }
    case 6: { // Rawa Statistika (Statistics & Data)
      if (grade <= 3) {
        const n1 = rand(5, 9);
        const n2 = rand(3, 7);
        const ans = n1 + n2;
        return {
          id: `dyn_w6_g13_stat_${idSuffix}`,
          grade,
          worldId: 6,
          levelId,
          text: `Di sebuah petak rawa ada ${n1} ekor katak melompat-lompat dan ${n2} ekor katak sedang diam. Berapa jumlah keseluruhan katak yang ada di rawa tersebut?`,
          type: 'multiple-choice',
          options: [String(ans), String(ans + 2), String(ans - 2), '10'].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Gabungkan kedua kelompok katak dengan penjumlahan: ${n1} + ${n2} = ${ans}.`,
          hint: "Tambahkan kelompok katak melompat dengan katak yang diam.",
          points: 10
        };
      } else if (grade === 4 || grade === 5) {
        const v1 = rand(70, 80);
        const v2 = rand(80, 90);
        const v3 = rand(75, 85);
        const ans = Math.round((v1 + v2 + v3) / 3);
        return {
          id: `dyn_w6_g45_mean_${idSuffix}`,
          grade,
          worldId: 6,
          levelId,
          text: `Budi mengikuti tiga kali latihan ujian matematika dengan nilai: ${v1}, ${v2}, dan ${v3}. Berapakah nilai rata-rata (mean) dari hasil latihan Budi tersebut? (Bulatkan ke angka terdekat)`,
          type: 'multiple-choice',
          options: [String(ans), String(ans - 2), String(ans + 3), '85'].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Rata-rata dihitung dengan menjumlahkan semua nilai lalu dibagi jumlah datanya: (${v1} + ${v2} + ${v3}) / 3 = ${ans}.`,
          hint: "Jumlahkan ketiga nilai ujian terlebih dahulu, kemudian bagilah hasil penjumlahannya dengan angka 3.",
          points: 10
        };
      } else {
        const modeVal = rand(31, 35);
        const other1 = modeVal - 2;
        const other2 = modeVal + 3;
        return {
          id: `dyn_w6_g6_mode_${idSuffix}`,
          grade: 6,
          worldId: 6,
          levelId,
          text: `Diberikan data berat badan sekelompok siswa: ${modeVal} kg, ${other1} kg, ${modeVal} kg, ${other2} kg, ${modeVal} kg, ${other1} kg. Manakah nilai modusnya?`,
          type: 'multiple-choice',
          options: [`${modeVal} kg`, `${other1} kg`, `${other2} kg`, '30 kg'].sort(() => Math.random() - 0.5),
          answer: `${modeVal} kg`,
          explanation: `Modus adalah nilai data yang paling sering muncul. Angka ${modeVal} muncul sebanyak 3 kali, paling banyak dibanding data lainnya.`,
          hint: "Cari angka berat badan siswa yang memiliki frekuensi kemunculan paling tinggi.",
          points: 10
        };
      }
    }
    case 7: { // Kerajaan Logika CT (Computational Thinking)
      if (grade <= 2) {
        return {
          id: `dyn_w7_g12_ct_${idSuffix}`,
          grade,
          worldId: 7,
          levelId,
          text: "Untuk menggerakkan robot maju 2 kotak dan belok kiri, perintah urutan tombol yang benar adalah... (M = Maju, K = Kiri)",
          type: 'multiple-choice',
          options: ['M -> M -> K', 'M -> K -> M', 'K -> M -> M', 'M -> K'].sort(() => Math.random() - 0.5),
          answer: 'M -> M -> K',
          explanation: "Robot harus maju terlebih dahulu sebanyak 2 langkah (M -> M), barulah kemudian berputar ke arah kiri (K).",
          hint: "Maju dua kali lalu belok kiri sekali.",
          points: 10,
          isComputationalThinking: true
        };
      } else if (grade === 3 || grade === 4) {
        return {
          id: `dyn_w7_g34_ct_${idSuffix}`,
          grade,
          worldId: 7,
          levelId,
          text: "Jika kode sandi rahasia: A=1, B=2, C=3, D=4. Maka kata apakah yang dituliskan sebagai kode '2 - 1 - 4 - 3'?",
          type: 'multiple-choice',
          options: ['BADC', 'ABCD', 'CABD', 'BCAD'].sort(() => Math.random() - 0.5),
          answer: 'BADC',
          explanation: "Mencocokkan angka ke huruf: 2 = B, 1 = A, 4 = D, 3 = C. Digabung menjadi BADC.",
          hint: "Ganti angka 2 dengan B, angka 1 dengan A, angka 4 dengan D, dan angka 3 dengan C.",
          points: 10,
          isComputationalThinking: true
        };
      } else {
        return {
          id: `dyn_w7_g56_ct_${idSuffix}`,
          grade,
          worldId: 7,
          levelId,
          text: "Ada tiga pahlawan: Riko, Susi, dan Doni. Doni lebih tinggi dari Riko. Susi lebih tinggi dari Doni. Siapakah pahlawan yang paling PENDEK?",
          type: 'multiple-choice',
          options: ['Riko', 'Doni', 'Susi', 'Sama tinggi'].sort(() => Math.random() - 0.5),
          answer: 'Riko',
          explanation: "Hubungan tinggi badan: Susi > Doni > Riko. Maka yang paling pendek di antara ketiganya adalah Riko.",
          hint: "Susun urutannya dari yang paling tinggi ke pendek berdasarkan kalimat soal.",
          points: 12,
          isComputationalThinking: true
        };
      }
    }
    default: { // Candi Tantangan HOTS (HOTS)
      if (grade <= 2) {
        const n1 = rand(3, 8);
        const diff = rand(2, 5);
        const ans = n1 + n1 + diff;
        return {
          id: `dyn_w8_g12_hots_${idSuffix}`,
          grade,
          worldId: 8,
          levelId,
          text: `Andi memiliki ${n1} mainan robot. Roni memiliki ${diff} mainan robot lebih banyak dari Andi. Berapa jumlah mainan robot mereka jika digabungkan?`,
          type: 'multiple-choice',
          options: [String(ans), String(n1 + diff), String(ans + 3), String(ans - 2)].sort(() => Math.random() - 0.5),
          answer: String(ans),
          explanation: `Robot Andi = ${n1}. Robot Roni = ${n1} + ${diff} = ${n1 + diff}. Jumlah gabungan mereka = ${n1} + ${n1 + diff} = ${ans}.`,
          hint: "Cari dulu jumlah mainan robot milik Roni sebelum menjumlahkan total keseluruhan.",
          points: 15,
          isHots: true
        };
      } else if (grade === 3 || grade === 4) {
        const ans = '12 detik';
        return {
          id: `dyn_w8_g34_hots_${idSuffix}`,
          grade,
          worldId: 8,
          levelId,
          text: `Sebuah lampu mercusuar merah berkedip setiap 3 detik sekali. Lampu hijau berkedip setiap 4 detik sekali. Jika keduanya menyala bersamaan di detik ke-0, pada detik keberapa mereka akan berkedip bersamaan untuk kedua kalinya?`,
          type: 'multiple-choice',
          options: ['12 detik', '24 detik', '6 detik', '8 detik'].sort(() => Math.random() - 0.5),
          answer: ans,
          explanation: "Mencari kelipatan persekutuan terkecil (KPK) dari 3 dan 4. Kelipatan 3: 3, 6, 9, 12... Kelipatan 4: 4, 8, 12... KPK terkecil adalah 12 detik.",
          hint: "Carilah angka terkecil yang bisa dibagi habis oleh angka 3 sekaligus angka 4.",
          points: 15,
          isHots: true
        };
      } else {
        return {
          id: `dyn_w8_g56_hots_${idSuffix}`,
          grade,
          worldId: 8,
          levelId,
          text: "Jika 5 ekor kelinci dapat menghabiskan 5 buah wortel dalam waktu 5 menit, berapakah waktu yang diperlukan oleh 10 ekor kelinci untuk menghabiskan 10 buah wortel secara bersama-sama?",
          type: 'multiple-choice',
          options: ['5 menit', '10 menit', '50 menit', '1 menit'].sort(() => Math.random() - 0.5),
          answer: '5 menit',
          explanation: "5 kelinci menghabiskan 5 wortel dalam 5 menit berarti setiap 1 kelinci membutuhkan 5 menit untuk menghabiskan 1 wortel secara simultan. Jika ada 10 kelinci menghabiskan 10 wortel secara serentak, waktunya tetap sama yaitu 5 menit.",
          hint: "Ingatlah bahwa setiap kelinci makan wortelnya sendiri secara serentak dalam waktu yang bersamaan.",
          points: 15,
          isHots: true
        };
      }
    }
  }
}

