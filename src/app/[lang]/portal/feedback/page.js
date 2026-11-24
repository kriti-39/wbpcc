import { getDictionary } from "@/i18n/config";
import { ContactForm } from "@/components/PublicForms";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).contactForm.types.feedback };
}

export default async function PortalFeedback({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return (
    <div className="portal-stack" style={{ maxWidth: 720 }}>
      <div>
        <h1 className="portal-title">{d.contactForm.types.feedback}</h1>
        <p className="portal-lead">{d.contact.lead}</p>
      </div>
      <ContactForm lang={lang} s={d.contactForm} c={d.common} />
    </div>
  );
}