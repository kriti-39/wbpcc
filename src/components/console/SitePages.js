"use client";

import { useState } from "react";
import { t } from "@/i18n/config";
import en from "@/i18n/en";
import bn from "@/i18n/bn";
import hi from "@/i18n/hi";
import pagesDict from "@/i18n/pages";
import { ideology, values, vision, manifesto, contactTopics, helpTopics, hq, history } from "@/data/pages";
import { groups, social } from "@/data/placeholder";
import { PageTitle, Panel, LangField, Flash, useFlash, ConfirmPublish, useQueryParam } from "./ui";

// "Edit any section" — every info page and site-wide block, without code.
// Each section saves as a draft or publishes live; every version is kept.
const SECTIONS = [
  { id: "ideology", page: "About", label: "Vision & aim (AICC)", icon: "📜" },
  { id: "values", page: "About", label: "Ethos / values (AICC)", icon: "🤍" },
  { id: "vision", page: "About", label: "Vision (President's quote)", icon: "🕊️" },
  { id: "history", page: "History", label: "Timeline", icon: "🕰️" },
  { id: "manifesto", page: "Manifesto", label: "Promises", icon: "📘" },
  { id: "contact", page: "Contact", label: "Types of contact & inboxes", icon: "✉️" },
  { id: "footer", page: "Site-wide", label: "Footer & contact details", icon: "🧭" },
  { id: "press", page: "Press kit", label: "About-the-party text", icon: "📰" },
];

