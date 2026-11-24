// Seed the LOCAL Firebase emulator with everything the website shows today
// (all the placeholder content) + demo logins for each access level.
//
//   npm run seed          (the emulators must be running: npm run emulators)
//
// Safety: refuses to run unless it points at the emulator, so it can never
// write demo data into the real party project. (The real project uses
// scripts/live.mjs instead — content only, no demo logins.)
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

import { contentDocs, countBy } from "./content.mjs";
import { submissionQueue, appointments, applications } from "../src/data/console";
import { DEMO_USERS } from "./demo-users.mjs";

// `npm run seed` passes --local, which points at WBPCC's emulator ports.
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
let writes = 0;

async function writeDocs(docs) {
  let batch = db.batch(), n = 0;
  for (const d of docs) {
    batch.set(db.collection(d.col).doc(d.id), d.data);
    writes++;
    if (++n === 400) { await batch.commit(); batch = db.batch(); n = 0; }
  }
  if (n) await batch.commit();
  for (const [col, c] of Object.entries(countBy(docs))) console.log(`  ${col.padEnd(20)} ${c}`);
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
    writes++;
    console.log(`  ${u.role.padEnd(12)} ${u.login}`);
  }
  return uids;
}

function sampleQueues(uids) {
  const kindMap = { article: "post", blog: "post", petition: "petition", campaign: "campaign", event: "event" };
  const statusMap = { review: "pending", approved: "accepted", changes: "changes" };
  return [
    ...submissionQueue.map((s) => ({ col: "submissions", id: s.id, data: {
      ...s, kind: kindMap[s.kind] || "post", status: statusMap[s.status] || "pending",
      authorUid: uids.contributor, authorEmail: s.by, title: { en: s.title }, summary: { en: s.summary },
      createdAt: new Date(s.date),
    } })),
    ...appointments.map((a) => ({ col: "appointments", id: a.id, data: { ...a, createdAt: now } })),
    ...applications.map((a) => ({ col: "applications", id: a.id, data: { ...a, createdAt: new Date(a.date), fee: 5 } })),
  ];
}

async function main() {
  console.log(`Seeding emulator project "${PROJECT_ID}" at ${process.env.FIRESTORE_EMULATOR_HOST}\n`);
  console.log("Website content:");
  await writeDocs(contentDocs(now));
  const uids = await seedUsers();
  console.log("Sample review queue & inboxes (visible to Admin only):");
  await writeDocs(sampleQueues(uids));
  await db.collection("audit").add({ actorUid: "seed", actorEmail: "seed", action: "Seeded demo data", target: "all", createdAt: now });
  console.log(`\n✅ Done — ${writes} documents. Open http://127.0.0.1:4100 to look around.`);
}

main().catch((e) => { console.error("❌ Seed failed:", e.message); process.exit(1); });
