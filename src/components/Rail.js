"use client";

import { useRef } from "react";

// Horizontal, swipeable row (like Instagram reels) with arrow buttons.
// variant="light" for cream backgrounds, default is for the navy newsroom.
export default function Rail({ title, children, variant = "dark", className = "" }) {
  const ref = useRef(null);
  const go = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className={`rail-wrap rail-${variant}`}>
      <div className="rail-head">
        <h3>{title}</h3>
        <div className="rail-btns">
          <button onClick={() => go(-1)} aria-label="Previous">←</button>
          <button onClick={() => go(1)} aria-label="Next">→</button>
        </div>
      </div>
      <div className={`rail ${className}`} ref={ref}>{children}</div>
    </div>
  );
}
