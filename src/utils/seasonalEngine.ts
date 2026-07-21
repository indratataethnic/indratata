/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { World, Badge } from '../types';

export type SeasonId = 
  | 'default'
  | 'rainy'
  | 'dry'
  | 'independence'
  | 'teacher'
  | 'children'
  | 'earth'
  | 'education'
  | 'school_year'
  | 'mpls'
  | 'halloween'
  | 'christmas'
  | 'new_year'
  | 'ramadan'
  | 'eid';

export interface NPCCostume {
  name: string;
  emoji: string;
  desc: string;
}

export interface BossCostume {
  name: string;
  emoji: string;
  desc: string;
}

export interface SeasonalQuest {
  worldId: number;
  originalName: string;
  seasonalName: string;
  description: string;
}

export interface Season {
  id: SeasonId;
  name: string;
  logo: string;
  theme: string;
  bgGradient: string; // Background gradient overriding standard panels
  particleType: 'rain' | 'leaves' | 'stars' | 'confetti' | 'snow' | 'lanterns' | 'fireworks' | 'none';
  loadingMessage: string;
  npcCostume: NPCCostume;
  bossCostume: BossCostume;
  rewardName: string;
  rewardEmoji: string;
  badge: Badge;
  quests: SeasonalQuest[];
  themeColor: string; // Tailwind accent color
}

