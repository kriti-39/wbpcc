# WBPCC website — roadmap, user journeys & backend plan

_Last updated: 23 Nov 2026_

**Rule of the build:** finish the whole front end (UI) first with placeholder data → then build the backend and connect it. Every screen is designed with its access level in mind, so the backend slots in without redesigning.

---

## 1. Who uses the site — 4 access levels (updated 24 Nov 2026)

| # | Level | How they get in | What they can do |
|---|---|---|---|
| 1 | **Visitor** | No login | See every public page · **Contact form** (feedback, grievance, help, volunteer, suggest a petition…) · **Join as a member** form (₹5 fee) · **Appointment with the State President** · **Sign petitions**. Cannot see any member list. |
| 2 | **Member** | Mobile number (or Member ID) + password, after registering | Everything a visitor can + **Members area**: **Resources** (download campaign printables, create your own placard / poster / leaflet), Appointment (also open to visitors), **Feedback**, profile. |
| 3 | **Contributor** | Team login + 2-step | Write **articles / blogs**, create **petitions** and **campaigns**, then **submit for review**. Until an Admin accepts, the submission is visible **only to Admins** — not the public, not members. |
| 4 | **Admin** | Team login + 2-step | **Full access**: accept or reject contributors' work (accept = live on the website), edit any section, change the **leadership team** (State Committee, 35 District Presidents, organisations), official statements, appointments, **members list (Admins only)**, team & roles, audit log. There is no separate "President" role — the State President's office uses an Admin account. |

**Publishing = live.** When an Admin accepts or publishes in the console, the change is saved and the affected pages refresh within seconds — no code, no redeploy. Drafts and earlier versions are kept, and every team action is in the audit log.

> **Membership:** one type only, fee **₹5**, paid at registration. **Razorpay** payment to be integrated later (backend). No Voter ID is collected.

> **On hold:** how a new member registration is verified before the member gets access — to be decided by the party before backend step B5.

---
## 2. User journeys ("user map")

### Common citizen (came from a reel / WhatsApp link)
```
Lands on a link (event / petition / news)  ─┐
or the homepage                              │
  → sees LIVE ticker + hero + "I want to…"   │
  → What's on near me (district / 📍 near me) → event page → I'm going / Directions / Share on WhatsApp
  → Petitions → petition page → sign (online: name + OTP │ formal: + address) → share
  → Groups → group page → "Ask for help" form → that group's inbox
  → Newsroom → reel / blog / official statement → share
  → ✋ Join us (header, every page) → membership application
```

### Supporter (signed in)
```
Sign in (Google / email OTP) → My account: my signatures · my RSVPs · my tickets
  → Request a petition (goes to the review queue)
```

### Applicant → Member
```
✋ Join us → application (name, phone, district, constituency, groups) → locked member vault
  → Leadership verifies (call / district office) → Approve
  → Member ID issued (e.g. WB-HWH-YTH-0421) + one-time activation link
  → Member activates login → New member (60 days) → Active member
```

### Member (portal)
```
Sign in → Dashboard (district & group announcements)
  → Printables: pick template → fill form → live preview → download PDF (bn / en / hi)
  → Propose petition / campaign / event → review queue → status in "My submissions"
  → Submit ground report + photos/video link → Admin Editor verifies → Newsroom as "Party member · district"
```

### Media person
```
Newsroom → official statements (ID + PDF) · verified reports · press kit · media contact
```

### Content Editor
```
Team sign-in → Console → My posts → New post (type: reel / video / blog; paste YouTube/Instagram/Facebook link; write text in English)
  → auto-translate to বাংলা / हिन्दी → Publish → can edit only own posts later
```

### Admin Editor
```
Team sign-in → Console →
  Landing page: hero text/photo, ticker items, featured campaign, stats
  Events · Groups · Leaders & hierarchy (e.g. new President → edit card → publish → site updates instantly)
  Review queue: members' ground reports → verify / reject with reason
  Editors: add / remove Content & Language Editors
```

### Leadership / President
```
Team sign-in (role email + 2FA) → Leadership desk →
  Issue Official Statement (gets ID WBPCC/ST/2026/xxx + QR PDF)
  Approval queues: petitions · campaigns · petition requests
  Member vault: applications → verify → approve / reject
  (President) Roles: who has which access
```

---

## 3. How content gets in & gets changed ("I need to change names easily")

Everything that is placeholder today becomes an editable record in the **console**:

