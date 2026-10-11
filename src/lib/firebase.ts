/**
 * Firebase client SDK setup.
 *
 * All config values come from NEXT_PUBLIC_* environment variables (see
 * .env.local.example) so the same build can point at different Firebase
 * projects without code changes. These values are safe to expose in the
 * browser bundle — they identify the project, they are not secrets.
 * Access to data is enforced by firestore.rules, not by hiding this config.
 */
import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
} else if (process.env.NODE_ENV !== "production") {
  // Helpful during local setup, before a Firebase project is connected.
  console.warn(
    "[firebase] NEXT_PUBLIC_FIREBASE_* env vars are missing — the order form will not be able to save requests until .env.local is set up."
  );
}

export { app, db };
