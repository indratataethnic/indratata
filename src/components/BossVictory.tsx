/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerProfile } from '../types';
import { sound } from '../utils/audio';
import { Trophy, Star, Sparkles, Award, Home } from 'lucide-react';

interface BossVictoryProps {
  profile: PlayerProfile;
  onBackToLobby: () => void;
}

export const BossVictory: React.FC<BossVictoryProps> = ({ profile, onBackToLobby }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center">
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl border-4 border-yellow-400 p-8 shadow-2xl relative overflow-hidden text-white">
        
        {/* Particle visual effects */}
        <div className="absolute top-4 left-6 text-yellow-300 text-5xl animate-bounce">✨</div>
        <div className="absolute top-10 right-8 text-amber-400 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🎉</div>
        <div className="absolute bottom-10 left-10 text-cyan-400 text-3xl animate-pulse">🌟</div>

        <div className="w-28 h-28 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto mb-6 border-4 border-yellow-300 shadow-md">
          <Trophy className="w-14 h-14 text-yellow-300 fill-yellow-200 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <span className="bg-yellow-400 text-indigo-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest border border-white">
          Penyelamat Numeraverse!
        </span>

        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 mt-4 leading-tight">
          SELAMAT! KAMU MENANG!
        </h2>
        
        <p className="text-slate-300 font-semibold text-xs md:text-sm mt-3 leading-relaxed">
          Luar biasa, <strong className="text-yellow-300">{profile.name.toUpperCase()}</strong>! Kamu telah memecahkan semua trik matematika Raja Distraktor dan mengembalikan kedamaian numerasi di seluruh dunia Numeraverse!
        </p>

        {/* Certificate Card */}
        <div className="bg-white/5 border-2 border-yellow-500/30 rounded-2xl p-4 my-6 text-left space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-yellow-400 border-b border-white/10 pb-2">
            <span>PIAGAM PENGHARGAAN SD</span>
            <span>NO. NUMERA-{profile.name.length}22</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
            Diberikan kepada <strong className="text-white font-black">{profile.name}</strong> atas dedikasi luar biasa menyelesaikan petualangan Fase Kurikulum Sekolah Dasar dan menguasai literasi numerasi secara sempurna!
          </p>
        </div>

        <button
          id="victory-home-btn"
          onClick={() => { sound.playClick(); onBackToLobby(); }}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-indigo-950 font-black py-4 rounded-2xl border-b-4 border-amber-700 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          <Home className="w-5 h-5 text-indigo-950" />
          Kembalilah ke Beranda Utama
        </button>
      </div>
    </div>
  );
};
