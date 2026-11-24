"use client";

import Link from "next/link";
import { useSession } from "./session";

// Top-bar link: "Sign in" when signed out; otherwise goes to the right home
// for the role (account / member portal / team console).
export default function AccountLink({ lang, a, areaLabel }) {
  const s = useSession();
  let href = `/${lang}/signin`, label = areaLabel || a.signinLink, icon = "👤";
  if (s?.role === "member") { href = `/${lang}/portal`; label = a.memberPortal; icon = "🪪"; }
  if (s?.role === "team") { href = `/console`; label = a.consoleTitle; icon = "🛡️"; }
  return (
    <Link href={href} className="account-link">
      <span aria-hidden="true">{icon}</span> {label}
    </Link>
  );
}
