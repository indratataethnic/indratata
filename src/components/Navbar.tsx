/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { Heart, Coins, Trophy, Volume2, VolumeX, User, LogOut, Sparkles, BookOpen, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { useActiveSeason, SeasonId } from '../utils/seasonalEngine';

interface NavbarProps {
  profile: PlayerProfile | null;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, onNavigate, onLogout, activeView }) => {
  const [muted, setMuted] = useState(sound.getMuted());
  const { seasonId, season, selectSeason, seasons } = useActiveSeason();

  const handleToggleMute = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
    sound.playClick();
  };

  if (!profile) return null;

  // Calculate XP percentage to next level
  const xpNeeded = profile.level * 100;
  const xpPercent = Math.min(100, Math.floor((profile.xp / xpNeeded) * 100));

  // Avatar lookup
  const getAvatarEmoji = (avatarId: string) => {
    switch (avatarId) {
      case 'niko': return '👨‍🚀';
      case 'rumi': return '🤖';
      case 'sora': return '👩‍🌾';
      case 'kiko': return '🐼';
      default: return '👶';
    }
  };

  const getAvatarName = (avatarId: string) => {
    switch (avatarId) {
      case 'niko': return 'Astro-Niko';
      case 'rumi': return 'Rumi-Bot';
      case 'sora': return 'Sora-Kelana';
      case 'kiko': return 'Kiko-Panda';
      default: return 'Hero';
    }
  };

  return (
    <header className="bg-white border-b-4 border-gray-100 shadow-sm sticky top-0 z-50 px-4 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Grade Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button 
            id="nav-logo-btn"
            onClick={() => { sound.playClick(); onNavigate('lobby'); }}
            className="flex items-center gap-2 font-bold text-2xl text-violet-600 hover:scale-105 transition-transform"
          >
            <span className="text-3xl animate-bounce">🎮</span>
            <span className="tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">NUMERAVERSE</span>
          </button>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300 shadow-sm flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              Kls {profile.grade}
            </span>
            {/* Season Selector */}
            <div className="flex items-center gap-1 bg-violet-100 text-violet-800 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-300 shadow-sm transition-all hover:border-violet-400">
              <span className="text-sm shrink-0">{season.logo}</span>
              <select
                id="nav-season-select"
                value={seasonId}
                onChange={(e) => {
                  sound.playClick();
                  selectSeason(e.target.value as SeasonId);
                }}
                className="bg-transparent font-black outline-none cursor-pointer pr-1 text-violet-900 border-none appearance-none focus:ring-0 py-0 text-[11px] uppercase tracking-wider"
                title="Ganti Tema & Musim Dunia"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id} className="text-slate-800 font-bold bg-white normal-case">
                    {s.logo} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Player Stats (XP, Lives, Coins) */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 w-full md:w-auto">
          {/* Level & XP */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-3 py-1.5 flex items-center gap-3 shadow-inner w-44 md:w-48">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-black text-sm flex items-center justify-center border-2 border-violet-400 shrink-0 shadow-sm">
              Lvl {profile.level}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                <span>XP</span>
                <span>{profile.xp}/{xpNeeded}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-500" 
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lives (Hearts) */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <span className="text-xs font-black text-red-600 mr-1 hidden sm:inline">NYAWA:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((h) => (
                <Heart 
                  key={h} 
                  id={`heart-icon-${h}`}
                  className={`w-5 h-5 transition-all duration-300 ${
                    h <= profile.lives 
                      ? "text-red-500 fill-red-500 scale-110 drop-shadow-[0_2px_4px_rgba(239,68,68,0.4)]" 
                      : "text-red-200 fill-red-100"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Coins */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-sm font-bold text-amber-700">
            <Coins className="w-5 h-5 text-amber-500 fill-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span id="nav-coins-count" className="font-extrabold text-sm md:text-base">{profile.coins}</span>
          </div>
        </div>

        {/* Profile Avatar, Volume & Logout */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
          {/* Avatar Clickable */}
          <button 
            id="nav-profile-btn"
            onClick={() => { sound.playClick(); onNavigate('profile'); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 transition-all hover:scale-105 ${
              activeView === 'profile' 
                ? 'bg-violet-100 border-violet-400 text-violet-800' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xl">{getAvatarEmoji(profile.avatar)}</span>
            <span className="text-xs font-bold max-w-[80px] truncate">{profile.name || getAvatarName(profile.avatar)}</span>
          </button>

          {/* Leaderboard Link */}
          <button 
            id="nav-leaderboard-btn"
            onClick={() => { sound.playClick(); onNavigate('leaderboard'); }}
            className={`p-2 rounded-2xl border-2 transition-all hover:scale-105 ${
              activeView === 'leaderboard' 
                ? 'bg-amber-100 border-amber-400 text-amber-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Klasemen Pahlawan (Leaderboard)"
          >
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-100" />
          </button>

          {/* Badges Link */}
          <button 
            id="nav-badges-btn"
            onClick={() => { sound.playClick(); onNavigate('badges'); }}
            className={`p-2 rounded-2xl border-2 transition-all hover:scale-105 ${
              activeView === 'badges' 
                ? 'bg-purple-100 border-purple-400 text-purple-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Koleksi Medali"
          >
            <Award className="w-5 h-5 text-purple-600" />
          </button>

          {/* Bank Soal Link */}
          <button 
            id="nav-banksoal-btn"
            onClick={() => { sound.playClick(); onNavigate('question-bank'); }}
            className={`p-2 rounded-2xl border-2 transition-all hover:scale-105 ${
              activeView === 'question-bank' 
                ? 'bg-violet-100 border-violet-400 text-violet-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Eksplorasi Bank Soal"
          >
            <BookOpen className="w-5 h-5 text-violet-600" />
          </button>

          {/* Mute Control */}
          <button 
            id="nav-mute-btn"
            onClick={handleToggleMute}
            className="p-2 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-transform hover:scale-105"
            title={muted ? 'Buka Suara' : 'Senyap'}
          >
            {muted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          {/* Logout */}
          <button 
            id="nav-logout-btn"
            onClick={() => { sound.playClick(); onLogout(); }}
            className="p-2 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all hover:scale-105"
            title="Keluar Game"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
