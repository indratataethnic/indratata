/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  LogOut, 
  Download, 
  Award, 
  Coins, 
  Heart, 
  TrendingUp, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Database,
  ArrowLeft,
  XCircle,
  HelpCircle,
  UserCheck,
  Eye,
  Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerProfile } from '../types';
import { getAllPlayerProfiles, savePlayerProfile, db, getGlobalStats } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { sound } from '../utils/audio';

interface AdminScreenProps {
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'coins' | 'xp' | 'lastPlayed'>('lastPlayed');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  
  // Statistik tayangan dan permainan global
  const [globalStats, setGlobalStats] = useState<{ views: number; plays: number }>({ views: 0, plays: 0 });

  // States for Quick Actions
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [adjustCoins, setAdjustCoins] = useState<number>(0);
  const [adjustXp, setAdjustXp] = useState<number>(0);
  const [adjustLives, setAdjustLives] = useState<number>(0);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  // Load all players & global stats
  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPlayerProfiles();
      setPlayers(data);
      const stats = await getGlobalStats();
      setGlobalStats(stats);
    } catch (e) {
      console.error('Gagal mengambil data pahlawan & statistik:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleRefresh = () => {
    sound.playClick();
    loadPlayers();
  };

  // Export to CSV
  const handleExportCSV = () => {
    sound.playClick();
    if (players.length === 0) return;

    const headers = ['ID', 'Nama', 'Kelas', 'Sekolah', 'Level', 'XP', 'Koin', 'Nyawa', 'Jumlah Badge', 'Terakhir Main'];
    const rows = players.map(p => [
      p.id,
      p.name,
      p.grade,
      p.school || '-',
      p.level,
      p.xp,
      p.coins,
      p.lives,
      p.badges.length,
      new Date(p.lastPlayed).toLocaleString('id-ID')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `database_numeraverse_siswa_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Data berhasil diekspor ke CSV!');
  };

  const showToast = (message: string) => {
    setSuccessNotification(message);
    setTimeout(() => {
      setSuccessNotification(null);
    }, 3000);
  };

  // Adjust student metrics
  const handleSaveAdjustments = async () => {
    if (!selectedPlayer) return;
    sound.playLevelUp();

    const updated: PlayerProfile = {
      ...selectedPlayer,
      coins: Math.max(0, selectedPlayer.coins + adjustCoins),
      xp: Math.max(0, selectedPlayer.xp + adjustXp),
      lives: Math.min(5, Math.max(1, selectedPlayer.lives + adjustLives)),
      lastPlayed: Date.now()
    };

    // Calculate level up if XP was added
    let currentXp = updated.xp;
    let currentLevel = updated.level;
    let xpNeeded = currentLevel * 100;
    while (currentXp >= xpNeeded) {
      currentXp -= xpNeeded;
      currentLevel += 1;
      xpNeeded = currentLevel * 100;
    }
    updated.level = currentLevel;
    updated.xp = currentXp;

    try {
      await savePlayerProfile(updated);
      setSelectedPlayer(updated);
      setPlayers(prev => prev.map(p => p.id === updated.id ? updated : p));
      
      // Reset adjustment fields
      setAdjustCoins(0);
      setAdjustXp(0);
      setAdjustLives(0);
      
      showToast(`Berhasil menyesuaikan status ${updated.name}!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Player
  const handleDeletePlayer = async (id: string) => {
    sound.playWrong();
    try {
      const userRef = doc(db, 'users', id);
      await deleteDoc(userRef);
      setPlayers(prev => prev.filter(p => p.id !== id));
      if (selectedPlayer?.id === id) {
        setSelectedPlayer(null);
      }
      setShowDeleteConfirm(null);
      showToast('Siswa berhasil dihapus dari database.');
    } catch (err) {
      console.error('Gagal menghapus siswa:', err);
    }
  };

  // Seed Demo Students for teachers to test instantly
  const handleSeedDemoData = async () => {
    sound.playLevelUp();
    setIsLoading(true);

    const demoStudents: PlayerProfile[] = [
      {
        id: 'demo_budi',
        name: 'Budi Pratama',
        grade: 2,
        school: 'SD Merdeka 01',
        avatar: 'niko',
        xp: 45,
        level: 3,
        coins: 85,
        lives: 5,
        lastLifeRegenTime: Date.now(),
        unlockedWorlds: [1, 2, 7, 8],
        completedLevels: { 1: [1, 2, 3], 2: [1] },
        badges: ['first_level_clear', 'stars_collector'],
        lastPlayed: Date.now() - 3600000 * 2 // 2 hours ago
      },
      {
        id: 'demo_siti',
        name: 'Siti Aminah',
        grade: 4,
        school: 'SD Harapan Bangsa',
        avatar: 'rumi',
        xp: 120,
        level: 8,
        coins: 240,
        lives: 4,
        lastLifeRegenTime: Date.now(),
        unlockedWorlds: [1, 2, 3, 4, 7, 8],
        completedLevels: { 1: [1, 2, 3, 4, 5], 2: [1, 2, 3], 3: [1, 2] },
        badges: ['first_level_clear', 'world_explorer', 'stars_collector', 'hots_conqueror'],
        lastPlayed: Date.now() - 3600000 * 12 // 12 hours ago
      },
      {
        id: 'demo_rian',
        name: 'Rian Hidayat',
        grade: 1,
        school: 'SD Merdeka 01',
        avatar: 'sora',
        xp: 10,
        level: 1,
        coins: 15,
        lives: 2,
        lastLifeRegenTime: Date.now() - 100000,
        unlockedWorlds: [1, 2, 7, 8],
        completedLevels: {},
        badges: [],
        lastPlayed: Date.now() - 3600000 * 48 // 2 days ago
      },
      {
        id: 'demo_putri',
        name: 'Putri Lestari',
        grade: 6,
        school: 'SD Islam Terpadu',
        avatar: 'kiko',
        xp: 210,
        level: 15,
        coins: 450,
        lives: 5,
        lastLifeRegenTime: Date.now(),
        unlockedWorlds: [1, 2, 3, 4, 5, 6, 7, 8],
        completedLevels: { 
          1: [1, 2, 3, 4, 5], 
          2: [1, 2, 3, 4, 5], 
          3: [1, 2, 3, 4, 5],
          4: [1, 2, 3],
          5: [1, 2],
          7: [1, 2, 3]
        },
        badges: ['first_level_clear', 'world_explorer', 'stars_collector', 'hots_conqueror', 'boss_slayer'],
        lastPlayed: Date.now()
      }
    ];

    try {
      for (const student of demoStudents) {
        await savePlayerProfile(student);
      }
      await loadPlayers();
      showToast('Siswa percontohan berhasil ditambahkan!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredPlayers = players
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.school && p.school.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchGrade = gradeFilter === 'all' || p.grade === parseInt(gradeFilter);
      return matchSearch && matchGrade;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'level') return b.level - a.level;
      if (sortBy === 'coins') return b.coins - a.coins;
      if (sortBy === 'xp') return (b.level * 100 + b.xp) - (a.level * 100 + a.xp);
      return b.lastPlayed - a.lastPlayed;
    });

  // Calculations for Admin Analytics
  const totalStudents = players.length;
  const grade1_2 = players.filter(p => p.grade <= 2).length;
  const grade3_4 = players.filter(p => p.grade >= 3 && p.grade <= 4).length;
  const grade5_6 = players.filter(p => p.grade >= 5).length;
  
  const totalBadges = players.reduce((sum, p) => sum + p.badges.length, 0);
  const totalCoins = players.reduce((sum, p) => sum + p.coins, 0);
  const totalLevelsCleared = players.reduce((sum, p) => {
    let clears = 0;
    if (p.completedLevels) {
      Object.values(p.completedLevels).forEach(arr => {
        const levelList = arr as number[];
        if (levelList && Array.isArray(levelList)) {
          clears += levelList.length;
        }
      });
    }
    return sum + clears;
  }, 0);

  // Time Formatter helper
  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Baru saja';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} menit lalu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam lalu`;
    return new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 relative overflow-hidden">
      
      {/* Decorative Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Admin */}
      <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              <img 
                src="https://iili.io/fvetocQ.jpg" 
                alt="Logo Sekolah" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-violet-500/20 text-violet-300 font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-violet-500/30">
                  Dashboard Guru • UPT SDN Karanganyar
                </span>
              </div>
              <h1 className="text-xl font-black text-white uppercase tracking-wider">
                Portal Admin Numeraverse
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExportCSV}
              disabled={players.length === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-emerald-400 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Ekspor Excel/CSV</span>
            </button>

            <button
              onClick={() => { sound.playClick(); onBack(); }}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/20 border-b-4 border-rose-800 text-white font-black text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        
        {/* Success Alert */}
        <AnimatePresence>
          {successNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 text-emerald-200 text-sm font-bold flex items-center gap-2.5 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Siswa */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3.5 rounded-xl border border-blue-500/20 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Total Pahlawan</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{totalStudents} Anak</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Aktif di database Cloud</p>
            </div>
          </div>

          {/* Card 2: Kelas Distribution */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Fase & Kelas</p>
              <div className="flex flex-col gap-1 mt-1 text-[11px] font-bold text-slate-300">
                <div className="flex justify-between">
                  <span>Fase A (Kls 1-2):</span>
                  <span className="text-white">{grade1_2}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fase B (Kls 3-4):</span>
                  <span className="text-white">{grade3_4}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fase C (Kls 5-6):</span>
                  <span className="text-white">{grade5_6}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Total Level Diselesaikan */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Misi Selesai</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{totalLevelsCleared} Kali</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Akumulasi level matematika</p>
            </div>
          </div>

          {/* Card 4: Koin & Reward */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-yellow-500/10 p-3.5 rounded-xl border border-yellow-500/20 text-yellow-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Ekonomi Koin & Badge</p>
              <h3 className="text-xl font-black text-white mt-0.5">{totalCoins} Koin</h3>
              <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                <Award className="w-3 h-3 text-violet-400" />
                <span>{totalBadges} Penghargaan Terbuka</span>
              </p>
            </div>
          </div>

          {/* Card 5: Total Dilihat (App Views) */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-sky-500/10 p-3.5 rounded-xl border border-sky-500/20 text-sky-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Aplikasi Dilihat</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{globalStats.views} Kali</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Total tayangan global</p>
            </div>
          </div>

          {/* Card 6: Total Dimainkan (Games Played) */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Game Dimainkan</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{globalStats.plays} Kali</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Total level matematika dimuat</p>
            </div>
          </div>

        </div>

        {/* Database Search, Filters, and Table Grid */}
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama pahlawan atau asal sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 focus:border-violet-500 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-white placeholder-slate-500 outline-none transition-all shadow-inner"
              />
            </div>

            {/* Quick Filter Selects */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Filter Grade */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-indigo-400" /> Filter:
                </span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none transition-all"
                >
                  <option value="all">Semua Kelas</option>
                  <option value="1">Kelas 1 (Fase A)</option>
                  <option value="2">Kelas 2 (Fase A)</option>
                  <option value="3">Kelas 3 (Fase B)</option>
                  <option value="4">Kelas 4 (Fase B)</option>
                  <option value="5">Kelas 5 (Fase C)</option>
                  <option value="6">Kelas 6 (Fase C)</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Urutan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none transition-all"
                >
                  <option value="lastPlayed">Terakhir Main</option>
                  <option value="level">Level Tertinggi</option>
                  <option value="coins">Koin Terbanyak</option>
                  <option value="xp">XP Tertinggi</option>
                  <option value="name">Abjad Nama</option>
                </select>
              </div>

            </div>

          </div>

          {/* Student Table / List */}
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Memuat basis data siswa...
              </p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
              <div className="text-4xl text-center">📂</div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm">Tidak Ada Data Siswa</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  Tidak ditemukan pahlawan yang cocok dengan kata kunci pencarian atau filter kelas.
                </p>
              </div>
              {totalStudents === 0 && (
                <button
                  onClick={handleSeedDemoData}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 border-b-4 border-indigo-800 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tambahkan Data Pahlawan Percontohan</span>
                </button>
              )}
            </div>
          ) : (
            <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/20">
              
              {/* Header Kolom */}
              <div className="hidden lg:grid grid-cols-12 gap-3 bg-slate-900/60 border-b border-slate-800/80 p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <div className="col-span-3">Pahlawan & Asal Sekolah</div>
                <div className="col-span-1 text-center">Kelas</div>
                <div className="col-span-1 text-center">Level</div>
                <div className="col-span-1 text-center">Koin</div>
                <div className="col-span-1 text-center">Nyawa</div>
                <div className="col-span-3">Pencapaian Badge</div>
                <div className="col-span-1 text-center">Aktif</div>
                <div className="col-span-1 text-right">Tindakan</div>
              </div>

              {/* Baris Siswa */}
              <div className="divide-y divide-slate-800/60">
                {filteredPlayers.map((player) => {
                  const isDemo = player.id.startsWith('demo_');
                  const isOffline = player.id.startsWith('offline_');
                  
                  return (
                    <div 
                      key={player.id}
                      onClick={() => { sound.playClick(); setSelectedPlayer(player); }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 items-center hover:bg-slate-900/30 transition-all cursor-pointer"
                    >
                      {/* Name & Avatar */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-md shrink-0">
                          {player.avatar === 'niko' && '👨‍🚀'}
                          {player.avatar === 'rumi' && '🤖'}
                          {player.avatar === 'sora' && '👩‍🌾'}
                          {player.avatar === 'kiko' && '🐼'}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-sm text-white truncate max-w-[150px] sm:max-w-xs">{player.name}</span>
                            {isOffline && (
                              <span className="text-[8px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded uppercase">
                                Tamu
                              </span>
                            )}
                            {isDemo && (
                              <span className="text-[8px] bg-amber-500/10 text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase border border-amber-500/20">
                                Demo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                            {player.school || 'Belum mengisi asal sekolah'}
                          </span>
                        </div>
                      </div>

                      {/* Kelas/Grade */}
                      <div className="col-span-1 lg:text-center flex lg:block justify-between text-xs font-extrabold text-slate-300">
                        <span className="lg:hidden text-slate-500 text-[10px] uppercase">Kelas:</span>
                        <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-violet-300">
                          Kelas {player.grade}
                        </span>
                      </div>

                      {/* Level */}
                      <div className="col-span-1 lg:text-center flex lg:block justify-between text-xs font-black text-yellow-400">
                        <span className="lg:hidden text-slate-500 text-[10px] uppercase">Level:</span>
                        <span>Lvl {player.level}</span>
                      </div>

                      {/* Coins */}
                      <div className="col-span-1 lg:text-center flex lg:block justify-between text-xs font-black text-amber-300">
                        <span className="lg:hidden text-slate-500 text-[10px] uppercase">Koin:</span>
                        <span className="flex lg:justify-center items-center gap-1">
                          💰 {player.coins}
                        </span>
                      </div>

                      {/* Lives */}
                      <div className="col-span-1 lg:text-center flex lg:block justify-between text-xs font-black text-rose-400">
                        <span className="lg:hidden text-slate-500 text-[10px] uppercase">Nyawa:</span>
                        <span className="flex lg:justify-center items-center gap-1">
                          ❤️ {player.lives}/5
                        </span>
                      </div>

                      {/* Badges List Preview */}
                      <div className="col-span-3 flex lg:flex-wrap gap-1.5 overflow-x-auto lg:overflow-visible py-1 flex-row">
                        <span className="lg:hidden text-slate-500 text-[10px] uppercase self-center mr-2">Badges:</span>
                        {player.badges.length === 0 ? (
                          <span className="text-[10px] text-slate-600 font-bold italic">Belum ada badge</span>
                        ) : (
                          player.badges.slice(0, 4).map((b, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap shrink-0"
                            >
                              ✨ {b === 'first_level_clear' ? 'Pioneer' : 
                                  b === 'world_explorer' ? 'Penjelajah' : 
                                  b === 'stars_collector' ? 'Kolektor Bintang' : 
                                  b === 'hots_conqueror' ? 'Master HOTS' : 
                                  b === 'boss_slayer' ? 'Penakluk Raja' : b}
                            </span>
                          ))
                        )}
                        {player.badges.length > 4 && (
                          <span className="text-[9px] text-slate-500 font-black px-1">+{player.badges.length - 4}</span>
                        )}
                      </div>

                      {/* Last Active */}
                      <div className="col-span-1 lg:text-center flex lg:block justify-between text-[11px] font-bold text-slate-400">
                        <span className="lg:hidden text-slate-500 text-[10px] uppercase">Aktif:</span>
                        <span>{formatTimeAgo(player.lastPlayed)}</span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 text-right flex lg:justify-end gap-2 mt-2 lg:mt-0" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Detail Trigger */}
                        <button
                          onClick={() => { sound.playClick(); setSelectedPlayer(player); }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-indigo-400 hover:text-indigo-300 font-bold text-[11px] flex-1 lg:flex-none text-center cursor-pointer"
                        >
                          Kelola
                        </button>

                        {/* Delete Trigger */}
                        <button
                          onClick={() => { sound.playClick(); setShowDeleteConfirm(player.id); }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 cursor-pointer"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Footer Admin */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 text-center text-[10px] text-slate-600 font-bold border-t border-slate-900/60 pt-6">
          <p className="uppercase tracking-wider">
            © 2026 UPT SDN Karanganyar. Dibuat oleh <span className="text-violet-400 font-black">Indra Tata</span>
          </p>
        </footer>

      </main>

      {/* STUDENT DETAIL & QUICK STATS ADJUSTMENT DIALOG */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-hidden relative"
            >
              
              {/* Header Modal */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {selectedPlayer.avatar === 'niko' && '👨‍🚀'}
                    {selectedPlayer.avatar === 'rumi' && '🤖'}
                    {selectedPlayer.avatar === 'sora' && '👩‍🌾'}
                    {selectedPlayer.avatar === 'kiko' && '🐼'}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>{selectedPlayer.name}</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-black px-2 py-0.5 rounded uppercase border border-indigo-500/30">
                        Kelas {selectedPlayer.grade}
                      </span>
                    </h3>
                    <p className="text-slate-400 text-xs font-bold mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {selectedPlayer.school || 'Sekolah belum diisi'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { sound.playClick(); setSelectedPlayer(null); }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bagian Kiri: Statistik Akurat */}
                <div className="space-y-4">
                  <h4 className="text-slate-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-violet-400" /> Profil & Progres
                  </h4>

                  <div className="bg-slate-950/60 rounded-xl p-4 space-y-3 border border-slate-800/60 text-xs font-bold">
                    <div className="flex justify-between border-b border-slate-800/40 pb-2">
                      <span className="text-slate-400">UID Pemain:</span>
                      <span className="font-mono text-slate-300">{selectedPlayer.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-2">
                      <span className="text-slate-400">Level Saat Ini:</span>
                      <span className="text-yellow-400 font-black">Level {selectedPlayer.level}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-2">
                      <span className="text-slate-400">Poin XP:</span>
                      <span className="text-indigo-300">{selectedPlayer.xp} XP / {selectedPlayer.level * 100} XP</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-2">
                      <span className="text-slate-400">Tabungan Koin:</span>
                      <span className="text-amber-400 font-black">💰 {selectedPlayer.coins} Koin</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-2">
                      <span className="text-slate-400">Nyawa / Hearts:</span>
                      <span className="text-rose-400">❤️ {selectedPlayer.lives} / 5 Nyawa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Terakhir Online:</span>
                      <span className="text-slate-300">{new Date(selectedPlayer.lastPlayed).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Level Selesai */}
                  <div className="space-y-2">
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider block">
                      Misi yang Sudah Selesai:
                    </span>
                    <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/40 max-h-32 overflow-y-auto space-y-2 text-xs">
                      {Object.keys(selectedPlayer.completedLevels).length === 0 ? (
                        <p className="text-slate-500 font-bold italic text-center py-2">Belum ada misi diselesaikan</p>
                      ) : (
                        Object.entries(selectedPlayer.completedLevels).map(([worldId, levels]) => {
                          const levelList = levels as number[];
                          return (
                            <div key={worldId} className="flex justify-between items-center bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/30">
                              <span className="text-indigo-300 font-bold">Dunia {worldId}</span>
                              <span className="text-slate-300 font-black">Level: {levelList.join(', ')} ({levelList.length} level)</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

                {/* Bagian Kanan: Modifikasi Nilai / Hadiah dari Guru */}
                <div className="space-y-4">
                  <h4 className="text-slate-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Hadiah / Penyesuaian Status
                  </h4>

                  <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/60 space-y-4">
                    
                    {/* Atur Koin */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Hadiah/Kurangi Koin:</span>
                        <span className={`text-xs ${adjustCoins > 0 ? 'text-emerald-400' : adjustCoins < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {adjustCoins > 0 ? `+${adjustCoins}` : adjustCoins}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button onClick={() => setAdjustCoins(prev => prev - 10)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">-10</button>
                        <button onClick={() => setAdjustCoins(prev => prev - 5)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">-5</button>
                        <button onClick={() => setAdjustCoins(0)} className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-xs font-black flex-1 text-center cursor-pointer">Reset</button>
                        <button onClick={() => setAdjustCoins(prev => prev + 5)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">+5</button>
                        <button onClick={() => setAdjustCoins(prev => prev + 10)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">+10</button>
                      </div>
                    </div>

                    {/* Atur XP */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Tambahkan/Atur Poin XP:</span>
                        <span className={`text-xs ${adjustXp > 0 ? 'text-emerald-400' : adjustXp < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {adjustXp > 0 ? `+${adjustXp}` : adjustXp}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button onClick={() => setAdjustXp(prev => prev - 50)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">-50</button>
                        <button onClick={() => setAdjustXp(prev => prev - 10)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">-10</button>
                        <button onClick={() => setAdjustXp(0)} className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-xs font-black flex-1 text-center cursor-pointer">Reset</button>
                        <button onClick={() => setAdjustXp(prev => prev + 10)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">+10</button>
                        <button onClick={() => setAdjustXp(prev => prev + 50)} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-black cursor-pointer">+50</button>
                      </div>
                    </div>

                    {/* Atur Nyawa */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Tambahkan/Kurangi Nyawa:</span>
                        <span className={`text-xs ${adjustLives > 0 ? 'text-emerald-400' : adjustLives < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {adjustLives > 0 ? `+${adjustLives}` : adjustLives}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button onClick={() => setAdjustLives(prev => prev - 1)} className="bg-slate-900 border border-slate-800 rounded px-4 py-1 text-xs font-black cursor-pointer">-1</button>
                        <button onClick={() => setAdjustLives(0)} className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-xs font-black flex-1 text-center cursor-pointer">Reset</button>
                        <button onClick={() => setAdjustLives(prev => prev + 1)} className="bg-slate-900 border border-slate-800 rounded px-4 py-1 text-xs font-black cursor-pointer">+1</button>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveAdjustments}
                      className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:brightness-110 border-b-4 border-indigo-800 text-white font-black text-xs py-3 px-4 rounded-xl shadow-md uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Simpan Perubahan Siswa</span>
                    </button>

                  </div>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border-2 border-rose-500/30 rounded-2xl max-w-sm w-full p-6 space-y-6 text-center"
            >
              <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 mx-auto text-2xl animate-pulse">
                <AlertTriangle className="w-7 h-7" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-black text-base uppercase tracking-wider">Hapus Siswa ini?</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  Apakah Anda yakin ingin menghapus data petualangan siswa ini? Tindakan ini permanen dan tidak dapat dibatalkan di cloud Firestore.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { sound.playClick(); setShowDeleteConfirm(null); }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-xs font-black text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeletePlayer(showDeleteConfirm)}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white border-b-4 border-rose-800 rounded-xl py-2.5 text-xs font-black hover:shadow-lg hover:shadow-rose-500/20 transition-all cursor-pointer"
                >
                  Ya, Hapus Siswa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
