/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerProfile, Question } from '../types';

/**
 * Interface untuk melacak state aktif selama sesi gameplay berlangsung.
 * Dikelola oleh mesin game (Game Engine) untuk menghitung bonus, combo, skor, dan koin secara dinamis.
 */
export interface GameplaySessionState {
  score: number;             // Skor kumulatif level saat ini
  combo: number;             // Jumlah jawaban benar beruntun (combo streak)
  maxCombo: number;          // Combo tertinggi yang dicapai dalam level ini
  lives: number;             // Sisa nyawa pahlawan di level ini (maksimal 5)
  earnedCoins: number;       // Total koin terkumpul di level ini
  earnedXp: number;          // Total XP terkumpul di level ini
  correctAnswersCount: number;// Jumlah soal yang berhasil dijawab dengan benar
  wrongAnswersCount: number; // Jumlah soal yang dijawab salah
  hotsSolvedCount: number;   // Jumlah soal HOTS yang dijawab benar
  startTime: number;         // Waktu mulai level (epoch timestamp)
  questionStartTime: number; // Waktu mulai untuk soal yang sedang aktif
  timeSpentSeconds: number;  // Total waktu yang dihabiskan dalam detik
}

/**
 * Hasil kalkulasi evaluasi jawaban oleh Game Engine.
 */
export interface AnswerEvaluationResult {
  isCorrect: boolean;
  basePoints: number;
  difficultyBonus: number;
  comboMultiplier: number;
  timeMultiplier: number;
  pointsEarned: number;
  coinsEarned: number;
  newCombo: number;
  newLives: number;
}

/**
 * Hasil akhir evaluasi kelulusan level (Misi Berhasil).
 */
export interface LevelCompletionSummary {
  stars: number;             // Penilaian bintang (1, 2, atau 3)
  finalScore: number;        // Skor akhir level termasuk bonus
  finalCoins: number;        // Koin akhir termasuk bonus perfect run
  finalXp: number;           // XP akhir termasuk bonus penyelesaian
  isPerfectRun: boolean;     // True jika berhasil menyelesaikan tanpa kehilangan nyawa (5 nyawa utuh)
  newUnlockedBadges: string[]; // Daftar lencana baru yang berhasil didapatkan
}