export const SEASONS: Season[] = [
  {
    id: 'default',
    name: 'Tema Tropis Asli',
    logo: '🌴',
    theme: 'Petualangan Klasik',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    particleType: 'none',
    loadingMessage: 'Menyiapkan tantangan matematika seru di Numeraverse...',
    npcCostume: {
      name: 'Nova-Bot',
      emoji: '🤖',
      desc: 'Robot asisten petualangan yang siap membantumu kapan saja.'
    },
    bossCostume: {
      name: 'Raja Minus',
      emoji: '🦹‍♂️',
      desc: 'Penguasa kegelapan yang ingin melenyapkan angka dari dunia.'
    },
    rewardName: 'Koin Emas Klasik',
    rewardEmoji: '🪙',
    badge: {
      id: 'default_hero',
      title: 'Pahlawan Numeraverse',
      description: 'Lencana kebanggaan pahlawan matematika.',
      icon: 'Crown',
      color: 'from-violet-500 to-indigo-500'
    },
    quests: [],
    themeColor: 'violet'
  },
  {
    id: 'rainy',
    name: 'Musim Hujan',
    logo: '🌧️',
    theme: 'Pelangi Di Tengah Badai',
    bgGradient: 'from-slate-900 via-sky-950 to-indigo-950',
    particleType: 'rain',
    loadingMessage: 'Mendengar gemercik air hujan... Menyiapkan jas hujan matematika!',
    npcCostume: {
      name: 'Nova Mantel Kuning',
      emoji: '🤖🧥',
      desc: 'Nova mengenakan jas hujan kuning cerah agar sistemnya tidak korsleting.'
    },
    bossCostume: {
      name: 'Raja Badai Petir',
      emoji: '⚡⛈️',
      desc: 'Raja Minus memegang payung besi hitam, menyerang dengan kekuatan petir numerik!'
    },
    rewardName: 'Payung Ajaib Pelangi',
    rewardEmoji: '☂️',
    badge: {
      id: 'rainy_clear',
      title: 'Rainforest Guard',
      description: 'Berhasil mengamankan Numeraverse di tengah badai hujan deras.',
      icon: 'CloudRain',
      color: 'from-sky-400 to-blue-600'
    },
    quests: [
      {
        worldId: 1,
        originalName: 'Hutan Angka',
        seasonalName: 'Sungai Meluap Hutan Angka',
        description: 'Sungai Hutan Angka meluap! Selesaikan penjumlahan desimal untuk membangun jembatan penyeberangan aman.'
      }
    ],
    themeColor: 'sky'
  },
  {
    id: 'dry',
    name: 'Musim Kemarau',
    logo: '☀️',
    theme: 'Pencarian Oase Gurun',
    bgGradient: 'from-slate-950 via-amber-950 to-orange-950',
    particleType: 'leaves',
    loadingMessage: 'Panas terik melanda... Menyiapkan bekal air bersih matematika!',
    npcCostume: {
      name: 'Nova Santuy Tropis',
      emoji: '🤖🕶️',
      desc: 'Nova memakai kacamata hitam anti-silau dan topi pantai jerami.'
    },
    bossCostume: {
      name: 'Sultan Debu Tandus',
      emoji: '🏜️👹',
      desc: 'Raja Minus mengenakan sorban gurun dan memegang kipas angin raksasa.'
    },
    rewardName: 'Air Suci Oase',
    rewardEmoji: '🧪',
    badge: {
      id: 'dry_clear',
      title: 'Desert Survivor',
      description: 'Menemukan oase matematika di tengah gurun gersang.',
      icon: 'Compass',
      color: 'from-amber-500 to-orange-600'
    },
    quests: [
      {
        worldId: 4,
        originalName: 'Gurun Pengukuran',
        seasonalName: 'Pencarian Mata Air Gurun',
        description: 'Tingkat air menyusut! Ukur volume sumur kuno dengan tepat untuk mengalirkan air ke oase.'
      }
    ],
    themeColor: 'amber'
  },
  {
    id: 'independence',
    name: 'Hari Kemerdekaan Indonesia',
    logo: '🇮🇩',
    theme: 'Semangat Merah Putih',
    bgGradient: 'from-slate-950 via-red-950 to-slate-950',
    particleType: 'confetti',
    loadingMessage: 'Merdeka! Menyiapkan bendera merah putih dan panggung perlombaan matematika...',
    npcCostume: {
      name: 'Nova Pejuang 45',
      emoji: '🤖🇮🇩',
      desc: 'Nova mengenakan ikat kepala merah putih dan memegang bendera mini.'
    },
    bossCostume: {
      name: 'Jenderal Kolonel Minus',
      emoji: '👺🚩',
      desc: 'Raja Minus mencoba menyabotase bendera pusaka dengan sandi angka rahasia!'
    },
    rewardName: 'Medali Merah Putih',
    rewardEmoji: '🥇',
    badge: {
      id: 'independence_clear',
      title: 'Explorer Kemerdekaan',
      description: 'Menyelesaikan festival numerasi Hari Kemerdekaan Republik Indonesia.',
      icon: 'Trophy',
      color: 'from-red-500 to-rose-600'
    },
    quests: [
      {
        worldId: 7,
        originalName: 'Kerajaan Logika CT',
        seasonalName: 'Balapan Sepeda Kemerdekaan',
        description: 'Pecahkan algoritme rute tercepat untuk memenangkan lomba balap sepeda merah putih!'
      }
    ],
    themeColor: 'rose'
  },
  {
    id: 'teacher',
    name: 'Hari Guru Nasional',
    logo: '👩‍🏫',
    theme: 'Pelita Ilmu Pendidikan',
    bgGradient: 'from-slate-900 via-indigo-950 to-violet-950',
    particleType: 'stars',
    loadingMessage: 'Terima kasih Guruku! Menyiapkan papan tulis emas dan buku catatan pahlawan...',
    npcCostume: {
      name: 'Nova Profesor Cerdas',
      emoji: '🤖🎓',
      desc: 'Nova mengenakan kacamata bulat tebal dan topi wisuda toga.'
    },
    bossCostume: {
      name: 'Rektor Minus Maha-Sakti',
      emoji: '🧙‍♂️📚',
      desc: 'Raja Minus menyamar menjadi penguji ujian nasional yang super ketat!'
    },
    rewardName: 'Bintang Pendidikan',
    rewardEmoji: '⭐',
    badge: {
      id: 'teacher_clear',
      title: 'Scholar Champion',
      description: 'Menghargai jasa guru dengan menorehkan prestasi nilai matematika tertinggi.',
      icon: 'Award',
      color: 'from-violet-500 to-purple-600'
    },
    quests: [
      {
        worldId: 7,
        originalName: 'Kerajaan Logika CT',
        seasonalName: 'Bantu Guru Kerajaan',
        description: 'Bantu Guru Kerajaan mengoreksi dan mengurutkan lembar jawaban murid dengan rumus logika.'
      }
    ],
    themeColor: 'violet'
  },
  {
    id: 'children',
    name: 'Hari Anak Nasional',
    logo: '🧸',
    theme: 'Taman Bermain Gembira',
    bgGradient: 'from-slate-900 via-pink-950 to-indigo-950',
    particleType: 'confetti',
    loadingMessage: 'Selamat Hari Anak! Menyiapkan komidi putar, perosotan, dan balon angka...',
    npcCostume: {
      name: 'Nova Badut Ceria',
      emoji: '🤖🎈',
      desc: 'Nova memegang seikat balon warna-warni dan memakai hidung merah bulat.'
    },
    bossCostume: {
      name: 'Monster Balon Raksasa',
      emoji: '👾🎈',
      desc: 'Raja Minus mengubah balon-balon mainan menjadi gelembung angka raksasa yang harus dipecahkan!'
    },
    rewardName: 'Permen Bintang Berwarna',
    rewardEmoji: '🍭',
    badge: {
      id: 'children_clear',
      title: 'Playground Hero',
      description: 'Membantu seluruh anak di taman bermain Numeraverse hidup rukun berdampingan.',
      icon: 'Smile',
      color: 'from-pink-400 to-indigo-500'
    },
    quests: [
      {
        worldId: 1,
        originalName: 'Hutan Angka',
        seasonalName: 'Permainan Taman Kanak-Kanak',
        description: 'Bantu teman-teman menghitung jumlah mainan di kotak harta karun agar semuanya bisa bermain adil.'
      }
    ],
    themeColor: 'pink'
  },
  {
    id: 'earth',
    name: 'Hari Bumi',
    logo: '🌿',
    theme: 'Penjaga Hijau Lestari',
    bgGradient: 'from-slate-950 via-emerald-950 to-teal-950',
    particleType: 'leaves',
    loadingMessage: 'Selamatkan bumi kita! Menanam benih-benih pohon numerasi hijau...',
    npcCostume: {
      name: 'Nova Pecinta Alam',
      emoji: '🤖🌱',
      desc: 'Nova membawa bibit pohon mahoni kecil dan sekop berkebun.'
    },
    bossCostume: {
      name: 'Monster Limbah Beracun',
      emoji: '🏭👾',
      desc: 'Raja Minus berubah menjadi gumpalan asap hitam pekat yang mengotori hutan matematika!'
    },
    rewardName: 'Bibit Pohon Mahoni',
    rewardEmoji: '🌱',
    badge: {
      id: 'earth_clear',
      title: 'Guardian Hari Bumi',
      description: 'Menanam pohon dan membersihkan sampah matematika untuk melestarikan lingkungan.',
      icon: 'Trees',
      color: 'from-emerald-400 to-teal-600'
    },
    quests: [
      {
        worldId: 6,
        originalName: 'Rawa Statistika',
        seasonalName: 'Selamatkan Satwa Rawa',
        description: 'Hitung rata-rata populasi hewan langka dan bersihkan sampah di sepanjang rawa matematika.'
      }
    ],
    themeColor: 'emerald'
  },
  {
    id: 'education',
    name: 'Hari Pendidikan Nasional',
    logo: '📖',
    theme: 'Tut Wuri Handayani',
    bgGradient: 'from-slate-900 via-cyan-950 to-slate-950',
    particleType: 'stars',
    loadingMessage: 'Ing Ngarsa Sung Tulada... Membuka lembaran kitab matematika kuno...',
    npcCostume: {
      name: 'Nova Pujangga Buku',
      emoji: '🤖📚',
      desc: 'Nova membawa tumpukan ensiklopedia dan memegang pulpen bulu angsa.'
    },
    bossCostume: {
      name: 'Mumi Aksara Kuno',
      emoji: '🧟‍♂️📜',
      desc: 'Raja Minus bangkit dari balik candi kuno untuk mengunci ilmu pengetahuan dengan gembok aljabar.'
    },
    rewardName: 'Pena Emas Ki Hadjar',
    rewardEmoji: '✒️',
    badge: {
      id: 'education_clear',
      title: 'Pioneer Edukasi',
      description: 'Berhasil mengumpulkan seluruh lembar sejarah pendidikan matematika nusantara.',
      icon: 'BookOpen',
      color: 'from-cyan-400 to-indigo-600'
    },
    quests: [
      {
        worldId: 8,
        originalName: 'Candi Tantangan HOTS',
        seasonalName: 'Gulungan Kitab Kuno',
        description: 'Pecahkan teka-teki sandi analitik tingkat tinggi untuk menyelamatkan manuskrip matematika kuno.'
      }
    ],
    themeColor: 'cyan'
  },
  {
    id: 'school_year',
    name: 'Awal Tahun Ajaran',
    logo: '🎒',
    theme: 'Semangat Kelas Baru',
    bgGradient: 'from-slate-950 via-indigo-950 to-emerald-950',
    particleType: 'stars',
    loadingMessage: 'Tahun ajaran baru dimulai! Menyiapkan tas sekolah dan seragam rapi...',
    npcCostume: {
      name: 'Nova Pelajar Rapi',
      emoji: '🤖🎒',
      desc: 'Nova memakai dasi sekolah merah-putih dan tas ransel biru di punggungnya.'
    },
    bossCostume: {
      name: 'Kepala Sekolah Galak',
      emoji: '👨‍💼📢',
      desc: 'Raja Minus berlagak menjadi kepala sekolah yang menuntut ujian super kilat tanpa persiapan!'
    },
    rewardName: 'Buku Tulis Sakti',
    rewardEmoji: '📓',
    badge: {
      id: 'school_year_clear',
      title: 'Back To School Star',
      description: 'Siap menghadapi tantangan di jenjang kelas yang lebih tinggi dengan semangat baru.',
      icon: 'Sparkles',
      color: 'from-blue-400 to-teal-500'
    },
    quests: [
      {
        worldId: 5,
        originalName: 'Kota Bangun Ruang',
        seasonalName: 'Belanja Peralatan Sekolah',
        description: 'Hitung total harga belanjaan alat tulis, buku, dan seragam di toko koperasi menggunakan operasi bilangan desimal.'
      }
    ],
    themeColor: 'indigo'
  },
  {
    id: 'mpls',
    name: 'MPLS (Masa Pengenalan)',
    logo: '🤝',
    theme: 'Kawan Baru, Semangat Baru',
    bgGradient: 'from-slate-900 via-purple-950 to-slate-900',
    particleType: 'confetti',
    loadingMessage: 'Selamat datang siswa baru! Menyiapkan papan nama karton dan yel-yel seru...',
    npcCostume: {
      name: 'Nova Mentor MPLS',
      emoji: '🤖🏷️',
      desc: 'Nova memakai papan nama kalung dari kardus bekas bertuliskan "NOVA KECE".'
    },
    bossCostume: {
      name: 'Kakak Kelas Iseng',
      emoji: '🦹‍♂️📣',
      desc: 'Raja Minus menyamar menjadi panitia disiplin yang suka menguji mental dengan teka-teki angka rumit!'
    },
    rewardName: 'Lencana Sahabat MPLS',
    rewardEmoji: '🏅',
    badge: {
      id: 'mpls_clear',
      title: 'MPLS Champion',
      description: 'Sukses melewati masa pengenalan lingkungan sekolah dengan gembira.',
      icon: 'User',
      color: 'from-purple-400 to-fuchsia-600'
    },
    quests: [
      {
        worldId: 1,
        originalName: 'Hutan Angka',
        seasonalName: 'Temukan Teman Baru',
        description: 'Bantu teman sebangku yang kebingungan mengelompokkan bilangan bulat genap dan ganjil.'
      }
    ],
    themeColor: 'purple'
  },
  {
    id: 'halloween',
    name: 'Halloween Spooky',
    logo: '🎃',
    theme: 'Labirin Matematika Hantu',
    bgGradient: 'from-slate-950 via-purple-950 to-orange-950',
    particleType: 'stars',
    loadingMessage: 'Trick or Math! Memunculkan hantu-hantu numerasi yang gemar berhitung...',
    npcCostume: {
      name: 'Nova Jack-O-Lantern',
      emoji: '🤖🎃',
      desc: 'Nova mengenakan topeng labu menyala oranye di kepalanya.'
    },
    bossCostume: {
      name: 'Drakula Minus Bersayap',
      emoji: '🧛‍♂️🦇',
      desc: 'Raja Minus mengenakan jubah kelelawar hitam-merah, menantangmu di kastil gundukan angka seram.'
    },
    rewardName: 'Permen Sihir Halloween',
    rewardEmoji: '🍬',
    badge: {
      id: 'halloween_clear',
      title: 'Ghost Buster Matematika',
      description: 'Menjinakkan seluruh hantu pengacau angka di malam Halloween.',
      icon: 'Sparkles',
      color: 'from-purple-500 to-orange-600'
    },
    quests: [
      {
        worldId: 8,
        originalName: 'Candi Tantangan HOTS',
        seasonalName: 'Labirin Hantu Angka',
        description: 'Pecahkan teka-teki persamaan tersembunyi agar gerbang kastil terbuka sebelum tengah malam!'
      }
    ],
    themeColor: 'orange'
  },
  {
    id: 'christmas',
    name: 'Natal & Musim Dingin',
    logo: '🎄',
    theme: 'Negeri Salju Matematika',
    bgGradient: 'from-slate-900 via-blue-950 to-slate-900',
    particleType: 'snow',
    loadingMessage: 'Jingle Bells! Menghias pohon cemara dengan hiasan bola-bola angka...',
    npcCostume: {
      name: 'Nova Santa Claus',
      emoji: '🤖🎅',
      desc: 'Nova memakai topi rajut merah-putih tebal dan membawa karung kado raksasa.'
    },
    bossCostume: {
      name: 'Manusia Salju Dingin',
      emoji: '⛄❄️',
      desc: 'Raja Minus berubah menjadi monster salju es raksasa yang membekukan angka-angka penting!'
    },
    rewardName: 'Kotak Kado Ajaib',
    rewardEmoji: '🎁',
    badge: {
      id: 'christmas_clear',
      title: 'Snowflake Hero',
      description: 'Menghangatkan hati warga Numeraverse dengan membagikan kebahagiaan matematika.',
      icon: 'Award',
      color: 'from-blue-400 to-red-500'
    },
    quests: [
      {
        worldId: 4,
        originalName: 'Gurun Pengukuran',
        seasonalName: 'Negeri Kado Salju',
        description: 'Ukur berat paket-paket kado Natal dengan timbangan es agar semuanya terbagi rata ke seluruh penjuru dunia.'
      }
    ],
    themeColor: 'blue'
  },
  {
    id: 'new_year',
    name: 'Tahun Baru',
    logo: '🎆',
    theme: 'Cahaya Kembang Api',
    bgGradient: 'from-slate-950 via-neutral-900 to-indigo-950',
    particleType: 'fireworks',
    loadingMessage: '3... 2... 1... Selamat Tahun Baru! Menyiapkan pertunjukan kembang api...',
    npcCostume: {
      name: 'Nova Pesta Terompet',
      emoji: '🤖🎺',
      desc: 'Nova memakai topi kerucut berkilau dan memegang terompet pesta tahun baru.'
    },
    bossCostume: {
      name: 'Raja Waktu Detik-Detik',
      emoji: '👹⏰',
      desc: 'Raja Minus memegang jam pasir emas raksasa yang berdetak mundur menguji kecepatan berhitungmu!'
    },
    rewardName: 'Kembang Api Pelangi',
    rewardEmoji: '🎇',
    badge: {
      id: 'new_year_clear',
      title: 'New Year Champion',
      description: 'Melangkah ke lembaran tahun baru dengan kecerdasan matematika yang makin gemilang.',
      icon: 'Trophy',
      color: 'from-amber-400 to-indigo-500'
    },
    quests: [
      {
        worldId: 5,
        originalName: 'Kota Bangun Ruang',
        seasonalName: 'Kembang Api Geometri',
        description: 'Hitung volume roket kembang api berbentuk tabung dan kerucut agar meluncur sempurna menghiasi langit kota.'
      }
    ],
    themeColor: 'indigo'
  },
  {
    id: 'ramadan',
    name: 'Bulan Ramadan',
    logo: '🌙',
    theme: 'Keberkahan Ramadan',
    bgGradient: 'from-slate-950 via-emerald-950 to-indigo-950',
    particleType: 'lanterns',
    loadingMessage: 'Marhaban ya Ramadan! Menyiapkan bedug sahur dan hidangan takjil manis...',
    npcCostume: {
      name: 'Nova Santri Alim',
      emoji: '🤖🕌',
      desc: 'Nova mengenakan baju koko putih bersih, sarung, dan kopiah hitam.'
    },
    bossCostume: {
      name: 'Sultan Pelit Takjil',
      emoji: '👳‍♂️👹',
      desc: 'Raja Minus mencoba menyembunyikan takjil kurma milik penduduk desa di dalam peti berpola rahasia.'
    },
    rewardName: 'Kurma Emas Berkah',
    rewardEmoji: '🌴',
    badge: {
      id: 'ramadan_clear',
      title: 'Ramadan Explorer',
      description: 'Menyelesaikan tantangan pembagian takjil secara adil di bulan suci Ramadan.',
      icon: 'Award',
      color: 'from-emerald-400 to-indigo-600'
    },
    quests: [
      {
        worldId: 3,
        originalName: 'Pulau Pecahan',
        seasonalName: 'Bagi Takjil Kurma',
        description: 'Bantu Kapten Pecahan membagi kurma dan kolak takjil dengan pecahan adil untuk seluruh santri di masjid.'
      }
    ],
    themeColor: 'emerald'
  },
  {
    id: 'eid',
    name: 'Hari Raya Idulfitri',
    logo: '🕌',
    theme: 'Kemenangan Fitrah',
    bgGradient: 'from-slate-950 via-green-950 to-amber-950',
    particleType: 'fireworks',
    loadingMessage: 'Minal Aidin Wal Faizin! Menyiapkan anyaman ketupat hangat dan opor ayam...',
    npcCostume: {
      name: 'Nova Lebaran Fitri',
      emoji: '🤖🤝',
      desc: 'Nova memakai sorban hijau dan bersiap saling memaafkan dengan para petualang.'
    },
    bossCostume: {
      name: 'Monster Kuali Opor',
      emoji: '🥘👿',
      desc: 'Raja Minus mencoba memonopoli seluruh persediaan ketupat lebaran dengan gembok pola anyaman!'
    },
    rewardName: 'Ketupat Keberkahan',
    rewardEmoji: '🫔',
    badge: {
      id: 'eid_clear',
      title: 'Fitrah Master',
      description: 'Merayakan hari kemenangan dengan kesucian hati dan kemahiran matematika.',
      icon: 'Crown',
      color: 'from-green-400 to-amber-500'
    },
    quests: [
      {
        worldId: 2,
        originalName: 'Lembah Pola Ajaib',
        seasonalName: 'Anyaman Pola Ketupat',
        description: 'Lengkapi pola anyaman ketupat janur kuning yang terputus untuk menghidangkan sajian lebaran.'
      }
    ],
    themeColor: 'green'
  }
];

