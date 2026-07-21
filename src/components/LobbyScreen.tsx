/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { sound } from '../utils/audio';
import { 
  Gamepad2, Star, Coins, Trophy, Sparkles, BookOpen, 
  HelpCircle, ShieldAlert, Award, X, ChevronLeft, ChevronRight,
  Info, Heart, Shield, Activity
} from 'lucide-react';
import { useActiveSeason } from '../utils/seasonalEngine';

interface LobbyScreenProps {
  profile: PlayerProfile;
  onNavigate: (view: any) => void;
}

const FUN_FACTS = [
  "Tahu tidak? Angka nol (0) pertama kali digunakan sebagai angka matematika di India kuno!",
  "Tahukah kamu? Lebah madu adalah arsitek hebat! Mereka membuat sarang berbentuk segi enam (heksagon) karena bentuk itu paling hemat ruang dan kuat!",
  "Unik sekali! Angka 1 sampai 9 jika dijumlahkan semuanya (1+2+3+4+5+6+7+8+9) hasilnya tepat 45!",
  "Wah! Tanda tambah (+) dan kurang (-) baru mulai dipakai secara umum di buku matematika sejak tahun 1489 masehi!",
  "Keajaiban angka 9: Kalikan angka berapapun dengan 9, lalu jumlahkan angka hasil kalinya, hasilnya pasti kelipatan 9! (Contoh: 9 x 5 = 45 -> 4 + 5 = 9)!"
];

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ profile, onNavigate }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const { seasonId, season } = useActiveSeason();

  // Pick random fact based on player's name length to keep it deterministic per load but varied
  const factIndex = (profile.name?.length || 0) % FUN_FACTS.length;
  const activeFact = FUN_FACTS[factIndex];

  // Calculate completed level count
  const totalCompletedLevels = (Object.values(profile.completedLevels) as number[][]).reduce(
    (acc, val) => acc + (val?.length || 0), 0
  );

  const guideSteps = [
    {
      title: "🌌 Selamat Datang di Numeraverse!",
      icon: <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />,
      content: "Numeraverse adalah dunia petualangan matematika interaktif berbasis Kurikulum Merdeka. Di sini, kamu berperan sebagai Pahlawan Numerasi yang bertugas membebaskan galaksi dari serangan Raja Distraktor menggunakan kekuatan matematika!",
      color: "from-violet-500 to-indigo-600"
    },
    {
      title: "🗺️ Jelajahi 8 Dunia Matematika",
      icon: <Gamepad2 className="w-12 h-12 text-cyan-400 animate-bounce" />,
      content: "Terdapat 8 Dunia unik yang bisa kamu jelajahi melalui Peta Game. Mulai dari Hutan Angka (Kelas 1-2), Pulau Pecahan (Kelas 3-4), hingga Candi Tantangan HOTS (Kelas 5-6). Pilih dunia dan level sesuai kesiapan belajarmu!",
      color: "from-indigo-500 to-blue-600"
    },
    {
      title: "⚡ Aturan Main & Misi",
      icon: <Activity className="w-12 h-12 text-emerald-400" />,
      content: "Setiap level berisi 5 pertanyaan matematika adaptif. Soal akan otomatis menyesuaikan dengan kelas yang kamu pilih di profil! Jika kesulitan, klik tombol Bantuan (💡) untuk mendapatkan petunjuk rumus pengerjaan.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "❤️ Jaga Nyawamu!",
      icon: <Heart className="w-12 h-12 text-red-500 fill-red-400" />,
      content: "Kamu dibekali maksimal 5 nyawa (❤️). Setiap kali kamu menjawab salah, 1 nyawa akan berkurang. Jika nyawa habis, misi gagal! Tenang, kamu bisa memulihkan nyawa menggunakan Koin Numera di Toko Pahlawan.",
      color: "from-red-500 to-rose-600"
    },
    {
      title: "🔥 Combo Beruntun & Papan Skor",
      icon: <Trophy className="w-12 h-12 text-amber-400" />,
      content: "Menjawab dengan cepat dan mempertahankan jawaban benar beruntun akan meningkatkan Combo (🔥). Raih skor tertinggi untuk mengukir namamu di Papan Klasemen Nasional dan kumpulkan lencana medali legendaris!",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Hero Welcome Panel */}
      <div className={`bg-gradient-to-r ${seasonId === 'default' ? 'from-violet-600 via-indigo-600 to-cyan-500' : season.bgGradient} rounded-3xl p-6 md:p-8 text-white mb-8 shadow-lg relative overflow-hidden`}>
        
        {/* Background cosmic patterns */}
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
 
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                Selamat Datang Kembali!
              </span>
              {seasonId !== 'default' && (
                <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shrink-0">
                  🎉 {season.logo} EVENT: {season.name.toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              HAI, {profile.name.toUpperCase()}!
            </h2>
            <p className="text-xs md:text-sm font-semibold opacity-95 max-w-lg">
              Kekuatan numerasimu saat ini di level <strong className="text-yellow-300">Level {profile.level}</strong>. {seasonId === 'default' ? 'Terus selesaikan misi-misi matematika untuk memperkuat perlindungan Numeraverse!' : `Misi khusus "${season.theme}" sedang aktif! Pecahkan tantangan matematika sekarang!`}
            </p>
          </div>
 
          {/* Play & Guide Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              id="lobby-guide-btn"
              onClick={() => { sound.playClick(); setGuideStep(0); setShowGuide(true); }}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/25 border-2 border-white/20 text-white font-black text-sm px-5 py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <HelpCircle className="w-5 h-5 text-yellow-300 animate-bounce" />
              Cara Bermain
            </button>

            <button
              id="lobby-play-btn"
              onClick={() => { sound.playLevelUp(); onNavigate('map'); }}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black text-base px-7 py-4 rounded-2xl border-b-6 border-emerald-700 shadow-[0_10px_25px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider cursor-pointer"
            >
              <Gamepad2 className="w-6 h-6 text-white" />
              Buka Peta Game!
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Quick Stats Widget */}
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center border-2 border-amber-300 shrink-0">
            <Trophy className="w-6 h-6 text-amber-600 fill-amber-200" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MISI DISELESAIKAN</span>
            <span className="text-xl font-black text-slate-800">{totalCompletedLevels} Level</span>
          </div>
        </div>

        {/* Currency Widget */}
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center border-2 border-yellow-300 shrink-0">
            <Coins className="w-6 h-6 text-yellow-600 fill-yellow-200" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">KOIN NUMERA</span>
            <span id="lobby-coins-stat" className="text-xl font-black text-slate-800">{profile.coins} Koin</span>
          </div>
        </div>

        {/* Medals Locked vs Unlocked Widget */}
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center border-2 border-indigo-300 shrink-0">
            <Award className="w-6 h-6 text-indigo-600 fill-indigo-200" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MEDALI KEJUARAAN</span>
            <span className="text-xl font-black text-slate-800">{profile.badges.length} Terbuka</span>
          </div>
        </div>

      </div>

      {/* Seasonal Companion & Collectibles Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* NPC Nova Seasonal Companion Greeting */}
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4 hover:border-violet-300 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-4xl shrink-0 shadow-sm relative">
            <span className="absolute -top-1.5 -right-1.5 text-xs animate-bounce">✨</span>
            <span className="select-none">{season.npcCostume.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-slate-800 text-sm truncate">{season.npcCostume.name}</h4>
              <span className="bg-violet-100 text-violet-800 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase border border-violet-200 tracking-wider">
                Partner
              </span>
            </div>
            <p className="text-slate-500 font-semibold text-[11px] leading-relaxed mt-0.5">
              "{season.npcCostume.desc} Mari pecahkan soal!"
            </p>
          </div>
        </div>

        {/* Seasonal Collectibles Card */}
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 flex items-center justify-center text-4xl shrink-0 shadow-sm relative">
            <span className="absolute -top-1.5 -right-1.5 text-xs animate-spin" style={{ animationDuration: '6s' }}>⭐</span>
            <span className="select-none">{season.rewardEmoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-slate-800 text-sm truncate">Hadiah: {season.rewardName}</h4>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase border border-amber-200 tracking-wider">
                Event
              </span>
            </div>
            <p className="text-slate-500 font-semibold text-[11px] leading-relaxed mt-0.5">
              Raih medali eksklusif <span className="text-violet-600 font-bold">"{season.badge.title}"</span> di event musiman ini!
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard CTA Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 mb-8 text-slate-900 border-4 border-amber-400 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute -right-8 -bottom-8 text-amber-300 opacity-20 text-9xl font-black rotate-12 select-none pointer-events-none">🏆</div>
        <div className="relative z-10">
          <span className="bg-slate-950 text-amber-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-400/20 tracking-wider">
            Sistem Klasemen Aktif
          </span>
          <h3 className="text-xl font-black mt-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-slate-950 animate-bounce" />
            Kejuaraan & Klasemen Pahlawan
          </h3>
          <p className="text-xs text-slate-900 font-extrabold mt-1 max-w-xl">
            Tantang dirimu di klasemen Global, Sekolah, dan Kelas! Berkompetisi mengumpulkan XP harian, mingguan, dan bulanan untuk menjadi nomor satu!
          </p>
        </div>
        <button
          onClick={() => { sound.playClick(); onNavigate('leaderboard'); }}
          className="relative z-10 shrink-0 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs px-5 py-3 rounded-2xl border-2 border-amber-400 shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Buka Klasemen ↗</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Trivia Box (Deep Learning Pedagogical touch) */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-2 right-2 text-amber-200 text-5xl opacity-40 select-none">💡</div>
          <h4 className="font-extrabold text-amber-800 mb-2.5 text-base flex items-center gap-1.5">
            <HelpCircle className="w-5 h-5 text-amber-500 animate-pulse" />
            Tahukah Kamu? (Fakta Seru Matematika)
          </h4>
          <p className="text-slate-700 font-semibold text-xs md:text-sm leading-relaxed relative z-10">
            "{activeFact}"
          </p>
        </div>

        {/* Kurikulum Merdeka Phase Outline */}
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-6 shadow-sm">
          <h4 className="font-extrabold text-slate-800 mb-3 text-base flex items-center gap-1.5">
            <BookOpen className="w-5 h-5 text-violet-500" />
            Fase Kurikulum Numerasi
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold p-2 rounded-xl bg-green-50 border border-green-100">
              <span className="text-green-800">Fase A (Kelas 1-2)</span>
              <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Berhitung Dasar</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold p-2 rounded-xl bg-sky-50 border border-sky-100">
              <span className="text-sky-800">Fase B (Kelas 3-4)</span>
              <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Pecahan & Ukur</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold p-2 rounded-xl bg-indigo-50 border border-indigo-100">
              <span className="text-indigo-800">Fase C (Kelas 5-6)</span>
              <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Volume & Statistika</span>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onNavigate('question-bank'); }}
            className="w-full mt-3.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Jelajahi Bank Soal Lengkap ↗</span>
          </button>
        </div>

      </div>

      {/* Interactive Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border-4 border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${guideSteps[guideStep].color} text-white flex items-center justify-between relative`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <h3 className="font-black text-lg tracking-tight">PANDUAN BERMAIN</h3>
              </div>
              <button 
                onClick={() => { sound.playClick(); setShowGuide(false); }}
                className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto flex flex-col items-center text-center space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                {guideSteps[guideStep].icon}
              </div>
              <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                {guideSteps[guideStep].title}
              </h4>
              <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed max-w-md">
                {guideSteps[guideStep].content}
              </p>
            </div>

            {/* Stepper Dots Indicator */}
            <div className="flex justify-center gap-2 pb-4">
              {guideSteps.map((_, idx) => (
                <div 
                  key={idx}
                  onClick={() => { sound.playClick(); setGuideStep(idx); }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    guideStep === idx ? 'w-6 bg-violet-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                disabled={guideStep === 0}
                onClick={() => { sound.playClick(); setGuideStep(prev => prev - 1); }}
                className={`flex items-center gap-1 font-bold text-xs py-2.5 px-4 rounded-xl border transition-all ${
                  guideStep === 0 
                    ? 'text-slate-300 border-slate-200 cursor-not-allowed' 
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-100 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>

              {guideStep < guideSteps.length - 1 ? (
                <button
                  onClick={() => { sound.playClick(); setGuideStep(prev => prev + 1); }}
                  className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => { sound.playLevelUp(); setShowGuide(false); }}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black text-xs py-2.5 px-6 rounded-xl border-b-4 border-emerald-700 hover:scale-105 transition-all shadow-sm cursor-pointer"
                >
                  Saya Siap Bermain! 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
