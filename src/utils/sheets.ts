/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PlayerProfile, Question } from '../types';

// State lokal untuk menyimpan webAppUrl dan spreadsheetLink setelah di-load
let cachedWebAppUrl: string | null = localStorage.getItem('numeraverse_sheets_url');
let cachedSpreadsheetLink: string | null = localStorage.getItem('numeraverse_spreadsheet_link');

export interface SheetsConfig {
  webAppUrl: string | null;
  spreadsheetLink: string | null;
}

/**
 * Mengambil konfigurasi Google Sheets lengkap dari Firestore & lokal cache
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
        localStorage.setItem('numeraverse_sheets_url', data.webAppUrl);
      }
      if (data.spreadsheetLink) {
        spreadsheetLink = data.spreadsheetLink;
        cachedSpreadsheetLink = data.spreadsheetLink;
        localStorage.setItem('numeraverse_spreadsheet_link', data.spreadsheetLink);
      }
    }
  } catch (error) {
    console.warn('Gagal mengambil konfigurasi Google Sheets dari Firestore:', error);
  }

  return {
    webAppUrl: webAppUrl || localStorage.getItem('numeraverse_sheets_url'),
    spreadsheetLink: spreadsheetLink || localStorage.getItem('numeraverse_spreadsheet_link'),
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
 * Menyimpan konfigurasi Google Sheets lengkap ke Firestore dan Cache Lokal
 */
export async function saveSheetsConfig(config: SheetsConfig): Promise<void> {
  const webAppUrl = config.webAppUrl?.trim() || null;
  const spreadsheetLink = config.spreadsheetLink?.trim() || null;

  cachedWebAppUrl = webAppUrl;
  cachedSpreadsheetLink = spreadsheetLink;

  if (webAppUrl) localStorage.setItem('numeraverse_sheets_url', webAppUrl);
  else localStorage.removeItem('numeraverse_sheets_url');

  if (spreadsheetLink) localStorage.setItem('numeraverse_spreadsheet_link', spreadsheetLink);
  else localStorage.removeItem('numeraverse_spreadsheet_link');

  try {
    const configRef = doc(db, 'config', 'sheets');
    await setDoc(configRef, { webAppUrl, spreadsheetLink }, { merge: true });
    console.log('Konfigurasi Google Sheets disimpan ke Firestore.');
  } catch (error) {
    console.error('Gagal menyimpan konfigurasi Google Sheets ke Firestore:', error);
  }
}

/**
 * Menyimpan Google Sheets Web App URL ke Firestore dan Cache Lokal
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
