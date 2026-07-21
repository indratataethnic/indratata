/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

const NAMES = ["Budi", "Ani", "Cici", "Doni", "Elang", "Feri", "Gita", "Hana", "Iwan", "Joko", "Koko", "Lina", "Mila", "Niko", "Oki", "Putri", "Rian", "Sari", "Tono", "Wati", "Sinta", "Dewi", "Rudi", "Eka", "Bagus", "Bayu", "Arif", "Dian", "Santi", "Mega", "Yudi", "Hadi", "Indra", "Maya", "Tari", "Amir", "Yanti", "Umar", "Laras", "Zaki"];
const ITEMS = ["apel", "jeruk", "permen", "kelereng", "buku", "pensil", "koin", "balon", "kue", "roti", "stiker", "penghapus", "mangga", "pisang", "cokelat", "biskuit", "krayon", "penggaris", "mainan", "kartu", "manik-manik", "kertas", "peta", "bunga"];
const OBJECTS = ["tas", "meja", "kotak", "keranjang", "gelas", "piring", "laci", "lemari", "wadah", "toples", "saku", "peti", "dompet", "rak", "kantong", "loker"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickWithSeed<T>(arr: T[], seed: number): T {
  const r = seededRandom(seed);
  return arr[Math.floor(r * arr.length)];
}

function randWithSeed(min: number, max: number, seed: number): number {
  const r = seededRandom(seed);
  return Math.floor(r * (max - min + 1)) + min;
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateNumericOptions(answer: number, seed: number): string[] {
  const opts = new Set<string>();
  opts.add(String(answer));
  let attempts = 0;
  while (opts.size < 4 && attempts < 15) {
    attempts++;
    const offset = randWithSeed(-6, 6, seed + attempts * 2.3);
    if (offset !== 0 && answer + offset >= 0) {
      opts.add(String(answer + offset));
    }
  }
  let fallback = 1;
  while (opts.size < 4) {
    opts.add(String(answer + fallback));
    fallback++;
  }
  return shuffleWithSeed(Array.from(opts), seed);
}

function generateStringOptions(answer: string, distractors: string[], seed: number): string[] {
  const opts = new Set<string>();
  opts.add(answer);
  const shuffledDist = shuffleWithSeed(distractors, seed);
  for (const d of shuffledDist) {
    if (opts.size < 4 && d !== answer) opts.add(d);
  }
  const fallbacks = ["Lainnya", "Semua salah", "Sama saja", "Tidak tahu"];
  for (const f of fallbacks) {
    if (opts.size < 4 && f !== answer) opts.add(f);
  }
  return shuffleWithSeed(Array.from(opts), seed);
}

export function generateLevelQuestionPool(grade: number, worldId: number, levelId: number): Question[] {
  const pool: Question[] = [];
  const fase = grade <= 2 ? 'A' : grade <= 4 ? 'B' : 'C';

  const competencies: Record<number, string> = {
    1: "Operasi Bilangan Bulat",
    2: "Aljabar dan Pola",
    3: "Pecahan",
    4: "Pengukuran dan Geometri",
    5: "Geometri Bangun Ruang",
    6: "Analisis Data dan Peluang",
    7: "Berpikir Komputasional",
    8: "Penalaran Tingkat Tinggi"
  };

  const competency = competencies[worldId] || "Operasi Bilangan Bulat";

  for (let idx = 0; idx < 100; idx++) {
    // Unique seed based on parameters to avoid duplicates
    const seed = grade * 23000 + worldId * 2700 + levelId * 580 + idx * 19.3;
    
    let difficulty: 'mudah' | 'sedang' | 'sulit' = 'sedang';
    if (idx < 35) difficulty = 'mudah';
    else if (idx >= 70) difficulty = 'sulit';

    const name1 = pickWithSeed(NAMES, seed + 1);
    const name2 = pickWithSeed(NAMES, seed + 2);
    const item = pickWithSeed(ITEMS, seed + 3);
    const obj = pickWithSeed(OBJECTS, seed + 4);

    let text = "";
    let type: Question['type'] = "multiple-choice";
    let options: string[] = [];
    let answer = "";
    let explanation = "";
    let hint = "";
    let points = difficulty === 'mudah' ? 10 : difficulty === 'sedang' ? 15 : 20;
    let isHots = difficulty === 'sulit' && worldId !== 7;
    let isComputationalThinking = difficulty === 'sulit' && worldId === 7;
    let subCompetence = "Konsep Dasar";

    const templateId = idx % 4;

    switch (worldId) {
      case 1: { // Hutan Angka (Operasi Berhitung & Bilangan)
        subCompetence = "Konsep Bilangan & Operasi";
        if (grade === 1) {
          // Kelas 1: Membilang, Lambang bilangan, Membandingkan, Mengurutkan, Penjumlahan, Pengurangan
          if (templateId === 0) { // Membilang
            const a = randWithSeed(5, 12, seed + 5);
            answer = String(a);
            text = `Di dekat pohon rindang, terdapat sekelompok buah ${item}. Jika kita membilang satu per satu dari 1 sampai habis, jumlahnya adalah ${a}. Berapa banyak ${item} tersebut?`;
            explanation = `Membilang menghasilkan jumlah objek secara langsung yaitu ${a}.`;
            options = generateNumericOptions(a, seed);
          } else if (templateId === 1) { // Lambang Bilangan
            const val = randWithSeed(11, 19, seed + 5);
            const numWords: Record<number, string> = {
              11: "sebelas", 12: "dua belas", 13: "tiga belas", 14: "empat belas", 
              15: "lima belas", 16: "enam belas", 17: "tujuh belas", 18: "delapan belas", 19: "sembilan belas"
            };
            answer = String(val);
            text = `Manakah lambang bilangan (angka) yang tepat untuk nama bilangan "${numWords[val]}"?`;
            explanation = `Nama bilangan "${numWords[val]}" ditulis dengan lambang bilangan ${val}.`;
            options = generateNumericOptions(val, seed);
          } else if (templateId === 2) { // Membandingkan / Mengurutkan
            const a = randWithSeed(6, 10, seed + 5);
            const b = randWithSeed(2, 5, seed + 6);
            answer = `${a} lebih banyak dari ${b}`;
            text = `Bandingkan jumlah benda berikut: ${name1} memiliki ${a} buah ${item}, sedangkan ${name2} memiliki ${b} buah ${item}. Manakah kalimat perbandingan yang benar?`;
            explanation = `Karena ${a} lebih besar dari ${b}, maka ${a} lebih banyak dari ${b}.`;
            options = generateStringOptions(answer, [`${a} lebih sedikit dari ${b}`, `${a} sama banyak dengan ${b}`, `${b} lebih banyak dari ${a}`], seed);
          } else { // Penjumlahan & Pengurangan
            const a = randWithSeed(4, 9, seed + 5);
            const b = randWithSeed(2, 5, seed + 6);
            const isAdd = (idx % 2 === 0);
            if (isAdd) {
              answer = String(a + b);
              text = `${name1} mempunyai ${a} buah ${item}. Ibu memberikan ${b} buah ${item} lagi. Berapa jumlah ${item} ${name1} sekarang?`;
              explanation = `${a} + ${b} = ${answer}.`;
              options = generateNumericOptions(a + b, seed);
            } else {
              answer = String(a);
              text = `${name1} memiliki ${a + b} buah ${item}. Ia membagikan ${b} buah ${item} kepada ${name2}. Berapa sisa ${item} milik ${name1} sekarang?`;
              explanation = `${a + b} - ${b} = ${answer}.`;
              options = generateNumericOptions(a, seed);
            }
          }
        } else if (grade === 2) {
          // Kelas 2: Bilangan sampai 100, Nilai tempat, Penjumlahan, Pengurangan
          if (templateId === 0) { // Bilangan sampai 100
            const a = randWithSeed(21, 99, seed + 5);
            answer = String(a);
            text = `Seorang pedagang menghitung persediaan buah ${item} di petinya sebanyak ${a} butir. Manakah penulisan angka yang tepat untuk bilangan tersebut?`;
            explanation = `Bilangan ini ditulis langsung sebagai ${a}.`;
            options = generateNumericOptions(a, seed);
          } else if (templateId === 1) { // Nilai Tempat
            const tens = randWithSeed(2, 8, seed + 5);
            const units = randWithSeed(1, 9, seed + 6);
            const num = tens * 10 + units;
            answer = `${tens} Puluhan`;
            text = `Pada bilangan ${num}, angka ${tens} menempati nilai tempat...`;
            explanation = `Angka ${tens} di posisi kiri menempati nilai tempat Puluhan sedangkan ${units} menempati Satuan.`;
            options = generateStringOptions(answer, [`${tens} Satuan`, `${tens} Ratusan`, `${units} Puluhan`], seed);
          } else if (templateId === 2) { // Penjumlahan bersusun sampai 100
            const a = randWithSeed(15, 45, seed + 5);
            const b = randWithSeed(15, 45, seed + 6);
            answer = String(a + b);
            text = `Hitunglah hasil penjumlahan dari ${a} + ${b} dengan menggunakan teknik bersusun!`;
            explanation = `${a} + ${b} = ${answer}.`;
            options = generateNumericOptions(a + b, seed);
          } else { // Pengurangan sampai 100
            const a = randWithSeed(50, 90, seed + 5);
            const b = randWithSeed(11, 35, seed + 6);
            answer = String(a - b);
            text = `Di sebuah kebun terdapat ${a} pohon ${item}. Karena badai, sebanyak ${b} pohon tumbang. Berapa pohon ${item} yang masih kokoh berdiri?`;
            explanation = `${a} - ${b} = ${answer}.`;
            options = generateNumericOptions(a - b, seed);
          }
        } else if (grade === 3) {
          // Kelas 3: Membaca bilangan, Menulis bilangan, Nilai tempat, Membandingkan, Mengurutkan, Perkalian, Pembagian, Operasi hitung
          if (templateId === 0) { // Membaca & Menulis bilangan ribuan
            const a = randWithSeed(1000, 9999, seed + 5);
            answer = String(a);
            text = `Di Candi Tantangan terukir angka misterius. Jika angka tersebut dibaca secara harfiah, nilainya adalah ${a}. Tuliskan angka misterius tersebut dalam bentuk lambang bilangan!`;
            explanation = `Lambang bilangan yang dituliskan sesuai pembacaan adalah ${a}.`;
            options = generateNumericOptions(a, seed);
          } else if (templateId === 1) { // Nilai tempat & Membandingkan
            const a = randWithSeed(1500, 2500, seed + 5);
            const b = randWithSeed(2501, 3500, seed + 6);
            answer = `${a} lebih kecil dari ${b}`;
            text = `Bandingkan dua bilangan berikut: ${a} dan ${b}. Manakah pernyataan perbandingan matematika yang paling tepat?`;
            explanation = `Karena ${a} berada di sebelah kiri ${b} pada garis bilangan, maka ${a} lebih kecil dari ${b}.`;
            options = generateStringOptions(answer, [`${a} lebih besar dari ${b}`, `${a} sama dengan ${b}`, `${b} lebih kecil dari ${a}`], seed);
          } else if (templateId === 2) { // Perkalian
            const a = randWithSeed(4, 9, seed + 5);
            const b = randWithSeed(6, 12, seed + 6);
            answer = String(a * b);
            text = `Ibu membeli ${a} bungkus ${item}. Jika setiap bungkus berisi ${b} buah ${item}, berapa total ${item} yang dibeli ibu?`;
            explanation = `${a} x ${b} = ${answer}.`;
            options = generateNumericOptions(a * b, seed);
          } else { // Pembagian / Operasi hitung
            const b = randWithSeed(3, 8, seed + 5);
            const ans = randWithSeed(4, 12, seed + 6);
            const a = b * ans;
            answer = String(ans);
            text = `Pahlawan ${name1} ingin membagikan ${a} kelereng miliknya kepada ${b} penjaga gerbang secara sama rata. Berapa banyak kelereng yang diterima setiap penjaga?`;
            explanation = `${a} : ${b} = ${answer}.`;
            options = generateNumericOptions(ans, seed);
          }
        } else if (grade === 4) {
          // Kelas 4: Bilangan besar, Nilai tempat, Pembulatan, Operasi campuran, Faktor, Kelipatan
          if (templateId === 0) { // Bilangan besar & Nilai tempat
            const num = randWithSeed(125000, 485000, seed + 5);
            answer = "Ratusan Ribu";
            text = `Pada bilangan besar ${num}, angka pertama paling kiri menempati nilai tempat...`;
            explanation = `Angka paling kiri pada bilangan 6 digit mewakili nilai tempat Ratusan Ribu.`;
            options = generateStringOptions(answer, ["Puluhan Ribu", "Ribuan", "Jutaan"], seed);
          } else if (templateId === 1) { // Pembulatan
            const num = randWithSeed(145, 195, seed + 5);
            const rounded = Math.round(num / 10) * 10;
            answer = String(rounded);
            text = `Bulatkan bilangan ${num} ke dalam satuan puluhan terdekat!`;
            explanation = `${num} jika dibulatkan ke puluhan terdekat adalah ${rounded}.`;
            options = generateNumericOptions(rounded, seed);
          } else if (templateId === 2) { // Operasi campuran
            const a = randWithSeed(20, 50, seed + 5);
            const b = randWithSeed(3, 8, seed + 6);
            const c = randWithSeed(2, 6, seed + 7);
            answer = String(a + b * c);
            text = `Hitunglah hasil dari operasi campuran berikut ini: ${a} + ${b} x ${c}`;
            explanation = `Sesuai urutan operasi, kerjakan perkalian dahulu: ${b} x ${c} = ${b * c}. Lalu tambahkan ${a}: ${a} + ${b * c} = ${answer}.`;
            options = generateNumericOptions(a + b * c, seed);
          } else { // Faktor & Kelipatan
            const a = randWithSeed(12, 24, seed + 5);
            answer = "Faktor";
            text = `Bilangan yang dapat membagi habis bilangan ${a} tanpa sisa disebut sebagai...`;
            explanation = `Bilangan pembagi habis suatu bilangan disebut Faktor dari bilangan tersebut.`;
            options = generateStringOptions(answer, ["Kelipatan", "Kelipatan Persekutuan", "Bilangan Prima"], seed);
          }
        } else if (grade === 5) {
          // Kelas 5: Bilangan cacah, Operasi campuran, FPB, KPK
          if (templateId === 0) { // Bilangan cacah
            const a = randWithSeed(1200, 2500, seed + 5);
            const b = randWithSeed(800, 1500, seed + 6);
            answer = String(a + b);
            text = `Sebuah perpustakaan memiliki ${a} buku cerita dan menerima kiriman ${b} buku tambahan. Berapa jumlah seluruh buku sekarang?`;
            explanation = `${a} + ${b} = ${answer}.`;
            options = generateNumericOptions(a + b, seed);
          } else if (templateId === 1) { // Operasi campuran
            const a = randWithSeed(5, 12, seed + 5);
            const b = randWithSeed(3, 8, seed + 6);
            const c = randWithSeed(4, 9, seed + 7);
            answer = String((a + b) * c);
            text = `Berapakah hasil dari ekspresi matematika bersusun berikut: (${a} + ${b}) x ${c}?`;
            explanation = `Kerjakan yang ada di dalam kurung terlebih dahulu: ${a} + ${b} = ${a + b}. Kemudian kalikan ${c}: ${a + b} x ${c} = ${answer}.`;
            options = generateNumericOptions((a + b) * c, seed);
          } else if (templateId === 2) { // FPB
            const fpb = randWithSeed(4, 8, seed + 5);
            const a = fpb * 2;
            const b = fpb * 3;
            answer = String(fpb);
            text = `Tentukan Faktor Persekutuan Terbesar (FPB) dari dua bilangan berikut: ${a} dan ${b}!`;
            explanation = `Faktor pembagi terbesar yang sama untuk ${a} dan ${b} adalah ${fpb}.`;
            options = generateNumericOptions(fpb, seed);
          } else { // KPK
            const num1 = 4;
            const num2 = 6;
            answer = "12";
            text = `Berapakah Kelipatan Persekutuan Terkecil (KPK) dari bilangan 4 dan 6?`;
            explanation = `Kelipatan 4: 4, 8, 12, 16... Kelipatan 6: 6, 12, 18... Kelipatan terkecil yang sama adalah 12.`;
            options = generateStringOptions(answer, ["24", "18", "6"], seed);
          }
        } else {
          // Kelas 6: Operasi bilangan (Negatif, positif, mixed, Kabataku)
          if (templateId === 0) { // Negatif
            const a = randWithSeed(5, 15, seed + 5);
            const b = randWithSeed(16, 30, seed + 6);
            answer = String(a - b);
            text = `Hitunglah nilai dari ekspresi pengurangan bilangan bulat berikut: ${a} - ${b}`;
            explanation = `Karena pengurangnya lebih besar, hasilnya adalah bilangan bulat negatif: ${a - b}.`;
            options = generateNumericOptions(a - b, seed);
          } else if (templateId === 1) { // Cerita suhu negatif
            const initial = randWithSeed(-8, -2, seed + 5);
            const rise = randWithSeed(10, 18, seed + 6);
            answer = `${initial + rise}°C`;
            text = `Suhu udara di dalam gua es pada malam hari adalah ${initial}°C. Saat siang hari, suhunya naik sebesar ${rise}°C. Berapakah suhu udara sekarang?`;
            explanation = `${initial} + ${rise} = ${initial + rise}°C.`;
            options = generateStringOptions(answer, [`${initial}°C`, `${rise}°C`, `${initial - rise}°C`], seed);
          } else if (templateId === 2) { // Kabataku campuran
            const a = randWithSeed(10, 20, seed + 5);
            const b = randWithSeed(2, 6, seed + 6);
            const c = randWithSeed(3, 5, seed + 7);
            answer = String(-a + (b * c));
            text = `Berapakah hasil akhir dari perhitungan berikut: -${a} + (${b} x ${c})?`;
            explanation = `Kerjakan perkalian dahulu: ${b} x ${c} = ${b * c}. Kemudian -${a} + ${b * c} = ${-a + b * c}.`;
            options = generateNumericOptions(-a + (b * c), seed);
          } else { // Operasi bilangan lainnya
            const a = randWithSeed(50, 150, seed + 5);
            const b = randWithSeed(2, 5, seed + 6);
            answer = String(a * b);
            text = `Sebuah wadah penampung menampung ${a} liter air. Jika ada ${b} wadah yang sama penuh, berapa liter total air yang ada?`;
            explanation = `${a} x ${b} = ${answer} liter.`;
            options = generateNumericOptions(a * b, seed);
          }
        }
        break;
      }
      case 2: { // Lembah Pola Ajaib (Aljabar & Pola)
        subCompetence = "Pola dan Barisan";
        if (grade === 1) {
          // Kelas 1: Pola gambar/warna berulang (AB-AB, ABC-ABC)
          if (templateId === 0) {
            answer = "Merah";
            text = `Perhatikan pola warna berikut: Merah, Kuning, Merah, Kuning, Merah, ... Warna apakah setelah Merah?`;
            explanation = "Polanya berselang-seling Merah dan Kuning secara berulang.";
            options = generateStringOptions(answer, ["Kuning", "Hijau", "Biru"], seed);
          } else if (templateId === 1) {
            answer = "Segitiga";
            text = `Ada ubin berbentuk: Segitiga, Kotak, Segitiga, Kotak, ... Bentuk ubin kelima adalah...`;
            explanation = "Pola ganjil adalah Segitiga, pola genap adalah Kotak. Suku ke-5 ganjil, jadi Segitiga.";
            options = generateStringOptions(answer, ["Kotak", "Lingkaran", "Bintang"], seed);
          } else if (templateId === 2) {
            answer = "Hijau";
            text = `Sebuah rantai hias terdiri dari warna: Merah, Kuning, Hijau, Merah, Kuning, ... Warna berikutnya setelah Kuning adalah...`;
            explanation = "Pola ABC berulang: Merah -> Kuning -> Hijau.";
            options = generateStringOptions(answer, ["Merah", "Kuning", "Biru"], seed);
          } else {
            answer = "Bintang";
            text = `Ubin bermotif: Bulat, Bintang, Bulat, Bintang, ... Ubin berikutnya bermotif apa?`;
            explanation = "Pola berulang Bulat -> Bintang.";
            options = generateStringOptions(answer, ["Bulat", "Segitiga", "Kotak"], seed);
          }
        } else if (grade === 2) {
          // Kelas 2: Pola bilangan meloncat bertambah (+2, +3, +5, dst)
          const start = randWithSeed(1, 5, seed + 5);
          const step = randWithSeed(2, 4, seed + 6);
          if (templateId === 0) {
            answer = String(start + step * 3);
            text = `Lengkapi angka yang hilang pada barisan meloncat ini: ${start}, ${start + step}, ${start + step * 2}, ...`;
            explanation = `Setiap lompatan selalu bertambah ${step}.`;
            options = generateNumericOptions(start + step * 3, seed);
          } else {
            answer = String(start + 5 * 4);
            text = `Tentukan angka kelima dari barisan meloncat yang dimulai dari ${start} dengan loncatan bertambah 5!`;
            explanation = `Ulasannya: ${start}, ${start + 5}, ${start + 10}, ${start + 15}, ${start + 20}.`;
            options = generateNumericOptions(start + 20, seed);
          }
        } else if (grade === 3) {
          // Kelas 3: Pola bilangan bertambah dan berkurang (aritmetika)
          const start = randWithSeed(10, 30, seed + 5);
          const step = randWithSeed(3, 6, seed + 6);
          if (templateId < 2) {
            answer = String(start + step * 4);
            text = `Perhatikan barisan bilangan naik: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, ... Bilangan kelima adalah...`;
            explanation = `Barisan ditambah ${step} tiap langkah.`;
            options = generateNumericOptions(start + step * 4, seed);
          } else {
            const bigStart = randWithSeed(50, 80, seed + 5);
            answer = String(bigStart - step * 4);
            text = `Perhatikan barisan bilangan turun: ${bigStart}, ${bigStart - step}, ${bigStart - step * 2}, ... Berapakah bilangan kelima?`;
            explanation = `Barisan dikurangi ${step} tiap langkah.`;
            options = generateNumericOptions(bigStart - step * 4, seed);
          }
        } else if (grade === 4) {
          // Kelas 4: Pola bertingkat, pola geometri sederhana
          if (templateId === 0) {
            answer = "16";
            text = `Diberikan pola geometri pelipatan dua: 2, 4, 8, ... Berapakah angka suku berikutnya?`;
            explanation = `Polanya adalah dikali 2 pada setiap langkah: 8 x 2 = 16.`;
            options = generateStringOptions(answer, ["12", "14", "20"], seed);
          } else if (templateId === 1) {
            answer = "25";
            text = `Lengkapi barisan angka berikut yang bertambah 2, 4, 6, 8 secara bertahap: 5, 7, 11, 17, ...`;
            explanation = `Perubahan suku: +2, +4, +6, lalu berikutnya +8. Suku terakhir 17 + 8 = 25.`;
            options = generateStringOptions(answer, ["23", "24", "27"], seed);
          } else {
            const base = randWithSeed(2, 4, seed + 5);
            answer = String(base * 27);
            text = `Ada barisan pembelahan sel ajaib: ${base}, ${base * 3}, ${base * 9}, ... Berapakah angka berikutnya?`;
            explanation = `Setiap langkah dikalikan 3. ${base * 9} x 3 = ${base * 27}.`;
            options = generateNumericOptions(base * 27, seed);
          }
        } else if (grade === 5) {
          // Kelas 5: Pola kompleks (Fibonacci, pola kuadrat, aljabar linear)
          if (templateId === 0) {
            answer = "13";
            text = `Diberikan barisan Fibonacci berikut: 1, 1, 2, 3, 5, 8, ... Suku selanjutnya adalah...`;
            explanation = `Suku berikutnya diperoleh dari penjumlahan dua suku sebelumnya: 5 + 8 = 13.`;
            options = generateStringOptions(answer, ["11", "12", "15"], seed);
          } else if (templateId === 1) {
            answer = "25";
            text = `Tentukan pola ke-5 dari barisan bilangan kuadrat: 1, 4, 9, 16, ...`;
            explanation = `Polanya adalah n x n. Pola ke-5 adalah 5 x 5 = 25.`;
            options = generateStringOptions(answer, ["20", "30", "36"], seed);
          } else {
            const val = randWithSeed(3, 7, seed + 5);
            answer = String(val);
            text = `Jika sebuah persamaan aljabar tertulis: 3 x X + 5 = ${3 * val + 5}. Berapakah nilai X?`;
            explanation = `X = (${3 * val + 5} - 5) / 3 = ${val}.`;
            options = generateNumericOptions(val, seed);
          }
        } else {
          // Kelas 6: Aljabar variabel, persamaan satu variabel, deret geometri
          if (templateId === 0) {
            const x = randWithSeed(4, 9, seed + 5);
            answer = String(x);
            text = `Berapakah nilai variabel y yang memenuhi persamaan linear satu variabel berikut: 4y - 3 = ${4 * x - 3}?`;
            explanation = `4y = ${4 * x - 3} + 3 = ${4 * x}. Maka y = ${x}.`;
            options = generateNumericOptions(x, seed);
          } else if (templateId === 1) {
            answer = "81";
            text = `Tentukan suku kelima dari barisan geometri bertingkat r=3: 1, 3, 9, 27, ...`;
            explanation = `Suku ke-5 adalah 27 x 3 = 81.`;
            options = generateStringOptions(answer, ["54", "60", "90"], seed);
          } else {
            const x = randWithSeed(2, 5, seed + 5);
            answer = String(x);
            text = `Tentukan nilai x dari perbandingan senilai berikut: x / 6 = ${x * 2} / 12`;
            explanation = `Karena rasionya senilai, x = ${x}.`;
            options = generateNumericOptions(x, seed);
          }
        }
        break;
      }
      case 3: { // Reruntuhan Pecahan / Pulau Pecahan
        subCompetence = "Konsep Pecahan";
        if (grade === 1) {
          // Kelas 1: Setengah, Sepertiga, Seperempat dari benda konkret
          if (templateId === 0) {
            answer = "Setengah (1/2)";
            text = `Ibu memotong kue bolu pandan menjadi 2 bagian yang sama besar. Berapa bagian kah satu potong kue tersebut?`;
            explanation = `Satu benda dibagi 2 bagian sama besar bernilai setengah atau 1/2.`;
            options = generateStringOptions(answer, ["Sepertiga (1/3)", "Seperempat (1/4)", "Satu utuh"], seed);
          } else if (templateId === 1) {
            answer = "Seperempat (1/4)";
            text = `Sebuah pizza dipotong menjadi 4 potong yang berukuran sama. Jika Ani memakan satu potong, berapa bagian yang dimakan Ani?`;
            explanation = `Satu potong dari 4 bagian sama besar bernilai seperempat atau 1/4.`;
            options = generateStringOptions(answer, ["Setengah (1/2)", "Sepertiga (1/3)", "Dua per empat"], seed);
          } else {
            answer = "Sepertiga (1/3)";
            text = `Jika sebatang cokelat dipotong menjadi 3 bagian sama panjang, setiap bagian bernilai...`;
            explanation = `Satu dari 3 bagian bernilai sepertiga (1/3).`;
            options = generateStringOptions(answer, ["Setengah (1/2)", "Seperempat (1/4)", "Dua per tiga"], seed);
          }
        } else if (grade === 2) {
          // Kelas 2: Pecahan sederhana (1/2, 1/3, 1/4) dan maknanya (arsiran, potongan)
          if (templateId === 0) {
            answer = "1/2";
            text = `Sebuah lingkaran diarsir tepat separuh bagian dari keseluruhan permukaannya. Nilai pecahan daerah yang diarsir adalah...`;
            explanation = `Separuh bagian berarti 1 dari 2 bagian, ditulis 1/2.`;
            options = generateStringOptions(answer, ["1/3", "1/4", "2/3"], seed);
          } else if (templateId === 1) {
            answer = "2/4";
            text = `Jika sebuah persegi dibagi menjadi 4 bagian sama besar, dan 2 bagian di antaranya diarsir, berapa pecahan yang diwakili bagian arsir tersebut?`;
            explanation = `2 bagian diarsir dari 4 total bagian bernilai 2/4.`;
            options = generateStringOptions(answer, ["1/4", "3/4", "1/3"], seed);
          } else {
            answer = "1/3";
            text = `Sebuah segitiga dibagi menjadi 3 bagian sama besar, dan 1 bagian diarsir. Berapakah pecahan daerah arsir tersebut?`;
            explanation = `1 dari 3 bagian sama besar adalah 1/3.`;
            options = generateStringOptions(answer, ["1/2", "1/4", "3/1"], seed);
          }
        } else if (grade === 3) {
          // Kelas 3: Membaca/menulis pecahan, membandingkan berpenyebut sama, penjumlahan berpenyebut sama
          if (templateId === 0) {
            answer = "3/5";
            text = `Pecahan "tiga per lima" ditulis dalam bentuk lambang matematika sebagai...`;
            explanation = `Pembilang adalah 3 (di atas) dan penyebut adalah 5 (di bawah), ditulis 3/5.`;
            options = generateStringOptions(answer, ["5/3", "3.5", "1/5"], seed);
          } else if (templateId === 1) {
            answer = "Lebih besar dari";
            text = `Bandingkan dua pecahan berikut: 4/7 dengan 2/7. Pecahan 4/7 memiliki nilai yang... pecahan 2/7.`;
            explanation = `Karena pembilang 4 lebih besar dari 2 dengan penyebut yang sama, maka 4/7 lebih besar dari 2/7.`;
            options = generateStringOptions(answer, ["Lebih kecil dari", "Sama dengan", "Tidak bisa dibandingkan"], seed);
          } else {
            const a = randWithSeed(1, 3, seed + 5);
            const b = randWithSeed(1, 2, seed + 6);
            answer = `${a + b}/8`;
            text = `Berapakah hasil dari penjumlahan pecahan berpenyebut sama berikut: ${a}/8 + ${b}/8?`;
            explanation = `Jumlahkan pembilangnya langsung: ${a} + ${b} = ${a + b}/8.`;
            options = generateStringOptions(answer, [`${a}/8`, `${b}/8`, `${a + b}/16`], seed);
          }
        } else if (grade === 4) {
          // Kelas 4: Pecahan senilai, penyederhanaan pecahan, desimal persepuluhan
          if (templateId === 0) {
            answer = "1/2";
            text = `Bentuk paling sederhana dari pecahan 4/8 adalah...`;
            explanation = `Bagi pembilang dan penyebut dengan 4: (4/4) / (8/4) = 1/2.`;
            options = generateStringOptions(answer, ["2/4", "1/4", "2/3"], seed);
          } else if (templateId === 1) {
            answer = "0.7";
            text = `Tuliskan pecahan biasa 7/10 dalam bentuk pecahan desimal!`;
            explanation = `Pecahan berpenyebut 10 ditulis dengan satu angka di belakang koma, yaitu 0.7.`;
            options = generateStringOptions(answer, ["0.07", "7.0", "0.17"], seed);
          } else {
            answer = "2/3";
            text = `Pecahan manakah di bawah ini yang senilai dengan 6/9?`;
            explanation = `Sederhanakan 6/9 dengan membagi pembilang dan penyebut dengan 3, diperoleh 2/3.`;
            options = generateStringOptions(answer, ["1/3", "3/4", "5/9"], seed);
          }
        } else if (grade === 5) {
          // Kelas 5: Penjumlahan/pengurangan penyebut berbeda, desimal, persen, perkalian pecahan
          if (templateId === 0) {
            answer = "3/4";
            text = `Hitunglah hasil dari penjumlahan pecahan berbeda penyebut berikut: 1/2 + 1/4`;
            explanation = `Samakan penyebut menjadi 4: 2/4 + 1/4 = 3/4.`;
            options = generateStringOptions(answer, ["2/6", "1/3", "2/4"], seed);
          } else if (templateId === 1) {
            answer = "45%";
            text = `Ubah pecahan desimal 0.45 ke dalam bentuk persen!`;
            explanation = `Persen berarti per seratus. 0.45 sama dengan 45/100, ditulis 45%.`;
            options = generateStringOptions(answer, ["4.5%", "0.45%", "450%"], seed);
          } else {
            answer = "1/6";
            text = `Berapakah hasil dari perkalian pecahan berikut: 1/2 x 1/3?`;
            explanation = `Kalikan pembilang dengan pembilang, penyebut dengan penyebut: (1x1) / (2x3) = 1/6.`;
            options = generateStringOptions(answer, ["2/5", "1/5", "5/6"], seed);
          }
        } else {
          // Kelas 6: Operasi campuran pecahan/desimal/persen, rasio sederhana, perbandingan senilai/berbalik
          if (templateId === 0) {
            answer = "0.5";
            text = `Hitunglah nilai dari operasi campuran berikut dalam desimal: 3/4 - 0.25`;
            explanation = `3/4 dalam desimal adalah 0.75. Maka 0.75 - 0.25 = 0.5.`;
            options = generateStringOptions(answer, ["0.25", "0.55", "1.0"], seed);
          } else if (templateId === 1) {
            const a = randWithSeed(2, 4, seed + 5) * 5;
            answer = String((a / 5) * 3);
            text = `Rasio kelereng merah dibanding kelereng biru adalah 5:3. Jika jumlah kelereng merah adalah ${a} butir, berapa butir kelereng biru?`;
            explanation = `Rasio merah = 5 bagian = ${a} butir, maka 1 bagian = ${a}/5 = ${a/5}. Kelereng biru = 3 bagian = 3 x ${a/5} = ${(a/5)*3}.`;
            options = generateNumericOptions((a/5)*3, seed);
          } else {
            answer = "15 hari";
            text = `Sebuah pekerjaan pembangunan jembatan dapat diselesaikan oleh 3 pekerja dalam 10 hari. Jika pekerja dikurangi menjadi 2 orang saja, berapa hari waktu yang dibutuhkan?`;
            explanation = `Perbandingan berbalik nilai: Pekerja x Hari = Konstan. 3 x 10 = 30. Jika 2 pekerja, waktu = 30 / 2 = 15 hari.`;
            options = generateStringOptions(answer, ["20 hari", "12 hari", "8 hari"], seed);
          }
        }
        break;
      }
      case 4: { // Padang Ukur / Gurun Pengukuran (Pengukuran)
        subCompetence = "Konsep Pengukuran";
        if (grade === 1) {
          // Kelas 1: Pengukuran panjang tidak baku (jengkal, langkah, depa), perbandingan panjang/berat intuitif
          if (templateId === 0) {
            answer = "Langkah Kaki";
            text = `Alat ukur tidak baku manakah yang paling cocok digunakan untuk mengukur lebar halaman kelas?`;
            explanation = `Langkah kaki sangat praktis untuk mengukur jarak panjang di lantai/tanah.`;
            options = generateStringOptions(answer, ["Jengkal Tangan", "Buku Tulis", "Pensil"], seed);
          } else if (templateId === 1) {
            answer = "Batu Besar";
            text = `Di antara benda berikut: Bulu Burung, Daun Kering, dan Batu Besar, manakah benda yang paling berat?`;
            explanation = `Secara intuitif, batu besar memiliki bobot yang paling berat dibanding bulu burung dan daun kering.`;
            options = generateStringOptions(answer, ["Bulu Burung", "Daun Kering", "Sama ringan"], seed);
          } else {
            answer = "Jengkal Tangan";
            text = `Ukur panjang meja kelas menggunakan bentangan telapak tangan kita dari ibu jari ke kelingking disebut mengukur dengan...`;
            explanation = `Bentangan dari ibu jari ke kelingking dinamakan jengkal tangan.`;
            options = generateStringOptions(answer, ["Langkah kaki", "Depa", "Tali tambang"], seed);
          }
        } else if (grade === 2) {
          // Kelas 2: Uang (rupiah), waktu (jam analog tepat dan setengah), pengukuran berat/panjang sederhana
          if (templateId === 0) {
            answer = "Pukul 07.00";
            text = `Sebuah jam analog menunjukkan jarum pendek tepat ke angka 7, dan jarum panjang tepat ke angka 12. Pukul berapakah itu?`;
            explanation = `Jarum panjang di angka 12 menandakan jam tepat bulat, yaitu pukul 07.00.`;
            options = generateStringOptions(answer, ["Pukul 07.30", "Pukul 12.07", "Pukul 06.00"], seed);
          } else if (templateId === 1) {
            answer = "Rp 3.000";
            text = `Budi memiliki satu lembar uang kertas Rp 2.000 dan satu koin Rp 1.000. Berapa jumlah total uang Budi?`;
            explanation = `Rp 2.000 + Rp 1.000 = Rp 3.000.`;
            options = generateStringOptions(answer, ["Rp 4.000", "Rp 1.500", "Rp 5.000"], seed);
          } else {
            answer = "Pukul 08.30";
            text = `Jika jarum pendek berada di antara angka 8 dan 9, sedangkan jarum panjang menunjuk tepat ke angka 6. Waktu tersebut dibaca pukul...`;
            explanation = `Jarum panjang di angka 6 menandakan lewat 30 menit (setengah jam). Maka pukul 08.30.`;
            options = generateStringOptions(answer, ["Pukul 08.00", "Pukul 09.30", "Pukul 06.08"], seed);
          }
        } else if (grade === 3) {
          // Kelas 3: Satuan baku (m, cm), keliling & luas dengan petak satuan
          const s = randWithSeed(3, 6, seed + 5);
          if (templateId === 0) {
            answer = String(s * 100);
            text = `Sebuah jembatan kecil panjangnya ${s} meter. Berapa panjang jembatan tersebut jika dinyatakan dalam sentimeter (cm)?`;
            explanation = `1 meter = 100 sentimeter. Maka ${s} meter = ${s} x 100 = ${answer} cm.`;
            options = generateNumericOptions(s * 100, seed);
          } else if (templateId === 1) {
            answer = "12 petak satuan";
            text = `Sebuah lantai persegi panjang ditutupi oleh 3 baris ubin, dengan setiap baris berisi 4 ubin. Berapa luas lantai tersebut dalam petak satuan?`;
            explanation = `Luas dalam petak satuan = 3 x 4 = 12 petak satuan.`;
            options = generateStringOptions(answer, ["7 petak satuan", "14 petak satuan", "9 petak satuan"], seed);
          } else {
            answer = String(s * 4);
            text = `Sebuah taplak meja berbentuk persegi memiliki sisi ${s} meter. Hitunglah keliling taplak meja tersebut!`;
            explanation = `Keliling persegi = 4 x sisi = 4 x ${s} = ${answer} meter.`;
            options = generateNumericOptions(s * 4, seed);
          }
        } else if (grade === 4) {
          // Kelas 4: m, cm, mm, keliling & luas, konsep sudut (siku-siku, lancip, tumpul)
          if (templateId === 0) {
            answer = "Siku-siku";
            text = `Sudut yang terbentuk tepat berukuran 90 derajat dinamakan sebagai sudut...`;
            explanation = `Sudut berukuran tepat 90 derajat adalah sudut siku-siku.`;
            options = generateStringOptions(answer, ["Lancip", "Tumpul", "Refleks"], seed);
          } else if (templateId === 1) {
            const p = randWithSeed(6, 12, seed + 5);
            const l = randWithSeed(3, 5, seed + 6);
            answer = String(p * l);
            text = `Sebuah halaman rumah berbentuk persegi panjang memiliki panjang ${p} meter dan lebar ${l} meter. Berapakah luas halaman tersebut (m²)?`;
            explanation = `Luas persegi panjang = Panjang x Lebar = ${p} x ${l} = ${answer} m².`;
            options = generateNumericOptions(p * l, seed);
          } else {
            answer = "Lancip";
            text = `Sudut yang ukurannya lebih kecil dari 90 derajat dinamakan sebagai sudut...`;
            explanation = `Sudut dengan besar < 90 derajat disebut sudut lancip.`;
            options = generateStringOptions(answer, ["Tumpul", "Siku-siku", "Lurus"], seed);
          }
        } else if (grade === 5) {
          // Kelas 5: Volume kubus/balok, luas permukaan, konversi satuan volume (liter, ml, m³)
          if (templateId === 0) {
            const s = randWithSeed(3, 5, seed + 5);
            answer = `${s * s * s} cm³`;
            text = `Sebuah mainan berbentuk kubus memiliki panjang rusuk ${s} cm. Hitunglah volume kubus tersebut!`;
            explanation = `Volume kubus = sisi x sisi x sisi = ${s} x ${s} x ${s} = ${s * s * s} cm³.`;
            options = generateStringOptions(answer, [`${s * s} cm³`, `${s * 6} cm³`, `${s * s * s + 10} cm³`], seed);
          } else if (templateId === 1) {
            const liters = randWithSeed(2, 6, seed + 5);
            answer = String(liters * 1000);
            text = `Satu jeriken berisi ${liters} liter minyak goreng. Berapa mililiter (ml) volume minyak zaitun tersebut jika dikonversikan?`;
            explanation = `1 liter = 1.000 ml. Maka ${liters} liter = ${liters * 1000} ml.`;
            options = generateNumericOptions(liters * 1000, seed);
          } else {
            const p = randWithSeed(4, 6, seed + 5);
            const l = 3;
            const t = 2;
            answer = String(p * l * t);
            text = `Hitunglah volume balok kayu yang memiliki panjang ${p} cm, lebar ${l} cm, dan tinggi ${t} cm!`;
            explanation = `Volume balok = p x l x t = ${p} x 3 x 2 = ${answer} cm³.`;
            options = generateNumericOptions(p * l * t, seed);
          }
        } else {
          // Kelas 6: Luas gabungan bangun datar, volume gabungan, konsep skala
          if (templateId === 0) {
            answer = "10 km";
            text = `Pada peta tertulis skala 1:200.000. Jika jarak dua kota pada peta adalah 5 cm, berapakah jarak sebenarnya?`;
            explanation = `Jarak sebenarnya = Jarak peta x Skala = 5 x 200.000 = 1.000.000 cm = 10 km.`;
            options = generateStringOptions(answer, ["1 km", "100 km", "2 km"], seed);
          } else if (templateId === 1) {
            answer = "24 cm";
            text = `Sebuah papan nama berbentuk gabungan dua persegi kecil yang masing-masing berukuran sisi 4 cm dilepaskan. Berapakah keliling terluar gabungan persegi yang berdampingan tersebut?`;
            explanation = `Jika dua persegi berdampingan, maka ada satu sisi pertemuan di dalam yang tidak dihitung keliling. Jumlah sisi terluar adalah 6 sisi. Maka 6 x 4 = 24 cm.`;
            options = generateStringOptions(answer, ["32 cm", "16 cm", "28 cm"], seed);
          } else {
            answer = "1 : 500.000";
            text = `Jarak kota A ke B sebenarnya adalah 25 km. Jika digambar di peta sejauh 5 cm, berapakah skala peta tersebut?`;
            explanation = `Skala = Jarak peta : Jarak sebenarnya = 5 cm : 2.500.000 cm = 1 : 500.000.`;
            options = generateStringOptions(answer, ["1 : 5.000", "1 : 50.000", "1 : 2.500.000"], seed);
          }
        }
        break;
      }
      case 5: { // Kota Bangun Ruang (Geometri Bangun Datar & Ruang)
        subCompetence = "Geometri & Bangun Ruang";
        if (grade === 1) {
          // Kelas 1: Mengenal bangun datar (segitiga, segi empat, lingkaran) & bangun ruang (kubus, balok, bola)
          if (templateId === 0) {
            answer = "Lingkaran";
            text = `Roda sepeda milik pahlawan ${name1} memiliki permukaan yang berbentuk bangun datar...`;
            explanation = `Roda sepeda memiliki permukaan bulat melingkar, yaitu lingkaran.`;
            options = generateStringOptions(answer, ["Segitiga", "Segi Empat", "Bintang"], seed);
          } else if (templateId === 1) {
            answer = "Kubus";
            text = `Dadu mainan bermata 6 memiliki bentuk bangun ruang yang dinamakan...`;
            explanation = `Dadu mainan memiliki 6 sisi persegi yang sama besar, dinamakan kubus.`;
            options = generateStringOptions(answer, ["Bola", "Tabung", "Kerucut"], seed);
          } else {
            answer = "Bola";
            text = `Benda bulat meluncur seperti kelereng dan bola basket tergolong sebagai bangun ruang...`;
            explanation = `Bangun ruang bulat sempurna tanpa sudut dinamakan bola.`;
            options = generateStringOptions(answer, ["Balok", "Kubus", "Limas"], seed);
          }
        } else if (grade === 2) {
          // Kelas 2: Mengidentifikasi Sisi, Sudut, Titik Sudut
          if (templateId === 0) {
            answer = "3";
            text = `Berapa jumlah titik sudut yang dimiliki oleh bangun datar segitiga?`;
            explanation = `Segitiga memiliki 3 sisi dan 3 titik sudut.`;
            options = generateNumericOptions(3, seed);
          } else if (templateId === 1) {
            answer = "4 Sisi";
            text = `Bangun datar persegi panjang memiliki karakteristik jumlah sisi sebanyak...`;
            explanation = `Persegi panjang memiliki 4 sisi (2 pasang sisi yang sama panjang).`;
            options = generateStringOptions(answer, ["3 Sisi", "5 Sisi", "Tidak terbatas"], seed);
          } else {
            answer = "8 Titik Sudut";
            text = `Bangun ruang kubus memiliki titik sudut sebanyak...`;
            explanation = `Kubus memiliki 8 titik sudut, 12 rusuk, dan 6 sisi.`;
            options = generateStringOptions(answer, ["6 Titik Sudut", "12 Titik Sudut", "4 Titik Sudut"], seed);
          }
        } else if (grade === 3) {
          // Kelas 3: Sifat bangun datar, simetri lipat dan simetri putar dasar
          if (templateId === 0) {
            answer = "4";
            text = `Berapakah jumlah simetri lipat yang dimiliki oleh bangun datar persegi?`;
            explanation = `Persegi memiliki 4 simetri lipat (horizontal, vertikal, dan dua diagonal).`;
            options = generateNumericOptions(4, seed);
          } else if (templateId === 1) {
            answer = "2";
            text = `Berapa jumlah simetri putar yang dimiliki oleh bangun datar persegi panjang?`;
            explanation = `Persegi panjang memiliki 2 simetri putar penuh saat diputar 360 derajat.`;
            options = generateNumericOptions(2, seed);
          } else {
            answer = "Segitiga Sama Sisi";
            text = `Bangun datar yang memiliki 3 sisi sama panjang dan 3 sudut sama besar adalah...`;
            explanation = `Segitiga yang ketiga sisinya sama panjang disebut segitiga sama sisi.`;
            options = generateStringOptions(answer, ["Segitiga Sama Kaki", "Segitiga Siku-siku", "Segitiga Sembarang"], seed);
          }
        } else if (grade === 4) {
          // Kelas 4: Sudut, simetri lipat/putar lengkap, segi banyak beraturan/tidak
          if (templateId === 0) {
            answer = "Tak terhingga";
            text = `Berapakah jumlah simetri lipat yang dimiliki oleh sebuah bangun datar lingkaran?`;
            explanation = `Lingkaran memiliki garis lipat simetri tak terbatas melewati titik pusatnya.`;
            options = generateStringOptions(answer, ["4", "10", "100"], seed);
          } else if (templateId === 1) {
            answer = "Segi Banyak Beraturan";
            text = `Sebuah bangun segi-6 yang semua sisi dan semua sudutnya sama besar digolongkan sebagai...`;
            explanation = `Bangun datar tertutup dengan sisi dan sudut sama panjang dinamakan segi banyak beraturan.`;
            options = generateStringOptions(answer, ["Segi Banyak Tidak Beraturan", "Bukan Segi Banyak", "Bangun Melengkung"], seed);
          } else {
            answer = "180 derajat";
            text = `Jumlah seluruh sudut bagian dalam dari sebuah segitiga apa saja adalah...`;
            explanation = `Jumlah sudut dalam segitiga selalu konstan bernilai 180 derajat.`;
            options = generateStringOptions(answer, ["90 derajat", "360 derajat", "270 derajat"], seed);
          }
        } else if (grade === 5) {
          // Kelas 5: Jaring-jaring kubus/balok, sudut, pengukuran sudut busur
          if (templateId === 0) {
            answer = "6 persegi";
            text = `Jaring-jaring kubus jika dibentangkan utuh akan terdiri dari rangkaian...`;
            explanation = `Kubus terbentuk dari gabungan 6 bidang persegi yang identik.`;
            options = generateStringOptions(answer, ["6 persegi panjang", "4 persegi dan 2 segitiga", "8 persegi"], seed);
          } else if (templateId === 1) {
            answer = "Busur Derajat";
            text = `Alat bantu ukur standar yang paling tepat digunakan untuk mengukur besar derajat sudut adalah...`;
            explanation = `Busur derajat digunakan khusus untuk mengukur sudut dalam satuan derajat.`;
            options = generateStringOptions(answer, ["Penggaris Panjang", "Meteran Pita", "Jangka"], seed);
          } else {
            answer = "Jaring-jaring balok";
            text = `Rangkaian yang terdiri dari 3 pasang persegi panjang yang saling berhadapan membentuk bangun ruang disebut...`;
            explanation = `Bentangan permukaan balok disebut jaring-jaring balok.`;
            options = generateStringOptions(answer, ["Jaring-jaring kubus", "Jaring-jaring prisma", "Jaring-jaring tabung"], seed);
          }
        } else {
          // Kelas 6: Sifat prisma, tabung, kerucut, limas, bola; gabungan jaring-jaring
          if (templateId === 0) {
            answer = "Tabung";
            text = `Bangun ruang yang memiliki alas dan tutup berbentuk lingkaran yang sejajar serta selimut melengkung adalah...`;
            explanation = `Tabung dicirikan dengan 2 lingkaran sejajar dan selimut lengkung silinder.`;
            options = generateStringOptions(answer, ["Kerucut", "Prisma", "Tabung"], seed);
          } else if (templateId === 1) {
            answer = "Prisma Segitiga";
            text = `Bangun ruang yang memiliki 5 sisi, dengan alas dan atap berbentuk segitiga kongruen dinamakan...`;
            explanation = `Prisma segitiga memiliki 2 sisi segitiga dan 3 sisi tegak segi empat.`;
            options = generateStringOptions(answer, ["Limas Segitiga", "Prisma Segi Empat", "Kerucut"], seed);
          } else {
            answer = "Kerucut";
            text = `Bangun ruang yang memiliki alas lingkaran dan satu titik puncak lancip di atasnya adalah...`;
            explanation = `Kerucut merupakan limas dengan alas berbentuk lingkaran.`;
            options = generateStringOptions(answer, ["Tabung", "Prisma", "Bola"], seed);
          }
        }
        break;
      }
      case 6: { // Rawa Statistika (Statistika & Peluang)
        subCompetence = "Statistika dan Data";
        if (grade === 1) {
          // Kelas 1: Membaca data sederhana dari tabel turus / daftar sederhana
          if (templateId === 0) {
            answer = "8 ekor";
            text = `Tabel jumlah hewan rawa: Katak Hijau 8 ekor, Katak Cokelat 5 ekor. Berapa jumlah katak hijau yang tercatat?`;
            explanation = `Sesuai data di tabel, Katak Hijau berjumlah 8 ekor.`;
            options = generateStringOptions(answer, ["5 ekor", "3 ekor", "13 ekor"], seed);
          } else if (templateId === 1) {
            answer = "Katak Hijau";
            text = `Tabel mencatat: Katak Hijau 8 ekor, Katak Cokelat 5 ekor. Katak warna apakah yang paling banyak di rawa?`;
            explanation = `8 (Katak Hijau) lebih besar dibanding 5 (Katak Cokelat).`;
            options = generateStringOptions(answer, ["Katak Cokelat", "Semua sama", "Tidak ada"], seed);
          } else {
            answer = "3 ekor";
            text = `Berdasarkan catatan rawa: Katak Hijau 8 ekor, Katak Cokelat 5 ekor. Berapa selisih jumlah kedua jenis katak tersebut?`;
            explanation = `Selisih = 8 - 5 = 3 ekor.`;
            options = generateStringOptions(answer, ["13 ekor", "8 ekor", "2 ekor"], seed);
          }
        } else if (grade === 2) {
          // Kelas 2: Membaca data dari diagram gambar (piktogram)
          if (templateId === 0) {
            answer = "6 buah";
            text = `Di papan data, satu gambar bintang mewakili 2 buah apel. Jika ada 3 gambar bintang di kolom nama Ani, berapa buah apel milik Ani sebenarnya?`;
            explanation = `3 gambar bintang x 2 = 6 buah apel sebenarnya.`;
            options = generateStringOptions(answer, ["3 buah", "5 buah", "8 buah"], seed);
          } else {
            answer = "3 bintang";
            text = `Jika satu gambar bintang mewakili 2 buah apel, berapa bintang yang harus digambar untuk melambangkan 6 buah apel?`;
            explanation = `6 / 2 = 3 gambar bintang.`;
            options = generateStringOptions(answer, ["2 bintang", "4 bintang", "6 bintang"], seed);
          }
        } else if (grade === 3) {
          // Kelas 3: Membaca dan menafsirkan diagram batang sederhana
          if (templateId === 0) {
            answer = "Siswa Kelas 3";
            text = `Sebuah diagram batang menunjukkan tinggi batang buku terbaca: Kelas 1 = 10, Kelas 2 = 15, Kelas 3 = 25. Kelas manakah yang membaca buku paling banyak?`;
            explanation = `Batang Kelas 3 paling tinggi dengan nilai pembacaan 25.`;
            options = generateStringOptions(answer, ["Siswa Kelas 1", "Siswa Kelas 2", "Semua sama"], seed);
          } else {
            answer = "15 buku";
            text = `Dari diagram batang perpustakaan: Kelas 1 = 10, Kelas 2 = 15, Kelas 3 = 25. Berapa banyak buku yang dibaca oleh siswa Kelas 2?`;
            explanation = `Tinggi batang Kelas 2 sejajar dengan angka 15 buku.`;
            options = generateStringOptions(answer, ["10 buku", "25 buku", "5 buku"], seed);
          }
        } else if (grade === 4) {
          // Kelas 4: Menyajikan/menganalisis diagram batang dan diagram garis
          if (templateId === 0) {
            answer = "Diagram Garis";
            text = `Diagram manakah yang paling tepat digunakan untuk menyajikan perubahan suhu udara rawa dari jam ke jam secara berkesinambungan?`;
            explanation = `Diagram garis sangat cocok untuk menampilkan perkembangan data yang kontinu (terus-menerus).`;
            options = generateStringOptions(answer, ["Diagram Batang", "Diagram Gambar", "Tabel Turus"], seed);
          } else {
            answer = "Diagram Batang";
            text = `Untuk membandingkan jumlah siswa per kelas secara visual dengan batang tegak terpisah, jenis diagram yang paling umum dipakai adalah...`;
            explanation = `Diagram batang digunakan untuk membandingkan data kategori yang terpisah.`;
            options = generateStringOptions(answer, ["Diagram Garis", "Diagram Lingkaran", "Daftar Tulisan"], seed);
          }
        } else if (grade === 5) {
          // Kelas 5: Menghitung rata-rata (mean), interpretasi data tabel/diagram
          if (templateId === 0) {
            answer = "15 telur";
            text = `Diberikan data telur bangau di tiga sarang: 10, 15, dan 20 butir. Berapakah nilai rata-rata (mean) telur per sarang?`;
            explanation = `Rata-rata = (10 + 15 + 20) / 3 = 45 / 3 = 15 telur.`;
            options = generateStringOptions(answer, ["10 telur", "20 telur", "12 telur"], seed);
          } else {
            answer = "20 cm";
            text = `Data pertumbuhan tanaman: Hari 1 = 10 cm, Hari 2 = 15 cm, Hari 3 = 35 cm. Berapa tinggi tanaman tertinggi yang tercatat?`;
            explanation = `Berdasarkan data, nilai tertinggi adalah 35 cm.`;
            options = generateStringOptions(answer, ["35 cm", "10 cm", "15 cm"], seed);
            answer = "35 cm";
          }
        } else {
          // Kelas 6: Analisis data, diagram lingkaran, mean, median, modus, peluang sederhana
          if (templateId === 0) {
            answer = "12.5";
            text = `Diberikan rangkaian data tinggi air: 10, 15, 20. Berapakah nilai rata-rata (mean) dari data tersebut?`;
            explanation = `(10 + 15 + 20) / 3 = 45 / 3 = 15.`;
            options = generateStringOptions("15", ["10", "20", "12.5"], seed);
            answer = "15";
          } else if (templateId === 1) {
            answer = "Modus";
            text = `Nilai data matematika yang paling sering muncul atau memiliki frekuensi kemunculan terbanyak dinamakan...`;
            explanation = `Nilai yang paling sering muncul disebut Modus.`;
            options = generateStringOptions(answer, ["Mean", "Median", "Rata-rata"], seed);
          } else if (templateId === 2) {
            answer = "1/2";
            text = `Jika sebuah koin logam standar (memiliki sisi Angka dan Gambar) dilempar sekali, berapakah peluang munculnya sisi Gambar?`;
            explanation = `Peluang = Sisi terpilih / Total sisi = 1 / 2.`;
            options = generateStringOptions(answer, ["1/3", "1/4", "1"], seed);
          } else {
            answer = "Median";
            text = `Nilai tengah dari sekumpulan data yang telah diurutkan dari terkecil ke terbesar disebut...`;
            explanation = `Nilai tengah dari data terurut disebut Median.`;
            options = generateStringOptions(answer, ["Mean", "Modus", "Rata-rata"], seed);
          }
        }
        break;
      }
      case 7: { // Kerajaan Logika CT (Berpikir Komputasional)
        subCompetence = "Logika Algoritme";
        if (grade === 1) {
          if (templateId === 0) {
            answer = "Maju -> Belok Kanan";
            text = `Sebuah robot mainan berada di kotak mulai. Robot harus maju 1 kotak lalu menghadap ke arah bunga ${item}. Tombol apakah yang harus ditekan berurutan?`;
            explanation = `Sesuai petunjuk arah, robot harus Maju lalu Belok Kanan untuk menghadap ke bunga.`;
            options = generateStringOptions(answer, ["Maju -> Maju", "Belok Kiri -> Maju", "Maju -> Belok Kiri"], seed);
          } else if (templateId === 1) {
            answer = "Kelompok Merah";
            text = `Ada 3 apel merah dan 2 jeruk oranye di dalam kotak. Pahlawan ${name1} ingin mengelompokkan buah berdasarkan warnanya. Kelompok pertama adalah...`;
            explanation = `Pengelompokan (Dekomposisi) dilakukan berdasarkan ciri warna, salah satunya Kelompok Merah untuk apel.`;
            options = generateStringOptions(answer, ["Kelompok Bulat", "Kelompok Manis", "Kelompok Besar"], seed);
          } else if (templateId === 2) {
            answer = "Sakelar Dinyalakan";
            text = `Sebuah lampu hias di Kerajaan Logika hanya menyala jika sakelar ditekan ke bawah. Apa tindakan yang membuat lampu menyala?`;
            explanation = `Menyalakan sakelar (input) memberikan kondisi menyala (output) pada lampu.`;
            options = generateStringOptions(answer, ["Sakelar Dimatikan", "Kabel Dicabut", "Lampu Dipecahkan"], seed);
          } else {
            answer = "Pakai Kaus Kaki lalu Sepatu";
            text = `Urutan langkah (algoritme) yang benar sebelum kita berangkat sekolah menggunakan sepatu adalah...`;
            explanation = `Langkah logisnya adalah menggunakan kaus kaki terlebih dahulu baru kemudian memakai sepatu.`;
            options = generateStringOptions(answer, ["Pakai Sepatu lalu Kaus Kaki", "Langsung pakai Sepatu saja", "Pakai Kaus Kaki saja"], seed);
          }
        } else if (grade === 2) {
          if (templateId === 0) {
            answer = "Maju -> Maju -> Belok Kiri";
            text = `Robot penjelajah ingin mengambil koin emas berjarak 2 kotak di depannya, lalu berbelok ke arah kiri. Tuliskan kode perintah yang benar!`;
            explanation = `Robot melangkah maju 2 kali (Maju -> Maju) kemudian berbelok kiri.`;
            options = generateStringOptions(answer, ["Maju -> Belok Kiri -> Maju", "Belok Kiri -> Maju -> Maju", "Maju -> Maju -> Maju"], seed);
          } else if (templateId === 1) {
            answer = "Besar dan Kecil";
            text = `Di perpustakaan, terdapat buku tebal berukuran besar dan buku tipis berukuran kecil. Kriteria dekomposisi paling mudah untuk memilah buku adalah berdasarkan ukuran...`;
            explanation = `Memilah buku tebal-besar dan tipis-kecil paling efisien menggunakan klasifikasi ukuran Besar dan Kecil.`;
            options = generateStringOptions(answer, ["Berat dan Panjang", "Warna Sampul", "Penerbit Buku"], seed);
          } else if (templateId === 2) {
            answer = "Terbuka";
            text = `Gerbang kastil hanya akan terbuka jika tombol Hijau DAN tombol Biru ditekan bersamaan. Jika kedua tombol tersebut ditekan, kondisi gerbang adalah...`;
            explanation = `Karena kedua kondisi terpenuhi (Hijau DAN Biru), gerbang akan Terbuka.`;
            options = generateStringOptions(answer, ["Tertutup", "Setengah Terbuka", "Terkunci rapat"], seed);
          } else {
            answer = "Kuning -> Hijau -> Biru";
            text = `Pola bendera kerajaan adalah: Kuning, Hijau, Biru, Kuning, Hijau, Biru... Tiga warna bendera berurutan berikutnya setelah warna Biru adalah...`;
            explanation = `Pola berulang Kuning-Hijau-Biru akan kembali lagi ke Kuning -> Hijau -> Biru.`;
            options = generateStringOptions(answer, ["Hijau -> Kuning -> Biru", "Biru -> Kuning -> Hijau", "Kuning -> Biru -> Hijau"], seed);
          }
        } else if (grade === 3) {
          if (templateId === 0) {
            answer = "CAFE";
            text = `Sandi Rahasia Istana: A=1, B=2, C=3, D=4, E=5, F=6. Kata tersembunyi dari kode angka "3 - 1 - 6 - 5" adalah...`;
            explanation = `3=C, 1=A, 6=F, 5=E. Digabungkan menjadi CAFE.`;
            options = generateStringOptions(answer, ["FACE", "DECA", "BADE"], seed);
          } else if (templateId === 1) {
            answer = "Memakai Jas Hujan";
            text = `Algoritme Kondisional: JIKA hari hujan MAKA memakai jas hujan, JIKA TIDAK MAKA memakai jaket biasa. Jika cuaca di luar sedang hujan deras, pahlawan ${name1} akan...`;
            explanation = `Karena kondisi hari hujan terpenuhi, maka tindakan yang diambil adalah Memakai Jas Hujan.`;
            options = generateStringOptions(answer, ["Memakai Jaket biasa", "Tidak memakai apa-apa", "Tidur di kamar"], seed);
          } else if (templateId === 2) {
            answer = "6 langkah";
            text = `Sebuah instruksi komputer berbunyi: "Ulangi melangkah maju 2 langkah sebanyak 3 kali". Berapa total langkah maju yang dilakukan robot?`;
            explanation = `Maju 2 langkah dikalikan 3 kali pengulangan = 6 langkah.`;
            options = generateStringOptions(answer, ["5 langkah", "8 langkah", "9 langkah"], seed);
          } else {
            answer = "Jalur Utara (6 km)";
            text = `Untuk pergi dari kota A ke kota C, ada dua pilihan jalur: Jalur Utara melewati kota B sejauh 6 km, sedangkan Jalur Selatan langsung sejauh 8 km. Jalur manakah yang paling efisien (terpendek)?`;
            explanation = `Jalur terpendek dan paling efisien adalah Jalur Utara karena hanya 6 km dibandingkan Jalur Selatan yang 8 km.`;
            options = generateStringOptions(answer, ["Jalur Selatan (8 km)", "Kedua jalur sama saja", "Tidak ada jalur yang aman"], seed);
          }
        } else if (grade === 4) {
          if (templateId === 0) {
            answer = "NIKO";
            text = `Sandi Geser (Caesar Cipher +1): Setiap huruf digeser 1 langkah ke depan (A menjadi B, B menjadi C, dst). Kata asli dari sandi terenkripsi "OJLP" adalah...`;
            explanation = `Geser mundur 1 huruf: O->N, J->I, L->K, P->O. Menjadi NIKO.`;
            options = generateStringOptions(answer, ["NINA", "MILA", "KOKO"], seed);
          } else if (templateId === 1) {
            answer = "Mendapat Hadiah Utama";
            text = `Logika Bersarang: JIKA nilai matematika > 80 DAN mengumpulkan tugas tepat waktu MAKA mendapat hadiah utama. Jika ${name1} mendapat nilai 90 dan selalu tepat waktu mengumpulkan tugas, maka ${name1}...`;
            explanation = `Kedua syarat terpenuhi (90 > 80 dan tepat waktu), sehingga ia Mendapat Hadiah Utama.`;
            options = generateStringOptions(answer, ["Mendapat Hukuman", "Mengulang Ujian", "Tidak mendapat apa-apa"], seed);
          } else if (templateId === 2) {
            answer = "Ani";
            text = `Struktur data Antrean (Queue): Orang yang mengantre pertama kali akan dilayani pertama kali. Jika antrean loket berturut-turut adalah Ani, Budi, dan Cici, siapakah yang dilayani pertama kali?`;
            explanation = `Dalam antrean (FIFO), orang pertama masuk (Ani) adalah yang pertama dilayani.`;
            options = generateStringOptions(answer, ["Budi", "Cici", "Semua bersamaan"], seed);
          } else {
            answer = "Memotong sayur";
            text = `Dekomposisi tugas memasak sup: (1) Memotong sayur, (2) Merebus air, (3) Memasukkan bumbu, (4) Menyajikan sup. Langkah awal yang merupakan dekomposisi persiapan bahan adalah...`;
            explanation = `Mempersiapkan bahan makanan seperti memotong sayur adalah langkah awal pemisahan tugas dekomposisi.`;
            options = generateStringOptions(answer, ["Merebus air", "Menyajikan sup", "Mematikan kompor"], seed);
          }
        } else if (grade === 5) {
          if (templateId === 0) {
            answer = "4 tebakan";
            text = `Pencarian biner (Binary Search) digunakan untuk mencari angka antara 1 sampai 16. Berapa jumlah maksimal tebakan yang dibutuhkan dalam kondisi terburuk?`;
            explanation = `Pencarian biner membagi dua rentang pencarian setiap langkah. 16 -> 8 -> 4 -> 2 -> 1, sehingga membutuhkan maksimal log2(16) = 4 tebakan.`;
            options = generateStringOptions(answer, ["8 tebakan", "16 tebakan", "5 tebakan"], seed);
          } else if (templateId === 1) {
            answer = "Mamalia";
            text = `Pohon Keputusan (Decision Tree) Klasifikasi Hewan: JIKA menyusui MAKA Mamalia, JIKA TIDAK MAKA JIKA bertelur MAKA Unggas. Lumba-lumba adalah hewan menyusui, maka lumba-lumba diklasifikasikan sebagai...`;
            explanation = `Lumba-lumba menyusui anaknya, sehingga langsung diklasifikasikan ke cabang Mamalia.`;
            options = generateStringOptions(answer, ["Unggas", "Reptil", "Amfibi"], seed);
          } else if (templateId === 2) {
            const loops = randWithSeed(3, 5, seed + 5);
            answer = String(loops * 4);
            text = `Sebuah program komputer memiliki variabel nilai awal Y = 0. Program mengulangi (loop) sebanyak ${loops} kali perintah: "Y = Y + 4". Berapakah nilai akhir Y?`;
            explanation = `Y = 0 + (${loops} x 4) = ${loops * 4}.`;
            options = generateNumericOptions(loops * 4, seed);
          } else {
            answer = "Sistem mati";
            text = `Kombinasi Gerbang Logika: Alarm berbunyi jika (Sensor Gerak mendeteksi gerakan AND Sakelar Utama ON). Jika Sensor mendeteksi gerakan tetapi Sakelar Utama OFF, kondisi alarm adalah...`;
            explanation = `Karena sakelar OFF, gerbang AND tidak terpenuhi (True AND False = False), alarm tidak berbunyi.`;
            options = generateStringOptions(answer, ["Alarm berbunyi", "Lampu menyala", "Sistem eror"], seed);
          }
        } else {
          if (templateId === 0) {
            answer = "1, 3, 5, 7";
            text = `Algoritme Pengurutan (Sorting): Kita ingin mengurutkan kumpulan kartu angka acak [5, 1, 7, 3] dari terkecil ke terbesar. Urutan hasil akhir yang benar adalah...`;
            explanation = `Mengurutkan secara ascending (naik) dari terkecil ke terbesar menghasilkan barisan 1, 3, 5, 7.`;
            options = generateStringOptions(answer, ["7, 5, 3, 1", "1, 5, 3, 7", "3, 1, 5, 7"], seed);
          } else if (templateId === 1) {
            answer = "Menolak Akses";
            text = `Diagram Alir (Flowchart) Validasi Login: JIKA kata sandi benar MAKA Masuk ke Beranda, JIKA TIDAK MAKA Menolak Akses. Seorang pengguna memasukkan kata sandi yang salah, apa tindakan sistem?`;
            explanation = `Sesuai alur logika kondisional, kegagalan kata sandi memicu aksi "Menolak Akses".`;
            options = generateStringOptions(answer, ["Masuk ke Beranda", "Menghapus Akun", "Mengunduh file"], seed);
          } else if (templateId === 2) {
            answer = "15";
            text = `Sebuah fungsi matematika rekursif sederhana f(n) didefinisikan sebagai: f(1) = 1, f(n) = f(n-1) + n untuk n > 1. Berapakah nilai dari f(5)?`;
            explanation = `f(1)=1, f(2)=1+2=3, f(3)=3+3=6, f(4)=6+4=10, f(5)=10+5=15.`;
            options = generateStringOptions(answer, ["10", "12", "20"], seed);
          } else {
            answer = "Topologi Bintang";
            text = `Dalam jaringan komputer, jika semua komputer klien terhubung langsung ke satu komputer pusat (server/switch) secara terpisah, arsitektur jaringan ini disebut...`;
            explanation = `Klien terhubung secara terpusat ke switch tunggal membentuk pola bintang, dinamakan Topologi Bintang.`;
            options = generateStringOptions(answer, ["Topologi Bus", "Topologi Cincin", "Topologi Jala"], seed);
          }
        }
        break;
      }
      default: { // Candi Tantangan HOTS (Penalaran Tingkat Tinggi)
        subCompetence = "Tantangan HOTS";
        if (grade === 1) {
          if (templateId === 0) {
            answer = name1;
            text = `Teka-teki Tinggi Badan: ${name1} lebih tinggi dari ${name2}. Sedangkan ${name2} lebih tinggi dari Cici. Siapakah anak yang paling tinggi di antara mereka bertiga?`;
            explanation = `Urutan tinggi badan: ${name1} > ${name2} > Cici. Maka yang paling tinggi adalah ${name1}.`;
            options = generateStringOptions(answer, [name2, "Cici", "Semua sama tinggi"], seed);
          } else if (templateId === 1) {
            answer = "2 buah stroberi";
            text = `Pada timbangan seimbang, berat 1 buah apel sama dengan berat 2 buah stroberi. Jika kita meletakkan 1 buah apel di piring timbangan kiri, berapa buah stroberi yang harus diletakkan di piring kanan agar timbangan seimbang?`;
            explanation = `Sesuai kesetaraan timbangan, dibutuhkan 2 buah stroberi untuk mengimbangi 1 buah apel.`;
            options = generateStringOptions(answer, ["1 buah stroberi", "3 buah stroberi", "4 buah stroberi"], seed);
          } else if (templateId === 2) {
            const a = randWithSeed(5, 8, seed + 5);
            answer = String(a - 2 + 3);
            text = `Pahlawan ${name1} mengantongi ${a} kelereng emas. Ia memberikan 2 kelereng kepada temannya, lalu menemukan 3 kelereng lagi di jalan. Berapa kelereng emas milik ${name1} sekarang?`;
            explanation = `Perhitungannya: ${a} - 2 + 3 = ${a - 2 + 3}.`;
            options = generateNumericOptions(a - 2 + 3, seed);
          } else {
            answer = "Kelinci";
            text = `Teka-teki Hewan Misterius: Hewan ini berkaki empat, memiliki telinga panjang yang tegak, sangat suka melompat, dan makanan kesukaannya adalah wortel. Hewan apakah ini?`;
            explanation = `Karakteristik telinga panjang, suka melompat, dan menyukai wortel menunjuk langsung pada kelinci.`;
            options = generateStringOptions(answer, ["Kucing", "Kambing", "Kura-kura"], seed);
          }
        } else if (grade === 2) {
          if (templateId === 0) {
            answer = "Eka";
            text = `Teka-teki Posisi Duduk: Doni duduk di sebelah kanan Eka. Eka duduk di sebelah kanan Feri. Siapakah yang duduk di posisi paling tengah di antara mereka bertiga?`;
            explanation = `Urutan duduk dari kiri ke kanan: Feri -> Eka -> Doni. Posisi tengah ditempati oleh Eka.`;
            options = generateStringOptions(answer, ["Doni", "Feri", "Sari"], seed);
          } else if (templateId === 1) {
            answer = "4 penghapus";
            text = `Pada timbangan mainan: Berat 1 buku tulis sama dengan 2 pensil. Sedangkan berat 1 pensil sama dengan 2 penghapus karet. Berapakah jumlah penghapus karet yang beratnya setara dengan 1 buku tulis?`;
            explanation = `1 buku = 2 pensil. 2 pensil = 2 x 2 penghapus = 4 penghapus.`;
            options = generateStringOptions(answer, ["2 penghapus", "3 penghapus", "6 penghapus"], seed);
          } else if (templateId === 2) {
            const bags = randWithSeed(3, 4, seed + 5);
            answer = String(bags * 5 - 2);
            text = `Ibu memiliki ${bags} bungkus kue kering yang masing-masing berisi 5 kue. Setelah dimakan bersama-sama sebanyak 2 buah kue, berapa sisa total kue kering sekarang?`;
            explanation = `Total awal = ${bags} x 5 = ${bags * 5}. Dikurangi yang dimakan: ${bags * 5} - 2 = ${bags * 5 - 2} kue.`;
            options = generateNumericOptions(bags * 5 - 2, seed);
          } else {
            answer = "Biru";
            text = `Teka-teki Blok Warna: Kotak merah ditumpuk di atas kotak kuning. Kotak kuning diletakkan di atas kotak biru. Kotak warna apakah yang berada di tumpukan paling bawah?`;
            explanation = `Urutan tumpukan dari atas ke bawah: Merah -> Kuning -> Biru. Jadi yang paling bawah adalah Biru.`;
            options = generateStringOptions(answer, ["Merah", "Kuning", "Hijau"], seed);
          }
        } else if (grade === 3) {
          if (templateId === 0) {
            answer = "12 hari sekali";
            text = `Pahlawan ${name1} berlatih panahan setiap 4 hari sekali, sedangkan pahlawan ${name2} berlatih setiap 6 hari sekali. Jika hari ini mereka berlatih bersama, berapa hari lagi mereka akan berlatih bersama kembali?`;
            explanation = `Cari Kelipatan Persekutuan Terkecil (KPK) dari 4 dan 6, yaitu 12 hari sekali.`;
            options = generateStringOptions(answer, ["8 hari sekali", "10 hari sekali", "24 hari sekali"], seed);
          } else if (templateId === 1) {
            answer = "4 paket";
            text = `Koki kerajaan memiliki 12 kue cokelat dan 16 biskuit susu. Ia ingin membagikannya ke dalam kotak bingkisan secara merata tanpa sisa. Berapa jumlah kotak bingkisan paling banyak yang bisa dibuat?`;
            explanation = `Cari Faktor Persekutuan Terbesar (FPB) dari 12 dan 16, yaitu 4.`;
            options = generateStringOptions(answer, ["2 paket", "6 paket", "8 paket"], seed);
          } else if (templateId === 2) {
            answer = "Rp 4.000";
            text = `Rasio uang saku milik ${name1} dan ${name2} adalah 2:3. Jika selisih uang saku mereka adalah Rp 2.000, berapakah jumlah uang saku milik ${name1}?`;
            explanation = `Selisih rasio = 3 - 2 = 1 bagian = Rp 2.000. Maka uang saku ${name1} yang 2 bagian adalah 2 x Rp 2.000 = Rp 4.000.`;
            options = generateStringOptions(answer, ["Rp 6.000", "Rp 8.000", "Rp 10.000"], seed);
          } else {
            answer = "3 anak";
            text = `Dari 10 anak di kelas, 6 anak menyukai pelajaran berhitung, 5 anak menyukai seni lukis, dan 4 anak menyukai keduanya. Berapa banyak anak yang tidak menyukai keduanya?`;
            explanation = `Suka salah satu/keduanya = (6 - 4) + (5 - 4) + 4 = 2 + 1 + 4 = 7 anak. Maka tidak suka keduanya = 10 - 7 = 3 anak.`;
            options = generateStringOptions(answer, ["1 anak", "2 anak", "5 anak"], seed);
          }
        } else if (grade === 4) {
          if (templateId === 0) {
            answer = "2.4 jam";
            text = `Mesin pompa air A dapat mengisi penuh sebuah kolam dalam 4 jam. Sedangkan mesin pompa air B membutuhkan waktu 6 jam. Jika kedua pompa dijalankan bersama-sama, berapa jam kolam akan penuh?`;
            explanation = `Waktu gabungan = (t1 x t2) / (t1 + t2) = (4 x 6) / (4 + 6) = 24 / 10 = 2.4 jam.`;
            options = generateStringOptions(answer, ["5 jam", "3 jam", "10 jam"], seed);
          } else if (templateId === 1) {
            answer = "120 km";
            text = `Sebuah mobil melaju dari Kota P ke Kota Q dengan kecepatan rata-rata 60 km/jam selama 2 jam penuh. Berapakah jarak sebenarnya antara Kota P dan Kota Q?`;
            explanation = `Jarak = Kecepatan x Waktu = 60 km/jam x 2 jam = 120 km.`;
            options = generateStringOptions(answer, ["100 km", "150 km", "30 km"], seed);
          } else if (templateId === 2) {
            answer = "6 pilihan";
            text = `Budi memiliki 3 helai baju kaos berbeda warna dan 2 helai celana pendek berbeda corak. Ada berapa banyak variasi setelan baju dan celana berbeda yang dapat dipakai oleh Budi?`;
            explanation = `Jumlah setelan kombinasi = jumlah baju x jumlah celana = 3 x 2 = 6 pilihan setelan.`;
            options = generateStringOptions(answer, ["5 pilihan", "9 pilihan", "12 pilihan"], seed);
          } else {
            answer = "1/4 cokelat";
            text = `Sari memotong sebatang cokelat menjadi dua bagian sama besar. Setengah bagian cokelat tersebut ia berikan kepada adiknya. Setengah bagian sisanya ia potong lagi menjadi dua bagian sama besar untuk dirinya sendiri. Berapa nilai pecahan cokelat yang didapat Sari untuk dirinya sendiri?`;
            explanation = `Sari memotong sisa setengah menjadi dua, berarti (1/2) x (1/2) = 1/4 bagian cokelat.`;
            options = generateStringOptions(answer, ["1/2 cokelat", "1/3 cokelat", "1/8 cokelat"], seed);
          }
        } else if (grade === 5) {
          if (templateId === 0) {
            answer = "5 menit";
            text = `Jika 5 ekor kelinci dapat menghabiskan 5 buah wortel segar dalam waktu tepat 5 menit, berapa menit waktu yang dibutuhkan oleh 10 ekor kelinci untuk menghabiskan 10 buah wortel secara serentak?`;
            explanation = `Karena setiap kelinci memakan wortelnya sendiri secara serentak, waktu yang dibutuhkan tetap sama yaitu 5 menit.`;
            options = generateStringOptions(answer, ["10 menit", "50 menit", "1 menit"], seed);
          } else if (templateId === 1) {
            const n = randWithSeed(5, 8, seed + 5);
            answer = String((n * (n - 1)) / 2);
            text = `Di Candi Tantangan berkumpul ${n} orang pahlawan. Jika mereka semua saling berjabat tangan satu sama lain masing-masing tepat sekali, berapakah jumlah jabat tangan yang terjadi?`;
            explanation = `Menggunakan rumus kombinasi jabat tangan n(n-1)/2: ${n} x ${n-1} / 2 = ${answer}.`;
            options = generateNumericOptions((n * (n - 1)) / 2, seed);
          } else if (templateId === 2) {
            answer = "48 km/jam";
            text = `Sebuah kereta melaju dari stasiun A ke B dengan kecepatan 60 km/jam, lalu kembali dari B ke A dengan rute yang sama berkecepatan 40 km/jam. Berapakah kecepatan rata-rata pulang-pergi?`;
            explanation = `Kecepatan rata-rata = 2 x v1 x v2 / (v1 + v2) = 2 x 60 x 40 / (60 + 40) = 4800 / 100 = 48 km/jam.`;
            options = generateStringOptions(answer, ["50 km/jam", "45 km/jam", "52 km/jam"], seed);
          } else {
            answer = "12 tahun";
            text = `Umur seorang pahlawan adalah 3 kali umur adiknya. Jika jumlah umur mereka berdua saat ini adalah 16 tahun, berapakah umur sang pahlawan saat ini?`;
            explanation = `Perbandingan umur = 3 : 1. Total bagian = 4. Umur pahlawan = (3/4) x 16 = 12 tahun.`;
            options = generateStringOptions(answer, ["4 tahun", "8 tahun", "15 tahun"], seed);
          }
        } else {
          if (templateId === 0) {
            answer = "135";
            text = `Teka-teki Angka Misterius: Sebuah bilangan terdiri dari 3 digit yaitu ABC. Jika A + B + C = 9, digit A adalah 1, dan digit C adalah 5, tentukan bilangan 3 digit tersebut!`;
            explanation = `A=1, C=5. A+B+C = 1+B+5 = 9, maka B = 3. Bilangan tersebut adalah 135.`;
            options = generateStringOptions(answer, ["125", "145", "153"], seed);
          } else if (templateId === 1) {
            answer = "1/5";
            text = `Di dalam kantong tertutup terdapat 3 bola merah, 5 bola hijau, dan 2 bola kuning. Berapakah peluang teoretis pahlawan ${name1} mengambil 1 bola kuning secara acak?`;
            explanation = `Peluang = bola kuning / total bola = 2 / (3 + 5 + 2) = 2 / 10 = 1/5.`;
            options = generateStringOptions(answer, ["1/2", "3/10", "1/10"], seed);
          } else if (templateId === 2) {
            answer = "Rp 80.000";
            text = `Sebuah jubah perang seharga Rp 100.000 didiskon sebesar 20% di toko senjata. Berapakah harga jubah perang tersebut setelah dipotong diskon?`;
            explanation = `Diskon = 20% x 100.000 = Rp 20.000. Harga setelah diskon = 100.000 - 20.000 = Rp 80.000.`;
            options = generateStringOptions(answer, ["Rp 20.000", "Rp 90.000", "Rp 75.000"], seed);
          } else {
            answer = "Topi Hijau";
            text = `Teka-teki Logika Tiga Pahlawan: Niko, Mila, dan Oki masing-masing memakai topi berbeda warna (Merah, Hijau, Biru). Niko berkata, "Saya tidak memakai topi merah maupun biru". Topi warna apakah yang dipakai Niko?`;
            explanation = `Karena Niko tidak memakai topi merah maupun biru, maka satu-satunya pilihan warna tersisa untuknya adalah Hijau.`;
            options = generateStringOptions(answer, ["Topi Merah", "Topi Biru", "Topi Kuning"], seed);
          }
        }
        break;
      }
    }

    pool.push({
      id: `${grade}-${worldId}-${levelId}-q${idx}`,
      grade,
      worldId,
      levelId,
      text,
      type,
      options: options.length > 0 ? options : undefined,
      answer,
      explanation,
      hint: hint || "Baca soal dengan teliti pahlawan!",
      points,
      isHots,
      isComputationalThinking,
      fase,
      competency,
      subCompetence,
      difficulty
    });
  }

  return pool;
}
