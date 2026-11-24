"use client";

import { useEffect, useMemo, useState } from "react";
import { t, fill, formatNumber } from "@/i18n/config";
import { districts, petitions, events } from "@/data/placeholder";

// ---------------------------------------------------------------------
// "Someone in Howrah just signed…" pop-ups, bottom-left.
// SIMULATED for the design. In Phase 2 these must come from REAL
// activity (anonymous: district only, never names) — or be turned off.
// ---------------------------------------------------------------------
export default function ActivityToasts({ lang, a }) {
  const [msg, setMsg] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [off, setOff] = useState(false);

  const messages = useMemo(() => {
    const ds = Object.keys(districts);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return () => {
      const kind = pick(["signed", "signed", "going", "joined"]);
      const district = t(districts[pick(ds)], lang);
      if (kind === "signed") return { icon: "✍️", text: fill(a.signed, { district, title: t(pick(petitions).title, lang) }) };
      if (kind === "going") return { icon: "📍", text: fill(a.going, { district, title: t(pick(events.slice(0, 6)).title, lang) }) };
      return { icon: "🙌", text: fill(a.joined, { district, n: formatNumber(3 + Math.floor(Math.random() * 20), lang) }) };
    };
  }, [lang, a]);

  useEffect(() => {
    try { if (sessionStorage.getItem("wbpcc-toasts-off")) { setOff(true); return; } } catch {}
    let t1, t2, t3;
    const show = () => {
      setLeaving(false);
      setMsg(messages());
      t2 = setTimeout(() => setLeaving(true), 5200);
      t3 = setTimeout(() => setMsg(null), 5600);
      t1 = setTimeout(show, 16000 + Math.random() * 8000);
    };
    t1 = setTimeout(show, 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [messages]);

  if (off || !msg) return null;
  return (
    <div className={`toast${leaving ? " out" : ""}`} role="status" aria-live="polite">
      <span className="t-ico" aria-hidden="true">{msg.icon}</span>
      <span>{msg.text}</span>
      <button
        aria-label={a.dismiss}
        title={a.dismiss}
        onClick={() => { setOff(true); try { sessionStorage.setItem("wbpcc-toasts-off", "1"); } catch {} }}
      >
        ✕
      </button>
    </div>
  );
}
