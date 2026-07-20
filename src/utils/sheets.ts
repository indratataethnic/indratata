/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PlayerProfile, Question } from '../types';

// State lokal untuk menyimpan webAppUrl dan spreadsheetLink setelah di-load
let cachedWebAppUrl: string | null = null;
let cachedSpreadsheetLink: string | null = null;

try {
  cachedWebAppUrl = localStorage.getItem('numeraverse_sheets_url');
  cachedSpreadsheetLink = localStorage.getItem('numeraverse_spreadsheet_link');
} catch (e) {
  console.warn('LocalStorage tidak tersedia saat memuat sheets.ts:', e);
}

export interface SheetsConfig {
  webAppUrl: string | null;
  spreadsheetLink: string | null;
}

/**
 * Mengambil konfigurasi Google Sheets lengkap dari Firestore & lokal cache secara aman
 */
export async function getSheetsConfig(): Promise<SheetsConfig> {
  let webAppUrl = cachedWebAppUrl;
  let spreadsheetLink = cachedSpreadsheetLink;

  try {
    const configRef = doc(db, 'config', 'sheets');
    const docSnap = await getDoc(configRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.webAppUrl) {
        webAppUrl = data.webAppUrl;
        cachedWebAppUrl = data.webAppUrl;
        try {
          localStorage.setItem('numeraverse_sheets_url', data.webAppUrl);
        } catch (e) {}
      }
      if (data.spreadsheetLink) {
        spreadsheetLink = data.spreadsheetLink;
        cachedSpreadsheetLink = data.spreadsheetLink;
        try {
          localStorage.setItem('numeraverse_spreadsheet_link', data.spreadsheetLink);
        } catch (e) {}
      }
    }
  } catch (error) {
    console.warn('Gagal mengambil konfigurasi Google Sheets dari Firestore:', error);
  }

  let localUrl: string | null = null;
  let localLink: string | null = null;
  try {
    localUrl = localStorage.getItem('numeraverse_sheets_url');
    localLink = localStorage.getItem('numeraverse_spreadsheet_link');
  } catch (e) {}

  return {
    webAppUrl: webAppUrl || localUrl,
    spreadsheetLink: spreadsheetLink || localLink,
  };
}

/**
 * Mengambil Google Sheets Apps Script Web App URL saja
 */
export async function getSheetsUrl(): Promise<string | null> {
  const config = await getSheetsConfig();
  return config.webAppUrl;
}

/**
 * Menyimpan konfigurasi Google Sheets lengkap ke Firestore dan Cache Lokal secara aman
 */
export async function saveSheetsConfig(config: SheetsConfig): Promise<void> {
  const webAppUrl = config.webAppUrl?.trim() || null;
  const spreadsheetLink = config.spreadsheetLink?.trim() || null;

  cachedWebAppUrl = webAppUrl;
  cachedSpreadsheetLink = spreadsheetLink;

  try {
    if (webAppUrl) localStorage.setItem('numeraverse_sheets_url', webAppUrl);
    else localStorage.removeItem('numeraverse_sheets_url');
  } catch (e) {}

  try {
    if (spreadsheetLink) localStorage.setItem('numeraverse_spreadsheet_link', spreadsheetLink);
    else localStorage.removeItem('numeraverse_spreadsheet_link');
  } catch (e) {}

  try {
    const configRef = doc(db, 'config', 'sheets');
    await setDoc(configRef, { webAppUrl, spreadsheetLink }, { merge: true });
    console.log('Konfigurasi Google Sheets disimpan ke Firestore.');
  } catch (error) {
    console.error('Gagal menyimpan konfigurasi Google Sheets ke Firestore:', error);
  }
}

/**
 * Menyimpan Google Sheets Web App URL ke Firestore dan Cache Lokal secara aman
 */
export async function saveSheetsUrl(url: string): Promise<void> {
  await saveSheetsConfig({
    webAppUrl: url,
    spreadsheetLink: cachedSpreadsheetLink
  });
}

/**
 * Sinkronisasi data profil pahlawan (Google maupun Tamu/Offline) ke Google Sheets
 */
export async function syncPlayerToSheets(player: PlayerProfile): Promise<boolean> {
  const url = await getSheetsUrl();
  if (!url) return false;

  try {
    // Hitung total misi/level selesai
    let completedLevelsCount = 0;
    if (player.completedLevels) {
      Object.values(player.completedLevels).forEach(arr => {
        const levelList = arr as number[];
        if (levelList && Array.isArray(levelList)) {
          completedLevelsCount += levelList.length;
        }
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // mode no-cors mencegah masalah CORS browser saat Apps Script dialihkan
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'syncPlayer',
        player: {
          id: player.id,
          name: player.name,
          grade: player.grade,
          school: player.school || '',
          level: player.level,
          xp: player.xp,
          coins: player.coins,
          lives: player.lives,
          badges: player.badges,
          completedLevelsCount,
          lastPlayed: player.lastPlayed
        }
      })
    });
    console.log('Data pahlawan disinkronkan ke Google Sheet.');
    return true;
  } catch (error) {
    console.warn('Gagal sinkronisasi data pahlawan ke Google Sheet:', error);
    return false;
  }
}

/**
 * Catat aktivitas pahlawan (kunjungan, membuka gameplay, dll.) ke Google Sheets
 */
