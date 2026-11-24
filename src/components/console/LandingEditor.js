"use client";

import { useState } from "react";
import en from "@/i18n/en";
import bn from "@/i18n/bn";
import hi from "@/i18n/hi";
import { t } from "@/i18n/config";
import { tickerItems, events, featured, stats } from "@/data/placeholder";
import { PageTitle, Panel, LangField, Flash, useFlash, ConfirmPublish } from "./ui";

// Landing page editor — Admin. Edits the hero,
// the LIVE ticker, the featured campaign card and the headline numbers.
const tri = (k) => ({ en: en.hero[k], bn: bn.hero[k], hi: hi.hero[k] });

export default function LandingEditor() {
  const [hero, setHero] = useState({ eyebrow: tri("eyebrow"), title: tri("title"), titleEm: tri("titleEm"), sub: tri("sub") });
  const [ticker, setTicker] = useState(tickerItems.map((x, i) => ({ id: i, ...x })));
  const [feat, setFeat] = useState(featured.eventId);
  const [nums, setNums] = useState({ events: stats.eventsThisWeek, districts: stats.districts });
  const [pl, setPl] = useState("en");
  const [dirty, setDirty] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [msg, flash] = useFlash();
  const touch = (fn) => (...a) => { fn(...a); setDirty(true); };

  const move = (i, d) => {
    const n = [...ticker]; const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; setTicker(n); setDirty(true);
  };
  const ev = events.find((e) => e.id === feat);

  return (
    <>
      <PageTitle title="Landing page" sub="What every visitor sees first. Changes go live when you press Publish; every version is kept.">
        <button className="btn btn-ghost" onClick={() => { setDirty(false); flash("Draft saved"); }}>Save draft</button>
        <button className="btn btn-saffron" disabled={!dirty} onClick={() => setConfirming(true)}>Submit changes</button>
      </PageTitle>
      <Flash msg={msg} />
      <ConfirmPublish open={confirming} page="Home page" changes={["Hero text & photo", "LIVE ticker (" + ticker.length + " items)", "Featured campaign", "Headline numbers"]} onCancel={() => setConfirming(false)} onConfirm={() => { setConfirming(false); setDirty(false); flash("Published — the homepage is updated"); }} />
      <p className="cs-muted" style={{ marginTop: -6 }}>Last published by <code>media@wbpcc.org</code> · 23 Nov 2026, 7:04 PM · <a className="link-arrow" href="/console/audit">History</a></p>

      <div className="cs-two wide-left">
        <div className="cs-stack">
          <Panel title="Hero">
            <div className="form">
              <LangField label="Small line above the headline" value={hero.eyebrow} onChange={touch((v) => setHero({ ...hero, eyebrow: v }))} />
              <LangField label="Headline — line 1" value={hero.title} onChange={touch((v) => setHero({ ...hero, title: v }))} />
              <LangField label="Headline — line 2 (saffron)" value={hero.titleEm} onChange={touch((v) => setHero({ ...hero, titleEm: v }))} />
              <LangField label="Sub-line" value={hero.sub} onChange={touch((v) => setHero({ ...hero, sub: v }))} multiline rows={3} />
              <div className="field">
                <label>Hero photo</label>
                <label className="dropzone"><span>🖼️ Upload a photo</span><small>Rally or Congress Bhavan · at least 1600 px wide</small><input type="file" accept="image/*" className="sr-only" onChange={() => setDirty(true)} /></label>
              </div>
            </div>
          </Panel>

          <Panel title="LIVE ticker" actions={<button className="btn btn-ghost btn-sm" onClick={() => { setTicker([...ticker, { id: Date.now(), href: "/", text: { en: "", bn: "", hi: "" } }]); setDirty(true); }}>+ Add item</button>}>
            <div className="cs-list">
              {ticker.map((it, i) => (
                <div key={it.id} className="cs-ticker-item">
                  <div className="cs-order">
                    <button type="button" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                    <button type="button" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                  </div>
                  <div className="form" style={{ flex: 1 }}>
                    <LangField label={`Item ${i + 1}`} value={it.text} onChange={touch((v) => setTicker(ticker.map((x) => (x.id === it.id ? { ...x, text: v } : x))))} />
                    <div className="field"><label>Opens</label><input value={it.href} onChange={touch((e) => setTicker(ticker.map((x) => (x.id === it.id ? { ...x, href: e.target.value } : x))))} /></div>
                  </div>
                  <button type="button" className="cs-x" aria-label="Remove" onClick={() => { setTicker(ticker.filter((x) => x.id !== it.id)); setDirty(true); }}>✕</button>
                </div>
              ))}
            </div>
          </Panel>

          <div className="cs-two">
            <Panel title="Featured “Live now” card">
              <div className="field">
                <label>Event</label>
                <select value={feat} onChange={touch((e) => setFeat(e.target.value))}>
                  {events.map((e) => <option key={e.id} value={e.id}>{t(e.title, "en")}</option>)}
                </select>
              </div>
            </Panel>
            <Panel title="Headline numbers">
              <div className="form">
                <div className="field"><label>Events this week</label><input type="number" value={nums.events} onChange={touch((e) => setNums({ ...nums, events: e.target.value }))} /></div>
                <div className="field"><label>Districts</label><input type="number" value={nums.districts} onChange={touch((e) => setNums({ ...nums, districts: e.target.value }))} /></div>
                <p className="form-note">Groups and petition signatures are counted automatically.</p>
              </div>
            </Panel>
          </div>
        </div>

        <div className="cs-sticky">
          <Panel title="Preview" actions={
            <div className="lang-tabs">
              {[["en", "EN"], ["bn", "বাং"], ["hi", "हिं"]].map(([k, l]) => <button key={k} type="button" aria-pressed={pl === k} onClick={() => setPl(k)}>{l}</button>)}
            </div>
          }>
            <div className="lp-preview" lang={pl}>
              <div className="lp-ticker"><span>LIVE</span><em>{ticker.map((x) => x.text[pl] || x.text.en).filter(Boolean).join("  •  ")}</em></div>
              <div className="lp-hero">
                <small>{hero.eyebrow[pl] || hero.eyebrow.en}</small>
                <h3>{hero.title[pl] || hero.title.en}<br /><em>{hero.titleEm[pl] || hero.titleEm.en}</em></h3>
                <p>{hero.sub[pl] || hero.sub.en}</p>
                <div className="lp-btns"><i>✋ Join</i><i>📍 Events</i><i>✍️ Sign</i></div>
                {ev && <div className="lp-live"><b>● LIVE NOW</b>{t(ev.title, pl)}</div>}
              </div>
              <div className="lp-stats"><span><b>{nums.events}</b>events</span><span><b>6</b>groups</span><span><b>{nums.districts}</b>districts</span></div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
