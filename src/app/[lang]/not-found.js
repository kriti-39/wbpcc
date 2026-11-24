import Link from "next/link";

// Shown when a page, event, petition or post doesn't exist (e.g. an old link).
// Kept trilingual in one view because we can't always know the visitor's language here.
export default function NotFound() {
  return (
    <section className="soon">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 className="h-section" style={{ fontSize: "clamp(40px, 7vw, 72px)" }}>Page not found</h1>
        <p>
          This link may be old or mistyped.
          <br /><span lang="bn">এই পাতাটি পাওয়া যায়নি।</span> · <span lang="hi">यह पेज नहीं मिला।</span>
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/en" className="btn btn-saffron">← Home</Link>
          <Link href="/bn" className="btn btn-outline">হোম</Link>
          <Link href="/hi" className="btn btn-outline">होम</Link>
        </div>
      </div>
    </section>
  );
}
