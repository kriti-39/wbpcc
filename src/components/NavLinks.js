"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function isActive(pathname, href) {
  if (!pathname || !href) return false;
  const clean = href.split("#")[0];
  const parts = clean.split("/").filter(Boolean); // ["en", "events"]
  if (parts.length === 1) return pathname === clean;
  return pathname === clean || pathname.startsWith(clean + "/");
}

// Desktop menu. Items with `children` open a dropdown on hover, focus or click.
function Dropdown({ item, pathname }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = item.children.some((c) => isActive(pathname, c.href));
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <div className={`nav-dd${open ? " open" : ""}`} ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="nav-dd-btn" aria-expanded={open} aria-current={active ? "page" : undefined} onClick={() => setOpen((o) => !o)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
        {item.label} <span aria-hidden="true" className="caret">▾</span>
      </button>
      <div className="nav-dd-panel" role="menu">
        {item.children.map((c) => (
          <Link key={c.href} href={c.href} role="menuitem" aria-current={isActive(pathname, c.href) && !c.href.includes("#") ? "page" : undefined}>{c.label}</Link>
        ))}
      </div>
    </div>
  );
}

export default function NavLinks({ items }) {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Main">
      {items.map((it) =>
        it.children ? (
          <Dropdown key={it.label} item={it} pathname={pathname} />
        ) : (
          <Link key={it.href} href={it.href} className={it.accent ? "nav-accent" : undefined} aria-current={isActive(pathname, it.href) ? "page" : undefined}>
            {it.label}
          </Link>
        )
      )}
    </nav>
  );
}
