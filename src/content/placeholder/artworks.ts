import type {
  CanvasSubject,
  Media,
  Pigment,
  PlaceholderKind,
  PreviewItem,
} from "../types";

/**
 * Stand-ins used until individual photographs of ArtbyMoon's work exist. Each
 * entry carries only structure (where it links, aspect ratio, a pigment for
 * the wash) and is marked `source: "placeholder"`. No titles, dates or
 * descriptions. The data layer (src/lib/content) swaps in real artworks
 * slot by slot as they are added to src/content/artist/artworks.ts.
 */

const kindLabel: Record<PlaceholderKind, string> = {
  canvas: "Canvas painting",
  abstract: "Abstract work",
  polaroid: "Polaroid",
  sketch: "Sketch",
  bookmark: "Bookmark",
  photo: "Photograph",
};

export function placeholderMedia(
  kind: PlaceholderKind,
  w: number,
  h: number,
  pigment?: Pigment,
): Media {
  return { kind: "placeholder", placeholder: kind, aspect: { w, h }, pigment };
}

function placeholder(
  id: string,
  href: PreviewItem["href"],
  kind: PlaceholderKind,
  [w, h]: [number, number],
  pigment?: Pigment,
): PreviewItem {
  return {
    id,
    href,
    label: `${kindLabel[kind]} placeholder`,
    media: placeholderMedia(kind, w, h, pigment),
    source: "placeholder",
  };
}

/** Polaroid frames are about 88 × 107 mm, matching her polaroid-style works. */
export const POLAROID: [number, number] = [0.82, 1];
export const BOOKMARK: [number, number] = [1, 3.4];

/** The five pieces pinned to the hero's studio wall, in slot order. */
export const studioWallPlaceholders: PreviewItem[] = [
  placeholder("wall-canvas", "/artworks/canvas", "canvas", [4, 5], "sap"),
  placeholder(
    "wall-bookmark",
    "/artworks/bookmarks",
    "bookmark",
    BOOKMARK,
    "rose",
  ),
  placeholder(
    "wall-polaroid",
    "/artworks/polaroids",
    "polaroid",
    POLAROID,
    "turquoise",
  ),
  placeholder(
    "wall-abstract",
    "/artworks/abstract",
    "abstract",
    [1, 1],
    "cobalt",
  ),
  placeholder(
    "wall-landscape",
    "/artworks/canvas",
    "canvas",
    [4, 3],
    "vermilion",
  ),
];

/** Canvas subjects from the brief, each with the proportion its work tends to use. */
export const canvasSubjectPlaceholders: CanvasSubject[] = [
  {
    slug: "landscapes",
    title: "Landscapes",
    preview: placeholder(
      "subject-landscapes",
      "/artworks/canvas?subject=landscapes",
      "canvas",
      [4, 3],
      "sap",
    ),
  },
  {
    slug: "portraits",
    title: "Portraits",
    preview: placeholder(
      "subject-portraits",
      "/artworks/canvas?subject=portraits",
      "canvas",
      [3, 4],
      "vermilion",
    ),
  },
  {
    slug: "animals",
    title: "Animals",
    preview: placeholder(
      "subject-animals",
      "/artworks/canvas?subject=animals",
      "canvas",
      [4, 5],
      "ochre",
    ),
  },
  {
    slug: "flowers",
    title: "Flowers",
    preview: placeholder(
      "subject-flowers",
      "/artworks/canvas?subject=flowers",
      "canvas",
      [1, 1],
      "rose",
    ),
  },
];

const polaroidPigments: Pigment[] = [
  "turquoise",
  "ochre",
  "rose",
  "indigo",
  "sap",
  "vermilion",
];

export const polaroidPlaceholders: PreviewItem[] = polaroidPigments.map(
  (pigment, i) =>
    placeholder(
      `polaroid-${i + 1}`,
      "/artworks/polaroids",
      "polaroid",
      POLAROID,
      pigment,
    ),
);

const bookmarkPigments: Pigment[] = [
  "lavender",
  "rose",
  "turquoise",
  "ochre",
  "cobalt",
  "sap",
  "vermilion",
  "indigo",
  "rose",
];

export const bookmarkPlaceholders: PreviewItem[] = bookmarkPigments.map(
  (pigment, i) =>
    placeholder(
      `bookmark-${i + 1}`,
      "/artworks/bookmarks",
      "bookmark",
      BOOKMARK,
      pigment,
    ),
);

export const photographPlaceholders: PreviewItem[] = [
  placeholder("photo-1", "/photography", "photo", [3, 2]),
  placeholder("photo-2", "/photography", "photo", [4, 5]),
  placeholder("photo-3", "/photography", "photo", [2, 3]),
];
