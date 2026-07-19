/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile } from '../types';
import { getAllPlayerProfiles } from '../firebase';
import { sound } from '../utils/audio';
import { 
  Trophy, ArrowLeft, School, GraduationCap, Globe, 
  Calendar, Zap, Star, ShieldAlert, Sparkles, User,
  Award, Medal, ArrowUp, Flame, RefreshCw
} from 'lucide-react';

interface LeaderboardScreenProps {
  profile: PlayerProfile;
  onBack: () => void;
}

// Interface for unified ranking row
interface LeaderboardRow {
  id: string;
  name: string;
  avatar: string;
  grade: number;
  school: string;
  level: number;
  score: number; // dynamically calculated based on time-frame filter
  isCurrentUser: boolean;
}

// Get standard date keys
export function getDateKeys(timestamp: number = Date.now()) {
  const d = new Date(timestamp);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  const dayKey = `${year}-${month}-${date}`;
  
  const monthKey = `${year}-${month}`;
  
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  const weekKey = `${year}-W${String(weekNum).padStart(2, '0')}`;
  
  return { dayKey, weekKey, monthKey };
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ profile, onBack }) => {
  const [dbUsers, setDbUsers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  // 1. Scope: 'global' | 'school' | 'class'
  const [scope, setScope] = useState<'global' | 'school' | 'class'>('global');
  // 2. Time Range: 'daily' | 'weekly' | 'monthly' | 'all-time'
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time');

  // Trigger loading players from Firestore
  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      const users = await getAllPlayerProfiles();
      setDbUsers(users);
    } catch (e) {
      console.error('Gagal mengambil data klasemen:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  // Helper for avatar emoji
  const getAvatarEmoji = (avKey: string): string => {
    switch (avKey) {
      case 'niko': return '👨‍🚀';
      case 'rumi': return '🤖';
      case 'sora': return '👩‍🌾';
      case 'kiko': return '🐼';
      default: return '🎒';
    }
  };

  // Generate simulated fallback players so the leaderboard is incredibly detailed & competitive
  const getSimulatedPlayers = (): PlayerProfile[] => {
    const playerSchool = profile.school || 'SD Negeri 01 Merdeka';
    const playerGrade = profile.grade;
    const { dayKey, weekKey, monthKey } = getDateKeys();

    const baseBots = [
      { id: 'bot_1', name: 'Astro Niko', school: 'SD Negeri 01 Merdeka', grade: 4, avatar: 'niko', xp: 2450, level: 24, daily: 80, weekly: 340, monthly: 1200 },
      { id: 'bot_2', name: 'Sora Kelana', school: 'SD Swasta Cendekia', grade: 3, avatar: 'sora', xp: 2120, level: 21, daily: 55, weekly: 280, monthly: 980 },
      { id: 'bot_3', name: 'Rumi Bot', school: 'SD Negeri 02 Jaya', grade: 5, avatar: 'rumi', xp: 1980, level: 19, daily: 90, weekly: 410, monthly: 1100 },
      { id: 'bot_4', name: 'Kiko Panda', school: 'SD Al-Azhar 3', grade: 2, avatar: 'kiko', xp: 1850, level: 18, daily: 40, weekly: 190, monthly: 750 },
      { id: 'bot_5', name: 'Clarissa Putri', school: 'SD Swasta Cendekia', grade: 1, avatar: 'sora', xp: 1540, level: 15, daily: 30, weekly: 150, monthly: 600 },
      { id: 'bot_6', name: 'Budi Hartono', school: 'SD Negeri 01 Merdeka', grade: 6, avatar: 'niko', xp: 1420, level: 14, daily: 70, weekly: 290, monthly: 850 },
      { id: 'bot_7', name: 'Siti Rahma', school: 'SD Negeri 02 Jaya', grade: 3, avatar: 'sora', xp: 1310, level: 13, daily: 45, weekly: 210, monthly: 640 },
      { id: 'bot_8', name: 'Doni Kusuma', school: 'SD Swasta Cendekia', grade: 2, avatar: 'rumi', xp: 1200, level: 12, daily: 25, weekly: 130, monthly: 510 },
      { id: 'bot_9', name: 'Gisela Indah', school: 'SD Al-Azhar 3', grade: 5, avatar: 'sora', xp: 1050, level: 10, daily: 15, weekly: 90, monthly: 420 },
      { id: 'bot_10', name: 'Rian Maulana', school: 'SD Swasta Pratama', grade: 6, avatar: 'kiko', xp: 950, level: 9, daily: 10, weekly: 80, monthly: 390 }
    ];

    // Ensure we also inject competitors from the CURRENT user's exact school and class if they aren't in base bots
    const customSchoolBots = [
      { id: 'bot_sch_1', name: 'Rafi Ramadhan', school: playerSchool, grade: playerGrade, avatar: 'niko', xp: 1650, level: 16, daily: 75, weekly: 320, monthly: 920 },
      { id: 'bot_sch_2', name: 'Naila Azzahra', school: playerSchool, grade: playerGrade === 1 ? 2 : playerGrade - 1, avatar: 'sora', xp: 1280, level: 12, daily: 50, weekly: 230, monthly: 710 },
      { id: 'bot_sch_3', name: 'Fatih Al-Fatih', school: playerSchool, grade: playerGrade === 6 ? 5 : playerGrade + 1, avatar: 'rumi', xp: 1150, level: 11, daily: 60, weekly: 250, monthly: 680 }
    ];

    const allBots = [...baseBots, ...customSchoolBots];

    // Convert bots into PlayerProfile type matching date structures
    return allBots.map(bot => ({
      id: bot.id,
      name: bot.name,
      grade: bot.grade,
      avatar: bot.avatar,
      xp: bot.xp,
      level: bot.level,
      coins: 100,
      lives: 5,
      lastLifeRegenTime: Date.now(),
      unlockedWorlds: [1],
      completedLevels: {},
      badges: [],
      lastPlayed: Date.now(),
      school: bot.school,
      dailyXpRecord: { [dayKey]: bot.daily },
      weeklyXpRecord: { [weekKey]: bot.weekly },
      monthlyXpRecord: { [monthKey]: bot.monthly }
    }));
  };

  // Compile active ranking row data based on filters
  const getLeaderboardRows = (): LeaderboardRow[] => {
    const { dayKey, weekKey, monthKey } = getDateKeys();
    
    // 1. Combine database users and simulated users, ensuring no duplicates by ID
    const simulated = getSimulatedPlayers();
    
    // Create a dictionary of all profiles
    const profileMap: { [id: string]: PlayerProfile } = {};
    
    // Put simulated first
    simulated.forEach(p => {
      profileMap[p.id] = p;
    });

    // Overwrite/add real users from database
    dbUsers.forEach(p => {
      profileMap[p.id] = p;
    });

    // Always ensure the active user profile is perfectly up-to-date and in the dictionary
    profileMap[profile.id] = profile;

    const allProfiles = Object.values(profileMap);

    // 2. Filter profiles based on Scope: 'global' | 'school' | 'class'
    const scopeFiltered = allProfiles.filter(p => {
      if (scope === 'school') {
        const userSchool = profile.school || 'SD Negeri 01 Merdeka';
        const targetSchool = p.school || 'SD Negeri 01 Merdeka';
        return targetSchool.toLowerCase().trim() === userSchool.toLowerCase().trim();
      }
      if (scope === 'class') {
        return p.grade === profile.grade;
      }
      return true; // global
    });

    // 3. Map into LeaderboardRow, extracting appropriate scores based on Time Range
    const rows: LeaderboardRow[] = scopeFiltered.map(p => {
      let scoreVal = 0;
      
      if (timeRange === 'daily') {
        scoreVal = p.dailyXpRecord?.[dayKey] || 0;
      } else if (timeRange === 'weekly') {
        scoreVal = p.weeklyXpRecord?.[weekKey] || 0;
      } else if (timeRange === 'monthly') {
        scoreVal = p.monthlyXpRecord?.[monthKey] || 0;
      } else {
        // all-time
        scoreVal = p.xp + (p.level - 1) * 100; // Calculate cumulative absolute score based on level and current XP progress
      }

      return {
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        grade: p.grade,
        school: p.school || 'Belum Diatur',
        level: p.level,
        score: scoreVal,
        isCurrentUser: p.id === profile.id
      };
    });

    // 4. Sort rows by score descending, with level/name as secondary tie-breakers
    rows.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.level - a.level;
    });

    return rows;
  };

  const rows = getLeaderboardRows();

  // Find active player's exact rank
  const myRankIdx = rows.findIndex(r => r.isCurrentUser);
  const myRank = myRankIdx !== -1 ? myRankIdx + 1 : null;
  const myScore = myRankIdx !== -1 ? rows[myRankIdx].score : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="p-3 bg-white hover:bg-slate-50 border-3 border-slate-100 hover:border-slate-200 text-slate-700 rounded-2xl shadow-sm transition-all hover:-translate-x-1 cursor-pointer"
            title="Kembali ke Lobby"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500 fill-amber-100 animate-bounce" />
              Klasemen Pahlawan
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
              Pantau peringkat petualangan belajarmu di sekolah, kelas, maupun secara nasional!
            </p>
          </div>
        </div>

        <button
          onClick={() => { sound.playClick(); loadLeaderboardData(); }}
          className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 font-extrabold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Muat Ulang Klasemen</span>
        </button>
      </div>

      {/* User Current Standing Banner Card */}
      {profile && (
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 border-4 border-violet-400 rounded-3xl p-5 mb-8 text-white relative overflow-hidden shadow-md">
          {/* Decorative Sparkles background */}
          <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl select-none">🏆</div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 border-2 border-white/40 rounded-full flex items-center justify-center text-4xl shadow-sm">
                {getAvatarEmoji(profile.avatar)}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                  Peringkat Kamu
                </span>
                <h2 className="text-lg font-black mt-1 flex items-center gap-1.5">
                  {profile.name}
                  <span className="text-amber-300 font-bold text-xs bg-black/30 px-2 py-0.5 rounded-md border border-amber-500/20">
                    LVL {profile.level}
                  </span>
                </h2>
                <p className="text-xs text-indigo-100 mt-0.5 font-medium flex items-center gap-1">
                  <School className="w-3.5 h-3.5 shrink-0 text-indigo-200" />
                  {profile.school || 'Belum Mengatur Nama Sekolah (Atur di Profil)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-black/20 px-6 py-3 rounded-2xl border border-white/10 w-full md:w-auto justify-around md:justify-end">
              <div className="text-center">
                <p className="text-[10px] font-extrabold text-indigo-200 uppercase">Peringkat</p>
                <p className="text-2xl font-black text-amber-300">
                  {myRank ? `#${myRank}` : 'Belum Masuk'}
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] font-extrabold text-indigo-200 uppercase">XP Sesi Ini</p>
                <p className="text-2xl font-black text-emerald-300 flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-emerald-400 text-emerald-400 shrink-0" />
                  {myScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER CONTROL PANEL */}
      <div className="bg-white border-4 border-slate-100 rounded-3xl p-5 mb-6 shadow-sm space-y-4">
        
        {/* Row 1: Scope Filters (Global, School, Class) */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Cakupan Wilayah / Peringkat
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => { sound.playClick(); setScope('global'); }}
              className={`py-3 px-4 rounded-xl border-2 font-black text-xs md:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                scope === 'global'
                  ? 'bg-amber-500 border-amber-600 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Nasional (Global)</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setScope('school'); }}
              className={`py-3 px-4 rounded-xl border-2 font-black text-xs md:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                scope === 'school'
                  ? 'bg-amber-500 border-amber-600 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Sekolah Saya</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setScope('class'); }}
              className={`py-3 px-4 rounded-xl border-2 font-black text-xs md:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                scope === 'class'
                  ? 'bg-amber-500 border-amber-600 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4.5 h-4.5" />
              <span>Kelas {profile.grade} Saya</span>
            </button>
          </div>
        </div>

        {/* Row 2: Time Frame Filters (Daily, Weekly, Monthly, All-time) */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Rentang Waktu Akumulasi XP
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => { sound.playClick(); setTimeRange('daily'); }}
              className={`py-2 px-3 rounded-lg border font-extrabold text-xs transition-all cursor-pointer ${
                timeRange === 'daily'
                  ? 'bg-violet-600 border-violet-700 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 inline mr-1.5 text-amber-400 animate-pulse" />
              Harian (Hari Ini)
            </button>

            <button
              onClick={() => { sound.playClick(); setTimeRange('weekly'); }}
              className={`py-2 px-3 rounded-lg border font-extrabold text-xs transition-all cursor-pointer ${
                timeRange === 'weekly'
                  ? 'bg-violet-600 border-violet-700 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-sky-400" />
              Mingguan (Minggu Ini)
            </button>

            <button
              onClick={() => { sound.playClick(); setTimeRange('monthly'); }}
              className={`py-2 px-3 rounded-lg border font-extrabold text-xs transition-all cursor-pointer ${
                timeRange === 'monthly'
                  ? 'bg-violet-600 border-violet-700 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 inline mr-1.5 text-yellow-400" />
              Bulanan (Bulan Ini)
            </button>

            <button
              onClick={() => { sound.playClick(); setTimeRange('all-time'); }}
              className={`py-2 px-3 rounded-lg border font-extrabold text-xs transition-all cursor-pointer ${
                timeRange === 'all-time'
                  ? 'bg-violet-600 border-violet-700 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
              Total Akumulasi
            </button>
          </div>
        </div>

      </div>

      {/* LEADERBOARD TABLE / ROWS */}
      {loading ? (
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-12 text-center">
          <RefreshCw className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
          <h4 className="text-slate-700 font-black uppercase tracking-wide text-sm">Menghubungkan ke Klasemen Pusat...</h4>
          <p className="text-slate-400 text-xs font-semibold mt-1">Harap tunggu sebentar selagi kami menyinkronkan data pahlawan.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="text-5xl mb-4">🏫</div>
          <h4 className="text-slate-700 font-black uppercase tracking-wide">Pemain Belum Ditemukan</h4>
          <p className="text-slate-400 text-xs font-semibold mt-1.5 leading-relaxed">
            Belum ada pahlawan terdaftar yang memenuhi kriteria filter ini. {scope === 'school' && "Tambahkan nama sekolah di halaman Pengaturan Profil kamu untuk mulai merekrut rekan sekolah!"}
          </p>
        </div>
      ) : (
        <div className="bg-white border-4 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Table Header Row */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-3.5 grid grid-cols-12 gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <div className="col-span-2 text-center">Peringkat</div>
            <div className="col-span-7 sm:col-span-6">Nama & Sekolah Pahlawan</div>
            <div className="hidden sm:block col-span-2 text-center">Kelas</div>
            <div className="col-span-3 sm:col-span-2 text-right">Skor XP</div>
          </div>

          {/* Table Body Rows */}
          <div className="divide-y divide-slate-50">
            {rows.map((row, index) => {
              const rank = index + 1;
              
              // Formatting Rank visuals
              let rankElement = (
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center mx-auto">
                  {rank}
                </span>
              );

              if (rank === 1) {
                rankElement = (
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 border-2 border-amber-400 font-black text-sm flex items-center justify-center mx-auto shadow-sm relative" title="Juara 1 Emas">
                    🥇
                  </span>
                );
              } else if (rank === 2) {
                rankElement = (
                  <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 border-2 border-slate-300 font-black text-sm flex items-center justify-center mx-auto shadow-sm relative" title="Juara 2 Perak">
                    🥈
                  </span>
                );
              } else if (rank === 3) {
                rankElement = (
                  <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-700 border-2 border-orange-300 font-black text-sm flex items-center justify-center mx-auto shadow-sm relative" title="Juara 3 Perunggu">
                    🥉
                  </span>
                );
              }

              return (
                <div 
                  key={row.id}
                  className={`px-6 py-4 grid grid-cols-12 gap-2 items-center transition-all ${
                    row.isCurrentUser 
                      ? 'bg-blue-50/70 border-y-2 border-blue-400/30' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Rank Col */}
                  <div className="col-span-2 text-center font-black">
                    {rankElement}
                  </div>

                  {/* Player Profile Info Col */}
                  <div className="col-span-7 sm:col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-2xl border-2 border-slate-200 shadow-sm shrink-0">
                      {getAvatarEmoji(row.avatar)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-xs md:text-sm text-slate-800 flex items-center gap-1 flex-wrap">
                        <span className="truncate max-w-[150px]">{row.name}</span>
                        {row.isCurrentUser && (
                          <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                            Kamu
                          </span>
                        )}
                        <span className="text-[10px] bg-slate-100 border text-slate-500 font-semibold px-1.5 rounded">
                          LVL {row.level}
                        </span>
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-0.5 font-semibold">
                        <School className="w-3 h-3 shrink-0 text-slate-300" />
                        {row.school}
                      </p>
                    </div>
                  </div>

                  {/* Grade/Class Col */}
                  <div className="hidden sm:block col-span-2 text-center">
                    <span className="bg-violet-50 border border-violet-100 text-violet-800 text-[10px] font-black px-2.5 py-1 rounded-lg">
                      Kelas {row.grade}
                    </span>
                  </div>

                  {/* Score XP Col */}
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <span className="text-xs md:text-sm font-black text-slate-800 flex items-center justify-end gap-1 font-mono">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-300 shrink-0" />
                      {row.score}
                    </span>
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                      XP
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