/**
 * Mendapatkan konfigurasi season aktif berdasarkan ID
 */
export function getSeasonById(id: SeasonId): Season {
  return SEASONS.find(s => s.id === id) || SEASONS[0];
}

/**
 * Menyimpan ID season aktif ke localStorage
 */
export function saveActiveSeasonId(id: SeasonId) {
  localStorage.setItem('numeraverse_active_season', id);
  // Dispatch custom event agar komponen React tahu perubahan musim secara global
  window.dispatchEvent(new Event('numeraverse_season_changed'));
}

/**
 * Mendapatkan ID season aktif dari localStorage (Default: 'default')
 */
export function getActiveSeasonId(): SeasonId {
  const stored = localStorage.getItem('numeraverse_active_season');
  if (stored) {
    return stored as SeasonId;
  }
  return 'default';
}

/**
 * Mengganti / meng-override properti world asli berdasarkan season aktif
 */
export function getSeasonalWorld(world: World, seasonId: SeasonId): World {
  const season = getSeasonById(seasonId);
  const matchedQuest = season.quests.find(q => q.worldId === world.id);

  if (matchedQuest) {
    return {
      ...world,
      name: matchedQuest.seasonalName,
      description: matchedQuest.description,
      storyIntroduction: matchedQuest.description,
      // override colors or theme to match seasonal colors
      themeColor: season.themeColor,
      bgGradient: season.id === 'default' ? world.bgGradient : season.bgGradient
    };
  }
  return world;
}

/**
 * Custom hook untuk mengambil ID season aktif, objek konfigurasinya,
 * serta fungsi untuk mengubah season secara reaktif di seluruh aplikasi.
 */
export function useActiveSeason() {
  const [seasonId, setSeasonId] = useState<SeasonId>(getActiveSeasonId());

  useEffect(() => {
    const handler = () => {
      setSeasonId(getActiveSeasonId());
    };
    window.addEventListener('numeraverse_season_changed', handler);
    return () => {
      window.removeEventListener('numeraverse_season_changed', handler);
    };
  }, []);

  const season = getSeasonById(seasonId);

  const selectSeason = (id: SeasonId) => {
    saveActiveSeasonId(id);
  };

  return {
    seasonId,
    season,
    selectSeason,
    seasons: SEASONS
  };
}
