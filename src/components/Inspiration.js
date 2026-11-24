import Link from "next/link";
import { t } from "@/i18n/config";
import { inspiration } from "@/data/inspiration";
import Rail from "./Rail";

export function PersonCard({ p, lang, i = 0, reveal = true }) {
  return (
    <article className={`person-card person-${p.group}`} {...(reveal ? { "data-reveal": true } : {})} style={{ "--i": i % 4 }}>
      {/* PLACEHOLDER: official portrait, uploaded by the Admin */}
      <div className="person-photo" aria-hidden="true"><span>{p.initials}</span></div>
      <div className="person-body">
        <small>{p.years}</small>
        <h3>{t(p.name, lang)}</h3>
        <p>{t(p.line, lang)}</p>
      </div>
    </article>
  );
}

// Homepage row — a swipeable strip of portraits.
export default function InspirationRow({ lang, d }) {
  const s = d.inspiration;
  return (
    <section className="section deco deco-c" id="inspiration">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">{s.eyebrow}</p>
            <h2 className="h-section">{s.title}</h2>
            <p>{s.lead}</p>
          </div>
          <Link className="link-arrow" href={`/${lang}/inspiration`}>{s.viewAll} →</Link>
        </div>
        <Rail title={`${s.national} · ${s.bengal}`} variant="light" className="person-rail">
          {inspiration.map((p) => <PersonCard key={p.id} p={p} lang={lang} reveal={false} />)}
        </Rail>
      </div>
    </section>
  );
}
