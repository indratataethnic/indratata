/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerProfile } from '../types';
import { sound } from '../utils/audio';
import { XCircle, RefreshCw, Compass, Heart } from 'lucide-react';

interface LevelFailProps {
  profile: PlayerProfile;
  onRetry: () => void;
  onBackToMap: () => void;
}

export const LevelFail: React.FC<LevelFailProps> = ({ profile, onRetry, onBackToMap }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="bg-white border-4 border-red-400 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        
        {/* Visual Header */}
        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 border-4 border-red-300">
          <span className="text-5xl animate-bounce">😿</span>
        </div>

        <span className="bg-red-100 text-red-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          Misi Terhenti
        </span>

        <h2 className="text-3xl font-black text-slate-800 mt-3 leading-tight">
          NYAWA LEVEL HABIS!
        </h2>
        
        <p className="text-slate-500 font-bold text-xs md:text-sm mt-2 leading-relaxed">
          Tenang, salah adalah bagian alami dari belajar matematika! Mari isi kembali energimu dan coba pecahkan soal ini sekali lagi!
        </p>

        {/* Informative tips */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-5 text-left text-xs font-semibold text-slate-600 leading-relaxed">
          💡 <strong>Tips dari Teman Pintarmu:</strong> Bacalah petunjuk (Hint) yang ada di pojok kanan jika kesulitan, dan coret-coret di kertas untuk membantumu berhitung bersusun.
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            id="retry-level-btn"
            onClick={() => { sound.playLevelUp(); onRetry(); }}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black py-4 rounded-2xl border-b-4 border-indigo-800 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
            Isi Energi & Coba Lagi (Gratis)
          </button>

          <button
            id="fail-back-to-map-btn"
            onClick={() => { sound.playClick(); onBackToMap(); }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Compass className="w-5 h-5 text-slate-500" />
            Kembalilah ke Peta
          </button>
        </div>
      </div>
    </div>
  );
};
