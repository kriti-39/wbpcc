# WBPCC backend — how it works and how to run it

The backend is **Firebase**: Firestore (the database) + Firebase Auth (logins).
Until the party's real Firebase project exists, everything runs on the
**Firebase emulator** — a private copy of Firebase on your own computer.
Nothing you do locally touches the internet.

## Run it locally

You need two terminals in `F:\JuniorProjects\wbpcc`.

**Terminal 1 — start the local Firebase**
```powershell
npm run emulators
```
Leave it running. Its dashboard is at http://127.0.0.1:4100.
WBPCC uses its own ports (Auth 9199, Firestore 8180, dashboard 4100) so it can
run beside other projects' emulators, which use the default ports.

**Terminal 2 — fill it with the website's content + demo logins**
```powershell
npm run seed
```
The emulator forgets everything when you stop it, so run `npm run seed` again after each restart.

**Check the security rules** (no need to start the emulator first)
```powershell
npm run test:rules
```

## Demo logins (local emulator only)

These accounts exist only in the emulator. Real accounts are created by an
Admin from the console once the real project is connected.

| Access level | Sign in with | Password |
|---|---|---|
| Admin | `admin@wbpcc.org` | `demo-admin-123` |
| Contributor | `contributor1@wbpcc.org` | `demo-contrib-123` |
| Member | mobile `9000000001` | `demo-member-123` |
| Visitor | no login | — |

Source of truth: `scripts/demo-users.mjs`.

## What is stored where

| Collection | What | Who can read | Who can write |
|---|---|---|---|
| `pages/*` | Page sections (home ticker, about, manifesto, history, contact, site) | Everyone (when published) | Admin |
| `leaders`, `districtPresidents`, `groups`, `events`, `posts`, `campaigns`, `petitions`, `inspiration`, `offices` | Website content | Everyone (when published); Admin sees drafts too | Admin |
| `resources` | Members-area announcements & printables | Members, Contributors, Admin | Admin |
| `members/{uid}` | One member's private record | That member + Admin | Admin (member may change language/notifications/district) |
| `submissions` | Contributor articles, campaigns, petitions awaiting review | Author + Admin | Author while pending; only Admin accepts |
| `inbox` | Contact form messages | Admin | Anyone can **send** |
| `appointments` | Appointment requests | Admin | Anyone can **send** |
| `applications` | Join form (₹5, no Voter ID field allowed) | Admin | Anyone can **send** |
| `petitions/{id}/signatures` | Signatures (names/addresses) | Admin | Anyone can **sign** |
| `staff/{uid}` | Admin & Contributor accounts | Admin (+ self) | Admin |
| `audit` | Change log | Admin | Staff add own entries; nobody edits or deletes |

The rules are in `firestore.rules`; the tests that prove them are in `tests/rules.test.mjs`.

**Access levels are stored on the login itself** (a Firebase "custom claim" called `role`:
`member`, `contributor` or `admin`). A login with no role is treated like a visitor.

## Files

| File | Purpose |
|---|---|
| `firebase.json`, `.firebaserc` | Emulator ports; local project id `demo-wbpcc` |
| `firestore.rules` | Who can read/write what |
| `firestore.indexes.json` | Indexes for the review queue |
| `src/lib/firebase/client.js` | Firebase in the browser (console, member area, forms) |
| `src/lib/firebase/admin.js` | Firebase on the server (full access — server code only) |
| `scripts/seed.mjs` | Copies all placeholder content into the emulator |
| `.env.local.example` | Settings template → copy to `.env.local` |

## Going live (when the party's project exists)

1. The party creates a Firebase project under its own Google account (Spark free plan is enough to start).
2. Turn on **Authentication → Email/Password** and **Firestore**.
3. Copy the web-app config into `.env.local` (and later into Vercel) using `.env.local.example`, and remove `NEXT_PUBLIC_USE_EMULATORS`.
4. Create a service-account key for the server and put it in `FIREBASE_SERVICE_ACCOUNT`. **Never commit it, never share it in chat.**
5. Deploy the rules: `npx firebase deploy --only firestore:rules,firestore:indexes --project <real-id>`.
6. Create the first Admin login (one-time script; every later login is made from the console).

Safety: `npm run seed` refuses to run unless it is pointed at the emulator, so demo data can never land in the real project.

## Not done yet (next steps)

- **B2** — real sign-in on `/signin`; the website and console read and write Firestore instead of the placeholder files; publishing refreshes the public pages.
- **B3** — review queue live; auto-translation.
- **B4** — forms send email alerts to the right inbox; OTP for mobile numbers; spam protection (App Check).
- **B5** — Razorpay for the ₹5 fee and donations.
- **B6** — photo uploads, PDFs/QR, final security review, launch.
