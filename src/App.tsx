/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PlayerProfile, GameState } from './types';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { AdminScreen } from './components/AdminScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { WorldMap } from './components/WorldMap';
import { GameplayArea } from './components/GameplayArea';
import { BossBattle } from './components/BossBattle';
import { BadgesScreen } from './components/BadgesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BossVictory } from './components/BossVictory';
import { LevelFail } from './components/LevelFail';
import { QuestionBankScreen } from './components/QuestionBankScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { sound } from './utils/audio';
import { auth, getPlayerProfile, savePlayerProfile, trackAppView, trackGameplay } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { NumeraverseEngine } from './utils/gameEngine';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [currentView, setCurrentView] = useState<GameState['currentView']>('auth');
  const [activeWorldId, setActiveWorldId] = useState<number | null>(null);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Mencatat tayangan aplikasi (App Views) global sekali per sesi browser
  useEffect(() => {
    trackAppView().catch((err) => {
      console.warn('Gagal mencatat tayangan global:', err);
    });
  }, []);

  // Menyimpan data ke penyimpanan lokal dan menyinkronkan ke Firestore cloud secara non-blocking
  const saveProfile = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('numeraverse_player_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error('Gagal menyimpan profil lokal:', e);
    }

    // Melakukan sinkronisasi cloud secara aman di latar belakang
    savePlayerProfile(newProfile).catch((err) => {
      console.error('Gagal mencadangkan data profil ke Firestore cloud:', err);
    });
  };

  // Background heart regeneration tick
  useEffect(() => {
    if (!profile) return;
    
    // Jalankan pengecekan pertama kali saat profil termuat
    const { lives, lastLifeRegenTime, regeneratedCount } = NumeraverseEngine.regenerateLives(profile);
    if (regeneratedCount > 0) {
      saveProfile({
        ...profile,
        lives,
        lastLifeRegenTime
      });
    }

    // Lakukan pemantauan setiap 15 detik untuk meregenerasi nyawa secara real-time
    const interval = setInterval(() => {
      setProfile((current) => {
        if (!current) return current;
        const result = NumeraverseEngine.regenerateLives(current);
        if (result.regeneratedCount > 0) {
          const updated = {
            ...current,
            lives: result.lives,
            lastLifeRegenTime: result.lastLifeRegenTime
          };
          localStorage.setItem('numeraverse_player_profile', JSON.stringify(updated));
          savePlayerProfile(updated).catch(e => console.error(e));
          return updated;
        }
        return current;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [profile?.id, profile?.lives]);

  // Monitor status masuk/autentikasi Firebase Auth secara real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoadingAuth(true);
      if (user) {
        try {
          // Ambil profil terlengkap dari database cloud Firestore
          const cloudProfile = await getPlayerProfile(user.uid);
          if (cloudProfile) {
            setProfile(cloudProfile);
            localStorage.setItem('numeraverse_player_profile', JSON.stringify(cloudProfile));
            setCurrentView('lobby');
          } else {
            // Jika akun ada di Auth tetapi tidak ada profil di Firestore (biasanya backup lokal masih ada)
            const localStored = localStorage.getItem('numeraverse_player_profile');
            if (localStored) {
              const parsed = JSON.parse(localStored);
              if (parsed.id === user.uid) {
                setProfile(parsed);
                await savePlayerProfile(parsed); // Sinkronisasi kembali ke Firestore
                setCurrentView('lobby');
                setIsLoadingAuth(false);
                return;
              }
            }
            
            // Profil fallback aman jika data Firestore & Lokal benar-benar kosong
            const fallbackProfile: PlayerProfile = {
              id: user.uid,
              name: user.email?.split('@')[0] || 'KsatriaNumera',
              grade: 1,
              avatar: 'niko',
              xp: 0,
              level: 1,
              coins: 20,
              lives: 5,
              lastLifeRegenTime: Date.now(),
              unlockedWorlds: [1, 2, 7, 8],
              completedLevels: {},
              badges: [],
              lastPlayed: Date.now()
            };
            setProfile(fallbackProfile);
            await savePlayerProfile(fallbackProfile);
            localStorage.setItem('numeraverse_player_profile', JSON.stringify(fallbackProfile));
            setCurrentView('lobby');
          }
        } catch (e) {
          console.error('Gagal memuat profil pemain dari cloud:', e);
          // Fallback ke penyimpanan lokal jika koneksi bermasalah
          const localStored = localStorage.getItem('numeraverse_player_profile');
          if (localStored) {
            setProfile(JSON.parse(localStored));
            setCurrentView('lobby');
          } else {
            setCurrentView('auth');
          }
        }
      } else {
        // Pengguna tidak masuk atau telah keluar, hapus cache lokal
        setProfile(null);
        localStorage.removeItem('numeraverse_player_profile');
        setCurrentView('auth');
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. LOGIN / PROFILE CREATION DARI AUTH SCREEN (TERAUTHENTIKASI)
  const handleLogin = (userProfile: PlayerProfile) => {
    saveProfile(userProfile);
    setCurrentView('lobby');
  };

  // 2. PROFILE SETTINGS UPDATE
  const handleUpdateProfile = (name: string, grade: number, avatar: string, school?: string) => {
    if (!profile) return;
    
    // Sesuaikan dunia yang terbuka secara otomatis jika murid naik kelas
    const worlds = [...profile.unlockedWorlds];
    if (grade >= 3 && !worlds.includes(3)) worlds.push(3, 4);
    if (grade >= 5 && !worlds.includes(5)) worlds.push(5, 6);

    const updated: PlayerProfile = {
      ...profile,
      name,
      grade,
      avatar,
      school,
      unlockedWorlds: Array.from(new Set(worlds)),
      lastPlayed: Date.now()
    };
    saveProfile(updated);
  };

  // 3. LOGOUT / KELUAR DARI GAME
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('numeraverse_player_profile');
    } catch (e) {
      console.error('Gagal keluar dari sesi Firebase Auth:', e);
    }
    setProfile(null);
    setCurrentView('auth');
  };

  // 4. ENTER A MATH LEVEL
  const handleSelectLevel = (worldId: number, levelId: number) => {
    setActiveWorldId(worldId);
    setActiveLevelId(levelId);
    setCurrentView('gameplay');
    trackGameplay().catch((err) => {
      console.warn('Gagal mencatat gameplay global:', err);
    });
  };

  // 5. GAME LEVEL COMPLETED SUCCESS
  const handleLevelComplete = (
    earnedXp: number, 
    earnedCoins: number, 
    starsEarned: number, 
    scoreEarned: number,
    unlockedBadges: string[],
    newAnsweredIds?: string[]
  ) => {
    if (!profile || activeWorldId === null || activeLevelId === null) return;

    // Record completed level
    const currentCompleted = profile.completedLevels[activeWorldId] || [];
    const updatedCompletedWorld = Array.from(new Set([...currentCompleted, activeLevelId]));
    const updatedCompletedLevels = {
      ...profile.completedLevels,
      [activeWorldId]: updatedCompletedWorld
    };

    // Record stars per level
    const levelKey = `${activeWorldId}-${activeLevelId}`;
    const currentStars = profile.levelStars || {};
    const bestStars = Math.max(currentStars[levelKey] || 0, starsEarned);
    const updatedStars = {
      ...currentStars,
      [levelKey]: bestStars
    };

    // Record high scores per level
    const currentHighScores = profile.highScores || {};
    const bestHighScore = Math.max(currentHighScores[levelKey] || 0, scoreEarned);
    const updatedHighScores = {
      ...currentHighScores,
      [levelKey]: bestHighScore
    };

    // Calculate competency mastery updates (Mastery Learning)
    const competenciesMap: { [key: number]: string } = {
      1: "Operasi Bilangan Bulat",
      2: "Aljabar dan Pola",
      3: "Pecahan",
      4: "Pengukuran dan Geometri",
      5: "Geometri Bangun Ruang",
      6: "Analisis Data dan Peluang",
      7: "Berpikir Komputasional",
      8: "Penalaran Tingkat Tinggi"
    };

    const compName = competenciesMap[activeWorldId] || "Operasi Bilangan Bulat";
    const currentMasteryMap = profile.competencyMastery || {};
    const currentMastery = currentMasteryMap[compName] || "Belum Belajar";
    let newMastery: 'Belum Belajar' | 'Sedang Belajar' | 'Mulai Menguasai' | 'Menguasai' | 'Mahir' = currentMastery;

    if (starsEarned === 3) {
      if (currentMastery === "Belum Belajar" || currentMastery === "Sedang Belajar") {
        newMastery = "Mulai Menguasai";
      } else if (currentMastery === "Mulai Menguasai") {
        newMastery = "Menguasai";
      } else {
        newMastery = "Mahir";
      }
    } else if (starsEarned === 2) {
      if (currentMastery === "Belum Belajar") {
        newMastery = "Sedang Belajar";
      } else if (currentMastery === "Sedang Belajar") {
        newMastery = "Mulai Menguasai";
      } else if (currentMastery === "Mulai Menguasai" || currentMastery === "Menguasai") {
        newMastery = "Menguasai";
      }
    } else {
      if (currentMastery === "Belum Belajar") {
        newMastery = "Sedang Belajar";
      }
    }

    const updatedCompetencyMastery = {
      ...currentMasteryMap,
      [compName]: newMastery
    };

    // Update answered question IDs
    const currentAnswered = profile.answeredQuestionIds || [];
    const updatedAnsweredIds = Array.from(new Set([...currentAnswered, ...(newAnsweredIds || [])]));

    // Calculate XP and level-up mechanics
    let newXp = profile.xp + earnedXp;
    let newLevel = profile.level;
    let xpNeeded = newLevel * 100;

    while (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel += 1;
      xpNeeded = newLevel * 100;
    }

    const newCoins = profile.coins + earnedCoins;

    // Merge unlocked badges
    const updatedBadges = Array.from(new Set([...profile.badges, ...unlockedBadges]));

    // Record daily, weekly, and monthly XP records
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const dayKey = `${year}-${month}-${date}`;
    const monthKey = `${year}-${month}`;
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    const weekKey = `${year}-W${String(weekNum).padStart(2, '0')}`;

    const currentDaily = profile.dailyXpRecord || {};
    const currentWeekly = profile.weeklyXpRecord || {};
    const currentMonthly = profile.monthlyXpRecord || {};

    const updatedDaily = {
      ...currentDaily,
      [dayKey]: (currentDaily[dayKey] || 0) + earnedXp
    };
    const updatedWeekly = {
      ...currentWeekly,
      [weekKey]: (currentWeekly[weekKey] || 0) + earnedXp
    };
    const updatedMonthly = {
      ...currentMonthly,
      [monthKey]: (currentMonthly[monthKey] || 0) + earnedXp
    };

    const updatedProfile: PlayerProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
      coins: newCoins,
      completedLevels: updatedCompletedLevels,
      levelStars: updatedStars,
      highScores: updatedHighScores,
      badges: updatedBadges,
      dailyXpRecord: updatedDaily,
      weeklyXpRecord: updatedWeekly,
      monthlyXpRecord: updatedMonthly,
      competencyMastery: updatedCompetencyMastery,
      answeredQuestionIds: updatedAnsweredIds,
      lastPlayed: Date.now()
    };

    saveProfile(updatedProfile);
    setCurrentView('map'); // Back to World Map to see progress
  };

  // 6. GAME LEVEL FAILED (OUT OF HEART LIVES)
  const handleLevelFail = () => {
    if (profile) {
      const updatedProfile: PlayerProfile = {
        ...profile,
        lives: Math.max(0, profile.lives - 1),
        lastLifeRegenTime: profile.lives === 5 ? Date.now() : profile.lastLifeRegenTime
      };
      saveProfile(updatedProfile);
    }
    setCurrentView('world-select');
  };

  const handleRetryLevel = () => {
    // Reset back to gameplay
    setCurrentView('gameplay');
  };

  // 7. EPIC FINAL BOSS DEFEATED
  const handleBossVictory = () => {
    if (!profile) return;
    
    const badges = [...profile.badges];
    if (!badges.includes('boss_slayer')) {
      badges.push('boss_slayer');
    }

    const updatedProfile: PlayerProfile = {
      ...profile,
      coins: profile.coins + 100, // Large final prize
      badges,
      lastPlayed: Date.now()
    };

    saveProfile(updatedProfile);
    setCurrentView('victory-screen');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-6 max-w-sm">
          {/* 8-Bit Pixel Loader */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-xl border-4 border-violet-500/30 animate-pulse" />
            <div className="absolute inset-2 rounded-lg border-4 border-t-violet-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-4 rounded bg-indigo-500/20 flex items-center justify-center">
              <span className="text-yellow-400 animate-bounce">✨</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white uppercase tracking-widest animate-pulse">
              Memuat Dunia...
            </h3>
            <p className="text-violet-300 text-xs font-semibold leading-relaxed">
              Menghubungkan ke server cloud Numeraverse. Menyiapkan tantangan matematika seru untukmu!
            </p>
          </div>
          
          {/* Quick Tip Card */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 text-left">
            <div className="text-amber-400 font-extrabold text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              💡 Tips Pahlawan:
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed font-medium">
              Tahukah kamu? Menyelesaikan misi di Numeraverse akan memberikanmu Koin Emas yang bisa digunakan untuk memulihkan nyawa!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Top Navbar HUD (Only visible when logged in) */}
      {profile && currentView !== 'auth' && (
        <Navbar 
          profile={profile} 
          onNavigate={(view) => setCurrentView(view)} 
          onLogout={handleLogout}
          activeView={currentView}
        />
      )}

      {/* Primary Content Router */}
      <main className="flex-1">
        {currentView === 'auth' && (
          <AuthScreen onLogin={handleLogin} onAdminLogin={() => setCurrentView('admin')} />
        )}

        {currentView === 'admin' && (
          <AdminScreen onBack={() => setCurrentView('auth')} />
        )}

        {currentView === 'lobby' && profile && (
          <LobbyScreen 
            profile={profile} 
            onNavigate={(view) => setCurrentView(view)} 
          />
        )}

        {currentView === 'map' && profile && (
          <WorldMap 
            profile={profile}
            onSelectLevel={handleSelectLevel}
            onEnterBossBattle={() => {
              setCurrentView('final-boss');
              trackGameplay().catch((err) => {
                console.warn('Gagal mencatat gameplay global:', err);
              });
            }}
          />
        )}

        {currentView === 'gameplay' && profile && activeWorldId !== null && activeLevelId !== null && (
          <GameplayArea
            profile={profile}
            worldId={activeWorldId}
            levelId={activeLevelId}
            onLevelComplete={handleLevelComplete}
            onLevelFail={handleLevelFail}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'final-boss' && profile && (
          <BossBattle
            profile={profile}
            onVictory={handleBossVictory}
            onDefeat={handleLevelFail}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'badges' && profile && (
          <BadgesScreen
            profile={profile}
            onBack={() => setCurrentView('lobby')}
          />
        )}

        {currentView === 'question-bank' && profile && (
          <QuestionBankScreen
            profile={profile}
            onBack={() => setCurrentView('lobby')}
          />
        )}

        {currentView === 'leaderboard' && profile && (
          <LeaderboardScreen
            profile={profile}
            onBack={() => setCurrentView('lobby')}
          />
        )}

        {currentView === 'profile' && profile && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setCurrentView('lobby')}
          />
        )}

        {currentView === 'victory-screen' && profile && (
          <BossVictory
            profile={profile}
            onBackToLobby={() => setCurrentView('lobby')}
          />
        )}

        {/* 'world-select' is mapped to represent Level Fail state */}
        {currentView === 'world-select' && profile && (
          <LevelFail
            profile={profile}
            onRetry={handleRetryLevel}
            onBackToMap={() => setCurrentView('map')}
          />
        )}
      </main>
    </div>
  );
}
