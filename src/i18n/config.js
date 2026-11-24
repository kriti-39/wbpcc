import en from "./en";
import bn from "./bn";
import hi from "./hi";
import pages from "./pages";
import portal from "./portal";
import orgText from "./org";

// English is the default. Order here = order in the language switcher.
export const locales = ["en", "bn", "hi"];
export const defaultLocale = "en";

// Shown in the switcher, each in its own script.
export const localeLabels = { en: "EN", bn: "বাং", hi: "हिं" };
export const localeNames = { en: "English", bn: "বাংলা", hi: "हिन्दी" };

// Main dictionary + the info-page strings from pages.js
const dictionaries = {
  en: { ...en, ...pages.en, ...portal.en, ...orgText.en },
  bn: { ...bn, ...pages.bn, ...portal.bn, ...orgText.bn },
  hi: { ...hi, ...pages.hi, ...portal.hi, ...orgText.hi },
};

export function isLocale(value) {
  return locales.includes(value);
}

export function getDictionary(lang) {
  return dictionaries[lang] ?? dictionaries[defaultLocale];
}

// Locale codes for dates/numbers: bn-IN gives Bengali digits (১২৩).
export const intlLocale = { en: "en-IN", bn: "bn-IN", hi: "hi-IN" };

export function formatNumber(n, lang) {
  return new Intl.NumberFormat(intlLocale[lang] || "en-IN").format(n);
}

// fill("{n} going", { n: "320" }) → "320 going"
export function fill(str, vars = {}) {
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

// Content items store text as { en, bn, hi }. Falls back to English
// when a translation is missing (Phase 2: auto-translate fills these).
export function t(field, lang) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field[defaultLocale] || "";
}
