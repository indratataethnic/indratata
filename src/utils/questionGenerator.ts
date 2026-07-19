/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

// Lists of names, items, and objects to make questions feel natural
const NAMES = ["Budi", "Ani", "Cici", "Doni", "Elang", "Feri", "Gita", "Hana", "Iwan", "Joko", "Koko", "Lina", "Mila", "Niko", "Oki", "Putri", "Rian", "Sari", "Tono", "Wati"];
const ITEMS = ["apel", "jeruk", "permen", "kelereng", "buku", "pensil", "koin", "balon", "kue", "roti", "mainan", "stiker", "penghapus", "topi"];
const OBJECTS = ["tas", "meja", "kotak", "keranjang", "gelas", "piring", "laci", "lemari", "wadah", "peta"];

// Deterministic random generator seeded for variety and stability
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickWithSeed<T>(arr: T[], seed: number): T {
  const rand = seededRandom(seed);
  return arr[Math.floor(rand * arr.length)];
}

function randWithSeed(min: number, max: number, seed: number): number {
  const rand = seededRandom(seed);
  return Math.floor(rand * (max - min + 1)) + min;
}

export function generateLevelQuestionPool(grade: number, worldId: number, levelId: number): Question[] {
  const pool: Question[] = [];
  const fase = grade <= 2 ? 'A' : grade <= 4 ? 'B' : 'C';

  const competencies: { [key: number]: string } = {
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
    // Unique seed for each question index
    const seed = grade * 15000 + worldId * 1800 + levelId * 350 + idx * 7.5;
    
    let difficulty: 'mudah' | 'sedang' | 'sulit' = 'sedang';
    if (idx < 35) {
      difficulty = 'mudah';
    } else if (idx >= 70) {
      difficulty = 'sulit';
    }

    const name1 = pickWithSeed(NAMES, seed + 1);
    const name2 = pickWithSeed(NAMES, seed + 2);
    const item = pickWithSeed(ITEMS, seed + 3);
    const obj = pickWithSeed(OBJECTS, seed + 4);

    let text = "";
    let type: Question['type'] = "multiple-choice";
    let options: string[] = [];
    let answer: string | string[] = "";
    let explanation = "";
    let hint = "";
    let points = difficulty === 'mudah' ? 10 : difficulty === 'sedang' ? 15 : 20;
    let isHots = false;
    let isComputationalThinking = false;
    let subCompetence = "";

    if (difficulty === 'sulit') {
      isHots = worldId !== 7;
      isComputationalThinking = worldId === 7;
    }

    switch (worldId) {
      case 1: { // Hutan Angka
        subCompetence = difficulty === 'mudah' ? "Penjumlahan Dasar" : difficulty === 'sedang' ? "Pengurangan Bersusun" : "Analisis Aljabar Sederhana";
        if (grade <= 2) {
          const a = randWithSeed(3, 10, seed + 5);
          const b = randWithSeed(2, 9, seed + 6);
          if (idx % 2 === 0) {
            const ans = a + b;
            text = `Ada ${a} buah ${item} di pohon Hutan Angka. ${name1} memetik semuanya, lalu ${name2} memberikan ${b} buah ${item} tambahan. Berapa jumlah seluruh ${item} yang dimiliki ${name1} sekarang?`;
            answer = String(ans);
            options = [String(ans), String(ans - 1), String(ans + 2), String(ans + 4)];
            explanation = `Jumlah keseluruhan dihitung menggunakan penjumlahan: ${a} + ${b} = ${ans} buah ${item}.`;
            hint = "Tambahkan kedua bilangan tersebut untuk mendapat totalnya.";
          } else {
            const sumVal = a + b;
            const ans = sumVal - a;
            text = `${name1} mengumpulkan ${sumVal} ${item} di rawa. Dia memberikan ${a} ${item} kepada ${name2} agar adil. Berapakah sisa ${item} yang dipegang ${name1} sekarang?`;
            answer = String(ans);
            options = [String(ans), String(ans + 1), String(ans - 1), String(ans + 3)];
            explanation = `Sisa benda dihitung dengan operasi pengurangan: ${sumVal} - ${a} = ${ans} ${item}.`;
            hint = `Kurangkan jumlah awal (${sumVal}) dengan jumlah yang diberikan (${a}).`;
          }
        } else if (grade <= 4) {
          const a = randWithSeed(10, 20, seed + 5);
          const b = randWithSeed(3, 6, seed + 6);
          if (idx % 2 === 0) {
            const ans = a * b;
            text = `Terdapat ${b} buah ${obj} di gerbang hutan. Masing-masing ${obj} berisi ${a} butir ${item}. Berapakah jumlah seluruh ${item} yang disimpan di sana?`;
            answer = String(ans);
            options = [String(ans), String(ans + 10), String(ans - 5), String(ans + 4)];
            explanation = `Gunakan perkalian: ${b} wadah x ${a} ${item} = ${ans} ${item}.`;
            hint = "Ingat bahwa perkalian adalah penjumlahan berulang berkelompok.";
          } else {
            const mul = a * b;
            text = `Pahlawan ${name1} membagikan ${mul} buah ${item} secara merata kepada ${b} penjaga gerbang. Berapa banyak ${item} yang diterima masing-masing penjaga?`;
            answer = String(a);
            options = [String(a), String(a - 2), String(a + 3), String(a + 1)];
            explanation = `Gunakan operasi pembagian: ${mul} dibagi ${b} sama dengan ${a}.`;
            hint = `Cari angka yang jika dikalikan ${b} akan menghasilkan ${mul}.`;
          }
        } else { // Grade 5-6
          const temp = randWithSeed(-8, -2, seed + 5);
          const rise = randWithSeed(5, 12, seed + 6);
          const ans = temp + rise;
          if (idx % 2 === 0) {
            text = `Suhu udara pagi hari di dalam gua es Hutan Angka adalah ${temp}°C. Pada siang hari, suhunya naik sebesar ${rise}°C. Berapakah suhu udara di gua es tersebut saat siang hari?`;
            answer = String(ans) + "°C";
            options = [String(ans) + "°C", String(temp - rise) + "°C", String(rise - temp) + "°C", "0°C"];
            explanation = `Suhu naik berarti operasi penjumlahan bilangan bulat: ${temp} + ${rise} = ${ans}°C.`;
            hint = `Melangkah ke kanan di garis bilangan mulai dari angka ${temp} sebanyak ${rise} kali.`;
          } else {
            const largeA = randWithSeed(200, 450, seed + 5);
            const largeB = randWithSeed(120, 280, seed + 6);
            const ansSum = largeA + largeB;
            text = `Sebuah koloni semut membawa ${largeA} keping koin emas, lalu ${name1} menambahkan ${largeB} keping koin emas lagi. Berapa total koin emas mereka?`;
            answer = String(ansSum);
            type = "text-input";
            explanation = `Hitung dengan menjumlahkan kedua nilai besar: ${largeA} + ${largeB} = ${ansSum}.`;
            hint = "Gunakan metode penjumlahan bersusun ke bawah.";
          }
        }
        break;
      }
      case 2: { // Lembah Pola Ajaib
        subCompetence = difficulty === 'mudah' ? "Pola Visual Bergambar" : difficulty === 'sedang' ? "Pola Bilangan Naik" : "Mencari Rumus Suku ke-n";
        if (grade <= 2) {
          const shapes = ["Kotak", "Bulat", "Segitiga", "Bintang"];
          const s1 = shapes[(idx) % shapes.length];
          const s2 = shapes[(idx + 1) % shapes.length];
          text = `Di Lembah Pola, ada barisan ubin bermotif: ${s1}, ${s2}, ${s1}, ${s2}, ${s1}, ... Apakah bentuk motif ubin berikutnya?`;
          answer = s2;
          options = [s2, s1, "Hati", "Sila"];
          explanation = `Pola ubin ini berulang berselingan antara ${s1} dan ${s2}. Suku setelah ${s1} selalu ubin bermotif ${s2}.`;
          hint = "Perhatikan pola berseling yang terjadi di awal barisan.";
        } else {
          const start = randWithSeed(4, 18, seed + 5);
          const diff = randWithSeed(2, 7, seed + 6);
          const t1 = start;
          const t2 = start + diff;
          const t3 = start + diff * 2;
          const t4 = start + diff * 3;
          const ans = start + diff * 4;
          text = `Lengkapi suku kelima dari barisan angka ajaib berikut: ${t1}, ${t2}, ${t3}, ${t4}, ... Berapakah angka selanjutnya?`;
          answer = String(ans);
          options = [String(ans), String(ans + 2), String(ans - diff), String(ans + diff + 1)];
          explanation = `Setiap angka pada barisan ini selalu bertambah ${diff}. Maka suku berikutnya adalah ${t4} + ${diff} = ${ans}.`;
          hint = `Hitung selisih antara angka kedua dan pertama, lalu tambahkan selisih itu ke angka terakhir.`;
        }
        break;
      }
      case 3: { // Pulau Pecahan
        subCompetence = difficulty === 'mudah' ? "Visualisasi Bagian" : difficulty === 'sedang' ? "Sederhanakan Pecahan" : "Penjumlahan Penyebut Berbeda";
        if (grade <= 2) {
          const p = randWithSeed(2, 4, seed + 5);
          text = `Ibu memotong satu loyang kue bolu pandan menjadi ${p} bagian sama besar. Berapa nilai pecahan dari setiap potong kue tersebut?`;
          answer = `1/${p}`;
          options = [`1/${p}`, `2/${p}`, "1/1", `1/${p + 1}`];
          explanation = `Satu bagian utuh dipotong menjadi ${p} bagian menghasilkan nilai pecahan 1/${p} per potong kue.`;
          hint = "Pembilang adalah bagian ubin (1), penyebut adalah jumlah potong keseluruhan.";
        } else if (grade <= 4) {
          const mult = randWithSeed(2, 4, seed + 5);
          const top = 2 * mult;
          const bot = 5 * mult;
          text = `Manakah pecahan sederhana di bawah ini yang setara nilainya dengan pecahan ${top}/${bot}?`;
          answer = "2/5";
          options = ["2/5", "1/2", "3/5", "1/5"];
          explanation = `Pecahan ${top}/${bot} jika disederhanakan dengan membagi pembilang dan penyebut dengan ${mult} adalah 2/5.`;
          hint = "Bagilah angka pembilang dan penyebut dengan faktor pembagi terbesar mereka.";
        } else {
          text = `Berapakah hasil dari penjumlahan pecahan berikut ini: 1/3 + 1/6?`;
          answer = "1/2";
          options = ["1/2", "2/9", "3/6", "2/3"];
          explanation = `Samakan penyebut menjadi 6: 1/3 = 2/6. Maka 2/6 + 1/6 = 3/6. Jika disederhanakan (dibagi 3), hasilnya adalah 1/2.`;
          hint = "Ubah pecahan 1/3 menjadi berpenyebut 6 terlebih dahulu.";
        }
        break;
      }
      case 4: { // Gurun Pengukuran
        subCompetence = difficulty === 'mudah' ? "Membaca Jam" : difficulty === 'sedang' ? "Konversi Satuan Massa" : "Kecepatan Rata-rata";
        if (grade <= 2) {
          const hr = randWithSeed(1, 12, seed + 5);
          text = `Jarum pendek pada jam pasir kuno menunjuk ke angka ${hr} sedangkan jarum panjang tepat menunjuk ke angka 12. Jam berapakah itu?`;
          answer = hr < 10 ? `0${hr}.00` : `${hr}.00`;
          options = [answer, `${hr}.30`, "12.00", `${hr}.15`].sort();
          explanation = `Jarum panjang di angka 12 menandakan menit tepat (:00), sedangkan jarum pendek menandakan jam ${hr}.`;
          hint = "Gunakan pembacaan jam bulat standar.";
        } else if (grade <= 4) {
          const kg = randWithSeed(3, 9, seed + 5);
          const ans = kg * 1000;
          text = `Ibu membeli kantong gandum gurun seberat ${kg} kg. Berapakah berat gandum tersebut jika dinyatakan dalam satuan gram?`;
          answer = String(ans);
          options = [String(ans), String(kg * 100), String(kg * 10), `${kg}00 gram`].sort();
          explanation = `Karena 1 kilogram (kg) sama dengan 1.000 gram, maka ${kg} kg = ${kg} x 1000 = ${ans} gram.`;
          hint = "Kalikan nilai kilogram dengan angka 1.000.";
        } else {
          const speed = randWithSeed(4, 8, seed + 5) * 10;
          const duration = 2;
          const ans = speed * duration;
          text = `Sebuah kereta bertenaga uap melaju melintasi Gurun Pengukuran dengan kecepatan ${speed} km/jam selama ${duration} jam. Berapa jarak (km) yang ditempuhnya?`;
          answer = String(ans);
          type = "text-input";
          explanation = `Jarak = Kecepatan x Waktu. Jarak = ${speed} km/jam x ${duration} jam = ${ans} km.`;
          hint = `Kalikan nilai kecepatan rata-rata (${speed}) dengan lama waktu perjalanan (${duration}).`;
        }
        break;
      }
      case 5: { // Kota Bangun Ruang
        subCompetence = difficulty === 'mudah' ? "Bentuk Bangun Datar" : difficulty === 'sedang' ? "Luas Persegi Panjang" : "Volume Balok";
        if (grade <= 2) {
          text = "Manakah dari benda berikut yang memiliki permukaan berwujud persegi panjang?";
          answer = "Papan Tulis Sekolah";
          options = ["Papan Tulis Sekolah", "Uang Koin Logam", "Roda Gerobak", "Dadu Mainan"];
          explanation = "Papan tulis sekolah memiliki dua pasang sisi sejajar yang berbeda panjangnya, membentuk persegi panjang.";
          hint = "Cari benda yang panjangnya lebih besar daripada lebarnya.";
        } else if (grade <= 4) {
          const p = randWithSeed(6, 12, seed + 5);
          const l = randWithSeed(4, 5, seed + 6);
          const ans = p * l;
          text = `Sebuah karpet hias di aula Kota Bangun Ruang berbentuk persegi panjang memiliki panjang ${p} meter dan lebar ${l} meter. Berapakah luasnya?`;
          answer = String(ans);
          options = [String(ans), String((p + l) * 2), String(p + l), String(ans + 6)];
          explanation = `Luas persegi panjang dihitung dengan rumus: Panjang x Lebar. Luas = ${p} x ${l} = ${ans} m².`;
          hint = "Kalikan panjang dengan lebarnya secara langsung.";
        } else {
          const p = randWithSeed(3, 5, seed + 5);
          const l = randWithSeed(2, 3, seed + 6);
          const t = randWithSeed(4, 6, seed + 7);
          const ans = p * l * t;
          text = `Sebuah tangki air perkotaan berbentuk balok memiliki ukuran panjang ${p} meter, lebar ${l} meter, dan tinggi ${t} meter. Berapa volume air di tangki itu jika penuh?`;
          answer = `${ans} m³`;
          options = [`${ans} m³`, `${p + l + t} m³`, `${p * l} m³`, `${ans + 12} m³`].sort();
          explanation = `Volume balok dihitung dengan rumus: Panjang x Lebar x Tinggi. Volume = ${p} x ${l} x ${t} = ${ans} m³.`;
          hint = "Kalikan ketiga ukuran dimensi bangun ruang balok tersebut (P x L x T).";
        }
        break;
      }
      case 6: { // Rawa Statistika
        subCompetence = difficulty === 'mudah' ? "Menghitung Elemen" : difficulty === 'sedang' ? "Menentukan Modus" : "Rata-rata Nilai (Mean)";
        if (grade <= 2) {
          const green = randWithSeed(4, 8, seed + 5);
          text = `Di rawa ada ${green} ekor bangau putih berdiri dan 2 ekor bangau abu-abu. Berapa ekor bangau putih yang ada di rawa tersebut?`;
          answer = String(green);
          options = [String(green), "2", String(green + 2), "0"];
          explanation = `Berdasarkan keterangan eksplisit pada teks soal, jumlah bangau putih adalah ${green} ekor.`;
          hint = "Jawaban tertulis langsung di dalam kalimat soal.";
        } else if (grade <= 4) {
          const mod = randWithSeed(21, 25, seed + 5);
          const o1 = mod + 1;
          const o2 = mod - 2;
          text = `Diberikan data umur anak penjelajah rawa: ${mod} tahun, ${o1} tahun, ${mod} tahun, ${o2} tahun, ${mod} tahun. Nilai modus dari data umur tersebut adalah...`;
          answer = `${mod} tahun`;
          options = [`${mod} year`, `${mod} tahun`, `${o1} tahun`, `${o2} tahun`].map(s => s === `${mod} year` ? `${mod} tahun` : s);
          // clean duplicates from options
          options = Array.from(new Set(options));
          if (options.length < 4) options.push("10 tahun", "30 tahun");
          options = options.slice(0, 4);
          explanation = `Modus adalah data yang frekuensi kemunculannya paling sering. Umur ${mod} tahun muncul sebanyak 3 kali (paling banyak).`;
          hint = "Cari angka umur yang paling sering ditulis di dalam daftar data tersebut.";
        } else {
          const v1 = randWithSeed(70, 75, seed + 5);
          const v2 = randWithSeed(80, 85, seed + 6);
          const v3 = randWithSeed(85, 90, seed + 7);
          const ans = Math.round((v1 + v2 + v3) / 3);
          text = `Tiga ekor ikan rawa melompat dengan ketinggian masing-masing: ${v1} cm, ${v2} cm, dan ${v3} cm. Berapa rata-rata (mean) ketinggian lompatan ikan tersebut?`;
          answer = String(ans);
          type = "text-input";
          explanation = `Rata-rata dihitung dengan rumus: (Total Data) / (Jumlah Banyak Data). Rata-rata = (${v1} + ${v2} + ${v3}) / 3 = ${ans} cm.`;
          hint = "Jumlahkan ketiga tinggi lompatan lalu bagilah hasil penjumlahannya dengan angka 3.";
        }
        break;
      }
      case 7: { // Kerajaan Logika CT
        subCompetence = difficulty === 'mudah' ? "Langkah Robot" : difficulty === 'sedang' ? "Sandi Alfabet" : "Penalaran Deduktif";
        if (grade <= 2) {
          text = "Perintah: U = Utara (Atas), T = Timur (Kanan). Untuk mengarahkan semut berjalan 2 kotak ke kanan lalu 1 kotak ke atas, instruksi yang benar adalah...";
          answer = "T -> T -> U";
          options = ["T -> T -> U", "T -> U -> T", "U -> T -> T", "T -> U"];
          explanation = "Semut harus melangkah ke Timur (Kanan) dua kali (T -> T), dilanjutkan melangkah ke Utara (Atas) satu kali (U).";
          hint = "Langkah kanan dinamakan T, langkah atas dinamakan U.";
        } else if (grade <= 4) {
          text = "Kode sandi: X=1, Y=2, Z=3. Kata rahasia manakah yang dibentuk oleh rangkaian kode angka '3 - 2 - 1 - 2'?";
          answer = "ZYXY";
          options = ["ZYXY", "ZXYY", "YZZX", "XYZX"];
          explanation = "Mencocokkan angka ke huruf sandi: 3=Z, 2=Y, 1=X, 2=Y. Digabung membentuk kata ZYXY.";
          hint = "Satu-persatu terjemahkan angka tersebut sesuai petunjuk kodenya.";
        } else {
          text = "Niko lebih tinggi dari Rumi. Kiko lebih tinggi dari Niko. Siapakah robot pahlawan yang memiliki tinggi badan paling rendah (pendek)?";
          answer = "Rumi";
          options = ["Rumi", "Niko", "Kiko", "Sama tinggi"];
          explanation = "Hubungan tinggi badan: Kiko > Niko > Rumi. Dengan demikian, pahlawan paling pendek adalah Rumi.";
          hint = "Rumi lebih pendek dari Niko, dan Niko lebih pendek dari Kiko.";
        }
        break;
      }
      case 8: { // Candi Tantangan HOTS
        subCompetence = "Logika Analitik";
        if (grade <= 2) {
          text = "Tono memiliki 6 kelereng. Rian memiliki 3 kelereng lebih banyak dari Tono. Berapa jumlah kelereng mereka berdua jika disatukan?";
          answer = "15";
          options = ["15", "9", "6", "12"];
          explanation = "Kelereng Tono = 6. Kelereng Rian = 6 + 3 = 9. Total gabungan kelereng mereka = 6 + 9 = 15.";
          hint = "Cari tahu dulu berapa kelereng milik Rian sebelum ditambahkan dengan kelereng Tono.";
        } else if (grade <= 4) {
          text = "Lampu mercusuar biru menyala setiap 4 detik sekali. Lampu merah menyala setiap 5 detik sekali. Pada detik keberapa keduanya menyala bersamaan?";
          answer = "20";
          options = ["20", "40", "10", "9"];
          explanation = "Mencari KPK dari 4 dan 5. Kelipatan 4: 4, 8, 12, 16, 20... Kelipatan 5: 5, 10, 15, 20... KPK terkecil adalah 20 detik.";
          hint = "Cari angka kelipatan persekutuan terkecil yang bisa habis dibagi 4 sekaligus 5.";
        } else {
          text = "Jika 3 ekor kucing dapat menangkap 3 ekor tikus dalam waktu 3 menit, berapakah waktu (menit) yang diperlukan oleh 6 ekor kucing untuk menangkap 6 tikus bersama-sama?";
          answer = "3";
          options = ["3", "6", "1", "18"];
          explanation = "Setiap 1 kucing menangkap 1 tikus secara simultan membutuhkan waktu 3 menit. Jadi, jika 6 kucing menangkap 6 tikus secara serentak, waktu yang dibutuhkan tetaplah 3 menit.";
          hint = "Masing-masing kucing menangkap tikusnya sendiri secara serentak pada waktu yang sama.";
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
      hint,
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
