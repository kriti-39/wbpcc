"use client";

import { useState } from "react";
import { t } from "@/i18n/config";
import { events as evSeed, groups as orgSeed, leaders as ldSeed, districtPresidents as dpSeed, districts } from "@/data/placeholder";
import { inspiration as inSeed } from "@/data/inspiration";
import { PageTitle, Panel, Tabs, Drawer, LangField, DistrictPick, Flash, useFlash, ConfirmPublish, useQueryParam } from "./ui";

// Leadership & organisation (Admin + State President): State Committee,
// 35 District Presidents, frontal organisations / cells / departments, events.
const LEVELS = [["president", "State President"], ["vp", "Vice President"], ["gs", "General Secretary"]];
const CATS = [["frontal", "Frontal organisation"], ["cells", "Cell / department"], ["media", "Media & social media"], ["intuc", "Trade union"]];
const COLOURS = [["var(--saffron)", "Saffron"], ["var(--green)", "Green"], ["var(--sky)", "Sky"], ["var(--navy)", "Navy"], ["var(--navy-2)", "Navy 2"], ["var(--yellow)", "Yellow"]];
const tri = (x) => x || { en: "", bn: "", hi: "" };

function Photo() {
  return <div className="field"><label>Photo</label><label className="dropzone"><span>🖼️ Upload photo</span><small>Square, at least 600 × 600 px</small><input type="file" accept="image/*" className="sr-only" /></label></div>;
}

