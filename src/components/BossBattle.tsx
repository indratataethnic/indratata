/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile } from '../types';
import { BOSS_QUESTIONS } from '../questions';
import { sound } from '../utils/audio';
import { Swords, Heart, Shield, Sparkles, HelpCircle, Check, ArrowRight, XCircle } from 'lucide-react';

interface BossBattleProps {
  profile: PlayerProfile;
  onVictory: () => void;
  onDefeat: () => void;
  onBackToMap: () => void;
}

export const BossBattle: React.FC<BossBattleProps> = ({
  profile,
  onVictory,
  onDefeat,
  onBackToMap
}) => {
  const [bossHp, setBossHp] = useState(100);
  const [playerLives, setPlayerLives] = useState(profile.lives);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  
  // Feedback status
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false); // animation flag
  const [isBossHurt, setIsBossHurt] = useState(false); // animation flag

  const currentQuestion = BOSS_QUESTIONS[currentIndex];

  const handleKeypadPress = (val: string) => {
    if (isAnswered) return;
    sound.playClick();
    if (val === 'DEL') {
      setTextAnswer(prev => prev.slice(0, -1));
    } else {
      setTextAnswer(prev => prev + val);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion || isAnswered) return;

    let userIsCorrect = false;

    if (currentQuestion.type === 'multiple-choice') {
      if (!selectedOption) return;
      userIsCorrect = selectedOption === currentQuestion.answer;
    } else if (currentQuestion.type === 'text-input') {
      if (!textAnswer.trim()) return;
      userIsCorrect = textAnswer.trim().toLowerCase() === currentQuestion.answer.toString().toLowerCase();
    }

    setIsCorrect(userIsCorrect);
    setIsAnswered(true);

    if (userIsCorrect) {
      // Player attacks Boss!
      sound.playBossHit();
      setIsAttacking(true);
      setIsBossHurt(true);
      
      setTimeout(() => {
        setIsAttacking(false);
        setIsBossHurt(false);
      }, 1000);

      // Inflict damage
      setBossHp(prev => {
        const nextHp = prev - 35; // 3 correct answers will defeat Boss (100 -> 65 -> 30 -> 0)
        return Math.max(0, nextHp);
      });
    } else {
      // Boss attacks Player!
      sound.playWrong();
      setPlayerLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setTimeout(() => {
            onDefeat();
          }, 1500);
        }
        return nextLives;
      });
    }
  };

  const handleNext = () => {
    sound.playClick();
    
    // Check if boss defeated
    if (bossHp <= 0) {
      onVictory();
      return;
    }

    // Go to next question or loop back if not yet defeated
    const nextIdx = currentIndex + 1;
    if (nextIdx < BOSS_QUESTIONS.length) {
      setCurrentIndex(nextIdx);
    } else {
      // Loop boss questions if they missed some but didn't die
      setCurrentIndex(0);
    }

    setSelectedOption(null);
    setTextAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Boss Battle Arena header */}
      <div className="flex items-center justify-between bg-slate-900 border-2 border-rose-500 rounded-3xl p-4 mb-8 text-white flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Swords className="w-6 h-6 text-rose-500 animate-pulse" />
          <span className="font-black tracking-widest text-rose-400">ARENA PERTARUNGAN BOSS AKHIR</span>
        </div>
        <button
          id="flee-boss-battle-btn"
          onClick={() => { sound.playClick(); onBackToMap(); }}
          className="text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-rose-900 text-rose-300 font-extrabold transition-all"
        >
          🏳️ Mundur & Atur Strategi
        </button>
      </div>

      {/* Visual Fight Screen */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-3xl border-4 border-slate-800 p-6 md:p-8 relative min-h-[300px] flex flex-col md:flex-row justify-around items-center gap-8 mb-8 overflow-hidden shadow-[0_10px_40px_rgba(239,68,68,0.15)]">
        
        {/* Glowing battle flash lines */}
        {isAttacking && (
          <div className="absolute inset-0 bg-cyan-400/20 z-20 pointer-events-none animate-flash flex items-center justify-center">
            <div className="w-full h-8 bg-cyan-300 shadow-[0_0_30px_#06b6d4] rotate-12 transform scale-150" />
          </div>
        )}

        {/* BOSS PANEL */}
        <div className={`text-center space-y-3 transition-transform duration-300 ${isBossHurt ? 'animate-bounce text-red-500 scale-105' : ''}`}>
          <div className="relative inline-block">
            {/* Boss visual aura */}
            <div className="absolute -inset-4 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
            <span className="text-7xl md:text-8xl relative z-10 filter drop-shadow-[0_4px_12px_rgba(168,85,247,0.5)]">
              😈
            </span>
          </div>
          <div>
            <h4 className="text-xl font-black text-purple-400 tracking-wider">RAJA DISTRAKTOR</h4>
            <span className="text-[10px] font-black text-rose-500 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800">
              PENGACAK ANGKA DUNIA
            </span>
          </div>

          {/* Boss HP Bar */}
          <div className="w-48 mx-auto">
            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1">
              <span>HP BOS:</span>
              <span>{bossHp}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border-2 border-slate-700 p-0.5">
              <div 
                className="bg-gradient-to-r from-purple-500 via-rose-500 to-red-600 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                style={{ width: `${bossHp}%` }}
              />
            </div>
          </div>
        </div>

        {/* VERSUS TEXT */}
        <div className="text-center">
          <div className="bg-red-950 text-red-400 font-black text-2xl w-14 h-14 rounded-full border-4 border-red-800 flex items-center justify-center shadow-lg animate-pulse">
            VS
          </div>
        </div>

        {/* PLAYER PANEL */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            {/* Player visual aura */}
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl" />
            <span className="text-7xl md:text-8xl relative z-10 filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
              {profile.avatar === 'niko' ? '👨‍🚀' : profile.avatar === 'rumi' ? '🤖' : profile.avatar === 'sora' ? '👩‍🌾' : '🐼'}
            </span>
          </div>
          <div>
            <h4 className="text-xl font-black text-emerald-400 tracking-wider uppercase">{profile.name}</h4>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
              PAHLAWAN NUMERASI
            </span>
          </div>

          {/* Player lives */}
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((h) => (
              <Heart 
                key={h} 
                className={`w-5 h-5 transition-all ${
                  h <= playerLives 
                    ? "text-red-500 fill-red-500 scale-110 animate-pulse" 
                    : "text-slate-700 fill-slate-800"
                }`} 
              />
            ))}
          </div>
        </div>

      </div>

      {/* Battle Question Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Question Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-4 border-slate-100 rounded-3xl p-6 shadow-sm relative">
            <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-rose-200 uppercase tracking-wider mb-3 inline-block">
              ⚠️ TANTANGAN DISTRAKTOR
            </span>
            <h3 className="text-lg md:text-xl font-black text-slate-800 leading-relaxed">
              {currentQuestion.text}
            </h3>
          </div>

          {/* Interactive Battle Controls */}
          <div className="bg-white border-4 border-slate-100 rounded-3xl p-6 shadow-sm">
            
            {/* MCQ OPTIONS */}
            {currentQuestion.type === 'multiple-choice' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options?.map((opt, idx) => {
                  const prefix = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === opt;

                  let optClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                  if (isSelected) {
                    optClass = "bg-rose-50 border-rose-400 text-rose-800 shadow-md";
                  }
                  if (isAnswered) {
                    if (opt === currentQuestion.answer) {
                      optClass = "bg-green-100 border-green-500 text-green-800 shadow-md";
                    } else if (isSelected && !isCorrect) {
                      optClass = "bg-red-100 border-red-500 text-red-800";
                    } else {
                      optClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      disabled={isAnswered}
                      onClick={() => { sound.playClick(); setSelectedOption(opt); }}
                      className={`p-4 rounded-2xl border-3 text-left font-bold text-sm md:text-base transition-all flex items-center gap-3 w-full cursor-pointer ${optClass}`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black shrink-0 ${
                        isSelected 
                          ? 'bg-rose-600 text-white' 
                          : isAnswered && opt === currentQuestion.answer
                            ? 'bg-green-600 text-white'
                            : 'bg-white border-2 border-slate-200 text-slate-500'
                      }`}>
                        {prefix}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TEXT INPUT TYPE */}
            {currentQuestion.type === 'text-input' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={isAnswered}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value.replace(/[^0-9\-]/g, ''))}
                    placeholder="Masukkan angka jawaban rahasia..."
                    className="flex-1 bg-slate-50 border-3 border-slate-200 focus:border-rose-500 focus:ring-0 rounded-2xl px-4 py-3.5 text-lg font-black text-slate-800 outline-none placeholder-slate-400"
                  />
                  {isAnswered && (
                    <div className="flex items-center px-4 rounded-2xl border-2 font-black text-sm bg-slate-50">
                      {isCorrect ? (
                        <span className="text-green-600">💥 SANGAT BENAR!</span>
                      ) : (
                        <span className="text-red-600">❌ Jawaban Benar: {currentQuestion.answer}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Kids Custom Numpad */}
                {!isAnswered && (
                  <div className="max-w-xs mx-auto border-t pt-4 border-slate-100">
                    <p className="text-center text-[10px] font-bold text-slate-400 mb-2.5 uppercase tracking-wider">Tombol Angka Sandi</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'DEL'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleKeypadPress(num)}
                          className={`py-3 rounded-2xl border-2 font-black text-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                            num === 'DEL' 
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-right">
              {!isAnswered ? (
                <button
                  id="shoot-boss-laser-btn"
                  onClick={handleCheckAnswer}
                  disabled={
                    (currentQuestion.type === 'multiple-choice' && !selectedOption) ||
                    (currentQuestion.type === 'text-input' && !textAnswer.trim())
                  }
                  className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110 disabled:bg-slate-200 text-white font-black text-sm px-8 py-4 rounded-2xl border-b-4 border-red-800 shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Swords className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
                  TEMBAK SINAR LASER NUMERASI!
                </button>
              ) : (
                <button
                  id="advance-battle-btn"
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-black text-sm px-8 py-4 rounded-2xl border-b-4 border-slate-950 shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjutkan Pertarungan</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Animated battle commentary dialog block */}
          {isAnswered && (
            <div className={`border-3 rounded-3xl p-5 shadow-md ${
              isCorrect ? 'bg-cyan-50 border-cyan-300 text-cyan-900' : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              <p className="text-xs md:text-sm font-semibold leading-relaxed">
                {isCorrect 
                  ? "BOOM! Sinar laser numerasimu berhasil menembus pertahanan Raja Distraktor! SANGAT DAHSYAT!" 
                  : "AWAS! Raja Distraktor membalas dengan melemparkan pecahan pembagi yang menghancurkan salah satu nyawamu! Ayo bangkit lagi!"
                }
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex items-start gap-2">
                <span className="text-xl">💡</span>
                <p className="text-[11px] font-extrabold text-slate-500 leading-relaxed">
                  <span className="text-slate-700 block mb-0.5">Penjelasan Konsep Pertarungan:</span>
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel helper (Narrator tips) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 text-slate-300 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-16 h-16 bg-rose-500/10 rounded-full" />
            <h4 className="font-black text-rose-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-500" />
              BANTUAN PENOLONG SHIELD
            </h4>
            
            {!isAnswered && (
              <div>
                {!showHint ? (
                  <button
                    id="boss-show-hint-btn"
                    onClick={() => { sound.playClick(); setShowHint(true); }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-rose-300 font-extrabold text-xs px-4 py-3 rounded-xl border border-rose-900 transition-all flex items-center justify-center gap-1"
                  >
                    💡 Minta Petunjuk Penolong
                  </button>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 animate-fadeIn">
                    <span className="text-[10px] font-black text-yellow-500 block mb-1">Misi Analitik:</span>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {currentQuestion.hint}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
