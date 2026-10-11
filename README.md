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

Your site will be live at `https://snjoroggras.web.app` (a short custom
Hosting site name within the `snjor-og-gras-alftanes` project — see
`firebase.json`'s `hosting.site`).

## 4. Turn on real email notifications

When someone submits the order form, the site writes a document into a
`mail` collection in Firestore — but **nothing actually emails you yet**
until you install Firebase's official **"Trigger Email" extension**, which
watches that collection and sends the real email via SMTP.

This needs your email password, so **do this yourself directly in the
Firebase Console** — never paste an email password into a chat with an AI
assistant or anywhere else; the Console's own form keeps it private to
Google/Firebase.

1. In Gmail: turn on
   [2-Step Verification](https://myaccount.google.com/signinoptions/two-step-verification),
   then generate an
   [App Password](https://myaccount.google.com/apppasswords) (pick "Mail"
   as the app). Copy the 16-character code it gives you.
2. Go to the
   [Trigger Email extension page](https://console.firebase.google.com/project/snjor-og-gras-alftanes/extensions/install?ref=firebase/firestore-send-email)
   for this project and click **Install**.
3. When asked for configuration:
   - **Collection path**: `mail`
   - **SMTP connection URI**: `smtps://your-email@gmail.com:YOUR_APP_PASSWORD@smtp.gmail.com:465`
     (swap in the Gmail address you're sending *from* and the app password
     from step 1 — this can be a different account than the one you
     receive at)
   - **Default FROM address**: the same Gmail address
4. Finish the install. From then on, every new document in `mail` gets
   emailed out automatically — no redeploy of the website needed.

The recipient address is hard-coded as
`sturlamar.gardslattur@gmail.com` in `src/lib/content.ts`
(`business.notifyEmail`) and locked in by `firestore.rules`
(`isValidMail`) so the form can only ever notify that one address — update
both files together if it ever needs to change.

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
