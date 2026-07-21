/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Plus, Check, XCircle } from 'lucide-react';
import { Question } from '../types';
import { WORLDS } from '../questions';
import { sound } from '../utils/audio';
import { addQuestionToSheets } from '../utils/sheets';

interface AddQuestionFormProps {
  onSuccess?: (newQ: Question) => void;
  onCancel?: () => void;
}

export const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ onSuccess, onCancel }) => {
  // Form states
  const [newGrade, setNewGrade] = useState<number>(1);
  const [newWorld, setNewWorld] = useState<number>(1);
  const [newLevel, setNewLevel] = useState<number>(1);
  const [newType, setNewType] = useState<'multiple-choice' | 'text-input'>('multiple-choice');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to determine the phase based on grade
  const getPhase = (grade: number): 'A' | 'B' | 'C' => {
    if (grade <= 2) return 'A';
    if (grade <= 4) return 'B';
    return 'C';
  };

  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newQuestionText.trim() || !newAnswer.trim()) {
      setErrorMsg('Harap isi teks soal dan kunci jawaban!');
      return;
    }

    setIsSubmitting(true);
    sound.playLevelUp();

    const newQ: Question = {
      id: `custom_${Date.now()}`,
      grade: newGrade,
      worldId: newWorld,
      levelId: newLevel,
      text: newQuestionText.trim(),
      type: newType,
      options: newType === 'multiple-choice' ? newOptions.filter(o => o.trim() !== '') : undefined,
      answer: newAnswer.trim(),
      explanation: newExplanation.trim() || 'Jawaban dihitung berdasarkan konsep dasar matematika kurikulum merdeka.',
      hint: newHint.trim() || 'Pikirkan kembali langkah logis berhitung.',
      points: 15,
      imageUrl: newImageUrl.trim() || undefined,
      audioUrl: newAudioUrl.trim() || undefined,
      videoUrl: newVideoUrl.trim() || undefined
    };

    try {
      // 1. Simpan soal kustom baru ke localStorage agar tersinkronisasi di perangkat lokal
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

      // 2. Kirim ke Google Sheets jika terkonfigurasi
      try {
        await addQuestionToSheets(newQ);
      } catch (err) {
        console.warn('Gagal mencadangkan soal ke Google Sheets:', err);
      }

      // 3. Reset form
      setNewQuestionText('');
      setNewAnswer('');
      setNewExplanation('');
      setNewHint('');
      setNewImageUrl('');
      setNewAudioUrl('');
      setNewVideoUrl('');
      setNewOptions(['', '', '', '']);
      
      // 4. Callback sukses
      if (onSuccess) {
        onSuccess(newQ);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan soal baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-4 border-violet-100 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-black text-violet-800 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-500" />
        Buat Soal Kurikulum Baru
      </h3>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

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
          {onCancel && (
            <button
              type="button"
              onClick={() => { sound.playClick(); onCancel(); }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin text-xs">🌀</span>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Simpan Soal Baru</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
