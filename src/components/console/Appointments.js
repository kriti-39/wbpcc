"use client";

import { useState } from "react";
import { t } from "@/i18n/config";
import { districts } from "@/data/placeholder";
import { appointments as seed } from "@/data/console";
import { PageTitle, Panel, Tabs, Status, Drawer, Flash, useFlash, fmtDate } from "./ui";

// Members' requests to meet the State President.
const ST = { new: ["review", "New"], confirmed: ["approved", "Confirmed"], declined: ["rejected", "Declined"] };

export default function Appointments() {
  const [list, setList] = useState(seed);
  const [tab, setTab] = useState("new");
  const [open, setOpen] = useState(null);
  const [slot, setSlot] = useState("");
  const [msg, flash] = useFlash();
  const cur = list.find((a) => a.id === open);
  const set = (id, p) => setList(list.map((a) => (a.id === id ? { ...a, ...p } : a)));
  const shown = list.filter((a) => tab === "all" || a.status === tab);

  return (
    <>
      <PageTitle title="Appointments" sub="Members' requests to meet the State President. Confirm a slot and the member gets an SMS and email." />
      <Flash msg={msg} />
      <Tabs value={tab} onChange={setTab} tabs={[["new", "New", list.filter((a) => a.status === "new").length], ["confirmed", "Confirmed", list.filter((a) => a.status === "confirmed").length], ["all", "All", list.length]]} />
      <Panel>
        <table className="cs-table">
          <thead><tr><th>Request</th><th>Member</th><th>Reason</th><th>Preferred</th><th>Status</th><th /></tr></thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a.id}>
                <td><code>{a.id}</code></td>
                <td>{a.name}<br /><small className="cs-muted">{t(districts[a.district], "en")}</small></td>
                <td>{a.reason}</td>
                <td>{fmtDate(a.date)} · {a.time}<br /><small className="cs-muted">{a.mode}</small></td>
                <td><Status kind={ST[a.status][0]}>{ST[a.status][1]}</Status></td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => { setOpen(a.id); setSlot(a.slot || `${fmtDate(a.date)}, ${a.time}`); }}>Open</button></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={6} className="cs-muted">Nothing here.</td></tr>}
          </tbody>
        </table>
      </Panel>

      <Drawer open={!!cur} title={cur ? `Appointment ${cur.id}` : ""} onClose={() => setOpen(null)}
        footer={cur?.status === "new" && (
          <div className="cs-row">
            <button className="btn btn-ghost btn-sm" onClick={() => { set(cur.id, { status: "declined" }); setOpen(null); flash("Declined — the member has been told"); }}>✕ Decline</button>
            <button className="btn btn-saffron btn-sm" onClick={() => { set(cur.id, { status: "confirmed", slot }); setOpen(null); flash("Confirmed — SMS & email sent to the member"); }}>✓ Confirm slot</button>
          </div>
        )}>
        {cur && (
          <div className="form">
            <dl className="cs-dl">
              <dt>Name</dt><dd>{cur.name}</dd>
              <dt>Member ID</dt><dd><code>{cur.memberId}</code></dd>
              <dt>Phone</dt><dd>{cur.phone}</dd>
              <dt>District</dt><dd>{t(districts[cur.district], "en")}</dd>
              <dt>Who</dt><dd>{cur.who}</dd>
              <dt>Reason</dt><dd>{cur.reason}</dd>
              <dt>Request</dt><dd>{cur.describe}</dd>
              <dt>Preferred</dt><dd>{fmtDate(cur.date)}, {cur.time} · {cur.mode} · {cur.people} {cur.people === 1 ? "person" : "people"}</dd>
            </dl>
            <div className="field"><label>Confirmed date & time</label><input value={slot} onChange={(e) => setSlot(e.target.value)} disabled={cur.status !== "new"} /></div>
          </div>
        )}
      </Drawer>
    </>
  );
}
