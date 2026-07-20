/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  getDocs,
  increment
} from 'firebase/firestore';
import { PlayerProfile } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Inisialisasi Firebase App menggunakan konfigurasi otomatis dari platform
const app = initializeApp(firebaseConfig);

// Ekspor layanan Autentikasi dan Database Firestore untuk digunakan di tempat lain
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

/**
 * Menyimpan data profil pemain ke Firestore.
 * @param profile Data profil lengkap pemain yang akan disimpan
 */
export async function savePlayerProfile(profile: PlayerProfile): Promise<void> {
  // Selalu simpan di localStorage terlebih dahulu sebagai backup lokal
  try {
    localStorage.setItem('numeraverse_player_profile', JSON.stringify(profile));
  } catch (e) {
    console.error('Gagal menyimpan cache profil lokal:', e);
  }

  try {
    const userRef = doc(db, 'users', profile.id);
    // Menyimpan data dengan opsi merge: true agar tidak menimpa data baru yang mungkin ditambahkan di masa depan
    await setDoc(userRef, profile, { merge: true });
    console.log('Profil berhasil disimpan ke Firestore:', profile.id);
  } catch (error) {
    console.warn('Firestore offline atau gagal menyimpan. Perubahan disimpan di penyimpanan lokal:', error);
    // JANGAN melempar error agar game tetap berjalan lancar secara offline
  }
}

/**
 * Mengambil data profil pemain dari Firestore berdasarkan UID.
 * @param uid ID pengguna Firebase Auth
 * @returns Profil pemain jika ditemukan, jika tidak mengembalikan null
 */
export async function getPlayerProfile(uid: string): Promise<PlayerProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as PlayerProfile;
      // Berhasil mengambil dari cloud, perbarui cache lokal
      try {
        localStorage.setItem('numeraverse_player_profile', JSON.stringify(data));
      } catch (e) {}
      return data;
    }
    
    // Fallback pertama: Jika tidak ada di cloud, periksa apakah ada data lokal yang cocok
    const localStored = localStorage.getItem('numeraverse_player_profile');
    if (localStored) {
      try {
        const parsed = JSON.parse(localStored);
        if (parsed && parsed.id === uid) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  } catch (error) {
    console.warn('Gagal mengambil profil dari Firestore (Mungkin offline). Menggunakan data lokal:', error);
    
    // Fallback darurat: Ambil dari penyimpanan lokal demi mencegah crash offline
    const localStored = localStorage.getItem('numeraverse_player_profile');
    if (localStored) {
      try {
        const parsed = JSON.parse(localStored);
        if (parsed && (parsed.id === uid || !uid)) {
          return parsed;
        }
      } catch (e) {}
    }
    
    // Jika benar-benar kosong, buat profil default agar pengguna tidak terblokir
    const fallbackProfile: PlayerProfile = {
      id: uid,
      name: 'PahlawanNumera',
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
    return fallbackProfile;
  }
}

/**
 * Mengambil semua data profil pemain dari Firestore.
 * @returns Array berisi PlayerProfile semua pemain
 */
export async function getAllPlayerProfiles(): Promise<PlayerProfile[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const profiles: PlayerProfile[] = [];
    querySnapshot.forEach((docSnap) => {
      profiles.push(docSnap.data() as PlayerProfile);
    });
    return profiles;
  } catch (error) {
    console.warn('Gagal mengambil semua profil dari Firestore untuk papan peringkat:', error);
    // Kembalikan profil aktif kita sendiri dari lokal untuk meredam crash
    const localStored = localStorage.getItem('numeraverse_player_profile');
    if (localStored) {
      try {
        const parsed = JSON.parse(localStored);
        if (parsed) {
          return [parsed];
        }
      } catch (e) {}
    }
    return [];
  }
}

/**
 * Mencatat/menambah jumlah tayangan (views) global Numeraverse.
 */
export async function trackAppView(): Promise<void> {
  // Hanya jalankan sekali per sesi browser agar tidak membanjiri increment
  if (sessionStorage.getItem('numeraverse_view_tracked')) {
    return;
  }
  sessionStorage.setItem('numeraverse_view_tracked', 'true');

  try {
    const analyticsRef = doc(db, 'analytics', 'global');
    await setDoc(analyticsRef, {
      views: increment(1)
    }, { merge: true });
    console.log('Tayangan aplikasi berhasil dicatat.');
  } catch (error) {
    console.warn('Gagal mencatat tayangan aplikasi (offline/tidak diizinkan):', error);
  }
}

/**
 * Mencatat/menambah jumlah sesi dimainkan (plays) global Numeraverse.
 */
export async function trackGameplay(): Promise<void> {
  try {
    const analyticsRef = doc(db, 'analytics', 'global');
    await setDoc(analyticsRef, {
      plays: increment(1)
    }, { merge: true });
    console.log('Gameplay berhasil dicatat.');
  } catch (error) {
    console.warn('Gagal mencatat gameplay (offline/tidak diizinkan):', error);
  }
}

/**
 * Mengambil statistik global dari Firestore (views & plays).
 */
export async function getGlobalStats(): Promise<{ views: number; plays: number }> {
  try {
    const analyticsRef = doc(db, 'analytics', 'global');
    const docSnap = await getDoc(analyticsRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        views: data.views || 0,
        plays: data.plays || 0
      };
    }
  } catch (error) {
    console.warn('Gagal mengambil statistik global:', error);
  }
  return { views: 0, plays: 0 };
}
