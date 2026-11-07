import type { Artwork } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Museum-style caption. Shows only facts that exist on the artwork record;
 * a missing title reads "Title to be confirmed" rather than an invented one.
 */
export function WallLabel({
  artwork,
  className,
}: {
  artwork: Artwork;
  className?: string;
}) {
  const { title, medium, dimensions, year } = artwork;
  const size =
    dimensions &&
    `${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
  const details = [medium, size, year].filter(Boolean);

  return (
    <figcaption className={cn("flex flex-col gap-0.5", className)}>
      <span
        className={cn(
          "font-display text-[1.0625rem] leading-snug",
          !title && "text-ink-muted italic",
        )}
      >
        {title ?? "Title to be confirmed"}
      </span>
      <span className="text-caption text-ink-muted">
        {details.length > 0 ? details.join(" · ") : "Details to come"}
      </span>
    </figcaption>
  );
}
