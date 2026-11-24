import { getDictionary } from "@/i18n/config";
import { AppointmentForm } from "@/components/PublicForms";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).appointment.title };
}

export default async function PortalAppointment({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const s = d.appointment;
  return (
    <div className="portal-stack" style={{ maxWidth: 860 }}>
      <div>
        <h1 className="portal-title">{s.title}</h1>
        <p className="portal-lead">{s.lead}</p>
      </div>
      <AppointmentForm lang={lang} s={s} g={d.joinForm.genders} c={d.common} requireMember={false} />
    </div>
  );
}