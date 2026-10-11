import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { CookieNotice } from "@/components/CookieNotice";
import { defaultThemeId } from "@/lib/themes";
import { business } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif used for headlines — the thing that keeps this
// from reading as a generic SaaS-template font stack.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const siteTitle = `${business.name} — Snjómokstur og garðsláttur á Álftanesi`;

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: siteTitle,
  description: business.intro,
  keywords: [
    "snjómokstur Álftanes",
    "garðsláttur Álftanes",
    "snjómokstur innkeyrslur",
    "snjómokstur bílaplön",
    "garðsláttur heimili",
    "Snjór og Gras",
  ],
  authors: [{ name: business.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "is_IS",
    url: business.siteUrl,
    siteName: business.name,
    title: siteTitle,
    description: business.intro,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: business.intro,
  },
};

// Structured data so search engines understand this is a local service
// business (shows up better in local/map-style search results).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: business.name,
  description: business.intro,
  telephone: business.phoneHref.replace("tel:", ""),
  areaServed: {
    "@type": "Place",
    name: business.location,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: business.location,
    addressCountry: "IS",
  },
  url: business.siteUrl,
};

// Applies the saved theme choice to <html> before paint, so switching
// "looks" earlier never causes a flash of the default theme on reload.
const noFlashScript = `(function(){try{var t=localStorage.getItem("snjor-og-gras-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="is"
      data-theme={defaultThemeId}
      // The no-flash script below intentionally overwrites data-theme
      // before hydration if a saved preference differs from the SSR
      // default — that mismatch is expected, not a bug.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#1f5f3f" />
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeSwitcher />
        <CookieNotice />
      </body>
    </html>
  );
}
