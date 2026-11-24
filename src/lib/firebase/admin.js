// Firebase on the SERVER (Next.js server components & API routes).
// Never import this from a "use client" file — it has full database access.
//
// Local:  set FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST (see .env.local.example).
// Live:   set FIREBASE_SERVICE_ACCOUNT (the JSON key from Firebase → Project settings →
//         Service accounts). Keep it in .env.local / Vercel env vars, NEVER in git.
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-wbpcc";

export const adminReady = !!(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_SERVICE_ACCOUNT);

export function admin() {
  if (!adminReady) return null;
  if (!getApps().length) {
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
    initializeApp(sa ? { credential: cert(JSON.parse(sa)), projectId: PROJECT_ID } : { projectId: PROJECT_ID });
  }
  return { db: getFirestore(), auth: getAuth() };
}
