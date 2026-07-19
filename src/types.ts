/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlayerProfile {
  id: string;
  name: string;
  grade: number; // 1 to 6
  avatar: string; // avatar ID or key
  xp: number;
  level: number;
  coins: number;
  lives: number; // 1 to 5
  lastLifeRegenTime: number; // epoch timestamp
  unlockedWorlds: number[]; // e.g. [1, 2]
  completedLevels: { [worldId: number]: number[] }; // e.g. { 1: [1, 2] } represents World 1 levels completed
  levelStars?: { [worldLevelKey: string]: number }; // e.g. { "1-1": 3 } represents Star rating per level
  highScores?: { [worldLevelKey: string]: number }; // e.g. { "1-1": 120 } represents High Score per level
  badges: string[]; // unlocked badge IDs
  lastPlayed: number;
  school?: string; // School name (Sekolah)
  dailyXpRecord?: { [dayKey: string]: number }; // e.g. { "2026-07-19": 150 }
  weeklyXpRecord?: { [weekKey: string]: number }; // e.g. { "2026-W29": 450 }
  monthlyXpRecord?: { [monthKey: string]: number }; // e.g. { "2026-07": 1200 }
  competencyMastery?: { [competencyName: string]: 'Belum Belajar' | 'Sedang Belajar' | 'Mulai Menguasai' | 'Menguasai' | 'Mahir' };
  answeredQuestionIds?: string[]; // list of completed question ids to prevent repeating
}

export type QuestionType = 'multiple-choice' | 'text-input' | 'sorting' | 'grid-puzzle' | 'true-false';

export interface Question {
  id: string;
  grade: number; // 1 to 6
  worldId: number; // 1 to 8, or 9 for Final Boss
  levelId: number; // 1 to 5
  text: string;
  type: QuestionType;
  options?: string[]; // For multiple choice
  answer: string | string[]; // Correct answer(s)
  explanation: string;
  hint: string;
  points: number;
  isHots?: boolean;
  isComputationalThinking?: boolean;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  gridData?: any; 
  fase?: 'A' | 'B' | 'C'; // Fase A: Kelas 1-2, Fase B: Kelas 3-4, Fase C: Kelas 5-6
  competency?: string; // e.g., "Operasi Hitung", "Geometri", "Aljabar", etc.
  subCompetence?: string; // e.g., "Penjumlahan Cacah", "Pola Geometri", etc.
  difficulty?: 'mudah' | 'sedang' | 'sulit';
}

export interface World {
  id: number;
  name: string;
  description: string;
  themeColor: string; // Tailwind class color
  bgGradient: string; // Tailwind gradient class
  textColor: string;
  icon: string; // Lucide icon name
  minGrade: number;
  storyIntroduction: string;
  levelsCount: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface GameState {
  currentView: 'auth' | 'lobby' | 'map' | 'world-select' | 'gameplay' | 'profile' | 'badges' | 'final-boss' | 'victory-screen' | 'question-bank' | 'leaderboard' | 'admin';
  activeWorldId: number | null;
  activeLevelId: number | null;
  activeQuestions: Question[];
  currentQuestionIndex: number;
  selectedOption: string | null;
  textAnswer: string;
  sortingItems: string[];
  livesLeft: number;
  score: number;
  streak: number;
  showExplanation: boolean;
  isCorrect: boolean | null;
  coinsEarned: number;
  xpEarned: number;
}
