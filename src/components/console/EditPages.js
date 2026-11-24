"use client";

import Link from "next/link";
import { PageTitle } from "./ui";

// Admin: "Which page do you want to edit?" → opens the right editor.
// Every editor ends with Confirm & submit before anything goes live.
const GROUPS = [
  {
    title: "Home",
    pages: [
      { icon: "🏠", label: "Home page", note: "Hero, LIVE ticker, featured campaign, numbers", href: "/console/landing", live: "/en" },
    ],
  },
  {
    title: "About",
    pages: [
      { icon: "📜", label: "Vision & aim", note: "About page — top section", href: "/console/pages?s=ideology", live: "/en/about#ideology" },
      { icon: "🤍", label: "Ethos / values", note: "About page — values", href: "/console/pages?s=values", live: "/en/about#values" },
      { icon: "🕊️", label: "President's vision", note: "About page — quote & points", href: "/console/pages?s=vision", live: "/en/about#vision" },
      { icon: "🕰️", label: "History", note: "Timeline of Bengal in the Congress story", href: "/console/pages?s=history", live: "/en/history" },
      { icon: "📘", label: "Manifesto", note: "Topics and promises", href: "/console/pages?s=manifesto", live: "/en/manifesto" },
      { icon: "🌟", label: "Our inspiration", note: "People, portraits and stories", href: "/console/content?tab=people", live: "/en/inspiration" },
    ],
  },
  {
    title: "Leadership & organisation",
    pages: [
      { icon: "🏛️", label: "State Committee", note: "President, Vice Presidents, General Secretaries", href: "/console/content?tab=committee", live: "/en/leadership" },
      { icon: "📍", label: "District Presidents", note: "All 35 districts", href: "/console/content?tab=districts", live: "/en/leadership#districts" },
      { icon: "👥", label: "Organisation", note: "Frontal organisations, cells, media, INTUC", href: "/console/content?tab=orgs", live: "/en/groups" },
    ],
  },
  {
    title: "News & take action",
    pages: [
      { icon: "📰", label: "News", note: "Reels, videos, blogs", href: "/console/posts", live: "/en/newsroom" },
      { icon: "🟥", label: "Official statements", note: "With ID and QR code", href: "/console/statements", live: "/en/newsroom" },
      { icon: "✊", label: "Campaigns & petitions", note: "Start, edit or close", href: "/console/campaigns", live: "/en/campaigns" },
      { icon: "🗓️", label: "Events", note: "What's on near you", href: "/console/content?tab=events", live: "/en/events" },
    ],
  },
  {
    title: "Contact & site-wide",
    pages: [
      { icon: "✉️", label: "Contact", note: "Types of contact & which inbox they go to", href: "/console/pages?s=contact", live: "/en/contact" },
      { icon: "🧭", label: "Footer & contact details", note: "Address, phone, social links", href: "/console/pages?s=footer", live: "/en" },
      { icon: "🗞️", label: "Press kit", note: "About-the-party text, logos", href: "/console/pages?s=press", live: "/en/press-kit" },
    ],
  },
];

export default function EditPages() {
  return (
    <>
      <PageTitle title="Edit a page" sub="Pick the page you want to change. Edit it, then Confirm & submit — it goes live on the website in a few seconds." />
      <div className="edit-hub">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2>{g.title}</h2>
            <div className="edit-grid">
              {g.pages.map((p) => (
                <div key={p.label} className="edit-tile">
                  <i aria-hidden="true">{p.icon}</i>
                  <b>{p.label}</b>
                  <small>{p.note}</small>
                  <div className="cs-row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="link-arrow" style={{ fontSize: 13 }}>View live ↗</a>
                    <Link href={p.href} className="btn btn-navy btn-sm">✏️ Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
