import {
  Barlow_Condensed, Anek_Bangla, Anek_Devanagari,
  Noto_Sans, Noto_Sans_Bengali, Noto_Sans_Devanagari,
  Noto_Serif_Display, Noto_Serif_Bengali, Noto_Serif_Devanagari,
} from "next/font/google";

// Fonts (shared by the public site and the console):
//  - Barlow Condensed → English headings
//  - Anek Bangla (width axis) → Bangla headings
//  - Anek Devanagari (width axis) → Hindi headings
//  - Noto Sans / Noto Sans Bengali / Noto Sans Devanagari → body text
//  - Noto Serif Display Italic (+ Serif Bengali/Devanagari) → accents like mottos
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--f-barlow" });
const anek = Anek_Bangla({ subsets: ["bengali"], axes: ["wdth"], variable: "--f-anek" });
const anekDeva = Anek_Devanagari({ subsets: ["devanagari"], axes: ["wdth"], variable: "--f-anek-deva" });
const noto = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-noto" });
const bengali = Noto_Sans_Bengali({ subsets: ["bengali"], weight: ["400", "500", "600", "700"], variable: "--f-bengali" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], axes: ["wdth"], variable: "--f-deva" });
const serif = Noto_Serif_Display({ subsets: ["latin"], style: ["italic"], variable: "--f-serif" });
const serifBn = Noto_Serif_Bengali({ subsets: ["bengali"], variable: "--f-serif-bn", preload: false });
const serifHi = Noto_Serif_Devanagari({ subsets: ["devanagari"], variable: "--f-serif-hi", preload: false });

export const fontClasses = [barlow, anek, anekDeva, noto, bengali, deva, serif, serifBn, serifHi].map((f) => f.variable).join(" ");
