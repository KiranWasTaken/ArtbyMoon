import type { Copy } from "../types";

const draft = (text: string): Copy => ({ text, status: "draft" });

/**
 * Homepage copy. Every line is a DRAFT written from the brief, pending
 * ArtbyMoon's own words. Visit any page with `?review` to highlight drafts.
 * When she approves or rewrites a line, change it here and set
 * `status: "approved"`.
 */
export const homeCopy = {
  hero: {
    eyebrow: draft("Paintings · Polaroids · Bookmarks · Photographs"),
    note: draft("come in, have a look around"),
    intro: draft(
      "Acrylic paintings on canvas, abstract studies, polaroid-sized paintings with handwritten captions, sketches, hand-painted bookmarks and photography, plus art workshops.",
    ),
  },
  explore: {
    title: draft("Explore the work"),
  },
  canvas: {
    note: draft("a first look, by subject"),
  },
  polaroids: {
    note: draft("placeholders, real polaroids to come"),
  },
  photography: {
    title: draft("A separate visual journal"),
    intro: draft(
      "Photographs and behind-the-scenes moments, shown in a darker, quieter viewing room so the images carry the page.",
    ),
  },
  workshops: {
    title: draft("Art workshops"),
    intro: draft(
      "ArtbyMoon has hosted art workshops and will announce future sessions here, with a simple way to reserve a seat.",
    ),
    empty: draft(
      "No sessions are published right now. New dates will appear here first.",
    ),
  },
  journal: {
    title: draft("Journal"),
    intro: draft(
      "Art stories, process notes, announcements, exhibitions and workshop updates.",
    ),
    empty: draft("Nothing published yet."),
  },
  closing: {
    title: draft("Say hello"),
    intro: draft(
      "Whether it's a piece you'd like to own, a commission or a collaboration, the door is open.",
    ),
    explore: draft("Paintings, polaroids, bookmarks and sketches."),
    commission: draft("Artwork enquiries, commissions and collaborations."),
    follow: draft("New work and studio moments, as they happen."),
  },
} as const;

export type HomeCopy = typeof homeCopy;
