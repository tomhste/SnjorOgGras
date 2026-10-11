# Snjór & Gras

Website for a kids' snow-shoveling / lawn-mowing business on Álftanes,
Iceland — built with Next.js (static export), Tailwind CSS, GSAP animations,
and Firebase (Hosting + Firestore) for the "get a quote" booking form.

**⚠️ This site is wired up to be its own brand-new, standalone Firebase
project.** It does not reuse or touch any other Firebase project you may
already have — follow the steps below to create a fresh one just for this
site.

## What's in here

- `src/app/` — Next.js App Router pages (static export, no server runtime needed)
- `src/components/` — Header, Hero (with GSAP intro + particle effect),
  Services, Team, OrderForm (writes booking requests to Firestore),
  Footer, and `ThemeSwitcher` — a live "pick your look" control with three
  built-in visual themes (**Frost**, **Skafl**, **Gróður**), switchable
  without a reload, remembered in `localStorage`.
- `src/lib/content.ts` — all the real business info (services, team, phone
  number) in one place.
- `src/lib/firebase.ts` — Firebase client SDK setup, reads config from
  `NEXT_PUBLIC_FIREBASE_*` env vars.
- `firestore.rules` — locks the `requests` collection down to
  create-only from the client (nobody can read/list/edit other people's
  quote requests from the browser).
- `firebase.json` / `firestore.indexes.json` / `.firebaserc.example` —
  Firebase Hosting + Firestore project config.

## 1. Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. The order form will work in a harmless "demo"
mode (shows a message instead of saving) until you connect a real Firebase
project — see below.

## 2. Create a brand-new Firebase project (one-time)

Do this once, from the project folder. This creates a project that is
**entirely separate** from any other Firebase project you may already own.

```bash
# Log in (opens a browser; if it can't open one automatically, it'll
# print a URL + ask you to paste back an authorization code)
npx firebase login
# or, in environments that can't open a local browser callback:
npx firebase login --no-localhost

# Create a brand-new project with a unique ID (change the id if it's taken)
npx firebase projects:create snjor-og-gras-alftanes --display-name "Snjór & Gras"

# Point this folder at that new project
npx firebase use --add
# -> pick "snjor-og-gras-alftanes" and alias it "default"

# Turn on Firestore for the new project (choose a region close to Iceland,
# e.g. europe-west1 / eur3) — this one needs the Firebase console:
# https://console.firebase.google.com/project/snjor-og-gras-alftanes/firestore
```

Then copy the web app config into your local env file:

```bash
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_FIREBASE_* with the values from:
# Firebase console -> Project settings -> General -> Your apps -> Web app
```

## 3. Deploy

```bash
npm run build          # static export -> out/
npx firebase deploy --only hosting,firestore:rules
```

Your site will be live at `https://<project-id>.web.app`.

## Picking a look

Click the **"Útlit"** button in the bottom-right corner of the site at any
time (including live, in front of the kids) to switch between the three
built-in visual themes:

| Theme    | Vibe                                              |
| -------- | -------------------------------------------------- |
| Frost    | Clean, minimal — white, black, green               |
| Skafl    | Dark mode with a glowing neon-green accent          |
| Gróður   | Warm, natural — cream background, deep green        |

Whatever gets picked is remembered automatically for the next visit.

## Security

- Firestore rules only allow **creating** a request from the client — no
  reading, listing, updating, or deleting. Other customers' contact info
  is never exposed to the browser.
- Firebase web config (`NEXT_PUBLIC_FIREBASE_*`) is not a secret — it just
  identifies the project; access control lives in `firestore.rules`.
