"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROLES, NAV, navAllows } from "@/data/console";
import { clearSession } from "../session";

// ---------------------------------------------------------------------
// Team console shell. DEMO: the "Viewing as" switcher lets you preview
// each role. Phase 2: the role comes from the signed-in account and the
// server enforces it — the switcher is removed.
// ---------------------------------------------------------------------
const RoleCtx = createContext({ role: "admin", me: ROLES.admin, setRole: () => {} });
export const useRole = () => useContext(RoleCtx);
const KEY = "wbpcc-console-role";

function matchNav(pathname) {
  const items = NAV.filter((n) => n.href);
  return items.filter((n) => pathname === n.href || pathname.startsWith(n.href + "/")).sort((a, b) => b.href.length - a.href.length)[0];
}

export default function ConsoleShell({ children }) {
  const [role, setRoleState] = useState("admin");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r && ROLES[r]) setRoleState(r); else localStorage.removeItem(KEY); } catch {}
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const setRole = (r) => { setRoleState(r); try { localStorage.setItem(KEY, r); } catch {} };
  const me = ROLES[role];
  const current = matchNav(pathname);
  const allowed = !current || navAllows(current, role);

  // Build nav with group headings that only show if they have a visible item.
  const visible = [];
  let pendingGroup = null;
  for (const n of NAV) {
    if (n.group) { pendingGroup = n.group; continue; }
    if (!navAllows(n, role)) continue;
    if (pendingGroup) { visible.push({ group: pendingGroup }); pendingGroup = null; }
    visible.push(n);
  }

  return (
    <RoleCtx.Provider value={{ role, me, setRole }}>
      <div className="cs">
        <aside className={`cs-side${open ? " open" : ""}`}>
          <Link href="/console" className="cs-brand">
            <img src="/brand/logo.svg" alt="" width={40} height={40} />
            <span><b>WBPCC</b><small>Team console</small></span>
          </Link>
          <nav className="cs-nav" aria-label="Console">
            {visible.map((n, i) =>
              n.group ? (
                <p key={`g${i}`} className="cs-group">{n.group}</p>
              ) : (
                <Link key={n.href} href={n.href} aria-current={current?.href === n.href ? "page" : undefined}>
                  <i aria-hidden="true">{n.icon}</i>{n.label}
                </Link>
              )
            )}
          </nav>
          <div className="cs-side-foot">
            <Link href="/en">↗ View website</Link>
            <button type="button" onClick={() => { clearSession(); router.push("/en"); }}>↩ Sign out</button>
          </div>
        </aside>

        <div className="cs-main">
          <header className="cs-top">
            <button type="button" className="cs-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">☰</button>
            <span className="cs-demo">🧪 Preview — nothing is saved</span>
            <label className="cs-role">
              <span>Viewing as</span>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.icon} {r.label}</option>)}
              </select>
            </label>
            <span className="cs-me" title="2-step verification on">🔐 {me.email}</span>
          </header>
          <main className="cs-content">
            {allowed ? children : <NoAccess roleLabel={me.label} />}
          </main>
        </div>
      </div>
    </RoleCtx.Provider>
  );
}

export function NoAccess({ roleLabel }) {
  return (
    <div className="cs-panel cs-noaccess">
      <div className="big">🔒</div>
      <h2>Not available for {roleLabel}</h2>
      <p>This screen is limited to other roles. In the real console it won&apos;t even appear in your menu — the server blocks it too.</p>
      <Link href="/console" className="btn btn-navy btn-sm">Back to dashboard</Link>
    </div>
  );
}
