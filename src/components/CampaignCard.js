import Link from "next/link";
import { t, fill, intlLocale } from "@/i18n/config";
import { findGroup } from "@/data/placeholder";

export function campaignRuns(c, lang, tpl) {
  const f = new Intl.DateTimeFormat(intlLocale[lang], { day: "numeric", month: "short" });
  return fill(tpl, { from: f.format(new Date(c.start)), to: f.format(new Date(c.end)) });
}

export default function CampaignCard({ c, lang, s, i = 0, compact = false }) {
  const g = c.group ? findGroup(c.group) : null;
  return (
    <Link href={`/${lang}/campaigns/${c.id}`} className={`card card-link camp-card${compact ? " compact" : ""}`} style={{ "--g": g?.color || "var(--saffron)", "--i": i }} data-reveal>
      <span className="camp-band" aria-hidden="true" />
      <div className="camp-top">
        <span className="pill pill-live"><span className="dot" />{s.eyebrow}</span>
        <small>{campaignRuns(c, lang, s.runs)}</small>
      </div>
      <h3>{t(c.title, lang)}</h3>
      {!compact && <p>{t(c.goal, lang)}</p>}
      <div className="camp-foot">
        {g && <span>{g.icon} {t(g.name, lang)}</span>}
        <span>🗓️ {c.events.length} · ✍️ {c.petitions.length}</span>
      </div>
    </Link>
  );
}
