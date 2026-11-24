import { getDictionary } from "@/i18n/config";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).legal.privacy };
}

// DRAFT privacy policy, structured around India's DPDP Act 2023.
// Must be reviewed by a lawyer before launch.
const sections = [
  { h: "Who we are", p: ["This website is run by the West Bengal Pradesh Congress Committee (\"WBPCC\", \"we\"). For any privacy question, write to privacy@wbpcc.org (placeholder)."] },
  { h: "What we collect", p: [
    "Browsing: we do not use advertising or tracking cookies. Our servers keep basic technical logs (such as IP address and time) for security.",
    "Petitions: your name, phone or email, and district. For petitions meant for government submission, also your address.",
    "Membership applications: name, phone, optional email, district, assembly constituency and the groups you choose.",
    "Feedback, help and volunteer forms: what you write, plus contact details only if you give them.",
  ] },
  { h: "Why we collect it", p: ["Only for the purpose you gave it to us: counting and delivering petitions, verifying membership, replying to you, or matching you with volunteer work. We never sell or rent personal data."] },
  { h: "Who can see it", p: [
    "Public: only petition signature counts — and your first name and district only if you choose to show them.",
    "Members' personal details are visible only to the State President and the leadership team. Other members cannot see them.",
    "Formal petition details are seen by the leadership and the authority the petition is submitted to.",
  ] },
  { h: "Your location", p: ["The \"Near me\" button uses your location only inside your own browser to sort events. It is never sent to us or stored."] },
  { h: "How long we keep it", p: ["Placeholder: retention periods for each kind of data will be set before launch (for example, petition data deleted a fixed time after the petition closes)."] },
  { h: "Your rights", p: ["Under the Digital Personal Data Protection Act, 2023 you can ask to see, correct or erase your data, withdraw consent, and raise a grievance. Contact our grievance officer at privacy@wbpcc.org (placeholder)."] },
  { h: "Security", p: ["Member data is kept in a separate, locked store. Every time a team member opens it, the access is logged."] },
  { h: "Changes to this policy", p: ["If we change this policy we will update the date at the top of this page."] },
];

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return <LegalPage lang={lang} d={d} title={d.legal.privacy} sections={sections} />;
}
