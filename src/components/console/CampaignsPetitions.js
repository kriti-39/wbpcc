"use client";

import { useState } from "react";
import { t } from "@/i18n/config";
import { petitions as petSeed, campaigns as campSeed, events, groups, districts } from "@/data/placeholder";

import { useRole } from "./ConsoleShell";
import { PageTitle, Panel, Tabs, Status, Drawer, LangField, DistrictPick, Flash, useFlash, fmtDate } from "./ui";

// Start petitions & campaigns directly (Admin).
// Contributors create theirs under "My submissions" → Review queue.
const tri = (x) => x || { en: "", bn: "", hi: "" };
const PSTATUS = { live: ["approved", "Live"], closed: ["review", "Closed"], submitted: ["changes", "Submitted to govt"], won: ["approved", "Won 🎉"], draft: ["review", "Draft"] };

export default function CampaignsPetitions() {
  const { role } = useRole();
  const lead = role === "admin";
  const canStartPet = lead;
  const canStartCamp = lead;
  const canStart = canStartPet || canStartCamp;
  const canEditExisting = lead;
  const [tab, setTab] = useState("petitions");
  const [pets, setPets] = useState(petSeed.map((p) => ({ ...p, status: "live", why: p.desc })));
  const [camps, setCamps] = useState(campSeed.map((c) => ({ ...c, desc: tri() })));
  const [ready, setReady] = useState([]);
  const [edit, setEdit] = useState(null); // { type: "petition" | "campaign", item }
  const [msg, flash] = useFlash();

  const blankPet = (from) => ({ id: `petition-${Date.now()}`, type: from?.ptype || "online", signatures: 0, goal: 5000, startedBy: from ? "member" : "leadership", district: from?.district || "", group: "", status: "live",
    title: { en: from?.title || "", bn: "", hi: "" }, why: { en: from?.why || "", bn: "", hi: "" }, addressedTo: { en: from?.authority || "", bn: "", hi: "" }, fromProposal: from?.id });
  const blankCamp = (from) => ({ id: `campaign-${Date.now()}`, group: "", start: "", end: "", featured: false, events: [], petitions: [],
    title: { en: from?.title || "", bn: "", hi: "" }, goal: { en: from?.why || "", bn: "", hi: "" }, desc: tri(), fromProposal: from?.id });

  const patch = (p) => setEdit({ ...edit, item: { ...edit.item, ...p } });
  const toggle = (key, id) => patch({ [key]: edit.item[key].includes(id) ? edit.item[key].filter((x) => x !== id) : [...edit.item[key], id] });

  function save(status) {
    const it = { ...edit.item, status: status || edit.item.status };
    const [list, setter] = edit.type === "petition" ? [pets, setPets] : [camps, setCamps];
    setter(list.find((x) => x.id === it.id) ? list.map((x) => (x.id === it.id ? it : x)) : [it, ...list]);
    if (it.fromProposal) setReady(ready.filter((r) => r.id !== it.fromProposal));
    setEdit(null);
    flash(status === "draft" ? "Saved as draft" : "Published — live on the website in a few seconds");
  }

  return (
    <>
      <PageTitle title="Petitions & campaigns" sub="Start a petition or campaign and publish it straight to the website — no code. Contributors' submissions arrive through the Review queue.">
        <button className="btn btn-ghost" disabled={!canStartCamp} title={canStartCamp ? "" : "You don't have permission to start campaigns"} onClick={() => setEdit({ type: "campaign", item: blankCamp() })}>✊ Start a campaign</button>
        <button className="btn btn-saffron" disabled={!canStartPet} title={canStartPet ? "" : "You don't have permission to start petitions"} onClick={() => setEdit({ type: "petition", item: blankPet() })}>✍️ Start a petition</button>
      </PageTitle>
      <Flash msg={msg} />

      <Tabs value={tab} onChange={setTab} tabs={[["petitions", "✍️ Petitions", pets.length], ["campaigns", "✊ Campaigns", camps.length]]} />

      <Panel>
        {tab === "petitions" && (
          <table className="cs-table">
            <thead><tr><th>Petition</th><th>Type</th><th>Signatures</th><th>Status</th><th /></tr></thead>
            <tbody>
              {pets.map((p) => (
                <tr key={p.id}>
                  <td><b>{t(p.title, "en")}</b><br /><small className="cs-muted">{p.startedBy === "member" ? "From a contributor" : "Started by the party"}{p.district ? ` · ${t(districts[p.district], "en")}` : ""}</small></td>
                  <td>{p.type === "formal" ? "🏛️ Government" : "🌐 Online"}</td>
                  <td>{p.signatures.toLocaleString("en-IN")} / {Number(p.goal).toLocaleString("en-IN")}</td>
                  <td><Status kind={PSTATUS[p.status][0]}>{PSTATUS[p.status][1]}</Status></td>
                  <td>{canEditExisting ? <button className="btn btn-ghost btn-sm" onClick={() => setEdit({ type: "petition", item: { ...p } })}>Edit</button> : <span className="cs-lock" title="Not in your permissions">🔒</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "campaigns" && (
          <table className="cs-table">
            <thead><tr><th>Campaign</th><th>Runs</th><th>Linked</th><th>Home page</th><th /></tr></thead>
            <tbody>
              {camps.map((c) => (
                <tr key={c.id}>
                  <td><b>{t(c.title, "en")}</b><br /><small className="cs-muted">{t(c.goal, "en")}</small></td>
                  <td>{c.start ? `${fmtDate(c.start)} – ${c.end ? fmtDate(c.end) : "…"}` : "—"}</td>
                  <td>🗓️ {c.events.length} · ✍️ {c.petitions.length}</td>
                  <td>{c.featured ? <Status kind="approved">Featured</Status> : "—"}</td>
                  <td>{canEditExisting ? <button className="btn btn-ghost btn-sm" onClick={() => setEdit({ type: "campaign", item: { ...c } })}>Edit</button> : <span className="cs-lock" title="Not in your permissions">🔒</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <Drawer
        open={!!edit}
        title={edit ? `${edit.type === "petition" ? "Petition" : "Campaign"}${edit.item.fromProposal ? ` — from ${edit.item.fromProposal}` : ""}` : ""}
        onClose={() => setEdit(null)}
        footer={edit && (
          <div className="cs-row">
            <button className="btn btn-ghost btn-sm" onClick={() => save("draft")}>Save draft</button>
            <button className="btn btn-saffron btn-sm" disabled={!edit.item.title.en} onClick={() => save(edit.type === "petition" && edit.item.status === "draft" ? "live" : undefined)}>Publish to website</button>
          </div>
        )}
      >
        {edit?.type === "petition" && (
          <div className="form">
            <LangField label="Petition title" value={edit.item.title} onChange={(v) => patch({ title: v })} />
            <LangField label="Why this matters" value={edit.item.why} onChange={(v) => patch({ why: v })} multiline rows={5} />
            <LangField label="Addressed to (who must act)" value={edit.item.addressedTo} onChange={(v) => patch({ addressedTo: v })} />
            <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend>Type</legend>
              <div className="checks" style={{ marginTop: 6 }}>
                <label><input type="radio" checked={edit.item.type === "online"} onChange={() => patch({ type: "online" })} /> 🌐 Online signatures</label>
                <label><input type="radio" checked={edit.item.type === "formal"} onChange={() => patch({ type: "formal" })} /> 🏛️ For government (collects name + address)</label>
              </div>
            </fieldset>
            <div className="cs-two">
              <div className="field"><label>Signature goal</label><input type="number" min={100} value={edit.item.goal} onChange={(e) => patch({ goal: e.target.value })} /></div>
              <div className="field"><label>Closes on</label><input type="date" /></div>
            </div>
            <DistrictPick value={edit.item.district} onChange={(v) => patch({ district: v })} />
            <div className="field"><label>Group</label><select value={edit.item.group || ""} onChange={(e) => patch({ group: e.target.value })}><option value="">— None —</option>{groups.map((g) => <option key={g.id} value={g.id}>{g.icon} {t(g.name, "en")}</option>)}</select></div>
            <div className="field"><label>Status</label><select value={edit.item.status} onChange={(e) => patch({ status: e.target.value })}>{Object.entries(PSTATUS).map(([k, v]) => <option key={k} value={k}>{v[1]}</option>)}</select></div>
          </div>
        )}
        {edit?.type === "campaign" && (
          <div className="form">
            <LangField label="Campaign name" value={edit.item.title} onChange={(v) => patch({ title: v })} />
            <LangField label="Goal (one line)" value={edit.item.goal} onChange={(v) => patch({ goal: v })} />
            <LangField label="About the campaign" value={edit.item.desc} onChange={(v) => patch({ desc: v })} multiline rows={5} />
            <div className="cs-two">
              <div className="field"><label>Starts</label><input type="date" value={edit.item.start} onChange={(e) => patch({ start: e.target.value })} /></div>
              <div className="field"><label>Ends</label><input type="date" value={edit.item.end} onChange={(e) => patch({ end: e.target.value })} /></div>
            </div>
            <div className="field"><label>Leading group</label><select value={edit.item.group || ""} onChange={(e) => patch({ group: e.target.value })}><option value="">Whole party</option>{groups.map((g) => <option key={g.id} value={g.id}>{g.icon} {t(g.name, "en")}</option>)}</select></div>
            <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend>Events in this campaign</legend>
              <div className="checks" style={{ marginTop: 6 }}>{events.map((e) => <label key={e.id}><input type="checkbox" checked={edit.item.events.includes(e.id)} onChange={() => toggle("events", e.id)} /> {t(e.title, "en")}</label>)}</div>
            </fieldset>
            <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend>Petitions in this campaign</legend>
              <div className="checks" style={{ marginTop: 6 }}>{pets.map((p) => <label key={p.id}><input type="checkbox" checked={edit.item.petitions.includes(p.id)} onChange={() => toggle("petitions", p.id)} /> {t(p.title, "en")}</label>)}</div>
            </fieldset>
            <div className="field"><label>Cover photo</label><label className="dropzone"><span>🖼️ Upload a cover</span><small>Wide photo, at least 1600 px</small><input type="file" accept="image/*" className="sr-only" /></label></div>
            <label className="check"><input type="checkbox" checked={edit.item.featured} onChange={(e) => patch({ featured: e.target.checked })} /> Feature on the landing page</label>
          </div>
        )}
      </Drawer>
    </>
  );
}
