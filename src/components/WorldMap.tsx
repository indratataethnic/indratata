/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { World, PlayerProfile } from '../types';
import { WORLDS } from '../questions';
import { 
  Lock, CheckCircle2, Play, ArrowLeft, Star, Trees, 
  Compass, Pizza, Ruler, Box, BarChart3, Cpu, Crown, Sparkles, Trophy 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface WorldMapProps {
  profile: PlayerProfile;
  onSelectLevel: (worldId: number, levelId: number) => void;
  onEnterBossBattle: () => void;
}

// Icon mapping helper
const getWorldIcon = (iconName: string) => {
  const props = { className: "w-8 h-8 text-white" };
  switch (iconName) {
    case 'Trees': return <Trees {...props} />;
    case 'Compass': return <Compass {...props} />;
    case 'Pizza': return <Pizza {...props} />;
    case 'Ruler': return <Ruler {...props} />;
    case 'Box': return <Box {...props} />;
    case 'BarChart3': return <BarChart3 {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'Crown': return <Crown {...props} />;
    default: return <Compass {...props} />;
  }
};

export const WorldMap: React.FC<WorldMapProps> = ({ profile, onSelectLevel, onEnterBossBattle }) => {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);

  // Helper to check if a world is unlocked
  const isWorldUnlocked = (world: World) => {
    // Grade 1-2 can access Worlds 1, 2, 7, 8
    // Grade 3-4 can access Worlds 1, 2, 3, 4, 7, 8
    // Grade 5-6 can access all Worlds
    if (profile.grade >= world.minGrade) return true;
    
    // Or if unlocked manually
    return profile.unlockedWorlds.includes(world.id);
  };

  // Check how many levels are completed in a world
  const getCompletedLevelsInWorld = (worldId: number) => {
    return profile.completedLevels[worldId]?.length || 0;
  };

  // Calculate total levels completed across all worlds
  const totalLevelsCompleted = (Object.values(profile.completedLevels) as number[][]).reduce(
    (acc, val) => acc + (val?.length || 0), 0
  );

  // Boss unlocks after completing at least 4 levels
  const isBossUnlocked = totalLevelsCompleted >= 4 || profile.level >= 5;

  const handleWorldClick = (world: World) => {
    sound.playClick();
    if (isWorldUnlocked(world)) {
      setSelectedWorld(world);
    } else {
      sound.playWrong();
    }
  };

  const handleBack = () => {
    sound.playClick();
    setSelectedWorld(null);
  };

  const handleLevelClick = (levelId: number) => {
    if (!selectedWorld) return;
    
    // Check if level is unlocked: level 1 is always unlocked, 
    // higher levels unlocked if previous level is completed
    const completedList = profile.completedLevels[selectedWorld.id] || [];
    const isLevelUnlocked = levelId === 1 || completedList.includes(levelId - 1);

    if (isLevelUnlocked) {
      sound.playClick();
      onSelectLevel(selectedWorld.id, levelId);
    } else {
      sound.playWrong();
    }
  };

  const handleBossClick = () => {
    if (isBossUnlocked) {
      sound.playLevelUp();
      onEnterBossBattle();
    } else {
      sound.playWrong();
    }
  };

  // Render Levels view for selected World
  if (selectedWorld) {
    const completedList = profile.completedLevels[selectedWorld.id] || [];
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button and World Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            id="back-to-map-btn"
            onClick={handleBack}
            className="self-start flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2.5 rounded-2xl border-2 border-slate-300 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" /> Kembalilah ke Peta
          </button>
          
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedWorld.bgGradient} shadow-md`}>
              {getWorldIcon(selectedWorld.icon)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{selectedWorld.name}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fase Kelas {selectedWorld.minGrade}+</p>
            </div>
          </div>
        </div>

        {/* Story Intro Card */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border-3 border-violet-200 rounded-3xl p-6 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-2 right-2 text-violet-200 text-6xl select-none font-bold">📜</div>
          <h3 className="font-extrabold text-violet-800 mb-2 text-base md:text-lg flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />
            Misi Petualanganmu:
          </h3>
          <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed relative z-10">
            "{selectedWorld.storyIntroduction}"
          </p>
        </div>

        {/* Levels Path Map Layout */}
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-8 shadow-sm relative min-h-[400px] flex flex-col justify-center items-center">
          
          {/* Background winding dotted path line */}
          <div className="absolute w-1.5 bg-dashed border-l-4 border-dashed border-slate-300 h-3/4 left-1/2 -translate-x-1/2 top-[12%] z-0 hidden md:block" />

          <div className="relative z-10 flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-8 md:gap-16 w-full max-w-2xl">
            {Array.from({ length: selectedWorld.levelsCount }).map((_, index) => {
              const levelId = index + 1;
              const isCompleted = completedList.includes(levelId);
              const isUnlocked = levelId === 1 || completedList.includes(levelId - 1);
              
              // Alternating coordinates for cute zigzag look on desktop
              const zigzagClass = index % 2 === 0 ? 'md:translate-x-8' : 'md:-translate-x-8';

              return (
                <div 
                  key={levelId}
                  className={`flex flex-col items-center ${zigzagClass} transition-all duration-300`}
                >
                  <button
                    id={`level-node-btn-${levelId}`}
                    onClick={() => handleLevelClick(levelId)}
                    disabled={!isUnlocked}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex flex-col items-center justify-center font-black text-xl transition-all shadow-md relative group cursor-pointer ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300 hover:scale-110 shadow-[0_4px_12px_rgba(16,185,129,0.4)]'
                        : isUnlocked
                          ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white border-violet-400 hover:scale-110 shadow-[0_4px_12px_rgba(99,102,241,0.4)]'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {/* Badge or Icon Status */}
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" />
                      ) : !isUnlocked ? (
                        <Lock className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Star className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" />
                      )}
                    </div>

                    <span className="text-[10px] tracking-wider opacity-80 uppercase font-black">Misi</span>
                    <span className="text-2xl md:text-3xl font-black">{levelId}</span>
                  </button>
                  
                  <span className="text-xs md:text-sm font-extrabold text-slate-600 mt-2">
                    {isCompleted ? 'Selesai!' : isUnlocked ? 'Mulai Misi' : 'Terkunci'}
                  </span>

                  {/* Render golden star ratings for completed missions */}
                  {isCompleted && (
                    <div className="flex gap-0.5 justify-center mt-1">
                      {Array.from({ length: 3 }).map((_, sIdx) => {
                        const starKey = `${selectedWorld.id}-${levelId}`;
                        const starsEarned = profile.levelStars?.[starKey] || 0;
                        const hasStar = sIdx < starsEarned;
                        return (
                          <Star 
                            key={sIdx} 
                            className={`w-3.5 h-3.5 ${hasStar ? 'text-amber-400 fill-amber-300' : 'text-slate-200'}`} 
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Render Main World Map view
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Map Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">PETA PETUALANGAN NUMERAVERSE</h2>
        <p className="text-slate-500 font-bold mt-1.5 max-w-xl mx-auto text-sm md:text-base">
          Selesaikan misi berhitung di setiap dunia untuk menaikkan level, mengumpulkan koin, dan bersiap melawan Raja Distraktor!
        </p>
      </div>

      {/* Grid of Worlds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {WORLDS.map((world) => {
          const unlocked = isWorldUnlocked(world);
          const completedCount = getCompletedLevelsInWorld(world.id);
          const progressPercent = Math.round((completedCount / world.levelsCount) * 100);

          return (
            <button
              key={world.id}
              id={`world-card-${world.id}`}
              onClick={() => handleWorldClick(world)}
              className={`text-left rounded-3xl border-4 transition-all overflow-hidden flex flex-col justify-between h-72 cursor-pointer relative group ${
                unlocked 
                  ? 'bg-white border-slate-200 hover:border-violet-400 hover:scale-[1.03] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(99,102,241,0.15)]'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              {/* World Card Header background gradient */}
              <div className={`p-4 bg-gradient-to-br ${unlocked ? world.bgGradient : 'from-slate-400 to-slate-500'} relative h-28 flex flex-col justify-between overflow-hidden`}>
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-white/10 rounded-full" />
                
                {/* World Number & Lock Icon */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="bg-black/20 text-white font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Dunia {world.id}
                  </span>
                  {!unlocked && (
                    <span className="bg-red-500 text-white p-1 rounded-full border border-red-300">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-2">
                  {getWorldIcon(world.icon)}
                  <h3 className="font-black text-white text-xl leading-tight group-hover:scale-102 transition-transform">{world.name}</h3>
                </div>
              </div>

              {/* World Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <p className="text-slate-500 font-semibold text-xs leading-relaxed line-clamp-3">
                  {world.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {unlocked ? (
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>MISI SELESAI</span>
                        <span>{completedCount}/{world.levelsCount}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className={`h-full bg-gradient-to-r ${world.bgGradient} transition-all duration-500`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] font-black text-red-500 bg-red-50 py-1.5 px-3 rounded-xl border border-red-100 flex items-center gap-1">
                      ⚠️ Membutuhkan Kelas {world.minGrade}+
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* FINAL BOSS CASTLE AREA */}
      <div className="max-w-xl mx-auto">
        <button
          id="boss-battle-gate-btn"
          onClick={handleBossClick}
          className={`w-full text-center rounded-3xl border-4 p-6 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer ${
            isBossUnlocked
              ? 'bg-gradient-to-b from-indigo-950 to-slate-900 border-rose-500 hover:scale-[1.03] shadow-[0_12px_30px_rgba(239,68,68,0.25)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.4)] group'
              : 'bg-slate-100 border-slate-300 opacity-60'
          }`}
        >
          {/* Animated pulsing glow for boss */}
          {isBossUnlocked && (
            <div className="absolute inset-0 bg-rose-500/10 animate-pulse mix-blend-color-dodge pointer-events-none" />
          )}

          <div className="flex items-center justify-center mb-3">
            <span className="text-5xl md:text-6xl filter drop-shadow-[0_4px_10px_rgba(239,68,68,0.4)] animate-bounce" style={{ animationDuration: '3s' }}>
              😈
            </span>
          </div>

          <h3 className={`text-xl md:text-2xl font-black ${isBossUnlocked ? 'text-rose-400' : 'text-slate-500'}`}>
            ISTANA RAJA DISTRAKTOR
          </h3>
          
          <p className={`text-xs font-semibold max-w-sm mt-1.5 ${isBossUnlocked ? 'text-slate-300' : 'text-slate-400'}`}>
            {isBossUnlocked 
              ? 'Kalahkan Bos Akhir untuk menghentikan kekacauan numerasi dan menyelamatkan Numeraverse!' 
              : 'Pintu Gerbang terkunci! Selesaikan minimal 4 misi di dunia mana pun untuk membuka Istana.'
            }
          </p>

          <div className="mt-5 w-full">
            {isBossUnlocked ? (
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs md:text-sm font-black px-6 py-3 rounded-2xl border-b-4 border-red-800 hover:brightness-110 transition-all uppercase tracking-wider">
                ⚔️ Duel Bos Akhir sekarang!
              </span>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-slate-200 text-slate-500 text-xs font-black px-4 py-2 rounded-xl">
                <Lock className="w-4 h-4" /> Progress Misi Anda: {totalLevelsCompleted}/4
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
