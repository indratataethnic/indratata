/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Gamepad2, 
  BookOpen, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Info,
  ExternalLink,
  XCircle
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, savePlayerProfile, getPlayerProfile } from '../firebase';
import { sound } from '../utils/audio';
import { PlayerProfile } from '../types';

interface AuthScreenProps {
  onLogin: (profile: PlayerProfile) => void;
  onAdminLogin: () => void;
}

// Preset Avatar Keren dengan Bio Karakter Game
const AVATAR_PRESETS = [
  {
    id: 'niko',
    emoji: '👨‍🚀',
    name: 'Astro-Niko',
    desc: 'Penjelajah luar angkasa yang pandai berhitung cepat dan menguak misteri bintang.',
    color: 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 hover:border-indigo-400'
  },
  {
    id: 'rumi',
    emoji: '🤖',
    name: 'Rumi-Bot',
    desc: 'Robot kalkulator super lucu yang senang memecahkan algoritme dan sandi logika.',
    color: 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 hover:border-cyan-400'
  },
  {
    id: 'sora',
    emoji: '👩‍🌾',
    name: 'Sora-Kelana',
    desc: 'Petualang alam pemegang kompas emas yang mahir dalam pola geometri dan bentuk.',
    color: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 hover:border-emerald-400'
  },
  {
    id: 'kiko',
    emoji: '🐼',
    name: 'Kiko-Panda',
    desc: 'Red panda penyuka kue kelapa yang cerdas memecahkan teka-teki logika HOTS.',
    color: 'bg-rose-950/40 border-rose-500/50 text-rose-200 hover:border-rose-400'
  }
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onAdminLogin }) => {
  // Tab Aktif: 'google' (Online) atau 'offline' (Tamu/Offline)
  const [activeTab, setActiveTab] = useState<'google' | 'offline'>('google');
  
  // State Input Form Utama (Hanya dipakai untuk mode offline)
  const [name, setName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('niko');
  
  // State Tambahan UI
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State Login Admin / Guru
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    if (adminUsername.trim() === 'sekarmelati' && adminPassword === 'sekarmelati') {
      sound.playLevelUp();
      setShowAdminLogin(false);
      onAdminLogin();
    } else {
      sound.playWrong();
      setAdminError('Username atau Password Guru Salah!');
    }
  };

  // Deskripsi Fase Kurikulum Merdeka berdasarkan Kelas yang dipilih
  const getPhaseName = (grade: number) => {
    if (grade <= 2) return 'FASE A (Kelas 1-2)';
    if (grade <= 4) return 'FASE B (Kelas 3-4)';
    return 'FASE C (Kelas 5-6)';
  };

  const getPhaseDesc = (grade: number) => {
    if (grade <= 2) return 'Fokus pada penjumlahan dasar, pengurangan, pengenalan bentuk, dan melengkapi pola warna geometri.';
    if (grade <= 4) return 'Belajar pecahan sederhana, pembagian adil, perkalian cepat, pengukuran waktu, panjang, dan berat.';
    return 'Analisis volume bangun ruang, diagram batang statistika, koordinat kartesius, & pemecahan soal HOTS.';
  };

  /**
   * Mengatur suara ketika tab diganti dan mereset error
   */
  const handleTabChange = (tab: 'google' | 'offline') => {
    sound.playClick();
    setActiveTab(tab);
    setErrorMessage(null);
  };

  /**
   * Menangani submit form untuk login/daftar offline
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (activeTab === 'offline') {
        // --- PROSES OFFLINE ---
        if (!name.trim()) {
          throw new Error('Silakan masukkan nama pahlawanmu!');
        }

        // Tentukan world mana saja yang langsung terbuka berdasarkan Kelas/Grade
        let initialWorlds = [1, 2, 7, 8]; // Kelas 1-2
        if (selectedGrade >= 3) {
          initialWorlds = [1, 2, 3, 4, 7, 8]; // Kelas 3-4 mendapat akses tambahan
        }
        if (selectedGrade >= 5) {
          initialWorlds = [1, 2, 3, 4, 5, 6, 7, 8]; // Kelas 5-6 mendapat akses penuh
        }

        const guestProfile: PlayerProfile = {
          id: 'offline_' + Math.random().toString(36).substring(2, 9),
          name: name.trim(),
          grade: selectedGrade,
          avatar: selectedAvatar,
          xp: 0,
          level: 1,
          coins: 25,
          lives: 5,
          lastLifeRegenTime: Date.now(),
          unlockedWorlds: initialWorlds,
          completedLevels: {},
          badges: [],
          lastPlayed: Date.now()
        };

        // Simpan ke localStorage
        localStorage.setItem('numeraverse_player_profile', JSON.stringify(guestProfile));
        sound.playLevelUp();
        onLogin(guestProfile);
      } else {
        // Jika submit pada tab google, langsung jalankan google sign in
        await handleGoogleSignIn();
      }
    } catch (error: any) {
      console.error('Kesalahan:', error);
      sound.playWrong();
      setErrorMessage(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Menangani login menggunakan Google Sign-In
   */
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Ambil profil pemain dari Firestore
      const profile = await getPlayerProfile(user.uid);
      
      if (profile) {
        sound.playLevelUp();
        onLogin(profile);
      } else {
        // Tentukan world mana saja yang langsung terbuka berdasarkan Kelas/Grade default (Kls 1)
        const initialWorlds = [1, 2, 7, 8];
        
        // Susun profil pemain baru
        const newProfile: PlayerProfile = {
          id: user.uid,
          name: user.displayName ? user.displayName.substring(0, 15) : 'Pahlawan',
          grade: 1,
          avatar: 'niko',
          xp: 0,
          level: 1,
          coins: 25, // Bonus koin sambutan
          lives: 5,
          lastLifeRegenTime: Date.now(),
          unlockedWorlds: initialWorlds,
          completedLevels: {},
          badges: [],
          lastPlayed: Date.now()
        };

        // Simpan ke Firestore database cloud
        await savePlayerProfile(newProfile);
        sound.playLevelUp();
        onLogin(newProfile);
      }
    } catch (error: any) {
      console.error('Kesalahan Google Auth:', error);
      sound.playWrong();
      
      let friendlyError = 'Gagal masuk dengan Google. Silakan coba lagi.';
      if (error.code === 'auth/popup-closed-by-user') {
        friendlyError = 'Sesi masuk dibatalkan karena jendela login ditutup.';
      } else if (error.code === 'auth/popup-blocked' || (error.message && error.message.includes('popup-blocked'))) {
        friendlyError = 'auth/popup-blocked';
      } else if (error.code === 'auth/operation-not-allowed') {
        friendlyError = 'Metode masuk Google belum diaktifkan di Firebase Console. Silakan hubungi admin.';
      } else if (error.message) {
        friendlyError = error.message;
      }
      
      setErrorMessage(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      
      {/* Ornamen Latar Belakang Cosmic */}
      <div className="absolute top-10 left-10 text-yellow-300 opacity-20 animate-pulse text-4xl select-none">⭐</div>
      <div className="absolute bottom-20 right-10 text-amber-300 opacity-35 animate-bounce text-5xl select-none">✨</div>
      <div className="absolute top-1/4 right-1/4 text-purple-400 opacity-20 animate-pulse text-3xl select-none">🪐</div>
      <div className="absolute bottom-1/4 left-1/5 text-cyan-400 opacity-25 animate-bounce text-4xl select-none">🚀</div>

      {/* Cahaya Aurora Neon */}
      <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />

      {/* Main Container Glassmorphism */}
      <div className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-violet-500/40 p-1 md:p-2 relative z-10 my-8 overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Kolom Kiri: Informasi Game & Lore Heroik (Sembunyi di HP kecil) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-900/60 to-violet-950/80 p-8 flex-col justify-between border-r border-violet-500/20 relative">
            <div className="space-y-6">
              {/* Logo Sekolah */}
              <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/85">
                <div className="w-12 h-12 bg-slate-900 border border-slate-750 p-1.5 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                  <img 
                    src="https://iili.io/fvetocQ.jpg" 
                    alt="Logo Sekolah" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain animate-pulse"
                    style={{ animationDuration: '3s' }}
                  />
                </div>
                <div>
                  <p className="text-[9px] text-violet-400 font-black uppercase tracking-wider">Sekolah Mitra Resmi</p>
                  <h4 className="text-white font-extrabold text-sm">UPT SDN Karanganyar</h4>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 px-3.5 py-1.5 rounded-full text-violet-300 font-bold text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                Visi Pendidikan Indonesia
              </div>
              
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 tracking-tight leading-tight">
                Selamat Datang di <br />
                <span className="text-white font-black text-5xl tracking-widest block mt-1 drop-shadow-[0_2px_10px_rgba(139,92,246,0.3)]">
                  NUMERAVERSE
                </span>
              </h2>
              
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Dunia magis di mana angka dan logika diolah menjadi sihir pertahanan! Hadapi monster numerasi, selesaikan teka-teki Kurikulum Merdeka, dan kalahkan Boss Terakhir untuk memulihkan keharmonisan kosmik.
              </p>

              {/* Fitur Utama Game */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Kurikulum Merdeka Interaktif</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Materi disesuaikan otomatis dari Fase A hingga Fase C.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/30">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Visual & Musik Fantastis</h4>
                    <p className="text-slate-400 text-xs mt-0.5">8-bit synth sound, sistem nyawa, koin, dan lencana.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Pendidikan di bawah */}
            <div className="pt-6 border-t border-slate-800">
              <p className="text-violet-300/80 italic text-xs leading-relaxed font-semibold">
                "Bermain sambil belajar adalah cara terbaik melatih kemampuan berpikir komputasional anak sejak dini."
              </p>
              <div className="mt-2 text-slate-400 text-[10px] font-bold">
                🛡️ Didukung oleh Google AI Studio Cloud
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Panel Form Autentikasi (Sangat Interaktif) */}
          <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Logo / Header di Mobile */}
              <div className="text-center lg:text-left mb-6 lg:mb-8 flex flex-col items-center lg:items-start">
                {/* Mobile Logo Badge */}
                <div className="lg:hidden flex items-center gap-2 bg-slate-950/40 p-1.5 pr-3 rounded-2xl border border-slate-800/80 mb-4 mx-auto">
                  <div className="w-8 h-8 bg-slate-900 border border-slate-700 p-1 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                    <img 
                      src="https://iili.io/fvetocQ.jpg" 
                      alt="Logo Sekolah" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-left leading-none">
                    <span className="block text-[7px] text-violet-400 font-black uppercase tracking-widest">Sekolah Mitra</span>
                    <span className="block text-[10px] text-slate-200 font-extrabold mt-0.5">UPT SDN Karanganyar</span>
                  </div>
                </div>

                <div className="lg:hidden inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-500/30 px-3 py-1 rounded-full text-violet-300 font-bold text-[10px] uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Game Edukasi Matematika Nasional
                </div>
                <h1 className="lg:hidden text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
                  NUMERAVERSE
                </h1>
                <p className="lg:hidden text-slate-400 text-xs font-bold mt-1">
                  "Petualangan Besar Dunia Numerasi"
                </p>
              </div>

              {/* Tab Selector Mode Game: GOOGLE vs OFFLINE */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 mb-6">
                <button
                  type="button"
                  onClick={() => handleTabChange('google')}
                  className={`py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === 'google'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  🌐 Masuk Google
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('offline')}
                  className={`py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === 'offline'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  ⚡ Mode Offline
                </button>
              </div>

              {/* Banner Notifikasi Kesalahan */}
              {errorMessage && (
                errorMessage.includes('auth/operation-not-allowed') ? (
                  <div className="mb-6 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 flex flex-col gap-3 animate-fadeIn text-amber-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-amber-400 font-black text-sm uppercase tracking-wide">Panduan Aktivasi Autentikasi</h5>
                        <p className="text-slate-300 text-xs font-semibold mt-1 leading-relaxed">
                          Metode pendaftaran Surel/Sandi (Email/Password) belum diaktifkan di konsol Firebase Anda. Silakan ikuti langkah mudah berikut untuk mengaktifkannya:
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950/80 rounded-xl p-4 border border-amber-500/20 text-xs space-y-2 mt-1">
                      <p className="font-extrabold text-amber-400">Langkah-langkah:</p>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed font-medium">
                        <li>
                          Buka <a href="https://console.firebase.google.com/project/gen-lang-client-0824166806/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-bold inline-flex items-center gap-0.5">Firebase Console ↗</a> di tab browser baru Anda.
                        </li>
                        <li>
                          Di bawah menu <strong>Sign-in method</strong>, klik tombol <strong>Add new provider</strong> (Tambah penyedia baru).
                        </li>
                        <li>
                          Pilih <strong>Email/Password</strong> (Surel/Sandi).
                        </li>
                        <li>
                          Aktifkan opsi pertama (<strong>Email/Password</strong>), lalu klik <strong>Save</strong> (Simpan).
                        </li>
                        <li>
                          Kembali ke game ini dan coba daftar kembali!
                        </li>
                      </ol>
                    </div>

                    <div className="border-t border-slate-800/60 pt-3">
                      <p className="text-xs font-bold text-slate-300 mb-2">⚡ Lewati Langkah Ini & Main Langsung:</p>
                      <button
                        type="button"
                        onClick={() => {
                          sound.playLevelUp();
                          const guestProfile: PlayerProfile = {
                            id: 'offline_' + Math.random().toString(36).substring(2, 9),
                            name: name.trim() || 'TamuNumera',
                            grade: selectedGrade || 1,
                            avatar: selectedAvatar || 'niko',
                            xp: 0,
                            level: 1,
                            coins: 25,
                            lives: 5,
                            lastLifeRegenTime: Date.now(),
                            unlockedWorlds: [1, 2, 7, 8],
                            completedLevels: {},
                            badges: [],
                            lastPlayed: Date.now()
                          };
                          localStorage.setItem('numeraverse_player_profile', JSON.stringify(guestProfile));
                          onLogin(guestProfile);
                        }}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 border-b-4 border-emerald-800 text-white font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                      >
                        <span>Main Mode Offline Secara Instan ↗</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 leading-relaxed mt-1">
                      💡 <strong>Tip Instan:</strong> Anda juga bisa langsung masuk secara instan menggunakan tombol <strong>Masuk dengan Google</strong> di bagian paling bawah halaman tanpa perlu konfigurasi apa pun!
                    </div>
                  </div>
                ) : errorMessage.includes('auth/popup-blocked') ? (
                  <div className="mb-6 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 flex flex-col gap-3 animate-fadeIn text-amber-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-amber-400 font-black text-sm uppercase tracking-wide">Jendela Masuk (Pop-up) Terblokir!</h5>
                        <p className="text-slate-300 text-xs font-semibold mt-1 leading-relaxed">
                          Google Sign-In memerlukan izin jendela pop-up. Karena game ini berjalan di dalam bingkai (iframe) AI Studio, browser Anda memblokirnya secara otomatis.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950/80 rounded-xl p-4 border border-amber-500/20 text-xs space-y-3 mt-1">
                      <p className="font-extrabold text-amber-400">Cara Mengatasi:</p>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed font-medium">
                        <li>
                          Izinkan pop-up untuk situs ini pada bilah alamat browser Anda (biasanya ditandai ikon jendela terblokir <span className="text-amber-400">🚫</span> di ujung kanan kolom URL).
                        </li>
                        <li>
                          <strong>Solusi Paling Mudah:</strong> Buka game ini langsung di tab baru agar tidak terhalang bingkai (iframe). Klik tombol di bawah ini:
                        </li>
                      </ol>
 
                       <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          window.open(window.location.href, '_blank');
                        }}
                        className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Game di Tab Baru & Masuk</span>
                      </button>
                    </div>
 
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      💡 <strong>Alternatif:</strong> Anda juga tetap bisa membuat akun baru secara instan di atas menggunakan kolom <strong>Nama, Surel (Email) & Sandi</strong> tanpa memerlukan jendela pop-up!
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-rose-400 font-black text-xs uppercase tracking-wide">Peringatan Sistem!</h5>
                      <p className="text-rose-200 text-xs font-medium mt-0.5 leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )
              )}

              {/* Form Interaktif */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {activeTab === 'google' ? (
                  <div className="space-y-6 animate-fadeIn py-4">
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                      <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                        <span>🌐</span> Manfaat Masuk dengan Google Cloud:
                      </h4>
                      <ul className="space-y-2.5 text-xs text-slate-300 font-semibold leading-relaxed">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span><strong>Penyimpanan Otomatis:</strong> Nilai, koin, dan nyawa disimpan aman di cloud.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span><strong>Papan Peringkat:</strong> Bersaing secara nasional dengan pahlawan lain se-Indonesia!</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span><strong>Multi-perangkat:</strong> Mainkan game ini di mana saja tanpa kehilangan progres.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Google Login Button */}
                    <button
                      type="button"
                      onClick={() => { sound.playClick(); handleGoogleSignIn(); }}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:brightness-110 border-b-4 border-indigo-800 text-white font-black text-sm py-4 px-6 rounded-xl shadow-[0_6px_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Menyambungkan Google Cloud...</span>
                        </div>
                      ) : (
                        <>
                          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.251 15.42 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z" />
                          </svg>
                          <span>Masuk Menggunakan Google</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* INPUT NAMA HERO */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                        Siapa Nama Pahlawanmu di Game?
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        required={activeTab === 'offline'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: KsatriaAritmatika"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm font-bold text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                      />
                    </div>

                    {/* SELECT KELAS / GRADE */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-bold text-xs uppercase tracking-wider">
                        🎒 Pilih Kelas Belajarmu:
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((grade) => (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => { sound.playClick(); setSelectedGrade(grade); }}
                            className={`py-2.5 rounded-xl border font-black text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                              selectedGrade === grade
                                ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white border-violet-400 shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
                                : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-900/40 hover:text-slate-200'
                            }`}
                          >
                            Kls {grade}
                          </button>
                        ))}
                      </div>

                      {/* Info Kurikulum Merdeka */}
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mt-2 flex gap-2.5 items-start">
                        <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-amber-400 font-black text-[10px] uppercase tracking-wider">
                            Fase Kurikulum Merdeka: {getPhaseName(selectedGrade)}
                          </div>
                          <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">
                            {getPhaseDesc(selectedGrade)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CHOOSE AVATAR PRESETS */}
                    <div className="space-y-2">
                      <label className="block text-slate-300 font-bold text-xs uppercase tracking-wider">
                        🎭 Pilih Karakter Petualangmu:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {AVATAR_PRESETS.map((avatar) => (
                          <button
                            key={avatar.id}
                            type="button"
                            onClick={() => { sound.playClick(); setSelectedAvatar(avatar.id); }}
                            className={`p-3 rounded-xl border text-left transition-all hover:scale-102 active:scale-98 flex flex-col justify-between h-32 cursor-pointer ${
                              selectedAvatar === avatar.id
                                ? 'bg-gradient-to-br from-indigo-900/40 to-violet-950/40 border-violet-500 text-white shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/30'
                                : avatar.color
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-3.5xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{avatar.emoji}</span>
                              {selectedAvatar === avatar.id && (
                                <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <div className="mt-1">
                              <h4 className="font-extrabold text-xs text-white">{avatar.name}</h4>
                              <p className="text-[9px] leading-tight text-slate-400 line-clamp-2 mt-0.5">{avatar.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mulai Offline Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:brightness-110 border-b-4 border-emerald-700 text-white font-black text-sm py-4 px-6 rounded-xl shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer disabled:opacity-50"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      <span>Mulai Petualangan Offline!</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </button>

                  </div>
                )}

              </form>
            </div>

            {/* Footer Mini info */}
            <div className="mt-6 pt-4 border-t border-slate-800/40 text-center text-[10px] text-slate-500 font-bold flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span>🔒 Transaksi & Data Aman</span>
                <span>•</span>
                <span>📈 Terintegrasi Firestore Database</span>
                <span>•</span>
                <span>🎮 Pengalaman Belajar Game-Based</span>
              </div>
              <div className="text-[9px] text-slate-600 mt-1 uppercase tracking-wider">
                © 2026 UPT SDN Karanganyar. Dibuat oleh <span className="text-violet-400 font-black">Indra Tata</span>
              </div>
            </div>

            {/* Portal Guru Button */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => { sound.playClick(); setAdminError(null); setShowAdminLogin(true); }}
                className="text-[10px] text-violet-400 hover:text-violet-300 font-black uppercase tracking-wider flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg border border-slate-800/60 bg-slate-950/40 hover:bg-slate-950/80 transition-all cursor-pointer"
              >
                🔒 Portal Guru & Admin
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Overlay Modal Login Admin */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border-2 border-violet-500/50 rounded-2xl p-6 max-w-sm w-full space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { sound.playClick(); setShowAdminLogin(false); }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-slate-950 border border-slate-800 p-1 rounded-2xl flex items-center justify-center overflow-hidden mx-auto shadow-inner">
                <img 
                  src="https://iili.io/fvetocQ.jpg" 
                  alt="Logo Sekolah" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Portal Masuk Guru
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                  Silakan masukkan kredensial khusus Guru UPT SDN Karanganyar.
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4 text-left">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold text-xs uppercase tracking-wider">
                  Nama Pengguna (Username)
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl py-2.5 px-3 text-xs font-bold text-white placeholder-slate-600 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold text-xs uppercase tracking-wider">
                  Kata Sandi (Password)
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl py-2.5 px-3 text-xs font-bold text-white placeholder-slate-600 outline-none transition-all shadow-inner"
                />
              </div>

              {adminError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-xs rounded-xl text-center">
                  ⚠️ {adminError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 border-b-4 border-indigo-800 text-white font-black text-xs py-3 px-6 rounded-xl shadow-md uppercase tracking-widest cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-0.5 transition-all"
              >
                Masuk Portal Guru
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
