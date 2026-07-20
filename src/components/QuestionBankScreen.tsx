/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Question, World, PlayerProfile } from '../types';
import { QUESTION_BANK, WORLDS } from '../questions';
import { sound } from '../utils/audio';
import { addQuestionToSheets, getQuestionsFromSheets } from '../utils/sheets';
import { 
  Search, ArrowLeft, Filter, Sparkles, BookOpen, 
  HelpCircle, Video, Volume2, Image as ImageIcon, 
  Plus, Eye, EyeOff, CheckCircle, XCircle, 
  Layers, Film, Check, ExternalLink, RefreshCw,
  Trophy, GraduationCap, Cpu, Play
} from 'lucide-react';

interface QuestionBankScreenProps {
  profile: PlayerProfile;
  onBack: () => void;
}

export const QuestionBankScreen: React.FC<QuestionBankScreenProps> = ({ profile, onBack }) => {
  // State for all questions (combining default bank + user's custom added questions)
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Active filters
  const [filterPhase, setFilterPhase] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [filterGrade, setFilterGrade] = useState<number | 'ALL'>('ALL');
  const [filterWorld, setFilterWorld] = useState<number | 'ALL'>('ALL');
  const [filterLevel, setFilterLevel] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // UI state per question cards
  const [openHintId, setOpenHintId] = useState<string | null>(null);
  const [openExplanationId, setOpenExplanationId] = useState<string | null>(null);
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);
  const [testedAnswers, setTestedAnswers] = useState<{ [qId: string]: string }>({});
  
  // Custom question form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newType, setNewType] = useState<'multiple-choice' | 'text-input'>('multiple-choice');
  const [newGrade, setNewGrade] = useState<number>(1);
  const [newWorld, setNewWorld] = useState<number>(1);
  const [newLevel, setNewLevel] = useState<number>(1);
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Load questions including custom ones from localStorage and Google Sheets
  useEffect(() => {
    const defaultQuestions = [...QUESTION_BANK];
    const loadAllQuestions = async () => {
      let localCustomList: Question[] = [];
      const storedCustom = localStorage.getItem('numeraverse_custom_questions');
      if (storedCustom) {
        try {
          localCustomList = JSON.parse(storedCustom);
        } catch (e) {
          console.error('Gagal memuat soal kustom lokal:', e);
        }
      }

      // Gabungkan soal default & soal kustom lokal terlebih dahulu
      let combined = [...defaultQuestions, ...localCustomList];
      setQuestions(combined);

      // Lalu ambil soal dari Google Sheets jika terkonfigurasi
      try {
        const sheetQuestions = await getQuestionsFromSheets();
        if (sheetQuestions && sheetQuestions.length > 0) {
          // Gabungkan tanpa duplikasi ID
          const existingIds = new Set(combined.map(q => q.id));
          const uniqueSheetQs = sheetQuestions.filter(q => !existingIds.has(q.id));
          if (uniqueSheetQs.length > 0) {
            combined = [...combined, ...uniqueSheetQs];
            setQuestions(combined);
          }
        }
      } catch (e) {
        console.warn('Gagal memuat soal dari Google Sheets:', e);
      }
    };

    loadAllQuestions();
  }, []);

  // Helper to determine the phase based on grade
  const getPhase = (grade: number): 'A' | 'B' | 'C' => {
    if (grade <= 2) return 'A';
    if (grade <= 4) return 'B';
    return 'C';
  };

  // Helper for world metadata lookup
  const getWorldName = (worldId: number): string => {
    const w = WORLDS.find(item => item.id === worldId);
    return w ? w.name : `Dunia ${worldId}`;
  };

  // Speak the question text using Web Speech API in Indonesian
  const handleSpeakQuestion = (text: string) => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; // Indonesian locale
      utterance.rate = 0.95; // Slightly slower for clear instruction
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Fitur Audio (Pernyataan Suara) tidak didukung di browser ini.');
    }
  };

  // Reset all active filters
  const handleResetFilters = () => {
    sound.playClick();
    setFilterPhase('ALL');
    setFilterGrade('ALL');
    setFilterWorld('ALL');
    setFilterLevel('ALL');
    setSearchQuery('');
  };

  // Dynamic filtering logic
  const filteredQuestions = questions.filter(q => {
    const qPhase = getPhase(q.grade);

    // Filter by Phase
    if (filterPhase !== 'ALL' && qPhase !== filterPhase) return false;

    // Filter by Grade
    if (filterGrade !== 'ALL' && q.grade !== filterGrade) return false;

    // Filter by World
    if (filterWorld !== 'ALL' && q.worldId !== filterWorld) return false;

    // Filter by Level
    if (filterLevel !== 'ALL' && q.levelId !== filterLevel) return false;

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchText = q.text.toLowerCase().includes(query);
      const matchExpl = q.explanation.toLowerCase().includes(query);
      const matchHint = q.hint.toLowerCase().includes(query);
      return matchText || matchExpl || matchHint;
    }

    return true;
  });

  // Calculate some stats for metadata report
  const countHots = filteredQuestions.filter(q => q.isHots).length;
  const countCT = filteredQuestions.filter(q => q.isComputationalThinking).length;

  // Handle option test click
  const handleTestOption = (questionId: string, option: string, isCorrect: boolean) => {
    setTestedAnswers(prev => ({ ...prev, [questionId]: option }));
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  // Handle adding a new custom question
  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newAnswer.trim()) {
      alert('Harap isi teks soal dan kunci jawaban!');
      return;
    }

    sound.playLevelUp();

    const newQ: Question = {
      id: `custom_${Date.now()}`,
      grade: newGrade,
      worldId: newWorld,
      levelId: newLevel,
      text: newQuestionText,
      type: newType,
      options: newType === 'multiple-choice' ? newOptions.filter(o => o.trim() !== '') : undefined,
      answer: newAnswer,
      explanation: newExplanation || 'Jawaban dihitung berdasarkan konsep dasar matematika kurikulum merdeka.',
      hint: newHint || 'Pikirkan kembali langkah logis berhitung.',
      points: 15,
      imageUrl: newImageUrl || undefined,
      audioUrl: newAudioUrl || undefined,
      videoUrl: newVideoUrl || undefined
    };

    const updated = [...questions, newQ];
    setQuestions(updated);

    // Save custom questions back to localStorage
    const storedCustom = localStorage.getItem('numeraverse_custom_questions');
    let customList: Question[] = [];
    if (storedCustom) {
      try {
        customList = JSON.parse(storedCustom);
      } catch (e) {
        customList = [];
      }
    }
    customList.push(newQ);
    localStorage.setItem('numeraverse_custom_questions', JSON.stringify(customList));

    // Kirim ke Google Sheets jika terkonfigurasi
    addQuestionToSheets(newQ).catch((err) => {
      console.warn('Gagal mencadangkan soal ke Google Sheets:', err);
    });

    // Reset Form fields
    setNewQuestionText('');
    setNewAnswer('');
    setNewExplanation('');
    setNewHint('');
    setNewImageUrl('');
    setNewAudioUrl('');
    setNewVideoUrl('');
    setNewOptions(['', '', '', '']);
    setShowAddForm(false);
  };

  // Reset custom questions
  const handleResetCustomQuestions = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua soal buatan sendiri?')) {
      sound.playWrong();
      localStorage.removeItem('numeraverse_custom_questions');
      setQuestions([...QUESTION_BANK]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      
      {/* Header and Back navigation */}
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
              <BookOpen className="w-7 h-7 text-violet-600" />
              Eksplorasi Bank Soal
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
              Portal penjelajah kurikulum matematika interaktif Fase A, B, & C lengkap dengan media visual, audio, dan pembahasan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => { sound.playClick(); setShowAddForm(!showAddForm); }}
            className="bg-violet-600 hover:bg-violet-700 border-b-4 border-violet-800 text-white font-extrabold text-xs px-4 py-3 rounded-xl flex items-center gap-2 transition-all active:border-b-0 active:translate-y-1 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal</span>
          </button>

          <button
            onClick={handleResetCustomQuestions}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-700 font-extrabold text-xs px-3 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset Soal Buatan"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Kustom</span>
          </button>
        </div>
      </div>

      {/* Add custom question form (Expander panel) */}
      {showAddForm && (
        <div className="bg-white border-4 border-violet-100 rounded-3xl p-6 mb-8 shadow-sm animate-fadeIn">
          <h3 className="text-lg font-black text-violet-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            Buat Soal Kurikulum Baru
          </h3>
          <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Kelas (Grade)</label>
                <select
                  value={newGrade}
                  onChange={(e) => {
                    const gradeVal = parseInt(e.target.value);
                    setNewGrade(gradeVal);
                    // Automatically adjust world recommendation
                    if (gradeVal <= 2) setNewWorld(1);
                    else if (gradeVal <= 4) setNewWorld(3);
                    else setNewWorld(5);
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-violet-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>Kelas {g} (Fase {getPhase(g)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Dunia (World)</label>
                <select
                  value={newWorld}
                  onChange={(e) => setNewWorld(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-violet-500"
                >
                  {WORLDS.map((w) => (
                    <option key={w.id} value={w.id}>{w.id}. {w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Level (Misi)</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-violet-500"
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>Level {l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Tipe Soal</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-violet-500"
                >
                  <option value="multiple-choice">Pilihan Ganda</option>
                  <option value="text-input">Isian Teks Singkat</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-1">Teks Pertanyaan (Soal)</label>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Masukkan soal matematika..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 h-20"
                required
              />
            </div>

            {newType === 'multiple-choice' && (
              <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100">
                <p className="text-xs font-black text-violet-700 uppercase mb-2.5">Pilihan Jawaban (A, B, C, D)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {newOptions.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <span className="font-extrabold text-violet-600 text-xs">{String.fromCharCode(65 + oIdx)}:</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updatedOpts = [...newOptions];
                          updatedOpts[oIdx] = e.target.value;
                          setNewOptions(updatedOpts);
                        }}
                        placeholder={`Pilihan ${String.fromCharCode(65 + oIdx)}...`}
                        className="flex-1 bg-white border-2 border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                        required={newType === 'multiple-choice'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Kunci Jawaban Tepat</label>
                <input
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder={newType === 'multiple-choice' ? 'Ketik salah satu pilihan jawaban di atas secara persis' : 'Ketik angka/jawaban singkat'}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Petunjuk Singkat (Hint)</label>
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="Beri petunjuk bantu untuk berpikir..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-1">Pembahasan & Solusi Detail</label>
              <textarea
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                placeholder="Tuliskan pembahasannya di sini agar siswa memahami logikanya..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 h-16"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-black text-slate-500 uppercase mb-2.5">Media Pendukung (Opsional)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-0.5">Tautan Gambar (Image URL)</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Contoh: https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-0.5">Tautan Audio (Audio URL)</label>
                  <input
                    type="url"
                    value={newAudioUrl}
                    onChange={(e) => setNewAudioUrl(e.target.value)}
                    placeholder="Biarkan kosong untuk TTS otomatis"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-0.5">Tautan Video Edukasi (Video URL)</label>
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Contoh: Tautan YouTube Pembelajaran"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { sound.playClick(); setShowAddForm(false); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Simpan Soal Baru
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Primary Filters Panel */}
      <div className="bg-white border-4 border-slate-100 rounded-3xl p-5 mb-8 shadow-sm space-y-4">
        
        {/* Row 1: Search & Reset */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan kata kunci soal, materi, atau pembahasan..."
              className="w-full bg-slate-50 border-2 border-slate-100 hover:border-slate-200 focus:border-violet-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:outline-none"
            />
          </div>
          
          <button
            onClick={handleResetFilters}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Atur Ulang Filter</span>
          </button>
        </div>

        {/* Row 2: Filtering Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-1.5">
          {/* Phase Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              Fase Kurikulum
            </label>
            <select
              value={filterPhase}
              onChange={(e) => {
                sound.playClick();
                setFilterPhase(e.target.value as any);
                setFilterGrade('ALL'); // Reset grade to avoid conflicts
              }}
              className="w-full bg-slate-50 border-2 border-slate-100 hover:border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Fase (A, B, C)</option>
              <option value="A">Fase A (Kelas 1-2)</option>
              <option value="B">Fase B (Kelas 3-4)</option>
              <option value="C">Fase C (Kelas 5-6)</option>
            </select>
          </div>

          {/* Grade/Class Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Kelas Tingkat
            </label>
            <select
              value={filterGrade}
              onChange={(e) => {
                sound.playClick();
                const val = e.target.value;
                if (val === 'ALL') {
                  setFilterGrade('ALL');
                } else {
                  const num = parseInt(val);
                  setFilterGrade(num);
                  // Align Phase dynamically
                  setFilterPhase(getPhase(num));
                }
              }}
              className="w-full bg-slate-50 border-2 border-slate-100 hover:border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Kelas</option>
              <option value="1">Kelas 1</option>
              <option value="2">Kelas 2</option>
              <option value="3">Kelas 3</option>
              <option value="4">Kelas 4</option>
              <option value="5">Kelas 5</option>
              <option value="6">Kelas 6</option>
            </select>
          </div>

          {/* World Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-slate-400" />
              Dunia Matematika
            </label>
            <select
              value={filterWorld}
              onChange={(e) => {
                sound.playClick();
                const val = e.target.value;
                setFilterWorld(val === 'ALL' ? 'ALL' : parseInt(val));
              }}
              className="w-full bg-slate-50 border-2 border-slate-100 hover:border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Dunia (1-8)</option>
              {WORLDS.map((w) => (
                <option key={w.id} value={w.id}>Dunia {w.id}: {w.name}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-slate-400" />
              Level Misi
            </label>
            <select
              value={filterLevel}
              onChange={(e) => {
                sound.playClick();
                const val = e.target.value;
                setFilterLevel(val === 'ALL' ? 'ALL' : parseInt(val));
              }}
              className="w-full bg-slate-50 border-2 border-slate-100 hover:border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Level (1-5)</option>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>Level {lvl}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats summary banner */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-bold">
          <div>
            Hasil Pencarian: <span className="text-violet-600 font-black">{filteredQuestions.length}</span> Soal Terfilter
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              HOTS: <strong className="font-extrabold">{countHots}</strong>
            </span>
            <span className="flex items-center gap-1 text-purple-600">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              CT: <strong className="font-extrabold">{countCT}</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Questions list area */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white border-4 border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-black text-slate-700 uppercase">Tidak Ada Soal yang Cocok</h3>
          <p className="text-slate-400 text-xs font-semibold mt-1 leading-relaxed">
            Tidak dapat menemukan soal dengan kriteria filter atau kata kunci tersebut. Coba ubah saringan filter di atas atau reset saringan Anda.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 bg-violet-600 hover:bg-violet-700 border-b-4 border-violet-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer active:border-b-0 active:translate-y-1"
          >
            Kembali Tampilkan Semua
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q) => {
            const qPhase = getPhase(q.grade);
            const isHintOpen = openHintId === q.id;
            const isExplanationOpen = openExplanationId === q.id;
            const isVideoOpen = openVideoId === q.id;
            const testedOption = testedAnswers[q.id];

            return (
              <div 
                key={q.id}
                className="bg-white border-4 border-slate-100 hover:border-violet-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Visual Accent based on Phase */}
                <div className={`absolute top-0 left-0 w-2 h-full ${
                  qPhase === 'A' ? 'bg-emerald-400' : qPhase === 'B' ? 'bg-sky-400' : 'bg-indigo-400'
                }`} />

                {/* Question metadata header tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {/* Phase Badge */}
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${
                    qPhase === 'A' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : qPhase === 'B'
                        ? 'bg-sky-50 border-sky-200 text-sky-800'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  }`}>
                    Fase {qPhase}
                  </span>

                  {/* Grade Badge */}
                  <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    Kelas {q.grade}
                  </span>

                  {/* World & Level Badge */}
                  <span className="bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    Dunia {q.worldId}: {getWorldName(q.worldId)} • Misi {q.levelId}
                  </span>

                  {/* HOTS / Computational Thinking Indicators */}
                  {q.isHots && (
                    <span className="bg-rose-100 border border-rose-200 text-rose-700 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      🔥 HOTS
                    </span>
                  )}
                  {q.isComputationalThinking && (
                    <span className="bg-purple-100 border border-purple-200 text-purple-700 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      🤖 Berpikir Komputasional (CT)
                    </span>
                  )}
                </div>

                {/* Primary Question Content */}
                <div className="mb-5 space-y-3">
                  <h4 className="text-slate-800 font-extrabold text-sm md:text-base leading-relaxed">
                    {q.text}
                  </h4>
                  
                  {/* Dynamic Custom Image rendering (if any) */}
                  {(q.imageUrl || q.gridData) && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-md overflow-hidden">
                      {q.imageUrl ? (
                        <img 
                          src={q.imageUrl} 
                          alt="Ilustrasi Matematika"
                          referrerPolicy="no-referrer"
                          className="max-h-48 object-contain rounded-xl mx-auto drop-shadow-sm"
                          onError={(e) => {
                            // Suppress broken image visual by hiding or falling back
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-center py-4 text-xs font-bold text-slate-400">
                          📊 [Tampilan Pola Geometri / Grid Puzzle Aktif]
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Options Layout (with interactive test simulation) */}
                <div className="mb-5">
                  {q.options && q.options.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isThisTested = testedOption === opt;
                        const isAnswerCorrect = opt === q.answer;
                        
                        let buttonStyle = "bg-slate-50 hover:bg-slate-100 border-2 border-slate-100 hover:border-slate-200 text-slate-700";
                        if (isThisTested) {
                          buttonStyle = isAnswerCorrect 
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold" 
                            : "bg-rose-50 border-rose-400 text-rose-800 font-bold";
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleTestOption(q.id, opt, isAnswerCorrect)}
                            className={`w-full rounded-2xl px-4 py-3 text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${buttonStyle}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-500 font-black flex items-center justify-center shrink-0">
                                {letter}
                              </span>
                              <span>{opt}</span>
                            </span>

                            {isThisTested && (
                              isAnswerCorrect 
                                ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                : <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs font-bold text-slate-500">
                      📝 Tipe Isian: Masukkan jawaban langsung pada isian game. Kunci Jawaban: <span className="text-emerald-600 font-black">{String(q.answer)}</span>
                    </div>
                  )}
                </div>

                {/* Core Control Action buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100">
                  {/* Speak TTS audio button */}
                  <button
                    onClick={() => handleSpeakQuestion(q.text)}
                    className="bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Dengarkan soal dibacakan dalam bahasa Indonesia"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan Soal</span>
                  </button>

                  {/* Toggle Hint button */}
                  <button
                    onClick={() => { sound.playClick(); setOpenHintId(isHintOpen ? null : q.id); }}
                    className={`font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      isHintOpen 
                        ? 'bg-amber-100 border border-amber-300 text-amber-800' 
                        : 'bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Petunjuk</span>
                  </button>

                  {/* Toggle Explanation button */}
                  <button
                    onClick={() => { sound.playClick(); setOpenExplanationId(isExplanationOpen ? null : q.id); }}
                    className={`font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      isExplanationOpen 
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-800' 
                        : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Pembahasan</span>
                  </button>

                  {/* Video Helper Tutorial Toggle */}
                  <button
                    onClick={() => { sound.playClick(); setOpenVideoId(isVideoOpen ? null : q.id); }}
                    className={`font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      isVideoOpen 
                        ? 'bg-rose-100 border border-rose-300 text-rose-800' 
                        : 'bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Edukasi</span>
                  </button>
                </div>

                {/* Sub Panels for toggles */}
                {/* 1. Hint Panel */}
                {isHintOpen && (
                  <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-xs font-semibold text-amber-900 leading-relaxed animate-fadeIn">
                    💡 <strong>Petunjuk / Hint:</strong> {q.hint}
                  </div>
                )}

                {/* 2. Pembahasan Panel */}
                {isExplanationOpen && (
                  <div className="mt-4 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 leading-relaxed animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-black text-emerald-800 uppercase tracking-wide mb-1.5">
                      <Check className="w-4.5 h-4.5" />
                      <span>Analisis Pembahasan & Solusi:</span>
                    </div>
                    <p className="font-semibold">{q.explanation}</p>
                    <div className="mt-2 text-[11px] text-emerald-700 font-bold border-t border-emerald-200/50 pt-2">
                      Kunci Jawaban Akhir: <span className="bg-emerald-200/80 px-2.5 py-0.5 rounded text-emerald-900">{String(q.answer)}</span>
                    </div>
                  </div>
                )}

                {/* 3. Video Tutorial Panel */}
                {isVideoOpen && (
                  <div className="mt-4 bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-4 animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-black text-rose-800 text-xs uppercase tracking-wide mb-2">
                      <Film className="w-4.5 h-4.5 text-rose-600 animate-pulse" />
                      <span>Video & Sumber Belajar Pembahasan Konsep</span>
                    </div>

                    {q.videoUrl ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-600">Video Belajar Mandiri:</p>
                        <a 
                          href={q.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-bold"
                        >
                          Tonton Pembahasan Soal di YouTube/Platform Belajar <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                          Tidak ada tautan video eksternal spesifik. Tonton rekomendasi video konsep belajar matematika dasar yang selaras dengan kurikulum nasional berikut:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a 
                            href="https://www.youtube.com/results?search_query=matematika+sd+kurikulum+merdeka" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-white border border-rose-300 hover:border-rose-400 p-3 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-700 shadow-sm hover:scale-105 transition-all"
                          >
                            <Play className="w-4 h-4 fill-rose-100" />
                            <span>Rumah Belajar Kemdikbud (Matematika SD)</span>
                          </a>
                          <a 
                            href="https://www.youtube.com/results?search_query=kurikulum+merdeka+numerasi" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white border border-rose-300 hover:border-rose-400 p-3 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-700 shadow-sm hover:scale-105 transition-all"
                          >
                            <Play className="w-4 h-4 fill-rose-100" />
                            <span>Materi Literasi-Numerasi Kurikulum Merdeka</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
