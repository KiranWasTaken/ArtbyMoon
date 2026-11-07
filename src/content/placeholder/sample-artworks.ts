import type { StaticImageData } from "next/image";
import type { Artwork, Media } from "../types";
import abstract1x1 from "./sample-images/abstract-1x1.jpg";
import abstract3x4 from "./sample-images/abstract-3x4.jpg";
import bookmark from "./sample-images/bookmark.jpg";
import canvas1x1 from "./sample-images/canvas-1x1.jpg";
import canvas3x4 from "./sample-images/canvas-3x4.jpg";
import canvas4x3 from "./sample-images/canvas-4x3.jpg";
import canvas4x5 from "./sample-images/canvas-4x5.jpg";
import detail3x2 from "./sample-images/detail-3x2.jpg";
import polaroid from "./sample-images/polaroid.jpg";

/**
 * SAMPLE CONTENT, NOT ARTBYMOON'S WORK. Loaded only when the site is built
 * with ARTBYMOON_SAMPLE_CONTENT=1, to review gallery and detail layouts before
 * real photographs exist. Titles say "Sample", years are 2099 and every
 * image is stamped "SAMPLE IMAGE · NOT ARTWORK". Sketches is left empty on
 * purpose so the empty-collection state can be reviewed too.
 */

function img(data: StaticImageData, alt: string): Media {
  return {
    kind: "image",
    image: {
      src: data.src,
      width: data.width,
      height: data.height,
      blurDataURL: data.blurDataURL,
      alt,
    },
  };
}

const altSample = (what: string) => `Sample image standing in for ${what}`;

export const sampleArtworks: Artwork[] = [
  {
    id: "sample-canvas-01",
    slug: "sample-canvas-01",
    collection: "canvas",
    featured: true,
    order: 1,
    title: "Sample canvas 01",
    medium: "Sample medium",
    dimensions: { width: 40, height: 50, unit: "cm" },
    year: 2099,
    subjects: ["landscapes"],
    availability: "available",
    media: img(canvas4x5, altSample("a canvas painting")),
    gallery: [
      {
        media: img(detail3x2, altSample("a close detail")),
        caption: "Sample detail view",
      },
    ],
    description:
      "Sample description. A factual sentence about the work appears here when supplied.",
    note: "Sample artist's note. ArtbyMoon's own words about the piece appear here when she writes them.",
  },
  {
    id: "sample-canvas-02",
    slug: "sample-canvas-02",
    collection: "canvas",
    featured: true,
    order: 2,
    title: "Sample canvas 02",
    year: 2099,
    subjects: ["landscapes"],
    availability: "sold",
    media: img(canvas4x3, altSample("a landscape-format canvas")),
  },
  {
    id: "sample-canvas-03",
    slug: "sample-canvas-03",
    collection: "canvas",
    order: 3,
    title: "Sample canvas 03",
    subjects: ["portraits"],
    media: img(canvas3x4, altSample("a portrait-format canvas")),
  },
  {
    id: "sample-canvas-04",
    slug: "sample-canvas-04",
    collection: "canvas",
    order: 4,
    subjects: ["flowers"],
    media: img(canvas1x1, altSample("a square canvas")),
  },
  {
    // A record whose photograph has not arrived yet: the labelled placeholder renders.
    id: "sample-canvas-05",
    slug: "sample-canvas-05",
    collection: "canvas",
    order: 5,
    title: "Sample canvas 05 (photo to come)",
    subjects: ["animals"],
    media: {
      kind: "placeholder",
      placeholder: "canvas",
      aspect: { w: 4, h: 5 },
      pigment: "ochre",
    },
  },
  {
    id: "sample-abstract-01",
    slug: "sample-abstract-01",
    collection: "abstract",
    featured: true,
    title: "Sample abstract 01",
    medium: "Sample medium",
    media: img(abstract1x1, altSample("an abstract work")),
  },
  {
    id: "sample-abstract-02",
    slug: "sample-abstract-02",
    collection: "abstract",
    title: "Sample abstract 02",
    media: img(abstract3x4, altSample("an abstract work")),
  },
  ...[1, 2, 3].map((n): Artwork => ({
    id: `sample-polaroid-0${n}`,
    slug: `sample-polaroid-0${n}`,
    collection: "polaroids",
    featured: true,
    title: `Sample polaroid 0${n}`,
    caption: n === 1 ? "Sample caption, transcribed by the artist" : undefined,
    media: img(polaroid, altSample("a polaroid-style painting")),
  })),
  ...[1, 2, 3].map((n): Artwork => ({
    id: `sample-bookmark-0${n}`,
    slug: `sample-bookmark-0${n}`,
    collection: "bookmarks",
    featured: true,
    title: `Sample bookmark 0${n}`,
    media: img(bookmark, altSample("a hand-painted bookmark")),
    gallery:
      n === 1
        ? [
            {
              media: img(bookmark, altSample("the back of a bookmark")),
              caption: "Sample back view",
            },
          ]
        : undefined,
  })),
];
