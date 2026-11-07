import type { Artwork } from "@/content/types";
import { cn, cssVars } from "@/lib/cn";
import { ArtworkThumb } from "./ArtworkThumb";
import { type Frame, type Layout, packRows, ratioOf } from "./presentation";

export interface GalleryItem {
  artwork: Artwork;
  label: string;
  frame: Frame;
}

interface GalleryWallProps {
  id: string;
  items: GalleryItem[];
  layout: Layout;
  "aria-label": string;
}

const tilts = [-3, 2, -1.5, 3, -2.5, 1.5];
const threads = [2.5, 4, 3, 5, 2.75, 3.75];

export function GalleryWall({
  id,
  items,
  layout,
  "aria-label": ariaLabel,
}: GalleryWallProps) {
  const placed = packRows(items, (i) => ratioOf(i.artwork.media), layout).map(
    ({ item, ...p }) => ({ ...item, ...p }),
  );
  return (
    <ul
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "grid",
        layout === "line"
          ? // Bookmarks keep a real bookmark size (~6–8rem wide) at every width.
            "grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] items-start gap-x-6 gap-y-12 md:grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] md:gap-x-10 lg:gap-y-16"
          : cn(
              "grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-12 lg:gap-y-24",
              layout === "table" ? "items-start" : "items-center",
            ),
      )}
    >
      {placed.map((item, i) => (
        <li
          key={item.artwork.id}
          data-gallery-item
          data-subjects={item.artwork.subjects?.join(" ")}
          className={cn(
            layout === "line"
              ? // Each bookmark draws its stretch of the drying line, gap included.
                "relative before:absolute before:-inset-x-5 before:top-2.5 before:h-px before:bg-line-strong/40"
              : "col-span-(--m) lg:col-span-(--s) lg:col-start-(--c)",
            layout === "table" && i % 2 === 1 && "mt-8 lg:mt-10",
          )}
          style={cssVars({
            "--s": String(item.span),
            "--m": String(layout === "line" ? 1 : item.mobileSpan),
            "--c": item.start ? String(item.start) : "auto",
          })}
        >
          <ArtworkThumb
            artwork={item.artwork}
            label={item.label}
            frame={item.frame}
            tilt={layout === "table" ? tilts[i % tilts.length] : 0}
            thread={threads[i % threads.length]}
            sizes={
              layout === "line"
                ? "9rem"
                : `(min-width: 64rem) ${Math.round((item.span / 12) * 100)}vw, ${item.mobileSpan * 50}vw`
            }
          />
        </li>
      ))}
    </ul>
  );
}
