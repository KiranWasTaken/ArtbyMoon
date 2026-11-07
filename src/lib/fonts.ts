import { Caveat, Fraunces, Schibsted_Grotesk } from "next/font/google";

/**
 * Display serif. The SOFT axis rounds the terminals so headings feel brushed
 * rather than engraved; opsz keeps large sizes delicate and small sizes sturdy.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
});

/**
 * Fraunces italic, loaded separately and NOT preloaded (it was a 149 KB
 * preload). It is used only for small italic notes, never above the fold
 * on the homepage. globals.css points .font-display.italic at it.
 */
export const frauncesItalic = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: "italic",
  variable: "--font-fraunces-italic",
  display: "swap",
  preload: false,
});

/** Interface and running text: an editorial grotesk with real newspaper roots. */
export const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

/**
 * Handwritten accent — INTERIM. The intention is to replace this with
 * ArtbyMoon's own digitised lettering (see docs/02-design-system.md).
 */
export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${frauncesItalic.variable} ${schibsted.variable} ${caveat.variable}`;
