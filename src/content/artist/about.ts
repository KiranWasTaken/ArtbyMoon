import type { AboutContent } from "../types";

/**
 * The About page. Only confirmed context appears here: ArtbyMoon mainly paints
 * with acrylics on canvas and makes small handmade bookmarks (project brief),
 * and posts her work as @art.by.moon_. Everything else (biography,
 * materials, inspirations, how she works, a portrait) stays empty until she
 * writes or approves it. Do not fill gaps with assumed education, awards,
 * exhibitions, philosophy or personal background.
 */
export const about: AboutContent = {
  intro: {
    text: "ArtbyMoon is an artist who paints mainly with acrylics on canvas and makes small handmade bookmarks.",
    status: "draft",
  },
  biography: [],
  practice: {
    summary: {
      text: "Most of her work is acrylic painting on canvas. Alongside it are bookmarks, small enough to keep between pages, painted and lettered by hand.",
      status: "draft",
    },
  },
};
