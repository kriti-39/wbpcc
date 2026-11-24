import Link from "next/link";

// "Take action" — one tap to whatever the visitor wants to do.
export default function IntentChips({ lang, d }) {
  const i = d.intent;
  const chips = [
    { icon: "🙌", label: i.join, href: `/${lang}/join` },
    { icon: "📍", label: i.attend, href: `/${lang}/events` },
    { icon: "✍️", label: i.sign, href: `/${lang}/petitions` },
    { icon: "🙋", label: i.volunteer, href: `/${lang}/contact?type=volunteer` },
    { icon: "🆘", label: i.help, href: `/${lang}/contact?type=help` },
    { icon: "📰", label: i.news, href: `/${lang}/newsroom` },
  ];
  return (
    <section className="section deco deco-a" id="take-action">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">{d.action.eyebrow}</p>
            <h2 className="h-section">{i.title}</h2>
          </div>
        </div>
        <div className="chips">
          {chips.map((c, n) => (
            <Link key={c.label} href={c.href} className="chip" data-reveal style={{ "--i": n }}>
              <i aria-hidden="true">{c.icon}</i>{c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
