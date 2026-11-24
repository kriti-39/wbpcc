import { ImageResponse } from "next/og";

// The preview image WhatsApp / Facebook / X show when someone shares a link.
// Phase 2: per-page images (event photo, petition title) can be added the same way.
export const alt = "West Bengal Pradesh Congress";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }, { lang: "hi" }];
}

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#15223f", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", right: -160, top: -120, width: 720, height: 720, borderRadius: 720, background: "#22325a", display: "flex" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 18, display: "flex" }}>
          <div style={{ flex: 1, background: "#f47320" }} />
          <div style={{ flex: 1, background: "#ffffff" }} />
          <div style={{ flex: 1, background: "#138741" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", position: "relative" }}>
          <div style={{ fontSize: 28, letterSpacing: 8, color: "#2aa7e1", fontWeight: 700 }}>WEST BENGAL PRADESH CONGRESS</div>
          <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1, marginTop: 24 }}>BENGAL IS CALLING.</div>
          <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1, color: "#f47320" }}>ARE YOU IN?</div>
          <div style={{ fontSize: 32, marginTop: 30, color: "rgba(255,255,255,.8)" }}>Events near you · Petitions · Verified news · Join us</div>
        </div>
      </div>
    ),
    size
  );
}