/**
 * ============================================================================
 *   GAME ENGINE ALGORITHMS (ALGORITMA MESIN GAME NUMERAVERSE)
 * ============================================================================
 * 
 * 1. ALGORITMA SKOR (SCORE ALGORITHM)
 *    Skor akhir sebuah soal didasarkan pada akurasi, kesulitan soal, combo beruntun,
 *    dan kecepatan menjawab (Timer).
 *    Rumus: Skor = (Poin Dasar + Bonus Kesulitan) * Pengali Combo * Pengali Kecepatan
 *    - Poin Dasar: Nilai dasar soal (dari bank soal, default 10).
 *    - Bonus Kesulitan: +5 jika tipe soal adalah HOTS, +5 jika tipe Computational Thinking (CT).
 *    - Pengali Combo (Combo Multiplier):
 *         - Combo 0-1: x1.0
 *         - Combo 2-3: x1.2
 *         - Combo 4-5: x1.5
 *         - Combo 6+:  x2.0
 *    - Pengali Kecepatan (Speed Multiplier):
 *         - Menjawab <= 5 detik: x1.5 (Kilat!)
 *         - Menjawab <= 12 detik: x1.2 (Cepat!)
 *         - Menjawab > 12 detik: x1.0 (Standar)
 * 
 * 2. ALGORITMA KOIN (COIN GENERATION ALGORITHM)
 *    Pemain mendapatkan koin dari setiap jawaban benar untuk berbelanja nyawa/item:
 *    Rumus: Koin Didapat = BulatAtas(Poin_Diperoleh / 2) + Bonus_Koin_Combo
 *    - Bonus Koin Combo:
 *         - Combo 2-3: +1 Koin
 *         - Combo 4-5: +2 Koin
 *         - Combo 6+:  +5 Koin
 *    - Bonus Perfect Run: Jika level diselesaikan dengan sisa 5 nyawa penuh, dapat bonus +10 koin tambahan.
 * 
 * 3. ALGORITMA BINTANG (STAR RATING ALGORITHM)
 *    Bintang (1-3) diberikan berdasarkan sisa nyawa saat misi selesai, melatih regulasi emosi & ketelitian:
 *    - 3 Bintang (Sempurna / Flawless): Sisa 5 nyawa penuh (tidak pernah salah).
 *    - 2 Bintang (Hebat / Excellent): Sisa 3 sampai 4 nyawa.
 *    - 1 Bintang (Bagus / Good): Sisa 1 sampai 2 nyawa.
 * 
 * 4. ALGORITMA NYAWA & REGENERASI (LIFE REGENERATION ALGORITHM)
 *    Nyawa adalah pembatas energi bermain (maksimal 5):
 *    - Jawaban salah mengurangi nyawa level sebesar 1. Sisa nyawa level 0 mengakibatkan misi GAGAL.
 *    - Sisa nyawa pahlawan di lobby akan berkurang jika pemain gagal menyelesaikan level (mencapai 0 lives).
 *    - Regenerasi Nyawa Otomatis: 1 Nyawa beregenerasi setiap 15 menit (900 detik).
 *      Waktu regenerasi dilacak menggunakan timestamp `lastLifeRegenTime` secara presisi.
 *      Rumus: Nyawa_Sekarang = Min(5, Nyawa_Lama + Lantai((Waktu_Sekarang - Waktu_Regen_Terakhir) / 900))
 * 
 * 5. ALGORITMA PROGRES & LEVEL-UP PEMAIN (XP & CHARACTER LEVEL ALGORITHM)
 *    Setiap level selesai menyumbangkan XP ke profil pahlawan:
 *    - Kebutuhan XP untuk naik tingkat (Level Up): XP_Dibutuhkan = Level_Saat_Ini * 100
 *    - Jika XP melebihi kebutuhan, level pahlawan bertambah 1, sisa XP dipindahkan ke level berikutnya.
 *    - Progres dunia (World Map) diatur dinamis: menyelesaikan misi ke-5 dalam suatu dunia membuka dunia berikutnya.
 * 
 * 6. ALGORITMA EVALUASI LENCANA (BADGE EVALUATION ALGORITHM)
 *    Mengevaluasi secara otomatis seluruh riwayat profil pahlawan untuk membuka lencana penghargaan.
 */

