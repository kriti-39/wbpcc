"use client";

import { useEffect, useState } from "react";

// Sticky top area; gets a "scrolled" class so the header shrinks + casts a shadow.
export default function HeaderShell({ children }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className={`site-top${scrolled ? " scrolled" : ""}`}>{children}</div>;
}
