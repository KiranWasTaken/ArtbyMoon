import type { Photograph } from "../types";

/**
 * ArtbyMoon's photographs for /photography. Empty until she supplies them:
 * the page shows its "darkroom" empty state. Never add stock or stand-in
 * photographs here.
 *
 * To add one: export sRGB, long edge ≥ 3000px, GPS/EXIF location stripped;
 * put it in public/images/photography/ and add a record with the file's
 * real pixel size and alt text she has approved. Optional fields (title,
 * caption, takenAt, location, category) only appear when filled in.
 *
 * {
 *   id: "photo-…",
 *   image: { src: "/images/photography/….jpg", width: 3000, height: 2000, alt: "…" },
 * }
 */
export const photographs: Photograph[] = [];