export default function ContentManager() {
  const [tab, setTab] = useState("committee");
  const [confirming, setConfirming] = useState(false);
  useQueryParam("tab", (v) => { if (["committee", "districts", "orgs", "events", "people"].includes(v)) setTab(v); });
  const [leaders, setLeaders] = useState(ldSeed.map((l) => ({ ...l, bio: tri() })));
  const [dps, setDps] = useState(dpSeed.map((p) => ({ ...p })));
  const [orgs, setOrgs] = useState(orgSeed.map((o) => ({ ...o, about: tri() })));
  const [events, setEvents] = useState(evSeed.map((e) => ({ ...e })));
  const [people, setPeople] = useState(inSeed.map((p) => ({ ...p })));
  const [edit, setEdit] = useState(null); // { type, item }
  const [msg, flash] = useFlash();

  const lists = { committee: [leaders, setLeaders], districts: [dps, setDps], orgs: [orgs, setOrgs], events: [events, setEvents], people: [people, setPeople] };
  const patch = (p) => setEdit({ ...edit, item: { ...edit.item, ...p } });
  function save() {
    const [list, setter] = lists[edit.type];
    setter(list.find((x) => x.id === edit.item.id) ? list.map((x) => (x.id === edit.item.id ? edit.item : x)) : [...list, edit.item]);
    setEdit(null);
    flash("Saved & published — the website updates in a few seconds");
  }
  const blank = {
    committee: { id: `leader-${Date.now()}`, level: "vp", initials: "NP", name: tri(), role: tri(), phone: "", email: "", bio: tri() },
    districts: { id: `dp-${Date.now()}`, district: tri(), name: tri(), initials: "DP", phone: "" },
    orgs: { id: `org-${Date.now()}`, category: "cells", icon: "⭐", color: "var(--sky)", name: tri(), head: tri(), phone: "", email: "", about: tri() },
    events: { id: `event-${Date.now()}`, title: tri(), place: tri(), district: "", group: "", startInHours: 48, durationHours: 3, going: 0, lat: 22.57, lng: 88.36 },
    people: { id: `person-${Date.now()}`, group: "bengal", years: "", initials: "NP", name: tri(), line: tri() },
  };
  const label = { committee: "office-bearer", districts: "district president", orgs: "organisation", events: "event", people: "inspiring person" }[tab];

  return (
    <>
      <PageTitle title="Leadership & organisation" sub="Change the State Committee, District Presidents, organisations and events. Every field has English, Bangla and Hindi.">
        <button className="btn btn-saffron" onClick={() => setEdit({ type: tab, item: blank[tab] })}>+ Add {label}</button>
      </PageTitle>
      <Flash msg={msg} />
      <ConfirmPublish open={confirming} page={edit ? `${{ committee: "State Committee", districts: "District Presidents", orgs: "Organisation", events: "Events", people: "Our inspiration" }[edit.type]} — ${t(edit.item.name || edit.item.title || edit.item.district, "en") || "new entry"}` : ""} onCancel={() => setConfirming(false)} onConfirm={() => { setConfirming(false); save(); }} />
      <Tabs value={tab} onChange={setTab} tabs={[["committee", "🏛️ State Committee", leaders.length], ["districts", "📍 District Presidents", dps.length], ["orgs", "👥 Organisations", orgs.length], ["events", "🗓️ Events", events.length], ["people", "🌟 Inspiration", people.length]]} />
      <Panel>
        <table className="cs-table">
          <tbody>
            {tab === "committee" && leaders.map((l) => (
              <tr key={l.id}><td><b>{t(l.name, "en")}</b><br /><small className="cs-muted">{t(l.role, "en")}</small></td><td>{LEVELS.find((x) => x[0] === l.level)?.[1]}</td><td>{l.phone}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => setEdit({ type: "committee", item: { ...l } })}>Edit</button></td></tr>
            ))}
            {tab === "districts" && dps.map((p) => (
              <tr key={p.id}><td><b>{t(p.district, "en")}</b></td><td>{t(p.name, "en")}</td><td>{p.phone}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => setEdit({ type: "districts", item: { ...p } })}>Edit</button></td></tr>
            ))}
            {tab === "orgs" && orgs.map((o) => (
              <tr key={o.id}><td><b>{o.icon} {t(o.name, "en")}</b><br /><small className="cs-muted">{CATS.find((c) => c[0] === o.category)?.[1]}</small></td><td>{t(o.head, "en")}</td><td>{o.phone}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => setEdit({ type: "orgs", item: { ...o } })}>Edit</button></td></tr>
            ))}
            {tab === "people" && people.map((p) => (
              <tr key={p.id}><td><b>{t(p.name, "en")}</b><br /><small className="cs-muted">{t(p.line, "en")}</small></td><td>{p.years}</td><td>{p.group === "bengal" ? "From Bengal" : "National"}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => setEdit({ type: "people", item: { ...p } })}>Edit</button></td></tr>
            ))}            {tab === "events" && events.map((e) => (
              <tr key={e.id}><td><b>{t(e.title, "en")}</b><br /><small className="cs-muted">📍 {t(e.place, "en")}</small></td><td>{e.district ? t(districts[e.district], "en") : "—"}</td><td>👥 {e.going}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => setEdit({ type: "events", item: { ...e } })}>Edit</button></td></tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Drawer open={!!edit} title={edit ? `Edit ${ { committee: "office-bearer", districts: "district president", orgs: "organisation", events: "event", people: "inspiring person" }[edit.type] }` : ""} onClose={() => setEdit(null)}
        footer={
          <div className="cs-row">
            {edit && lists[edit.type][0].some((x) => x.id === edit.item.id) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { const [list, setter] = lists[edit.type]; setter(list.filter((x) => x.id !== edit.item.id)); setEdit(null); flash("Removed — it disappears from the website in a few seconds"); }}>🗑 Remove</button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => setEdit(null)}>Cancel</button>
            <button className="btn btn-saffron btn-sm" onClick={() => setConfirming(true)}>Submit changes</button>
          </div>
        }>
        {edit?.type === "committee" && (
          <div className="form">
            <LangField label="Name" value={edit.item.name} onChange={(v) => patch({ name: v })} />
            <LangField label="Position" value={edit.item.role} onChange={(v) => patch({ role: v })} />
            <div className="field"><label>Level</label><select value={edit.item.level} onChange={(e) => patch({ level: e.target.value })}>{LEVELS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
            <div className="cs-two"><div className="field"><label>Contact number</label><input value={edit.item.phone} onChange={(e) => patch({ phone: e.target.value })} /></div><div className="field"><label>Email</label><input type="email" value={edit.item.email} onChange={(e) => patch({ email: e.target.value })} /></div></div>
            <Photo />
            <LangField label="Bio" value={edit.item.bio} onChange={(v) => patch({ bio: v })} multiline />
            {edit.item.level === "president" && <p className="cs-warn small">Changing the State President also hands over president@ (password + 2-step reset) on the Team screen.</p>}
          </div>
        )}
        {edit?.type === "districts" && (
          <div className="form">
            <LangField label="District" value={edit.item.district} onChange={(v) => patch({ district: v })} />
            <LangField label="District President's name" value={edit.item.name} onChange={(v) => patch({ name: v })} />
            <div className="field"><label>Contact number</label><input value={edit.item.phone} onChange={(e) => patch({ phone: e.target.value })} /></div>
            <Photo />
          </div>
        )}
        {edit?.type === "orgs" && (
          <div className="form">
            <LangField label="Name" value={edit.item.name} onChange={(v) => patch({ name: v })} />
            <div className="field"><label>Category</label><select value={edit.item.category} onChange={(e) => patch({ category: e.target.value })}>{CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
            <LangField label="One-line description (shown on the card)" value={edit.item.short} onChange={(v) => patch({ short: v })} />
            <LangField label="President / head (shown on its own page)" value={edit.item.head} onChange={(v) => patch({ head: v })} />
            <div className="cs-two"><div className="field"><label>Phone (to connect)</label><input value={edit.item.phone} onChange={(e) => patch({ phone: e.target.value })} /></div><div className="field"><label>Icon (emoji)</label><input value={edit.item.icon} maxLength={4} onChange={(e) => patch({ icon: e.target.value })} /></div></div>
            <LangField label="About" value={edit.item.about} onChange={(v) => patch({ about: v })} multiline />
            <div className="field"><label>Colour</label><div className="checks">{COLOURS.map(([v, l]) => <label key={v}><input type="radio" name="oc" checked={edit.item.color === v} onChange={() => patch({ color: v })} /> <span className="swatch-dot" style={{ background: v }} /> {l}</label>)}</div></div>
          </div>
        )}
        {edit?.type === "events" && (
          <div className="form">
            <LangField label="Title" value={edit.item.title} onChange={(v) => patch({ title: v })} />
            <LangField label="Place" value={edit.item.place} onChange={(v) => patch({ place: v })} />
            <DistrictPick value={edit.item.district} onChange={(v) => patch({ district: v })} />
            <div className="cs-two"><div className="field"><label>Date & time</label><input type="datetime-local" /></div><div className="field"><label>Duration (hours)</label><input type="number" value={edit.item.durationHours} onChange={(e) => patch({ durationHours: +e.target.value })} /></div></div>
            <div className="field"><label>Organisation</label><select value={edit.item.group || ""} onChange={(e) => patch({ group: e.target.value || null })}><option value="">Party (no specific organisation)</option>{orgs.map((g) => <option key={g.id} value={g.id}>{g.icon} {t(g.name, "en")}</option>)}</select></div>
            <div className="cs-two"><div className="field"><label>Map pin — latitude</label><input type="number" step="0.0001" value={edit.item.lat} onChange={(e) => patch({ lat: +e.target.value })} /></div><div className="field"><label>Longitude</label><input type="number" step="0.0001" value={edit.item.lng} onChange={(e) => patch({ lng: +e.target.value })} /></div></div>
          </div>
        )}
        {edit?.type === "people" && (
          <div className="form">
            <LangField label="Name" value={edit.item.name} onChange={(v) => patch({ name: v })} />
            <div className="cs-two">
              <div className="field"><label>Years (e.g. 1882–1962)</label><input value={edit.item.years} onChange={(e) => patch({ years: e.target.value })} /></div>
              <div className="field"><label>Section</label><select value={edit.item.group} onChange={(e) => patch({ group: e.target.value })}><option value="bengal">From Bengal</option><option value="national">Leaders of the nation</option></select></div>
            </div>
            <LangField label="One-line story" value={edit.item.line} onChange={(v) => patch({ line: v })} multiline rows={3} />
            <Photo />
            <p className="form-note">Use official photos the party has the right to publish.</p>
          </div>
        )}
      </Drawer>    </>
  );
}
