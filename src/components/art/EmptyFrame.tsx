import type { CollectionStyle } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * A pencil outline of the collection's object, drawn in on reveal: an empty
 * mount, an empty polaroid, a bookmark with its punch hole, a sketchbook
 * page. Used where real work will hang, instead of stand-in imagery.
 */
const shapes: Record<CollectionStyle, { viewBox: string; paths: string[] }> = {
  canvas: {
    viewBox: "0 0 100 125",
    paths: ["M2 2 H98 V123 H2 Z", "M14 15 H86 V110 H14 Z", "M14 110 L28 96"],
  },
  abstract: {
    viewBox: "0 0 100 100",
    paths: ["M2 2 H98 V98 H2 Z", "M2 70 C 30 55, 55 80, 98 40"],
  },
  polaroids: {
    viewBox: "0 0 82 100",
    paths: [
      "M2 2 H80 V98 H2 Z",
      "M7 7 H75 V75 H7 Z",
      "M14 89 C 30 87, 50 90, 62 88",
    ],
  },
  sketches: {
    viewBox: "0 0 100 130",
    paths: [
      "M2 10 H98 V128 H2 Z",
      "M18 4 v12 M34 4 v12 M50 4 v12 M66 4 v12 M82 4 v12",
      "M20 60 C 35 40, 60 85, 80 55",
    ],
  },
  bookmarks: {
    viewBox: "0 0 40 136",
    paths: [
      "M2 2 H38 V134 H2 Z",
      "M20 11 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
    ],
  },
};

export function EmptyFrame({
  collection,
  className,
}: {
  collection: CollectionStyle;
  className?: string;
}) {
  const shape = shapes[collection];
  return (
    <svg
      viewBox={shape.viewBox}
      aria-hidden="true"
      className={cn("h-auto overflow-visible text-ink-muted", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shape.paths.map((d) => (
        <path key={d} d={d} data-draw />
      ))}
    </svg>
  );
}
