"use client";

import { useState } from "react";

// WhatsApp first — that's where Bengal shares news.
export default function ShareButtons({ title, c }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? window.location.href : "");
  return (
    <div className="share">
      <b>{c.share}:</b>
      <a
        className="btn btn-sm btn-ghost"
        href="#"
        onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`, "_blank", "noopener"); }}
      >
        💬 {c.whatsapp}
      </a>
      <button
        className="btn btn-sm btn-ghost"
        onClick={async () => {
          try { await navigator.clipboard.writeText(url()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
        }}
      >
        🔗 {copied ? c.copied : c.copy}
      </button>
    </div>
  );
}
