import { getDictionary } from "@/i18n/config";
import { leaders } from "@/data/placeholder";
import PageHead from "@/components/PageHead";
import { AppointmentForm } from "@/components/PublicForms";
import { t } from "@/i18n/config";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).appointment.title };
}

// Appointment with the State President — members only (sign in first).
export default async function AppointmentPage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const s = d.appointment;
  const p = leaders.find((l) => l.level === "president");
  return (
    <>
      <PageHead crumbHref={`/${lang}/leadership`} crumbLabel={d.committee.title} eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <div className="wrap detail">
        <div data-reveal>
          <AppointmentForm lang={lang} s={s} g={d.joinForm.genders} c={d.common} />
        </div>
        <aside>
          <div className="card leader" style={{ padding: 26 }}>
            <div className="leader-photo" style={{ width: 120, height: 120, fontSize: 40 }} aria-hidden="true">{p.initials}</div>
            <h3>{t(p.name, lang)}</h3>
            <p>{t(p.role, lang)}</p>
          </div>
        </aside>
      </div>
    </>
  );
}