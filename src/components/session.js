"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// DEMO SESSION — stored in this browser only, so we can click through
// the signed-in screens. Phase 2 replaces this with real auth (cookies
// set by the server). Nothing here is secure; it's just for the UI.
// ---------------------------------------------------------------------
const KEY = "wbpcc-demo-session";
const EVT = "wbpcc-session";

export function getSession() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
}

export function setSession(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  window.dispatchEvent(new Event(EVT));
}

export function clearSession() {
  try { localStorage.removeItem(KEY); } catch {}
  window.dispatchEvent(new Event(EVT));
}

export function useSession() {
  const [s, setS] = useState(undefined); // undefined = not loaded yet
  useEffect(() => {
    const read = () => setS(getSession());
    read();
    window.addEventListener(EVT, read);
    window.addEventListener("storage", read);
    return () => { window.removeEventListener(EVT, read); window.removeEventListener("storage", read); };
  }, []);
  return s;
}
