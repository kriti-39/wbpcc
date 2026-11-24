import Link from "next/link";
import { t } from "@/i18n/config";
import { leaders } from "@/data/placeholder";

// Leadership is public (names + photos). Ordinary members are never listed.
export function LeaderCard({ p, lang, i = 0 }) {
  return (
    <Link href={`/${lang}/leadership/${p.id}`} className="card card-link leader" data-reveal style={{ "--i": i }}>
      {/* PLACEHOLDER: replace initials with the leader's photo */}
      <div className="leader-photo" aria-hidden="true">{p.initials}</div>
      <h3>{t(p.name, lang)}</h3>
      <p>{t(p.role, lang)}</p>
    </Link>
  );
}

export default function Leadership({ lang, d }) {
  const l = d.leaders;
  return (
    <section className="section deco deco-b flip" id="leadership">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">{l.eyebrow}</p>
            <h2 className="h-section">{l.title}</h2>
            <p>{l.sub}</p>
          </div>
          <Link className="link-arrow" href={`/${lang}/leadership`}>{l.viewAll} →</Link>
        </div>
        <div className="leaders">
          {leaders.slice(0, 4).map((p, i) => <LeaderCard key={p.id} p={p} lang={lang} i={i} />)}
        </div>
      </div>
    </section>
  );
}
