"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "./NavLinks";
import { IconHome, IconCalendar, IconPen, IconPlay, IconUsers } from "./Icons";

// Phone-only bottom bar, like an app — thumb-reachable from anywhere.
export default function BottomTabs({ lang, d }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/${lang}`, label: d.nav.home, Icon: IconHome },
    { href: `/${lang}/events`, label: d.nav.events, Icon: IconCalendar },
    { href: `/${lang}/petitions`, label: d.nav.petitions, Icon: IconPen },
    { href: `/${lang}/newsroom`, label: d.nav.news, Icon: IconPlay },
    { href: `/${lang}/groups`, label: d.nav.groups, Icon: IconUsers },
  ];
  return (
    <nav className="tabbar" aria-label="Quick">
      {tabs.map(({ href, label, Icon }) => (
        <Link key={href} href={href} aria-current={isActive(pathname, href) ? "page" : undefined}>
          <Icon />
          {label}
        </Link>
      ))}
    </nav>
  );
}
