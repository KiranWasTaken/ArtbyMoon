import type { StaticImageData } from "next/image";
import type { Photograph } from "../types";
import p16x9 from "./sample-images/photo-16x9.jpg";
import p1x1 from "./sample-images/photo-1x1.jpg";
import p2x3 from "./sample-images/photo-2x3.jpg";
import p3x2 from "./sample-images/photo-3x2.jpg";
import p4x5 from "./sample-images/photo-4x5.jpg";

/**
 * SAMPLE CONTENT, NOT ARTBYMOON'S PHOTOGRAPHY. Loaded only when built with
 * ARTBYMOON_SAMPLE_CONTENT=1, to review the journal layout, the category
 * filter and the viewer. Every image is stamped "SAMPLE IMAGE · NOT
 * ARTWORK"; dates are 2099; categories are "Sample A/B".
 */
const img = (data: StaticImageData, n: number) => ({
  src: data.src,
  width: data.width,
  height: data.height,
  blurDataURL: data.blurDataURL,
  alt: `Sample image ${n}, standing in for a photograph`,
});

const sources = [p3x2, p2x3, p4x5, p16x9, p1x1, p2x3, p3x2, p4x5];

export const samplePhotographs: Photograph[] = sources.map((data, i) => ({
  id: `sample-photo-${String(i + 1).padStart(2, "0")}`,
  image: img(data, i + 1),
  category: i % 2 === 0 ? "Sample A" : "Sample B",
  ...(i === 0 && {
    title: "Sample photograph 01",
    caption:
      "Sample caption. A line about the photograph appears here when supplied.",
    takenAt: "2099-03",
    location: "Sample location",
  }),
  ...(i === 3 && { title: "Sample photograph 04" }),
}));
