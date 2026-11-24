"use client";

import { useEffect, useState } from "react";
import { t } from "@/i18n/config";
import { posts as seed, districts } from "@/data/placeholder";
import { postAuthors } from "@/data/console";
import { useRole } from "./ConsoleShell";
import { PageTitle, Panel, Tabs, Status, Drawer, LangField, DistrictPick, Flash, useFlash, fmtDate } from "./ui";

// Newsroom posts — managed by Admins.
const KIND = { statement: "🟥 Statement", report: "✓ Verified report", story: "Story", explainer: "Explainer" };
const FORMAT = { reel: "📱 Reel", video: "▶️ Video", blog: "📝 Blog" };

function detectPlatform(url) {
  if (/youtu\.?be/.test(url)) return "YouTube";
  if (/instagram\.com/.test(url)) return "Instagram";
  if (/facebook\.com|fb\.watch/.test(url)) return "Facebook";
  if (/(twitter|x)\.com/.test(url)) return "X";
  return url ? "Unknown link" : "";
}

const blank = { id: null, format: "reel", link: "", title: { en: "", bn: "", hi: "" }, story: { en: "", bn: "", hi: "" }, kind: "story", district: "", status: "draft" };

export default function Posts() {
  const { role, me } = useRole();
  const ownOnly = false;
  const [list, setList] = useState(() =>
    seed.map((p) => ({ id: p.id, format: p.format, link: p.videoUrl || "", title: p.title, story: p.excerpt, kind: p.kind, district: p.district || "", status: "published", date: p.date, author: postAuthors[p.id] }))
  );
  const [tab, setTab] = useState(ownOnly ? "mine" : "all");
  const [edit, setEdit] = useState(null);
  const [msg, flash] = useFlash();

  useEffect(() => { if (window.location.search.includes("new=1")) setEdit({ ...blank }); }, []);
  useEffect(() => { setTab(ownOnly ? "mine" : "all"); }, [ownOnly]);

  // Admins edit everything here (contributors work in "My submissions").
  const canEdit = () => role === "admin";
  const shown = list.filter((p) => tab === "all" || p.author === me.email);

  function save(status) {
    const p = { ...edit, status, author: edit.author || me.email, date: edit.date || new Date().toISOString().slice(0, 10) };
    if (p.id) setList(list.map((x) => (x.id === p.id ? p : x)));
    else setList([{ ...p, id: `new-${Date.now()}` }, ...list]);
    setEdit(null);
    flash(status === "published" ? "Published to the Newsroom and homepage" : "Saved as draft");
  }

  return (
    <>
      <PageTitle title="Newsroom posts" sub="Post the video on YouTube / Instagram / Facebook first, then paste its link here and write the story.">
        <button className="btn btn-saffron" onClick={() => setEdit({ ...blank })}>+ New post</button>
      </PageTitle>
      <Flash msg={msg} />
      <Tabs value={tab} onChange={setTab} tabs={[["mine", "My posts", list.filter((p) => p.author === me.email).length], ["all", "All posts", list.length]]} />
      <Panel>
        <table className="cs-table">
          <thead><tr><th>Post</th><th>Type</th><th>Author</th><th>Date</th><th>Status</th><th /></tr></thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td><b>{t(p.title, "en")}</b><br /><small className="cs-muted">{FORMAT[p.format]}{p.district ? ` · ${t(districts[p.district], "en")}` : ""}</small></td>
                <td>{KIND[p.kind]}</td>
                <td><code>{p.author === me.email ? "you" : p.author}</code></td>
                <td>{fmtDate(p.date)}</td>
                <td><Status kind={p.status === "published" ? "approved" : "review"}>{p.status === "published" ? "Published" : "Draft"}</Status></td>
                <td>
                  {canEdit(p) ? (
                    <button className="btn btn-ghost btn-sm" onClick={() => setEdit({ ...p })}>Edit</button>
                  ) : (
                    <span className="cs-lock" title={p.kind === "statement" ? "Only Leadership can edit official statements" : "Only the author or an Admin Editor can edit this"}>🔒</span>
                  )}
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={6} className="cs-muted">You haven&apos;t created any posts yet.</td></tr>}
          </tbody>
        </table>
      </Panel>

      <Drawer
        open={!!edit}
        title={edit?.id ? "Edit post" : "New post"}
        onClose={() => setEdit(null)}
        footer={edit && (
          <div className="cs-row">
            {edit.id && canEdit(edit) && <button className="btn btn-ghost btn-sm" onClick={() => { setList(list.filter((x) => x.id !== edit.id)); setEdit(null); flash("Post deleted"); }}>🗑 Delete</button>}
            <button className="btn btn-ghost btn-sm" onClick={() => save("draft")}>Save draft</button>
            <button className="btn btn-saffron btn-sm" disabled={!edit.title.en} onClick={() => save("published")}>Publish</button>
          </div>
        )}
      >
        {edit && (
          <div className="form">
            <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend>Format</legend>
              <div className="checks" style={{ marginTop: 6 }}>
                {Object.entries(FORMAT).map(([k, l]) => (
                  <label key={k}><input type="radio" name="fmt" checked={edit.format === k} onChange={() => setEdit({ ...edit, format: k })} /> {l}</label>
                ))}
              </div>
            </fieldset>
            {edit.format !== "blog" && (
              <div className="field">
                <label>Video link</label>
                <input type="url" placeholder="https://www.instagram.com/reel/…" value={edit.link} onChange={(e) => setEdit({ ...edit, link: e.target.value })} />
                {edit.link && <small className="cs-detect">Detected: <b>{detectPlatform(edit.link)}</b> — thumbnail is fetched from the link</small>}
              </div>
            )}
            <LangField label="Headline" value={edit.title} onChange={(v) => setEdit({ ...edit, title: v })} />
            <LangField label="Story" value={edit.story} onChange={(v) => setEdit({ ...edit, story: v })} multiline rows={6} />
            <div className="field">
              <label>Type</label>
              <select value={edit.kind} onChange={(e) => setEdit({ ...edit, kind: e.target.value })} disabled={edit.kind === "statement"}>
                <option value="story">Story</option>
                <option value="explainer">Explainer</option>
                <option value="report">Verified ground report</option>
                {edit.kind === "statement" && <option value="statement">Official statement</option>}
              </select>
              <small className="cs-muted">Official statements are issued from <a className="link-arrow" href="/console/statements">Official statements</a>.</small>
            </div>
            <DistrictPick value={edit.district} onChange={(v) => setEdit({ ...edit, district: v })} />
          </div>
        )}
      </Drawer>
    </>
  );
}
