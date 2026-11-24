import { getDictionary } from "@/i18n/config";
import PageHead from "@/components/PageHead";
import { DonateForm } from "@/components/PublicForms";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).donate.title };
}

// Donate — Razorpay payment is connected in the backend phase.
export default async function DonatePage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const s = d.donate;
  return (
    <>
      <PageHead crumbHref={`/${lang}`} crumbLabel={d.nav.home} eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <div className="wrap detail">
        <div data-reveal>
          <DonateForm lang={lang} s={s} c={d.common} />
        </div>
        <aside>
          <div className="card" style={{ display: "grid", gap: 10 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>{s.why}</h2>
            <ul className="why-list">
              {s.whyList.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}