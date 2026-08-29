import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ── Firebase config ───────────────────────────────────────────────────────────
// TODO: Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── Visit logging ─────────────────────────────────────────────────────────────
/**
 * Log a page visit to Firestore visits collection.
 * Called once on page load.
 */
export async function logVisit() {
  try {
    await addDoc(collection(db, 'visits'), {
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  } catch (err) {
    // Silent fail — don't break the experience
    console.warn('Visit log failed:', err.message);
  }
}

// ── Voucher redemption tracking ───────────────────────────────────────────────
const REDEMPTION_DOC_ID = 'voucher-state';

/**
 * Get current redemption state from Firestore.
 * Returns an object: { pass_01: true/false, pass_02: number, ... }
 */
export async function getRedemptions() {
  try {
    const ref = doc(db, 'redemptions', REDEMPTION_DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    return {};
  } catch (err) {
    console.warn('Redemptions fetch failed:', err.message);
    return {};
  }
}

/**
 * Record a voucher as redeemed.
 * @param {string} voucherId - e.g. 'pass_01'
 * @param {any} value - true for used, or remaining count
 */
export async function redeemVoucher(voucherId, value) {
  try {
    const ref = doc(db, 'redemptions', REDEMPTION_DOC_ID);
    await setDoc(ref, {
      [voucherId]: value,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Redemption write failed:', err.message);
  }
}
