import type { CollectionStyle, Media } from "@/content/types";

/**
 * How each collection is shown. The informal-to-formal arc from the homepage
 * carries on: canvases are mounted like a gallery wall, polaroids lie on
 * notebook paper, sketches are taped into a sketchbook, bookmarks hang from
 * a line, abstract works get room to breathe without mounts.
 */
export type Frame = "mount" | "edge" | "print" | "tape" | "hang";
export type Surface = "paper" | "notebook" | "sketchbook";
export type Layout = "wall" | "bold" | "table" | "line";

export interface Presentation {
  layout: Layout;
  frame: Frame;
  surface: Surface;
}

export const presentation: Record<CollectionStyle, Presentation> = {
  canvas: { layout: "wall", frame: "mount", surface: "paper" },
  abstract: { layout: "bold", frame: "edge", surface: "paper" },
  polaroids: { layout: "table", frame: "print", surface: "notebook" },
  sketches: { layout: "wall", frame: "tape", surface: "sketchbook" },
  bookmarks: { layout: "line", frame: "hang", surface: "paper" },
};

export const surfaceClass: Record<Surface, string> = {
  paper: "",
  notebook: "notebook border-y border-line",
  sketchbook: "bg-surface-raised border-y border-line",
};

export function ratioOf(media: Media) {
  return media.kind === "placeholder"
    ? media.aspect.w / media.aspect.h
    : media.image.width / media.image.height;
}

/**
 * Desktop column span (of 12) by orientation, per layout. Wide works get
 * more room; slim bookmarks stay slim. Never crops: the span only sets width.
 */
export function spanFor(layout: Layout, ratio: number): number {
  switch (layout) {
    case "table":
      return 3;
    case "line":
      return 1; // unused: the line layout sizes bookmarks with its own auto-fill grid
    case "bold":
      return ratio >= 1.2 ? 8 : ratio >= 0.9 ? 6 : 5;
    default:
      return ratio >= 1.2 ? 6 : ratio >= 0.9 ? 4 : ratio >= 0.5 ? 4 : 2;
  }
}

/** Mobile column span (of 2): landscapes take the full width. */
export function mobileSpanFor(layout: Layout, ratio: number): 1 | 2 {
  if (layout === "table" || layout === "line") return 1;
  return ratio >= 1.2 ? 2 : 1;
}

export interface Packed<T> {
  item: T;
  span: number;
  mobileSpan: 1 | 2;
  /** Grid column start for a row's first item (offset), when the row has room. */
  start?: number;
}

/**
 * Packs items into rows of a 12-column grid (spans by orientation), then
 * offsets each row's first item, alternating left and right, so the wall
 * reads as hung rather than tiled. One grid, rows aligned on a common eye
 * line; DOM order matches visual order, so tab order is natural.
 * Shared by the artwork gallery and the photography journal.
 */
export function packRows<T>(
  items: T[],
  ratio: (item: T) => number,
  layout: Layout,
): Packed<T>[] {
  const placed: Packed<T>[] = [];
  let rowStart = 0;
  let used = 0;
  let row = 0;
  const closeRow = () => {
    const first = placed[rowStart];
    const left = 12 - used;
    if (first && left > 0 && layout !== "line" && layout !== "table") {
      first.start =
        1 +
        (row % 2 === 0 ? Math.floor(left / 3) : left - Math.floor(left / 3));
    }
    row += 1;
  };
  for (const item of items) {
    const r = ratio(item);
    const span = spanFor(layout, r);
    if (used + span > 12 && placed.length > rowStart) {
      closeRow();
      rowStart = placed.length;
      used = 0;
    }
    placed.push({ item, span, mobileSpan: mobileSpanFor(layout, r) });
    used += span;
  }
  if (placed.length > rowStart) closeRow();
  return placed;
}
