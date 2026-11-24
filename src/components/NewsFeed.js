"use client";

import { useState } from "react";
import { posts } from "@/data/placeholder";

// Filter chips for the Newsroom page. Cards are rendered on the server
// and passed in as { id → element } so this stays tiny.
export default function NewsFeed({ n, cards }) {
  const [f, setF] = useState("all");
  const filters = [
    ["all", n.filterAll],
    ["statement", n.filterStatements],
    ["report", n.filterReports],
    ["story", n.filterStories],
  ];
  const shown = posts.filter((p) => f === "all" || p.kind === f || (f === "story" && p.kind === "explainer"));
  return (
    <>
      <div className="filters" role="toolbar">
        {filters.map(([k, label]) => (
          <button key={k} aria-pressed={f === k} onClick={() => setF(k)}>{label}</button>
        ))}
      </div>
      <div className="news-grid">
        {shown.map((p) => <div key={`${f}-${p.id}`} className={p.format === "video" ? "post-card wide" : undefined} style={{ animation: "fadeUp .45s both" }}>{cards[p.id]}</div>)}
      </div>
    </>
  );
}
