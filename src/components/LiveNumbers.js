"use client";

import { useEffect, useRef, useState } from "react";
import { fill, formatNumber } from "@/i18n/config";

// ---------------------------------------------------------------------
// SIMULATED live numbers for the design. In Phase 2 these read real
// counts from the database (Firestore listeners). Do not launch with
// the random ticking switched on.
// ---------------------------------------------------------------------

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts up from 0 when scrolled into view; optionally keeps ticking. */
export function CountUp({ value, lang, live = false }) {
  const ref = useRef(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    setN(0);
    let raf, timer;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1400;
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
        else if (live) {
          const tick = () => { setN((x) => x + 1 + Math.floor(Math.random() * 3)); timer = setTimeout(tick, 4000 + Math.random() * 5000); };
          timer = setTimeout(tick, 4000);
        }
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [value, live]);

  return <span ref={ref}>{formatNumber(n, lang)}</span>;
}

/** A number that creeps up every few seconds, inside a sentence like "{n} going". */
export function LiveCount({ base, lang, template = "{n}", every = 6000 }) {
  const [n, setN] = useState(base);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (reduced()) return;
    let timer;
    const tick = () => {
      setN((x) => x + 1 + Math.floor(Math.random() * 2));
      setBump(true);
      setTimeout(() => setBump(false), 600);
      timer = setTimeout(tick, every + Math.random() * every);
    };
    timer = setTimeout(tick, every);
    return () => clearTimeout(timer);
  }, [every]);
  return (
    <span className="count" style={{ display: "inline-block", transition: "transform .3s", transform: bump ? "scale(1.12)" : "none" }}>
      {fill(template, { n: formatNumber(n, lang) })}
    </span>
  );
}
