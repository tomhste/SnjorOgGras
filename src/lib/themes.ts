/**
 * The three "looks" the site can switch between live (see ThemeSwitcher).
 * Each theme id corresponds to a `[data-theme="id"]` block in globals.css
 * that sets the actual CSS custom properties — this file only holds the
 * metadata needed to render the picker UI itself.
 */

export type ThemeId = "frost" | "skafl" | "grodur";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  swatch: [string, string, string];
}

export const themes: ThemeOption[] = [
  {
    id: "frost",
    name: "Frost",
    description: "Hreint og einfalt — hvítt, svart og grænt.",
    swatch: ["#ffffff", "#111315", "#2fae5c"],
  },
  {
    id: "skafl",
    name: "Skafl",
    description: "Dökkt og flott — neon grænt í myrkrinu.",
    swatch: ["#0a0d10", "#111315", "#39ff8c"],
  },
  {
    id: "grodur",
    name: "Gróður",
    description: "Hlýtt og náttúrulegt — rjómahvítt og djúpgrænt.",
    swatch: ["#f4f1e8", "#1c2a20", "#1f7a43"],
  },
];

export const defaultThemeId: ThemeId = "frost";
