"use client";

// Firebase in the BROWSER (console, member area, public forms).
// Uses the local emulator when NEXT_PUBLIC_USE_EMULATORS=1, otherwise the
// real project from NEXT_PUBLIC_FIREBASE_* (see .env.local.example).
import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "1";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-wbpcc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-wbpcc",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app",
};

export const firebaseReady = useEmulators || !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app, auth, db;
export function firebase() {
  if (!firebaseReady) return null;
  if (!app) {
    app = getApps()[0] || initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    if (useEmulators && !globalThis.__wbpccEmulatorsConnected) {
      // WBPCC uses its own ports (9199 / 8180) so it can run beside other projects' emulators.
      connectAuthEmulator(auth, "http://127.0.0.1:9199", { disableWarnings: true });
      connectFirestoreEmulator(db, "127.0.0.1", 8180);
      globalThis.__wbpccEmulatorsConnected = true;
    }
  }
  return { app, auth, db };
}