| Content | Who edits | Example |
|---|---|---|
| Landing page (hero, ticker, featured, stats, shortcuts) | Admin Editor | Change the hero headline for a new campaign |
| Leaders & hierarchy | Admin Editor (President approves) | New State President: edit name + photo, old one moved to "former" |
| Groups | Admin Editor | New wing, new motto, new contact email |
| Events | Admin Editor (later: group coordinators) | Add a rally with date, place, map pin |
| Petitions | Leadership / Admin Editor publish; members propose | Publish an approved member petition |
| Stories / blogs / reels | Content Editors (own) · Admin Editor (all) | Paste a YouTube link + write the story |
| Official statements | Leadership only | Issue statement → ID + QR PDF |
| Translations | Language Editors | Fix a Bangla word on any page |

Each text field has **EN / বাংলা / हिन्दी** tabs. Every save keeps a **version** you can restore.

---

## 4. Backend — recommendation (updated 24 Nov 2026)

**Recommended now: Firebase (Firestore + Authentication) behind the website, hosted on Vercel.**

Why this changed from Payload CMS: the team console is **already built as part of the website** (`/console`), so we don't need a ready-made admin panel any more. Firebase is free to start, and you already know it.

**Everything is operated through the website.** Leadership, editors and members never open Firebase — the console and member portal *are* the control room. Only the Tech Admin opens Firebase, for one-time setup, backups and emergencies.

How "Publish" goes live without code:
1. Someone presses **Publish** in the console.
2. The website's server checks their role, saves the change to Firestore and writes an audit-log entry.
3. It tells the website to refresh just the affected pages (on-demand revalidation) → live within seconds.
4. Visitors read fast, pre-built pages — they don't hit the database on every view, which keeps us inside the free limits.

Pieces:
- **Firestore** — all content, petitions, signatures, posts, audit log; member vault in a separate collection locked by security rules to Leadership.
- **Firebase Authentication** — supporter (Google / email), member and team logins; roles stored on the account and enforced by both the server and the security rules.
- **Server work on Vercel** (not Firebase Functions) — emails (Resend), auto-translation (Google Cloud Translation), statement PDFs + QR.
- **Photos / PDFs** — Firebase Storage needs the pay-as-you-go plan; a free alternative (e.g. Vercel Blob or Cloudinary free tier) can be used instead.

Free plan (Spark) vs pay-as-you-go (Blaze):
- Free covers us at launch: Firestore storage + daily read/write allowances, Google & email sign-in.
- Pay-as-you-go is only needed for: Firebase file storage, Cloud Functions, **phone-number (SMS) login**. Blaze keeps the same free allowance and charges only above it — set a budget alert.
- Biggest risk to the free limit: a viral petition (each signature = one write). Moving to Blaze then costs very little.

_To confirm when the backend starts: current Firebase free limits and prices, 2FA for team logins, SMS provider, photo storage choice._

---

## 5. Front-end (UI) build steps — do these first

| Step | What | Status |
|---|---|---|
| F1 | Homepage, What's on, Petitions, Groups, Leadership, Newsroom (+ detail pages), Join, trilingual, animations, backgrounds | ✅ Done |
| F2 | **Sign-in & accounts UI** — one Sign in page with 3 doors (Supporter · Member · Team), OTP screens, member activation, Supporter "My account" | ✅ Done |
| F3 | **Member portal UI** — dashboard, Printables generator (templates → form → preview → PDF), propose petition/campaign/event, submit ground report, My submissions | ✅ Done |
| F4 | **Remaining public pages** — About (ideology, values, vision, manifesto), Contact & feedback (category → right inbox), Volunteer, Get help, Request a petition, Press kit, Privacy, Terms. History stays "coming soon" | ✅ Done |
| F5 | **Team console UI** — Leadership desk (statements, approval queues, member vault), landing-page editor, translation editor. _If we pick Payload, its built-in admin covers most screens; we only design the Leadership desk & theming._ | ✅ Done |
| F6 | Polish — phone pass, accessibility, speed, WhatsApp/SEO share previews, 404 page | ✅ Done (basic) |

## 6. Backend steps — after the UI

| Step | What |
|---|---|
| B1 ✅ | Firebase emulator + security rules for the 4 levels (19 tests pass) + seed of all placeholder content + demo logins — see docs/BACKEND.md |
| B2 | Team logins + roles + audit log; landing page & content editing live |
| B3 | Auto-translation + language-editor workflow |
| B4 | Supporter sign-in, petition signing (OTP), RSVPs, feedback → email routing |
| B5 | Membership: application → vault → verification → Member ID → portal |
| B6 | Statements with ID + QR PDF; printables PDF generation |
| B7 | Security pass (rate limits, Cloudflare, backups), privacy policy (DPDP Act), launch |