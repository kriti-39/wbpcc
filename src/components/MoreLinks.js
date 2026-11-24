import Link from "next/link";

// History lives on its own page (later phase) but is linked from home.
export default function MoreLinks({ lang, d }) {
  const m = d.more;
  const items = [
    { icon: "📜", title: m.historyTitle, text: m.historyText, href: `/${lang}/history` },
    { icon: "🧭", title: m.aboutTitle, text: m.aboutText, href: `/${lang}/about` },
    { icon: "💬", title: m.contactTitle, text: m.contactText, href: `/${lang}/contact` },
    { icon: "📰", title: d.footer.pressKit, text: m.pressText, href: `/${lang}/press-kit` },
  ];
  return (
    <section className="section deco deco-b">
      <div className="wrap more-grid">
        {items.map((it, i) => (
          <Link key={it.href} href={it.href} className="card card-link more" data-reveal style={{ "--i": i }}>
            <i aria-hidden="true">{it.icon}</i>
            <div>
              <h3>{it.title} →</h3>
              <p>{it.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
