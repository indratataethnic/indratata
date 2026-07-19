/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerProfile } from '../types';
import { BADGES } from '../questions';
import { 
  Trophy, Compass, Trees, Coins, Cpu, Sword, Sparkles, 
  ArrowLeft, Star, Lock, Heart, Award 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface BadgesScreenProps {
  profile: PlayerProfile;
  onBack: () => void;
}

// Icon mapper for badges
const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
  const props = { className: `w-12 h-12 ${isUnlocked ? 'text-white' : 'text-slate-400'}` };
  switch (iconName) {
    case 'Compass': return <Compass {...props} />;
    case 'Trees': return <Trees {...props} />;
    case 'Coins': return <Coins {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'Sword': return <Sword {...props} />;
    default: return <Trophy {...props} />;
  }
};

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ profile, onBack }) => {
  
  // Helper to check if a badge is unlocked
  const isUnlocked = (badgeId: string) => {
    return profile.badges.includes(badgeId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          id="badges-back-btn"
          onClick={() => { sound.playClick(); onBack(); }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2.5 rounded-2xl border-2 border-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        
        <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 text-amber-800 text-sm font-black px-4 py-1.5 rounded-full shadow-sm">
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-200" />
          Medali Terbuka: {profile.badges.length} / {BADGES.length}
        </div>
      </div>

      {/* Main Jumbotron */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-3xl p-6 md:p-8 text-white mb-10 shadow-lg text-center relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-0 transform -translate-x-6 translate-y-6 w-24 h-24 bg-white/10 rounded-full" />
        
        <div className="relative z-10 space-y-2">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto border-2 border-white animate-bounce">
            <Trophy className="w-8 h-8 text-white fill-amber-200" />
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase">BUKU MEDALI KEJUARAAN</h2>
          <p className="text-xs md:text-sm font-semibold max-w-md mx-auto opacity-95">
            Selesaikan misi-misi sulit, kumpulkan koin, dan kalahkan Raja Distraktor untuk melengkapi seluruh buku medalimu!
          </p>
        </div>
      </div>

      {/* Badges Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES.map((badge) => {
          const unlocked = isUnlocked(badge.id);

          return (
            <div
              key={badge.id}
              id={`badge-card-${badge.id}`}
              className={`rounded-3xl border-4 p-5 flex flex-col items-center justify-between text-center transition-all duration-300 ${
                unlocked
                  ? 'bg-white border-amber-300 shadow-[0_6px_20px_rgba(245,158,11,0.15)] scale-102 hover:scale-105'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}
            >
              {/* Badge Icon bubble */}
              <div className="relative mb-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 relative overflow-hidden ${
                  unlocked
                    ? `bg-gradient-to-br ${badge.color} border-amber-200 shadow-md`
                    : 'bg-slate-200 border-slate-300'
                }`}>
                  {getBadgeIcon(badge.icon, unlocked)}
                  
                  {/* Glowing background if unlocked */}
                  {unlocked && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                  )}
                </div>

                {/* Status lock/star indicator */}
                <div className="absolute -bottom-1 right-1 bg-white rounded-full p-1 border shadow-sm">
                  {unlocked ? (
                    <Star className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Text details */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                <h3 className={`font-black text-sm md:text-base ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                  {badge.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed max-w-[200px]">
                  {badge.description}
                </p>
              </div>

              {/* Unlock Footer Status label */}
              <div className="mt-4 pt-3 border-t border-slate-100 w-full">
                {unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-emerald-500" /> TERBUKA
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    BELUM UNLOCKED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
