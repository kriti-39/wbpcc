"use client";

import { useState } from "react";
import { auditLog, team } from "@/data/console";
import { PageTitle, Panel } from "./ui";

// Read-only record of every team action. Editors can't change or delete it.
export default function AuditLog() {
  const [who, setWho] = useState("");
  const [q, setQ] = useState("");
  const rows = auditLog.filter((e) => (!who || e.who === who) && (!q || `${e.action} ${e.target}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <PageTitle title="Audit log" sub="Every change made by the team — who, what and when. Nobody can edit or delete these entries." />
      <Panel>
        <div className="cs-filters">
          <select value={who} onChange={(e) => setWho(e.target.value)} aria-label="Filter by account">
            <option value="">All accounts</option>
            {team.map((m) => <option key={m.email} value={m.email}>{m.email}</option>)}
          </select>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actions…" aria-label="Search" />
        </div>
        <table className="cs-table">
          <thead><tr><th>When</th><th>Account</th><th>Action</th><th>On</th></tr></thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={i}><td style={{ whiteSpace: "nowrap" }}>{e.at}</td><td><code>{e.who}</code></td><td>{e.action}</td><td>{e.target}</td></tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="cs-muted">No matching entries.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
