"use client";

import { useEffect, useState } from "react";

const HOUR = 3600 * 1000;

// Placeholder events store times relative to "now". This works out the
// real start/end + Live/Upcoming/Past in the browser (Phase 2: real dates).
export function withTimes(e, now) {
  const start = now + e.startInHours * HOUR;
  const end = start + e.durationHours * HOUR;
  const status = start <= now && now < end ? "live" : start > now ? "soon" : "past";
  return { ...e, start, end, status };
}

export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
