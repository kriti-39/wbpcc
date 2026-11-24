// Everything the public website shows today, as Firestore documents.
// Shared by `npm run seed` (local emulator) and `npm run live:content` (real project).
import { districts, leaders, districtPresidents, groups, ORG_CATEGORIES } from "../src/data/org";
import {
  events, offices, featured, tickerItems, petitions, posts, statementRegistry, social, campaigns,
} from "../src/data/placeholder";
import {
  ideology, values, vision, manifesto, contactTopics, helpTopics, volunteerSkills, availability, hq, brandColours, history,
} from "../src/data/pages";
import { inspiration } from "../src/data/inspiration";
import { announcements } from "../src/data/portal";

// Firestore can't hold arrays directly inside arrays — catch that early with a clear message.
export function checkShape(v, path) {
  if (Array.isArray(v)) v.forEach((x, i) => {
    if (Array.isArray(x)) throw new Error(`Nested array at ${path}[${i}] — wrap it in an object.`);
    checkShape(x, `${path}[${i}]`);
  });
  else if (v && typeof v === "object" && !(v instanceof Date)) for (const k of Object.keys(v)) checkShape(v[k], `${path}.${k}`);
}

/** @returns {{ col: string, id: string, data: object }[]} */
export function contentDocs(now = new Date(), by = "seed") {
  const out = [];
  const meta = (order) => ({ status: "published", order, updatedAt: now, updatedBy: by });
  const many = (col, items, idOf = (x) => x.id, extra = () => ({})) =>
    items.forEach((item, i) => out.push({
      col, id: String(idOf(item, i)).replace(/\//g, "-"), data: { ...item, ...meta(i), ...extra(item, i) },
    }));
  const one = (col, id, data) => out.push({ col, id, data: { ...data, ...meta(0) } });

  many("leaders", leaders);
  many("districtPresidents", districtPresidents);
  many("groups", groups);
  // Events get real start times (the placeholder file uses "hours from now").
  many("events", events, (e) => e.id, (e) => ({ startsAt: new Date(now.getTime() + e.startInHours * 3600e3) }));
  many("posts", posts);
  many("campaigns", campaigns);
  many("petitions", petitions);
  many("inspiration", inspiration);
  many("offices", offices);

  // Page sections — edited from Console → Edit a page.
  one("pages", "home", { featured, tickerItems });
  one("pages", "about", { ideology, values, vision });
  one("pages", "manifesto", { items: manifesto });
  one("pages", "history", { items: history });
  one("pages", "contact", { topics: contactTopics, helpTopics, volunteerSkills, availability, hq });
  one("pages", "site", { social, brandColours, districts, orgCategories: ORG_CATEGORIES, statementRegistry });

  // Members area.
  many("resources", announcements, (a) => `announcement-${a.id}`, () => ({ kind: "announcement" }));

  out.forEach((d) => checkShape(d.data, `${d.col}/${d.id}`));
  return out;
}

export function countBy(docs) {
  const c = {};
  for (const d of docs) c[d.col] = (c[d.col] || 0) + 1;
  return c;
}