export default function SitePages() {
  const [sel, setSel] = useState("ideology");
  const [confirming, setConfirming] = useState(false);
  useQueryParam("s", (v) => { if (SECTIONS.find((x) => x.id === v)) setSel(v); });
  const [msg, flash] = useFlash();
  const [state, setState] = useState(() => ({
    ideology: { intro: ideology.intro, pillars: ideology.pillars.map((p) => ({ ...p })) },
    values: values.map((v) => ({ ...v })),
    vision: { quote: vision.quote, points: vision.points.map((p) => ({ ...p })) },
    history: history.map((h) => ({ ...h })),
    manifesto: manifesto.map((m) => ({ ...m, text: { en: m.items.map((i) => i.en).join("\n"), bn: m.items.map((i) => i.bn).join("\n"), hi: m.items.map((i) => i.hi).join("\n") } })),
    contact: contactTopics.map((c) => ({ ...c })),
    help: helpTopics.map((h) => ({ ...h })),
    footer: { address: { en: en.footer.address, bn: bn.footer.address, hi: hi.footer.address }, phone: hq.phone, email: hq.email, handle: social.handle },
    press: { text: { en: pagesDict.en.press.boilerplateText, bn: pagesDict.bn.press.boilerplateText, hi: pagesDict.hi.press.boilerplateText }, media: hq.media },
  }));
  const [published, setPublished] = useState({});
  const set = (key, value) => setState({ ...state, [key]: value });
  const upd = (key, i, patch) => set(key, state[key].map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const cur = SECTIONS.find((s) => s.id === sel);

  return (
    <>
      <PageTitle title="Site pages" sub="Edit any section of the website. Press Publish and the live page updates within seconds — no code, no developer.">
        <button className="btn btn-ghost" onClick={() => flash("Draft saved")}>Save draft</button>
        <button className="btn btn-saffron" onClick={() => setConfirming(true)}>Submit changes</button>
      </PageTitle>
      <Flash msg={msg} />
      <ConfirmPublish open={confirming} page={`${cur.page} · ${cur.label}`} onCancel={() => setConfirming(false)} onConfirm={() => { setConfirming(false); setPublished({ ...published, [sel]: new Date() }); flash(`“${cur.page} · ${cur.label}” is live`); }} />
      <div className="tr-layout">
        <Panel title="Sections">
          <ul className="tr-list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button type="button" aria-pressed={s.id === sel} onClick={() => setSel(s.id)}>
                  <small>{s.page}</small>
                  <b>{s.icon} {s.label}</b>
                  <span>{published[s.id] ? `🟢 Published ${published[s.id].toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Live version · 23 Nov"}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={`${cur.page} · ${cur.label}`} actions={<a className="link-arrow" href={{ ideology: "/en/about#ideology", values: "/en/about#values", vision: "/en/about#vision", history: "/en/history", manifesto: "/en/manifesto", contact: "/en/contact", help: "/en/help", footer: "/en", press: "/en/press-kit" }[sel]} target="_blank" rel="noopener noreferrer">View live page ↗</a>}>
          <div className="form">
            {sel === "ideology" && (
              <>
                <LangField label="Introduction" value={state.ideology.intro} onChange={(v) => set("ideology", { ...state.ideology, intro: v })} multiline />
                {state.ideology.pillars.map((p, i) => (
                  <div key={i} className="cs-sub">
                    <b>{p.icon} Pillar {i + 1}</b>
                    <LangField label="Title" value={p.t} onChange={(v) => set("ideology", { ...state.ideology, pillars: state.ideology.pillars.map((x, j) => (j === i ? { ...x, t: v } : x)) })} />
                    <LangField label="One line" value={p.d} onChange={(v) => set("ideology", { ...state.ideology, pillars: state.ideology.pillars.map((x, j) => (j === i ? { ...x, d: v } : x)) })} />
                  </div>
                ))}
              </>
            )}
            {sel === "values" && state.values.map((v, i) => (
              <div key={i} className="cs-sub">
                <b>{v.icon} Value {i + 1}</b>
                <LangField label="Name" value={v.t} onChange={(x) => upd("values", i, { t: x })} />
                <LangField label="One line" value={v.d} onChange={(x) => upd("values", i, { d: x })} />
              </div>
            ))}
            {sel === "vision" && (
              <>
                <LangField label="The President's quote" value={state.vision.quote} onChange={(v) => set("vision", { ...state.vision, quote: v })} multiline />
                {state.vision.points.map((p, i) => (
                  <LangField key={i} label={`Point ${i + 1}`} value={p} onChange={(v) => set("vision", { ...state.vision, points: state.vision.points.map((x, j) => (j === i ? v : x)) })} />
                ))}
              </>
            )}
            {sel === "history" && (
              <>
                {state.history.map((h, i) => (
                  <div key={i} className="cs-sub">
                    <div className="cs-two">
                      <div className="field"><label>Year</label><input value={h.year} onChange={(e) => upd("history", i, { year: e.target.value })} /></div>
                      <div className="cs-row" style={{ alignItems: "end" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => set("history", state.history.filter((_, j) => j !== i))}>🗑 Remove</button></div>
                    </div>
                    <LangField label="Title" value={h.t} onChange={(v) => upd("history", i, { t: v })} />
                    <LangField label="What happened" value={h.d} onChange={(v) => upd("history", i, { d: v })} multiline rows={3} />
                  </div>
                ))}
                <button type="button" className="btn btn-ghost" onClick={() => set("history", [...state.history, { year: "", t: { en: "", bn: "", hi: "" }, d: { en: "", bn: "", hi: "" } }])}>+ Add a moment</button>
              </>
            )}
            {sel === "manifesto" && state.manifesto.map((m, i) => (
              <div key={m.id} className="cs-sub">
                <b>{m.icon} {t(m.t, "en")}</b>
                <LangField label="Topic name" value={m.t} onChange={(v) => upd("manifesto", i, { t: v })} />
                <LangField label="Promises — one per line" value={m.text} onChange={(v) => upd("manifesto", i, { text: v })} multiline rows={4} />
              </div>
            ))}
            {sel === "contact" && (
              <>
                <p className="form-note">Each topic on the Contact page sends its messages to this inbox.</p>
                {state.contact.map((c, i) => (
                  <div key={c.id} className="cs-inline">
                    <span>{c.icon} {t(c.t, "en")}</span>
                    <input type="email" value={c.inbox} onChange={(e) => upd("contact", i, { inbox: e.target.value })} aria-label={`Inbox for ${t(c.t, "en")}`} />
                  </div>
                ))}
              </>
            )}
            {sel === "help" && (
              <>
                <p className="form-note">Choose which group receives each kind of help request.</p>
                {state.help.map((h, i) => (
                  <div key={h.id} className="cs-inline">
                    <span>{h.icon} {t(h.t, "en")}</span>
                    <select value={h.group || ""} onChange={(e) => upd("help", i, { group: e.target.value || null })} aria-label={`Team for ${t(h.t, "en")}`}>
                      <option value="">State help desk</option>
                      {groups.map((g) => <option key={g.id} value={g.id}>{g.icon} {t(g.name, "en")}</option>)}
                    </select>
                  </div>
                ))}
              </>
            )}
            {sel === "footer" && (
              <>
                <LangField label="Office address" value={state.footer.address} onChange={(v) => set("footer", { ...state.footer, address: v })} />
                <div className="cs-two">
                  <div className="field"><label>Phone</label><input value={state.footer.phone} onChange={(e) => set("footer", { ...state.footer, phone: e.target.value })} /></div>
                  <div className="field"><label>Email</label><input type="email" value={state.footer.email} onChange={(e) => set("footer", { ...state.footer, email: e.target.value })} /></div>
                </div>
                <div className="field"><label>Social handle (all platforms)</label><input value={state.footer.handle} onChange={(e) => set("footer", { ...state.footer, handle: e.target.value })} /></div>
                <div className="cs-two">
                  {["Instagram", "Facebook", "X", "YouTube", "WhatsApp Channel"].map((s) => <div key={s} className="field"><label>{s} link</label><input type="url" placeholder="https://" /></div>)}
                </div>
              </>
            )}
            {sel === "press" && (
              <>
                <LangField label="About the party (journalists copy this)" value={state.press.text} onChange={(v) => set("press", { ...state.press, text: v })} multiline rows={5} />
                <div className="field"><label>Media contact email</label><input type="email" value={state.press.media} onChange={(e) => set("press", { ...state.press, media: e.target.value })} /></div>
                <div className="field"><label>Logo files & leader photos</label><label className="dropzone"><span>🖼️ Upload files</span><small>SVG / PNG / JPG</small><input type="file" multiple className="sr-only" /></label></div>
              </>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