export async function logActivityToSheets(
  type: 'VISIT' | 'GAMEPLAY' | 'COIN_SHOP' | 'BADGE_UNLOCKED',
  detail: string,
  player?: PlayerProfile | null
): Promise<boolean> {
  const url = await getSheetsUrl();
  if (!url) return false;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'logActivity',
        log: {
          type,
          detail,
          playerId: player?.id || 'tamu_anonim',
          playerName: player?.name || 'Tamu Tanpa Akun',
          playerGrade: player?.grade || '-',
          playerSchool: player?.school || '-'
        }
      })
    });
    return true;
  } catch (error) {
    console.warn('Gagal mencatat log aktivitas ke Google Sheet:', error);
    return false;
  }
}

/**
 * Menambahkan soal kustom baru ke dalam Google Sheet
 */
export async function addQuestionToSheets(question: Question): Promise<boolean> {
  const url = await getSheetsUrl();
  if (!url) return false;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addQuestion',
        question: question
      })
    });
    console.log('Soal kustom ditambahkan ke Google Sheet.');
    return true;
  } catch (error) {
    console.warn('Gagal menambahkan soal ke Google Sheet:', error);
    return false;
  }
}

/**
 * Mengambil Soal Tambahan dari Google Sheet
 */
export async function getQuestionsFromSheets(): Promise<Question[]> {
  const url = await getSheetsUrl();
  if (!url) return [];

  try {
    const fetchUrl = `${url}?action=getQuestions`;
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Network response not ok');
    const result = await response.json();
    if (result && result.success && Array.isArray(result.questions)) {
      return result.questions;
    }
  } catch (error) {
    console.warn('Gagal mengambil soal dari Google Sheet (kemungkinan CORS atau format salah):', error);
  }
  return [];
}

/**
 * Mengambil semua data pahlawan dari Google Sheet
 */
export async function getPlayersFromSheets(): Promise<PlayerProfile[]> {
  const url = await getSheetsUrl();
  if (!url) return [];

  try {
    const fetchUrl = `${url}?action=getPlayers`;
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Network response not ok');
    const result = await response.json();
    if (result && result.success && Array.isArray(result.players)) {
      return result.players.map((sheetPlayer: any) => {
        const id = sheetPlayer['ID Siswa'] || sheetPlayer['ID'] || sheetPlayer['id'] || '';
        const name = sheetPlayer['Nama'] || sheetPlayer['name'] || '';
        const grade = Number(sheetPlayer['Kelas'] || sheetPlayer['grade'] || 1);
        const school = sheetPlayer['Asal Sekolah'] || sheetPlayer['School'] || sheetPlayer['school'] || '';
        const level = Number(sheetPlayer['Level'] || sheetPlayer['level'] || 1);
        const xp = Number(sheetPlayer['XP'] || sheetPlayer['xp'] || 0);
        const coins = Number(sheetPlayer['Koin'] || sheetPlayer['coins'] || 0);
        const lives = Number(sheetPlayer['Nyawa'] || sheetPlayer['lives'] || 5);
        
        let badges: string[] = [];
        const badgeVal = sheetPlayer['Jumlah Badge'] || sheetPlayer['badges'] || sheetPlayer['Jumlah Penghargaan'] || 0;
        if (typeof badgeVal === 'number') {
          badges = Array(badgeVal).fill('badge');
        } else if (typeof badgeVal === 'string') {
          if (badgeVal.includes('|')) {
            badges = badgeVal.split('|').map((b: string) => b.trim());
          } else {
            const parsedNum = parseInt(badgeVal);
            if (!isNaN(parsedNum)) {
              badges = Array(parsedNum).fill('badge');
            } else if (badgeVal.trim()) {
              badges = [badgeVal];
            }
          }
        }

        let lastPlayed = Date.now();
        const lpVal = sheetPlayer['Terakhir Bermain'] || sheetPlayer['lastPlayed'] || sheetPlayer['Terakhir Main'];
        if (lpVal) {
          const parsedDate = Date.parse(lpVal);
          if (!isNaN(parsedDate)) {
            lastPlayed = parsedDate;
          }
        }

        const completedCountVal = Number(sheetPlayer['Misi Selesai'] || sheetPlayer['completedLevelsCount'] || 0);
        const completedLevels: { [worldId: number]: number[] } = {};
        if (completedCountVal > 0) {
          completedLevels[1] = Array.from({ length: completedCountVal }, (_, i) => i + 1);
        }

        return {
          id: String(id),
          name: String(name),
          grade,
          school: String(school),
          avatar: sheetPlayer['avatar'] || 'niko',
          xp,
          level,
          coins,
          lives,
          lastLifeRegenTime: Date.now(),
          unlockedWorlds: [1, 2, 7, 8],
          completedLevels,
          badges,
          lastPlayed
        };
      });
    }
  } catch (error) {
    console.warn('Gagal mengambil data siswa dari Google Sheet (CORS atau format salah):', error);
  }
  return [];
}

/**
 * Mengambil data statistik global (tayangan/visit dan gameplay) dari Google Sheet
 */
export async function getStatsFromSheets(): Promise<{ views: number; plays: number } | null> {
  const url = await getSheetsUrl();
  if (!url) return null;

  try {
    const fetchUrl = `${url}?action=getStats`;
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Network response not ok');
    const result = await response.json();
    if (result && result.success && result.stats) {
      return {
        views: Number(result.stats.views || 0),
        plays: Number(result.stats.plays || 0)
      };
    }
  } catch (error) {
    console.warn('Gagal mengambil statistik dari Google Sheet:', error);
  }
  return null;
}
