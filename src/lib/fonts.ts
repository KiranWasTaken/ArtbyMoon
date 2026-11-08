import { Caveat, DM_Sans, Instrument_Serif } from "next/font/google";

/**
 * All fonts are self-hosted by next/font at build time: no request to an
 * external font service at runtime.
 */

/**
 * Display serif: Instrument Serif. High-contrast, narrow and calm at large
 * sizes, like the titling of an independent gallery catalogue. One weight
 * only (400): never synthesise bold (see `font-synthesis` in globals.css).
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--font-instrument",
  display: "swap",
});

/**
 * Instrument Serif italic: the expressive voice (the "Moon" in the wordmark,
 * captions, quotes). Loaded separately and NOT preloaded, like the previous
 * italic, so it never competes with the roman for first paint.
 * globals.css points `.font-display.italic` and `.wordmark em` at it.
 */
export const instrumentSerifItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-italic",
  display: "swap",
  preload: false,
});

/**
 * Interface and running text: DM Sans, a quiet geometric grotesk with an
 * optical-size axis, so small labels stay open and body text stays even.
 */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-dm-sans",
  display: "swap",
});

/**
 * Handwritten accent, for pencilled annotations only. INTERIM: the
 * intention is to replace this with ArtbyMoon's own digitised lettering
 * (see docs/02-design-system.md).
 */
export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const fontVariables = `${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${dmSans.variable} ${caveat.variable}`;