export const NumeraverseEngine = {
  
  /**
   * Menginisialisasi session gameplay baru dengan kondisi awal yang prima.
   */
  createInitialSession: (playerLives: number): GameplaySessionState => {
    return {
      score: 0,
      combo: 0,
      maxCombo: 0,
      lives: playerLives > 0 ? playerLives : 5, // Fallback ke 5 jika nyawa pahlawan habis
      earnedCoins: 0,
      earnedXp: 0,
      correctAnswersCount: 0,
      wrongAnswersCount: 0,
      hotsSolvedCount: 0,
      startTime: Date.now(),
      questionStartTime: Date.now(),
      timeSpentSeconds: 0
    };
  },

  /**
   * Mengevaluasi jawaban masukan siswa dan menghitung poin, koin, combo, serta nyawa secara real-time.
   * 
   * @param question Soal aktif yang dijawab
   * @param userAnswer Jawaban dari pengguna (bisa berupa teks/string, indeks, atau array pilihan terurut)
   * @param currentState State gameplay saat ini
   * @returns Hasil evaluasi detail yang berisi perolehan skor, koin, dsb.
   */
  evaluateAnswer: (
    question: Question,
    userAnswer: string | string[],
    currentState: GameplaySessionState
  ): AnswerEvaluationResult => {
    
    // 1. Memeriksa Kebenaran Jawaban (Akurasi)
    let isCorrect = false;
    
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      isCorrect = userAnswer === question.answer;
    } else if (question.type === 'text-input') {
      const cleanUser = typeof userAnswer === 'string' ? userAnswer.trim().toLowerCase() : '';
      const cleanActual = typeof question.answer === 'string' ? question.answer.trim().toLowerCase() : '';
      isCorrect = cleanUser === cleanActual;
    } else if (question.type === 'sorting') {
      if (Array.isArray(userAnswer) && Array.isArray(question.answer)) {
        isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.answer);
      }
    }

    // Jika salah, kurangi nyawa, patahkan combo, koin/xp nihil
    if (!isCorrect) {
      const newLives = Math.max(0, currentState.lives - 1);
      return {
        isCorrect: false,
        basePoints: 0,
        difficultyBonus: 0,
        comboMultiplier: 1.0,
        timeMultiplier: 1.0,
        pointsEarned: 0,
        coinsEarned: 0,
        newCombo: 0,
        newLives
      };
    }

    // --- KALKULASI JAWABAN BENAR ---

    // 2. Tentukan Poin Dasar & Bonus Kesulitan (HOTS / Computational Thinking)
    const basePoints = question.points || 10;
    let difficultyBonus = 0;
    if (question.isHots) difficultyBonus += 5;
    if (question.isComputationalThinking) difficultyBonus += 5;

    // 3. Tentukan Pengali Combo berdasarkan combo streak saat ini
    let comboMultiplier = 1.0;
    let comboCoinBonus = 0;
    if (currentState.combo >= 1 && currentState.combo <= 2) {
      comboMultiplier = 1.2;
      comboCoinBonus = 1;
    } else if (currentState.combo >= 3 && currentState.combo <= 4) {
      comboMultiplier = 1.5;
      comboCoinBonus = 2;
    } else if (currentState.combo >= 5) {
      comboMultiplier = 2.0;
      comboCoinBonus = 5;
    }

    // 4. Tentukan Pengali Kecepatan (Timer)
    const timeSpentMs = Date.now() - currentState.questionStartTime;
    const timeSpentSeconds = timeSpentMs / 1000;
    
    let timeMultiplier = 1.0;
    if (timeSpentSeconds <= 5) {
      timeMultiplier = 1.5; // Kilat bonus!
    } else if (timeSpentSeconds <= 12) {
      timeMultiplier = 1.2; // Cepat bonus!
    }

    // 5. Hitung Skor & Koin Akhir Soal Ini
    const pointsEarned = Math.round((basePoints + difficultyBonus) * comboMultiplier * timeMultiplier);
    const coinsEarned = Math.round(pointsEarned / 2) + comboCoinBonus;

    return {
      isCorrect: true,
      basePoints,
      difficultyBonus,
      comboMultiplier,
      timeMultiplier,
      pointsEarned,
      coinsEarned,
      newCombo: currentState.combo + 1,
      newLives: currentState.lives
    };
  },

  /**
   * Menghitung regenerasi nyawa otomatis secara berkala (15 menit per nyawa).
   * Menghindari frustrasi pada anak dengan memberikan energi baru saat mereka beristirahat.
   * 
   * @param profile Profil pemain yang berisi nyawa saat ini dan timestamp regenerasi terakhir
   * @returns Profil yang telah disinkronkan nyawanya beserta timestamp baru
   */
  regenerateLives: (profile: PlayerProfile): { lives: number; lastLifeRegenTime: number; regeneratedCount: number } => {
    const MAX_LIVES = 5;
    const REGEN_INTERVAL_MS = 15 * 60 * 1000; // 15 menit dalam milidetik

    if (profile.lives >= MAX_LIVES) {
      return {
        lives: MAX_LIVES,
        lastLifeRegenTime: Date.now(),
        regeneratedCount: 0
      };
    }

    const currentTime = Date.now();
    const timeElapsed = currentTime - profile.lastLifeRegenTime;
    
    if (timeElapsed >= REGEN_INTERVAL_MS) {
      const livesEarned = Math.floor(timeElapsed / REGEN_INTERVAL_MS);
      const newLives = Math.min(MAX_LIVES, profile.lives + livesEarned);
      const remainingTime = timeElapsed % REGEN_INTERVAL_MS;
      const newRegenTime = currentTime - remainingTime;

      return {
        lives: newLives,
        lastLifeRegenTime: newRegenTime,
        regeneratedCount: Math.min(MAX_LIVES - profile.lives, livesEarned)
      };
    }

    return {
      lives: profile.lives,
      lastLifeRegenTime: profile.lastLifeRegenTime,
      regeneratedCount: 0
    };
  },

  /**
   * Mengevaluasi kelulusan level, menghitung perolehan bintang, bonus perfect run,
   * kenaikan level pemain (XP mechanics), dan evaluasi lencana baru.
   * 
   * @param sessionState State akhir sesi gameplay level
   * @param profile Profil pahlawan saat ini
   * @param worldId ID dunia tempat petualangan berlangsung
   * @param levelId ID level yang diselesaikan
   * @returns Ringkasan perolehan bintang, bonus, kenaikan tingkat pahlawan, dan lencana baru
   */
  completeLevel: (
    sessionState: GameplaySessionState,
    profile: PlayerProfile,
    worldId: number,
    levelId: number
  ): LevelCompletionSummary => {
    // 1. Hitung Bintang berdasarkan sisa nyawa level
    let stars = 1;
    if (sessionState.lives >= 5) {
      stars = 3; // Flawless!
    } else if (sessionState.lives >= 3) {
      stars = 2; // Hebat!
    }

    const isPerfectRun = sessionState.lives >= 5;

    // 2. Tambahkan bonus Perfect Run ke Koin
    let finalCoins = sessionState.earnedCoins;
    if (isPerfectRun) {
      finalCoins += 10; // Bonus +10 koin untuk performa tanpa cela
    }

    // 3. Evaluasi Lencana (Badges) Baru
    const currentBadges = profile.badges || [];
    const newUnlockedBadges: string[] = [];

    // Lencana 1: Langkah Pertama (first_steps)
    if (!currentBadges.includes('first_steps')) {
      newUnlockedBadges.push('first_steps');
    }

    // Lencana 2: Kilat Matematika (speed_demon) - Jika menjawab dengan kecepatan kilat
    if (sessionState.correctAnswersCount > 0 && !currentBadges.includes('speed_demon')) {
      newUnlockedBadges.push('speed_demon');
    }

    // Lencana 3: Raja Combo (combo_king) - Jika berhasil menyusun minimal 4 combo
    if (sessionState.maxCombo >= 4 && !currentBadges.includes('combo_king')) {
      newUnlockedBadges.push('combo_king');
    }

    // Lencana 4: Ksatria Tanpa Cela (flawless_victory) - Jika mendapat bintang 3
    if (isPerfectRun && !currentBadges.includes('flawless_victory')) {
      newUnlockedBadges.push('flawless_victory');
    }

    // Lencana 5: Pengumpul Koin (coin_collector)
    if (profile.coins + finalCoins >= 100 && !currentBadges.includes('coin_collector')) {
      newUnlockedBadges.push('coin_collector');
    }

    // Lencana 6: Ahli HOTS (hots_master) - Jika berhasil memecahkan minimal 3 soal HOTS dalam satu sesi
    if (sessionState.hotsSolvedCount >= 3 && !currentBadges.includes('hots_master')) {
      newUnlockedBadges.push('hots_master');
    }

    // Lencana khusus penyelesaian dunia (World Clear)
    const currentCompleted = profile.completedLevels[worldId] || [];
    const isWorldFullyCleared = currentCompleted.length + (currentCompleted.includes(levelId) ? 0 : 1) >= 5;
    const worldClearBadgeId = `world_${worldId}_clear`;
    
    if (isWorldFullyCleared && !currentBadges.includes(worldClearBadgeId)) {
      newUnlockedBadges.push(worldClearBadgeId);
    }

    return {
      stars,
      finalScore: sessionState.score,
      finalCoins,
      finalXp: sessionState.earnedXp,
      isPerfectRun,
      newUnlockedBadges
    };
  }
};
