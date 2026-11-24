import { getDictionary } from "@/i18n/config";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).legal.terms };
}

// DRAFT terms of use. Must be reviewed by a lawyer before launch.
const sections = [
  { h: "Using this website", p: ["By using this website you agree to these terms. If you do not agree, please do not use the site."] },
  { h: "Accounts and roles", p: ["Supporters, members and team members each have different access. You are responsible for keeping your login safe. Team accounts are protected with two-step verification."] },
  { h: "What you submit", p: ["Anything you send us — petitions, requests, reports or feedback — must be truthful and lawful. Hate speech, threats, false information or content that targets a private person is not allowed and will be removed."] },
  { h: "Official statements", p: ["Only statements published in our Newsroom with a statement ID (for example WBPCC/ST/2026/041) are official. Anything else attributed to the party should be treated as unverified."] },
  { h: "Petitions", p: ["An online signature on this website is a record of support. It is not a legal digital signature under the Information Technology Act, 2000."] },
  { h: "Moderation", p: ["Our editors may edit, refuse or remove content that breaks these terms. Every change made by our team is logged."] },
  { h: "Links to other platforms", p: ["Videos and posts are hosted on YouTube, Instagram, Facebook and similar platforms. Their own terms and privacy policies apply there."] },
  { h: "Liability", p: ["Placeholder: limitation of liability wording to be drafted by a lawyer."] },
  { h: "Governing law", p: ["Placeholder: these terms are governed by the laws of India; jurisdiction to be confirmed by a lawyer."] },
  { h: "Contact", p: ["Questions about these terms: info@wbpcc.org (placeholder)."] },
];

export default async function TermsPage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return <LegalPage lang={lang} d={d} title={d.legal.terms} sections={sections} />;
}
