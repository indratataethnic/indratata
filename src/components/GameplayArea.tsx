/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Question, PlayerProfile } from '../types';
import { WORLDS, generateDynamicQuestion } from '../questions';
import { generateLevelQuestionPool } from '../utils/questionGenerator';
import { 
  Heart, Coins, Sparkles, HelpCircle, ArrowRight, CheckCircle, 
  XCircle, Trophy, Home, Compass, RotateCcw, Award, Clock, Flame, ShieldAlert
} from 'lucide-react';
import { sound } from '../utils/audio';
import { NumeraverseEngine, GameplaySessionState, LevelCompletionSummary } from '../utils/gameEngine';

interface GameplayAreaProps {
  profile: PlayerProfile;
  worldId: number;
  levelId: number;
  onLevelComplete: (
    earnedXp: number, 
    earnedCoins: number, 
    starsEarned: number, 
    scoreEarned: number,
    unlockedBadges: string[],
    newAnsweredIds?: string[]
  ) => void;
  onLevelFail: () => void;
  onBackToMap: () => void;
}

export const GameplayArea: React.FC<GameplayAreaProps> = ({
  profile,
  worldId,
  levelId,
  onLevelComplete,
  onLevelFail,
  onBackToMap
}) => {
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];

  // Pool of 100 questions for this world/level/grade
  const levelPoolRef = useRef<Question[]>([]);

  // Load appropriate questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  
  // Sorting state
  const [availableItems, setAvailableItems] = useState<string[]>([]);
  const [sortedItems, setSortedItems] = useState<string[]>([]);

  // Feedback states
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  // Game Engine Session State
  const [session, setSession] = useState<GameplaySessionState>(() => 
    NumeraverseEngine.createInitialSession(5) // Start level with 5 hearts
  );

  // --- ADAPTIVE SYSTEM STATES ---
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<'mudah' | 'sedang' | 'sulit'>('sedang');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [adaptiveAlert, setAdaptiveAlert] = useState<{ type: 'level_up' | 'level_down' | null; message: string } | null>(null);
  const [forceHint, setForceHint] = useState(false);

  // Timer Countdown state
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<LevelCompletionSummary | null>(null);

  /**
   * Mengambil soal berikutnya secara adaptif sesuai tingkat kemampuan siswa.
   */
  const getAdaptiveQuestion = (
    difficulty: 'mudah' | 'sedang' | 'sulit',
    excludeIds: string[]
  ): Question => {
    // Pastikan pool 100 soal terisi
    if (levelPoolRef.current.length === 0) {
      levelPoolRef.current = generateLevelQuestionPool(profile.grade, worldId, levelId);
    }

    const poolOf100 = levelPoolRef.current;

    // Filter berdasarkan tingkat kesulitan adaptif
    let filtered = poolOf100.filter(q => q.difficulty === difficulty);
    if (filtered.length === 0) {
      filtered = poolOf100; // fallback jika kesulitan kosong
    }

    // Saring agar tidak berulang dalam sesi yang sama (excludeIds)
    filtered = filtered.filter(q => !excludeIds.includes(q.id));

    // Prioritaskan soal yang belum pernah dikerjakan pemain berdasarkan profile.answeredQuestionIds
    const unanswered = filtered.filter(q => !profile.answeredQuestionIds?.includes(q.id));

    let finalSelectionPool = unanswered;
    if (unanswered.length === 0) {
      // Jika seluruh soal telah selesai, acak kembali dengan urutan berbeda (gunakan kembali soal lama)
      finalSelectionPool = filtered;
    }

    if (finalSelectionPool.length === 0) {
      // Jika kehabisan soal yang belum dimainkan di sesi aktif, ambil soal apa saja di luar yang sedang aktif
      finalSelectionPool = poolOf100.filter(q => !excludeIds.includes(q.id));
    }

    if (finalSelectionPool.length === 0) {
      finalSelectionPool = poolOf100;
    }

    const randomIndex = Math.floor(Math.random() * finalSelectionPool.length);
    return finalSelectionPool[randomIndex];
  };

  // Load questions for world and level
  useEffect(() => {
    // Reset status adaptif di awal sesi
    setAdaptiveDifficulty('sedang');
    setCorrectStreak(0);
    setWrongCount(0);
    setAdaptiveAlert(null);
    setForceHint(false);

    // Bangun 100 soal deterministik khusus untuk tingkat kelas, dunia, dan level ini
    levelPoolRef.current = generateLevelQuestionPool(profile.grade, worldId, levelId);

    // Ambil soal pertama (Difficulty: Sedang / Sesuai tingkat kelas)
    const firstQ = getAdaptiveQuestion('sedang', []);
    setQuestions([firstQ]);
    setCurrentIndex(0);
    resetQuestionState(firstQ);
    
    // Inisialisasi Game Session Baru dengan 5 nyawa
    setSession(NumeraverseEngine.createInitialSession(5));
  }, [worldId, levelId, profile.grade]);

  // Handle active countdown timer ticking
  useEffect(() => {
    if (isCompleted || isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(30);
    setSession(prev => ({
      ...prev,
      questionStartTime: Date.now()
    }));

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer Habis! Pemicu Timeout Otomatis
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        
        // Mainkan efek suara detik terakhir jika hampir habis
        if (prev <= 6) {
          sound.playClick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, isCompleted]);

  // Reset answer states for new question
  const resetQuestionState = (question: Question | undefined) => {
    if (!question) return;
    setSelectedOption(null);
    setTextAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setIsTimeout(false);
    setTimeLeft(30);

    if (question.type === 'sorting' && question.options) {
      // Shuffle options for sorting
      setAvailableItems([...question.options].sort(() => Math.random() - 0.5));
      setSortedItems([]);
    }
  };

  const currentQuestion = questions[currentIndex];

  // Helper avatar Emojis & Titles
  const getAvatarEmoji = () => {
    switch (profile.avatar) {
      case 'niko': return '👨‍🚀';
      case 'rumi': return '🤖';
      case 'sora': return '👩‍🌾';
      case 'kiko': return '🐼';
      default: return '👶';
    }
  };

  const getAvatarName = () => {
    switch (profile.avatar) {
      case 'niko': return 'Astro-Niko';
      case 'rumi': return 'Rumi-Bot';
      case 'sora': return 'Sora-Kelana';
      case 'kiko': return 'Kiko-Panda';
      default: return 'Teman Pintarmu';
    }
  };

  // Sorting interactions
  const handleItemClick = (item: string) => {
    if (isAnswered) return;
    sound.playClick();
    setAvailableItems(prev => prev.filter(i => i !== item));
    setSortedItems(prev => [...prev, item]);
  };

  const handleSortedItemClick = (item: string) => {
    if (isAnswered) return;
    sound.playClick();
    setSortedItems(prev => prev.filter(i => i !== item));
    setAvailableItems(prev => [...prev, item]);
  };

  const handleResetSorting = () => {
    if (isAnswered) return;
    sound.playClick();
    if (currentQuestion && currentQuestion.options) {
      setAvailableItems([...currentQuestion.options].sort(() => Math.random() - 0.5));
      setSortedItems([]);
    }
  };

  // Keypad click for numerical inputs
  const handleKeypadPress = (val: string) => {
    if (isAnswered) return;
    sound.playClick();
    if (val === 'DEL') {
      setTextAnswer(prev => prev.slice(0, -1));
    } else {
      setTextAnswer(prev => prev + val);
    }
  };

  // Menangani ketika waktu habis (Timeout)
  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playWrong();
    setIsTimeout(true);
    setIsCorrect(false);
    setIsAnswered(true);

    const newLives = Math.max(0, session.lives - 1);

    // Jalur Adaptif: Reset streak benar & tambah hitungan kesalahan
    setCorrectStreak(0);
    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);

    if (nextWrong === 3) {
      setAdaptiveDifficulty('mudah');
      setWrongCount(0); // Reset hitungan
      setForceHint(true); // Auto-buka petunjuk di soal berikutnya
      setAdaptiveAlert({
        type: 'level_down',
        message: '💡 REINFORCEMENT AKTIF: Jangan menyerah! Kamu salah/kehabisan waktu 3 kali. Sistem memberikan Soal Penguatan yang lebih mudah disertai Petunjuk otomatis.'
      });
    }

    setSession(prev => ({
      ...prev,
      lives: newLives,
      combo: 0,
      wrongAnswersCount: prev.wrongAnswersCount + 1
    }));

    if (newLives <= 0) {
      setTimeout(() => {
        onLevelFail();
      }, 1800);
    }
  };

  // Memeriksa Jawaban Menggunakan Game Engine
  const handleCheckAnswer = () => {
    if (!currentQuestion || isAnswered) return;

    let userAnswer: string | string[] = '';

    if (currentQuestion.type === 'multiple-choice') {
      if (!selectedOption) return;
      userAnswer = selectedOption;
    } else if (currentQuestion.type === 'text-input') {
      if (!textAnswer.trim()) return;
      userAnswer = textAnswer;
    } else if (currentQuestion.type === 'sorting') {
      if (sortedItems.length !== currentQuestion.answer.length) return;
      userAnswer = sortedItems;
    } else if (currentQuestion.type === 'true-false') {
      if (!selectedOption) return;
      userAnswer = selectedOption;
    }

    // Panggil mesin game untuk melakukan evaluasi performa matematis pahlawan
    const result = NumeraverseEngine.evaluateAnswer(currentQuestion, userAnswer, session);

    setIsCorrect(result.isCorrect);
    setIsAnswered(true);

    if (result.isCorrect) {
      sound.playCorrect();
      
      // Jalur Adaptif: Naikkan streak dan periksa naik level kesulitan
      const nextStreak = correctStreak + 1;
      setCorrectStreak(nextStreak);

      if (nextStreak === 5) {
        setAdaptiveDifficulty('sulit');
        setCorrectStreak(0); // Reset streak
        setAdaptiveAlert({
          type: 'level_up',
          message: '⚡ ADAPTASI AKTIF: Hebat sekali! 5 Kali Benar Beruntun! Sistem otomatis meningkatkan kesulitan ke SULIT (Tantangan HOTS & Komputasional)!'
        });
      }

      setSession(prev => ({
        ...prev,
        score: prev.score + result.pointsEarned,
        earnedCoins: prev.earnedCoins + result.coinsEarned,
        earnedXp: prev.earnedXp + result.pointsEarned,
        combo: result.newCombo,
        maxCombo: Math.max(prev.maxCombo, result.newCombo),
        correctAnswersCount: prev.correctAnswersCount + 1,
        hotsSolvedCount: prev.hotsSolvedCount + (currentQuestion.isHots ? 1 : 0)
      }));
    } else {
      sound.playWrong();
      
      // Jalur Adaptif: Reset streak benar & tambah hitungan kesalahan
      setCorrectStreak(0);
      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);

      if (nextWrong === 3) {
        setAdaptiveDifficulty('mudah');
        setWrongCount(0); // Reset hitungan
        setForceHint(true); // Auto-buka petunjuk di soal berikutnya
        setAdaptiveAlert({
          type: 'level_down',
          message: '💡 REINFORCEMENT AKTIF: Jangan menyerah! Kamu salah 3 kali. Sistem memberikan Soal Penguatan yang lebih mudah disertai Petunjuk otomatis.'
        });
      }

      setSession(prev => ({
        ...prev,
        lives: result.newLives,
        combo: 0,
        wrongAnswersCount: prev.wrongAnswersCount + 1
      }));

      if (result.newLives <= 0) {
        setTimeout(() => {
          onLevelFail();
        }, 1800);
      }
    }
  };

  // Melangkah ke soal berikutnya atau pemicu layar kemenangan level secara adaptif
  const handleNext = () => {
    sound.playClick();
    
    // Sembunyikan alert adaptif setelah lanjut
    setAdaptiveAlert(null);

    const LEVEL_LENGTH = 5;
    const nextIdx = currentIndex + 1;

    if (nextIdx < LEVEL_LENGTH) {
      // Dapatkan daftar id soal yang sudah dikerjakan agar tidak duplikat
      const playedIds = questions.map(q => q.id);

      // Ambil soal baru berdasarkan status tingkat kesulitan adaptif terkini
      const nextQ = getAdaptiveQuestion(adaptiveDifficulty, playedIds);

      setQuestions(prev => [...prev, nextQ]);
      setCurrentIndex(nextIdx);
      resetQuestionState(nextQ);

      // Jika ada pemicu forceHint, otomatis tampilkan petunjuk
      if (forceHint) {
        setShowHint(true);
        setForceHint(false);
      }
    } else {
      // Selesaikan level & kalkulasi rating bintang akhir menggunakan Game Engine
      const summary = NumeraverseEngine.completeLevel(session, profile, worldId, levelId);
      setCompletionSummary(summary);
      sound.playVictoryFanfare();
      setIsCompleted(true);
    }
  };

  // Pemicu tombol ambil hadiah yang mengalirkan data matang ke root App.tsx
  const handleCompleteCollect = () => {
    if (!completionSummary) return;
    sound.playLevelUp();
    
    // Ambil daftar id soal yang sudah dikerjakan dalam sesi ini
    const playedIds = questions.map(q => q.id);

    onLevelComplete(
      completionSummary.finalXp,
      completionSummary.finalCoins,
      completionSummary.stars,
      completionSummary.finalScore,
      completionSummary.newUnlockedBadges,
      playedIds
    );
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <span className="text-4xl animate-spin">🌀</span>
        <p className="font-bold mt-2">Memuat Tantangan Berhitung...</p>
      </div>
    );
  }

  // --- CELEBRATION SUMMARY SCREEN (MISI BERHASIL) ---
  if (isCompleted && completionSummary) {
    const starsArray = Array.from({ length: 3 });

    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center animate-fade-in">
        <div className="bg-white border-4 border-emerald-400 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          
          {/* Confetti visual effects */}
          <div className="absolute top-2 left-2 text-yellow-400 text-3xl animate-bounce">✨</div>
          <div className="absolute top-4 right-4 text-emerald-400 text-4xl animate-bounce">🎉</div>
          <div className="absolute bottom-6 left-6 text-indigo-400 text-2xl">🌟</div>

          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-300">
            <Trophy className="w-10 h-10 text-emerald-600 fill-emerald-200 animate-pulse" />
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Misi Berhasil!
          </span>

          {/* Golden Stars Rating Display */}
          <div className="flex justify-center items-center gap-3 my-6">
            {starsArray.map((_, i) => {
              const isActive = i < completionSummary.stars;
              return (
                <div 
                  key={i} 
                  className={`transition-all duration-700 transform hover:scale-125 ${
                    isActive ? 'text-amber-400 scale-110 rotate-[360deg]' : 'text-slate-200'
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <Award className={`w-14 h-14 ${isActive ? 'fill-amber-300 drop-shadow-[0_4px_6px_rgba(245,158,11,0.4)]' : ''}`} />
                </div>
              );
            })}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
            DUNIA {worldId} - MISI {levelId} SELESAI!
          </h2>
          
          <p className="text-slate-500 font-bold text-sm mt-2">
            Kerja cerdas pahlawan! Kestabilan berhitung di <span className="text-slate-800 font-extrabold">{world.name}</span> berhasil dilindungi.
          </p>

          {/* Game Stats & Engine Rewards Summary */}
          <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 my-6 text-left space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-2">Evaluasi Performa Mesin Game:</h4>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-semibold">Skor Level:</span>
              <span className="font-extrabold text-slate-800 text-base">{completionSummary.finalScore} Poin</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-semibold">Combo Beruntun Maks:</span>
              <span className="font-extrabold text-indigo-600 flex items-center gap-1">
                🔥 {session.maxCombo}x Combo
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-semibold">XP Karakter Diperoleh:</span>
              <span className="font-extrabold text-indigo-700">+{completionSummary.finalXp} XP</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-semibold">Koin Emas Dikumpulkan:</span>
              <span className="font-extrabold text-amber-600 flex items-center gap-1">
                🪙 +{session.earnedCoins} Koin
              </span>
            </div>

            {/* Perfect Run Bonus visual alert */}
            {completionSummary.isPerfectRun && (
              <div className="bg-amber-100/60 border border-amber-300 text-amber-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-bold animate-pulse">
                <span>🛡️ Bonus Tanpa Cela (5 Nyawa Penuh)!</span>
                <span className="text-amber-700 font-black">+10 Koin</span>
              </div>
            )}
          </div>

          {/* New Unlocked Badges celebration widget */}
          {completionSummary.newUnlockedBadges.length > 0 && (
            <div className="mb-6 animate-bounce">
              <h4 className="text-xs font-black text-pink-500 uppercase tracking-wider mb-2">🎖️ Lencana Baru Terbuka!</h4>
              <div className="flex justify-center gap-3">
                {completionSummary.newUnlockedBadges.map(badgeId => (
                  <div key={badgeId} className="bg-pink-50 border-2 border-pink-200 rounded-xl p-2.5 flex flex-col items-center justify-center max-w-[120px] shadow-sm">
                    <span className="text-xl">⭐</span>
                    <span className="text-[10px] font-black text-pink-700 mt-1 uppercase text-center leading-tight">
                      {badgeId.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            id="collect-rewards-btn"
            onClick={handleCompleteCollect}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black py-4 rounded-2xl border-b-4 border-emerald-700 shadow-md hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <Award className="w-5 h-5 text-white" />
            Ambil Hadiah & Lanjutkan Petualangan
          </button>
        </div>
      </div>
    );
  }

  // --- ACTIVE GAMEPLAY LOOP PLAYING ---
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 animate-fade-in">
      
      {/* 1. HUD TOP BAR */}
      <div className="bg-white border-3 border-slate-100 rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* World & Level Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-100">
            <Compass className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Level Aktif:</span>
            <h3 className="font-black text-slate-800 text-sm md:text-base leading-none">{world.name} (Misi {levelId})</h3>
          </div>
        </div>

        {/* Level Hearts Status */}
        <div className="flex items-center gap-1 bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl">
          {Array.from({ length: 5 }).map((_, idx) => {
            const hasHeart = idx < session.lives;
            return (
              <Heart 
                key={idx} 
                className={`w-5 h-5 ${hasHeart ? 'text-red-500 fill-red-500 animate-pulse' : 'text-slate-200'}`} 
              />
            );
          })}
        </div>

        {/* Score & Coins indicators */}
        <div className="flex items-center gap-4">
          {/* Flame Combo streak indicator */}
          {session.combo >= 1 && (
            <div className="bg-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-[0_4px_12px_rgba(245,158,11,0.4)] animate-bounce">
              <Flame className="w-4 h-4 fill-white animate-pulse" />
              <span>{session.combo}x Combo!</span>
            </div>
          )}

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Skor Sesi:</span>
            <span className="font-black text-slate-800 text-sm md:text-base">{session.score} Poin</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-300" />
            <span className="font-extrabold text-amber-700 text-sm">+{session.earnedCoins}</span>
          </div>
        </div>
      </div>

      {/* ADAPTIVE PATHWAY STATE BAR (DASBOR LEVEL ADAPTIF) */}
      <div className="bg-slate-50 border-3 border-slate-100 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-sm">
        <div className="flex items-center gap-2.5 font-bold text-slate-700">
          <span className="p-2 rounded-xl bg-violet-100 text-base">🤖</span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-black">Sistem Jalur Adaptif</span>
            <span className="flex items-center gap-1.5 text-slate-700 font-extrabold">
              Kesulitan Saat Ini: 
              {adaptiveDifficulty === 'sulit' && (
                <span className="bg-rose-500 text-white font-black px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider animate-pulse">
                  🔥 SULIT (HOTS)
                </span>
              )}
              {adaptiveDifficulty === 'sedang' && (
                <span className="bg-indigo-600 text-white font-black px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
                  ⭐ SEDANG (STANDAR)
                </span>
              )}
              {adaptiveDifficulty === 'mudah' && (
                <span className="bg-emerald-500 text-white font-black px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider animate-bounce">
                  💡 MUDAH (PENGUATAN)
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Correct Streak Progress towards level up */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold text-[9px] uppercase">Streak HOTS:</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span 
                  key={idx} 
                  className={`w-4 h-4 rounded-full border text-[8px] font-black flex items-center justify-center transition-all ${
                    idx < correctStreak 
                      ? 'bg-amber-400 border-amber-500 text-slate-900 font-extrabold' 
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">(5x Benar = Level Up)</span>
          </div>

          {/* Wrong Count Progress towards reinforcement */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold text-[9px] uppercase">Bantuan Soal:</span>
            <div className="flex gap-1 font-sans">
              {Array.from({ length: 3 }).map((_, idx) => (
                <span 
                  key={idx} 
                  className={`w-4 h-4 rounded-full border text-[8px] font-black flex items-center justify-center transition-all ${
                    idx < wrongCount 
                      ? 'bg-rose-500 border-rose-600 text-white font-extrabold' 
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  ✗
                </span>
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">(3x Salah = Lebih Mudah + Petunjuk)</span>
          </div>
        </div>
      </div>

      {/* Adaptive Level Change Notification Banner */}
      {adaptiveAlert && (
        <div className={`border-3 rounded-2xl p-4 mb-6 shadow-md animate-slide-up flex items-start gap-3 relative ${
          adaptiveAlert.type === 'level_up' 
            ? 'bg-amber-50 border-amber-300 text-amber-900' 
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}>
          <div className="text-2xl">{adaptiveAlert.type === 'level_up' ? '⚡' : '💡'}</div>
          <div className="flex-1 pr-6">
            <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500 leading-none mb-1">
              {adaptiveAlert.type === 'level_up' ? 'Peningkatan Kesulitan Otomatis' : 'Penyesuaian Jalur Belajar'}
            </h4>
            <p className="text-xs font-black leading-relaxed">{adaptiveAlert.message}</p>
          </div>
          <button 
            onClick={() => setAdaptiveAlert(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 font-black text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. PROGRESS BAR & COUNTDOWN TIMER */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-bold mb-1">
          <span className="text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-red-500 animate-spin' : 'text-slate-400'}`} />
            Sisa Waktu Berpikir:
          </span>
          <span className={`font-black ${timeLeft <= 5 ? 'text-red-600 text-sm animate-ping' : 'text-slate-700'}`}>
            {timeLeft} Detik
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              timeLeft <= 5 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                : timeLeft <= 12 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                  : 'bg-gradient-to-r from-violet-500 to-indigo-600'
            }`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* 3. CORE CHALLENGE CONTAINER */}
      <div className="bg-white border-4 border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm mb-6 relative">
        
        {/* Floating Difficulty Tag */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          {currentQuestion.isHots && (
            <span className="bg-red-100 text-red-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-200">
              🔥 HOTS (Tinggi)
            </span>
          )}
          {currentQuestion.isComputationalThinking && (
            <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-200">
              💻 Komputasional
            </span>
          )}
          <span className="bg-slate-100 text-slate-700 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
            Soal {currentIndex + 1} dari 5
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-8 pt-4">
          <h2 className="text-lg md:text-xl font-black text-slate-800 leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* 4. DYNAMIC INTERACTIVE ANSWER CONTROLS */}
        <div className="mb-8">
          
          {/* A. MULTIPLE CHOICE */}
          {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && currentQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={idx}
                    id={`option-btn-${idx}`}
                    onClick={() => {
                      if (isAnswered) return;
                      sound.playClick();
                      setSelectedOption(option);
                    }}
                    disabled={isAnswered}
                    className={`text-left p-4 rounded-2xl border-3 text-sm md:text-base font-extrabold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-800 shadow-md transform scale-[1.01]'
                        : isAnswered
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option}</span>
                    <span className="text-[10px] uppercase font-black text-slate-300">Pilihan {idx + 1}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* B. NUMERICAL KEYPAD TEXT INPUT */}
          {currentQuestion.type === 'text-input' && (
            <div className="flex flex-col md:flex-row gap-6 items-center max-w-lg mx-auto">
              
              {/* Answer Box */}
              <div className="flex-1 w-full space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Jawaban Pahlawan:</span>
                <div className="bg-slate-50 border-3 border-slate-200 rounded-2xl p-4 text-center font-black text-2xl tracking-widest min-h-[64px] text-indigo-700 flex items-center justify-center shadow-inner">
                  {textAnswer || <span className="text-slate-300 animate-pulse">Isi Jawaban...</span>}
                </div>
              </div>

              {/* Pixel Keypad */}
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-3 rounded-2xl border-2 border-slate-200 w-full md:w-64">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', 'DEL'].map((val) => (
                  <button
                    key={val}
                    id={`keypad-btn-${val}`}
                    onClick={() => handleKeypadPress(val)}
                    disabled={isAnswered}
                    className="bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-black py-2.5 rounded-xl border border-slate-300 border-b-3 shadow-sm hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer disabled:opacity-50"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* C. SORTING ITEMS */}
          {currentQuestion.type === 'sorting' && (
            <div className="space-y-6 max-w-xl mx-auto">
              
              {/* Target Drop Zone Area */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Urutan Jawaban (Klik untuk Membatalkan):</span>
                <div className="bg-indigo-50/50 border-3 border-dashed border-indigo-200 rounded-2xl p-4 min-h-[80px] flex flex-wrap gap-3 items-center justify-center shadow-inner">
                  {sortedItems.length === 0 ? (
                    <p className="text-slate-400 text-xs font-bold italic">Urutkan dari terkecil ke terbesar, atau sebaliknya sesuai petunjuk...</p>
                  ) : (
                    sortedItems.map((item, idx) => (
                      <button
                        key={idx}
                        id={`sorted-item-${idx}`}
                        onClick={() => handleSortedItemClick(item)}
                        disabled={isAnswered}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-extrabold px-3.5 py-2 rounded-xl border-b-3 border-indigo-800 shadow-md hover:scale-105 transition-all text-xs cursor-pointer disabled:opacity-60"
                      >
                        {item}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Source/Available Items Area */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Item yang Tersedia:</span>
                <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 min-h-[80px] flex flex-wrap gap-3 items-center justify-center">
                  {availableItems.length === 0 && !isAnswered ? (
                    <p className="text-slate-400 text-xs font-bold">Semua telah diurutkan!</p>
                  ) : (
                    availableItems.map((item, idx) => (
                      <button
                        key={idx}
                        id={`available-item-${idx}`}
                        onClick={() => handleItemClick(item)}
                        disabled={isAnswered}
                        className="bg-white hover:bg-slate-100 text-slate-700 font-extrabold px-3.5 py-2 rounded-xl border border-slate-300 shadow-sm hover:scale-105 transition-all text-xs cursor-pointer disabled:opacity-50"
                      >
                        {item}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Reset button for sorting */}
              {!isAnswered && (
                <button
                  id="reset-sorting-btn"
                  onClick={handleResetSorting}
                  className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black px-3.5 py-1.5 rounded-xl text-xs border border-slate-200 transition-all mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Ulangi Urutan
                </button>
              )}
            </div>
          )}

        </div>

        {/* 5. FEEDBACK EXPLANATION PANEL */}
        {isAnswered && (
          <div className={`p-4 md:p-6 rounded-2xl border-3 mb-6 animate-slide-up ${
            isTimeout 
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : isCorrect 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex gap-3">
              {isTimeout ? (
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
              ) : isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              )}
              
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm md:text-base leading-none">
                  {isTimeout ? 'WAKTU BERPIKIR HABIS!' : isCorrect ? 'SANGAT BENAR! +Skor & +Koin' : 'JAWABAN BELUM TEPAT'}
                </h4>
                <p className="text-xs md:text-sm font-medium leading-relaxed opacity-90">
                  {isTimeout 
                    ? 'Pahlawan perlu memecahkan persamaan lebih cepat agar tidak terkejar oleh distractor.' 
                    : currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. SUBMIT / NEXT ACTION PANEL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          
          {/* Hint Trigger */}
          <div className="relative">
            {!isAnswered && (
              <button
                id="hint-trigger-btn"
                onClick={() => {
                  sound.playClick();
                  setShowHint(prev => !prev);
                }}
                className="flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" /> 
                {showHint ? 'Tutup Petunjuk Rahasia' : 'Tanya Petunjuk Rahasia Niko'}
              </button>
            )}

            {/* Hint Box popover */}
            {showHint && !isAnswered && (
              <div className="absolute bottom-8 left-0 w-64 bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 shadow-lg z-20 text-xs text-indigo-800 font-semibold animate-slide-up leading-relaxed">
                <div className="absolute bottom-[-10px] left-4 w-4 h-4 bg-indigo-50 border-b-2 border-r-2 border-indigo-200 rotate-45" />
                💡 {currentQuestion.hint}
              </div>
            )}
          </div>

          {/* Action triggers */}
          <div>
            {!isAnswered ? (
              <button
                id="submit-answer-btn"
                onClick={handleCheckAnswer}
                disabled={
                  (currentQuestion.type === 'multiple-choice' && !selectedOption) ||
                  (currentQuestion.type === 'true-false' && !selectedOption) ||
                  (currentQuestion.type === 'text-input' && !textAnswer.trim()) ||
                  (currentQuestion.type === 'sorting' && sortedItems.length !== currentQuestion.answer.length)
                }
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black px-6 py-3 rounded-xl border-b-4 border-indigo-800 shadow-md hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 text-sm"
              >
                <span>Periksa Jawaban</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="next-question-btn"
                onClick={handleNext}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black px-6 py-3 rounded-xl border-b-4 border-emerald-700 shadow-md hover:scale-[1.03] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
              >
                <span>{currentIndex + 1 === 5 ? 'Lihat Hasil Akhir Misi' : 'Tantangan Berikutnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 7. AVATAR COACHING ASSISTANCE SPEECH */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex gap-3.5 items-start">
        <div className="text-3xl bg-white p-2 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center shrink-0">
          {getAvatarEmoji()}
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider block">{getAvatarName()} - Pemandu Matematika:</span>
          <p className="text-xs text-slate-600 font-bold leading-relaxed">
            {isAnswered 
              ? isCorrect 
                ? 'Luar biasa! Analisis numerasimu sungguh tajam. Terus pertahankan ritme berpikir cepatmu!'
                : 'Tidak apa-apa, pahlawan! Belajar matematika adalah tentang mencoba. Ingatlah petunjuk dan amati pola pertanyaannya!'
              : 'Baca soal dengan teliti ya. Perhatikan jenis operasinya, pahlawan!'
            }
          </p>
        </div>
      </div>

    </div>
  );
};
