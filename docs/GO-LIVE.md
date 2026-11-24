# Put the WBPCC backend online (Firebase) — step by step

Time needed: about 20 minutes. Cost: ₹0 (Spark free plan, no card needed).

> **Good to know:** the website keeps showing its built-in placeholder content until
> backend step B2 connects pages to the database. Doing this setup now is safe — it
> changes nothing on the live website yet.

---

## Part A — in the Firebase website (only you can do this)

### 1. Pick the right Google account
The project should belong to the **party's official Google account**, not a personal one,
so it stays with the party if people change. Sign in to https://console.firebase.google.com with it.

### 2. Create the project
1. **Create a project** → name: `WBPCC Website`.
2. Firebase suggests a **project ID** (e.g. `wbpcc-website`). You can edit it now — **it can never change later.** Note it down.
3. Google Analytics: **turn it off** (not needed; less personal data collected).
4. **Create project.**

### 3. Turn on the database
1. Left menu → **Build → Firestore Database → Create database**.
2. Edition: **Standard**.
3. Location: **`asia-south1 (Mumbai)`** — closest to Bengal. ⚠️ Permanent.
4. Start in **production mode** (everything locked — our rules open exactly what's needed).

### 4. Turn on logins
1. **Build → Authentication → Get started**.
2. **Sign-in method → Email/Password → Enable** (leave "Email link" off) → **Save**.

### 5. Register the website
1. ⚙️ **Project settings → General → Your apps → Web `</>`**.
2. Nickname: `wbpcc-site`. Don't tick Firebase Hosting. **Register app.**
3. You'll see `apiKey`, `authDomain`, `projectId`, `appId`. **Send these 4 values to Claude.**
   They are public by design (every visitor's browser gets them) — safe to share.

### 6. Download the server key (secret!)
1. ⚙️ **Project settings → Service accounts → Generate new private key → Generate key**.
2. Save the file as `F:\JuniorProjects\secrets\wbpcc-service-account.json`
   — a folder **outside** `wbpcc`, so it can never end up on GitHub.
3. **Never** send this file or its contents to anyone, including Claude, and never paste it in chat.
   Anyone with it has full control of the database.

---

## Part B — in your terminal (in `F:\JuniorProjects\wbpcc`)

Replace `YOUR-PROJECT-ID` with the ID from step 2.

### 7. Make sure the Firebase tool uses the party account
```powershell
npx firebase login:list
```
If it shows a different account than the one that owns the project, either add that
account to the project (Project settings → Users and permissions → Add member → Editor), or run:
```powershell
npx firebase login:add
```

### 8. Upload the security rules
```powershell
npm run deploy:rules -- --project YOUR-PROJECT-ID
```

### 9. Load the website's current content into the database
```powershell
npm run live:content -- --project YOUR-PROJECT-ID --key F:\JuniorProjects\secrets\wbpcc-service-account.json
```
Safe to re-run: anything already in the database is left untouched.

### 10. Create the first Admin login
Use the email of the person who will run the site (e.g. the office secretary):
```powershell
npm run live:admin -- --project YOUR-PROJECT-ID --key F:\JuniorProjects\secrets\wbpcc-service-account.json --email admin@yourdomain.org --name "Office secretary"
```
It prints a one-time link. Open it in a browser and set the password. That's the only
time anyone uses the terminal for logins — every other Admin, Contributor and Member
is added from the website's console (built in B2).

### 11. Check it worked
Firebase website → **Firestore Database**: you should see `pages`, `leaders`, `groups`,
`events`, `posts` … and in **Authentication → Users**, your Admin.

---

## What's safe where

| Thing | Where it lives | On GitHub? |
|---|---|---|
| 4 web-app values (`apiKey` …) | `.env.local` + Vercel settings | No (but not secret) |
| Service-account key | `F:\JuniorProjects\secrets\` + Vercel settings | **Never** |
| Security rules | `firestore.rules` | Yes |
| Demo logins in `docs/BACKEND.md` | Local emulator only — they don't exist online | Yes (harmless) |

`.gitignore` already blocks `.env*` files and any `*service-account*.json` inside the project.
