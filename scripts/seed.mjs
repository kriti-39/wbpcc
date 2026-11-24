// Seed the LOCAL Firebase emulator with everything the website shows today
// (all the placeholder content) + demo logins for each access level.
//
//   npm run seed          (the emulators must be running: npm run emulators)
//
// Safety: refuses to run unless FIRESTORE_EMULATOR_HOST is set, so it can
// never write demo data into the real party project.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

import { districts, leaders, districtPresidents, groups, ORG_CATEGORIES } from "../src/data/org";
import {
  events, offices, featured, tickerItems, petitions, posts, statementRegistry, social, campaigns,
} from "../src/data/placeholder";
import {
  ideology, values, vision, manifesto, contactTopics, helpTopics, volunteerSkills, availability, hq, brandColours, history,
} from "../src/data/pages";
import { inspiration } from "../src/data/inspiration";
import { announcements } from "../src/data/portal";
import { submissionQueue, appointments, applications } from "../src/data/console";
import { DEMO_USERS } from "./demo-users.mjs";

// `npm run seed` passes --local, which points at the emulator's default ports.
if (process.argv.includes("--local")) {
  process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8180";
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9199";
}
if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  console.error("✋ Seed only runs against the local emulator. Start it with `npm run emulators`, then `npm run seed`.");
  process.exit(1);
}

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "demo-wbpcc";
initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
const auth = getAuth();

const now = new Date();
const meta = (order) => ({ status: "published", order, updatedAt: now, updatedBy: "seed" });

// Firestore can't hold arrays directly inside arrays — catch that early with a clear message.
function checkShape(v, path) {
  if (Array.isArray(v)) v.forEach((x, i) => {
    if (Array.isArray(x)) throw new Error(`Nested array at ${path}[${i}] — wrap it in an object.`);
    checkShape(x, `${path}[${i}]`);
  });
  else if (v && typeof v === "object" && !(v instanceof Date)) for (const k of Object.keys(v)) checkShape(v[k], `${path}.${k}`);
}

let writes = 0;
async function putAll(col, items, idOf = (x) => x.id, extra = () => ({})) {
  let batch = db.batch(), n = 0;
  for (const [i, item] of items.entries()) {
    const id = String(idOf(item, i)).replace(/\//g, "-");
    const data = { ...item, ...meta(i), ...extra(item, i) };
    checkShape(data, `${col}/${id}`);
    batch.set(db.collection(col).doc(id), data);
    if (++n === 400) { await batch.commit(); batch = db.batch(); n = 0; }
    writes++;
  }
  if (n) await batch.commit();
  console.log(`  ${col.padEnd(20)} ${items.length}`);
}
async function putDoc(col, id, data) {
  const d = { ...data, ...meta(0) };
  checkShape(d, `${col}/${id}`);
  await db.collection(col).doc(id).set(d);
  writes++;
  console.log(`  ${(col + "/" + id).padEnd(20)} 1`);
}

async function seedContent() {
  console.log("Public content:");
  await putAll("leaders", leaders);
  await putAll("districtPresidents", districtPresidents);
  await putAll("groups", groups);
  // Events are stored with real start times (the placeholder uses "hours from now").
  await putAll("events", events, (e) => e.id, (e) => ({
    startsAt: new Date(now.getTime() + e.startInHours * 3600e3),
  }));
  await putAll("posts", posts);
  await putAll("campaigns", campaigns);
  await putAll("petitions", petitions);
  await putAll("inspiration", inspiration);
  await putAll("offices", offices);

  console.log("Page sections (edited from Console → Edit a page):");
  await putDoc("pages", "home", { featured, tickerItems });
  await putDoc("pages", "about", { ideology, values, vision });
  await putDoc("pages", "manifesto", { items: manifesto });
  await putDoc("pages", "history", { items: history });
  await putDoc("pages", "contact", { topics: contactTopics, helpTopics, volunteerSkills, availability, hq });
  await putDoc("pages", "site", { social, brandColours, districts, orgCategories: ORG_CATEGORIES, statementRegistry });

  console.log("Members area:");
  await putAll("resources", announcements, (a) => `announcement-${a.id}`, () => ({ kind: "announcement" }));
}

async function seedUsers() {
  console.log("Demo logins:");
  const uids = {};
  for (const u of DEMO_USERS) {
    let user;
    try { user = await auth.getUserByEmail(u.email); }
    catch { user = await auth.createUser({ email: u.email, password: u.password, displayName: u.name, emailVerified: true }); }
    await auth.updateUser(user.uid, { password: u.password, displayName: u.name });
    await auth.setCustomUserClaims(user.uid, { role: u.role });
    uids[u.key] = user.uid;

    if (u.role === "member") {
      await db.collection("members").doc(user.uid).set({
        memberId: u.memberId, name: u.name, mobile: u.mobile, district: u.district,
        language: "en", status: "active", since: now, createdAt: now,
      });
    } else {
      await db.collection("staff").doc(user.uid).set({
        email: u.email, name: u.name, role: u.role, holder: u.holder, active: true, createdAt: now,
      });
    }
    console.log(`  ${u.role.padEnd(12)} ${u.login}`);
  }
  return uids;
}

async function seedQueues(uids) {
  console.log("Sample review queue & inboxes (visible to Admin only):");
  const kindMap = { article: "post", blog: "post", petition: "petition", campaign: "campaign", event: "event" };
  const statusMap = { review: "pending", approved: "accepted", changes: "changes" };
  await putAll("submissions", submissionQueue, (s) => s.id, (s) => ({
    kind: kindMap[s.kind] || "post",
    status: statusMap[s.status] || "pending",
    authorUid: uids.contributor,
    authorEmail: s.by,
    title: { en: s.title },
    summary: { en: s.summary },
    createdAt: new Date(s.date),
  }));
  await putAll("appointments", appointments, (a) => a.id, (a) => ({ createdAt: now, status: a.status }));
  await putAll("applications", applications, (a) => a.id, (a) => ({ createdAt: new Date(a.date), status: a.status, fee: 5 }));
}

async function main() {
  console.log(`Seeding emulator project "${PROJECT_ID}" at ${process.env.FIRESTORE_EMULATOR_HOST}\n`);
  await seedContent();
  const uids = await seedUsers();
  await seedQueues(uids);
  await db.collection("audit").add({ actorUid: "seed", actorEmail: "seed", action: "Seeded demo data", target: "all", createdAt: now });
  console.log(`\n✅ Done — ${writes} documents. Open http://127.0.0.1:4100 to look around.`);
}

main().catch((e) => { console.error("❌ Seed failed:", e.message); process.exit(1); });
