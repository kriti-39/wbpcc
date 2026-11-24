"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, localeNames } from "@/i18n/config";

// Always-visible EN | বাং | हिं pill. Keeps the visitor on the same page,
// just swaps the language part of the URL (/en/x → /bn/x).
export default function LanguageSwitcher({ lang, label }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav className="lang" aria-label={label}>
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          lang={l}
          hrefLang={l}
          title={localeNames[l]}
          aria-current={l === lang ? "true" : undefined}
          onClick={() => {
            try { localStorage.setItem("wbpcc-lang", l); } catch {}
          }}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </nav>
  );
}
