/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { sound } from '../utils/audio';
import { User, Sparkles, BookOpen, Coins, Award, Trophy, ArrowLeft, Check, Heart } from 'lucide-react';

interface ProfileScreenProps {
  profile: PlayerProfile;
  onUpdateProfile: (name: string, grade: number, avatar: string, school?: string) => void;
  onBack: () => void;
}

const AVATARS = [
  { id: 'niko', emoji: '👨‍🚀', name: 'Astro-Niko' },
  { id: 'rumi', emoji: '🤖', name: 'Rumi-Bot' },
  { id: 'sora', emoji: '👩‍🌾', name: 'Sora-Kelana' },
  { id: 'kiko', emoji: '🐼', name: 'Kiko-Panda' }
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, onUpdateProfile, onBack }) => {
  const [name, setName] = useState(profile.name);
  const [grade, setGrade] = useState(profile.grade);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [school, setSchool] = useState(profile.school || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    sound.playLevelUp();
    onUpdateProfile(name.trim(), grade, avatar, school.trim());
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  // Calculate completed level count
  const totalCompletedLevels = (Object.values(profile.completedLevels) as number[][]).reduce(
    (acc, val) => acc + (val?.length || 0), 0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          id="profile-back-btn"
          onClick={() => { sound.playClick(); onBack(); }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2.5 rounded-2xl border-2 border-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Identitas Pahlawan</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card & Stats Panel (Left) */}
        <div className="space-y-6">
          <div className="bg-white border-4 border-slate-100 rounded-3xl p-6 shadow-sm text-center">
            
            {/* Large Avatar badge */}
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-violet-400 shadow-sm relative">
                <span className="text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                  {AVATARS.find(a => a.id === avatar)?.emoji || '👶'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-violet-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm uppercase tracking-wider">
                LVL {profile.level}
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800">{profile.name}</h3>
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mt-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Siswa Kelas {profile.grade}
            </span>

            {/* Quick stats items */}
            <div className="grid grid-cols-2 gap-3 mt-6 border-t pt-4 border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100">
                <span className="text-xl">🏆</span>
                <span className="font-black text-sm text-slate-800 mt-1">{totalCompletedLevels}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Misi Selesai</span>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100">
                <Coins className="w-5 h-5 text-amber-500 fill-amber-200" />
                <span className="font-black text-sm text-slate-800 mt-1">{profile.coins}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Koin</span>
              </div>
            </div>
          </div>

          {/* Life Meter Card */}
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 shadow-sm text-center">
            <h4 className="font-black text-red-800 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1">
              <Heart className="w-4 h-4 text-red-500 fill-red-400" />
              KESEHATAN HERO (LIVES)
            </h4>
            <div className="flex justify-center gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map((h) => (
                <Heart 
                  key={h} 
                  className={`w-6 h-6 transition-all ${
                    h <= profile.lives 
                      ? "text-red-500 fill-red-500 scale-110 shadow-sm" 
                      : "text-red-200 fill-white"
                  }`} 
                />
              ))}
            </div>
            <p className="text-[10px] text-red-700 font-bold leading-relaxed">
              Nyawamu akan berkurang jika salah menjawab soal dalam misi, dan akan bertambah saat menyelesaikan level!
            </p>
          </div>
        </div>

        {/* Edit Form Panel (Right) */}
        <div className="md:col-span-2 bg-white border-4 border-slate-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 border-b pb-3 border-slate-100 mb-6 flex items-center gap-1.5">
            <span>⚙️</span> Pengaturan Identitas Karakter
          </h4>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-extrabold text-xs md:text-sm uppercase tracking-wider">
                Ganti Nama Pahlawan:
              </label>
              <input
                type="text"
                required
                maxLength={15}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border-3 border-slate-200 focus:border-violet-500 focus:ring-0 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* School Input */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-extrabold text-xs md:text-sm uppercase tracking-wider">
                Nama Sekolah (Sekolah):
              </label>
              <input
                type="text"
                maxLength={30}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Contoh: SD Negeri 1 Merdeka"
                className="w-full bg-slate-50 border-3 border-slate-200 focus:border-violet-500 focus:ring-0 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Class Grade Switcher */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-extrabold text-xs md:text-sm uppercase tracking-wider">
                Ubah Kelas (Tingkat Soal Matematika):
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { sound.playClick(); setGrade(g); }}
                    className={`py-3 rounded-xl border-2 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer ${
                      grade === g
                        ? 'bg-violet-600 text-white border-violet-400 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Kls {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Preset Switcher */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-extrabold text-xs md:text-sm uppercase tracking-wider">
                Pilih Rekan Petualang:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVATARS.map((av) => {
                  const isSelected = avatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => { sound.playClick(); setAvatar(av.id); }}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all h-28 cursor-pointer ${
                        isSelected
                          ? 'bg-violet-50 border-violet-500 text-violet-800 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] mb-1">{av.emoji}</span>
                      <span className="font-extrabold text-[10px] text-center leading-tight truncate w-full">{av.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              {showSavedToast ? (
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3.5 py-2.5 rounded-2xl border border-emerald-200 flex items-center gap-1 animate-pulse">
                  <Check className="w-4 h-4" /> Berhasil Disimpan!
                </span>
              ) : (
                <span />
              )}
              
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black px-8 py-3.5 rounded-2xl border-b-4 border-emerald-700 shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                <span>Simpan Perubahan</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
