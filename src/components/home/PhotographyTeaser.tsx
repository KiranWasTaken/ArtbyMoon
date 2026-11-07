import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import { LinkButton } from "@/components/ui/LinkButton";
import type { Copy, PreviewItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { ToneZone } from "@/lib/motion/ToneZone";

/** Grid placement per photo: an asymmetric contact-sheet composition. */
const placement = [
  {
    li: "sm:col-span-2 lg:col-span-7",
    sizes: "(min-width: 64rem) 55vw, 100vw",
  },
  {
    li: "lg:col-span-4 lg:col-start-9 lg:mt-40",
    sizes: "(min-width: 64rem) 30vw, 50vw",
  },
  {
    li: "lg:col-span-3 lg:col-start-3 lg:-mt-24",
    sizes: "(min-width: 64rem) 22vw, 50vw",
  },
];

interface PhotographyTeaserProps {
  photographs: PreviewItem[];
  copy: { title: Copy; intro: Copy };
}

/**
 * The darkroom. The section always carries the dark tokens itself, so its
 * text keeps full contrast even mid-transition, with reduced motion or
 * without JS; ToneZone additionally dims the whole page while it is in view.
 */
export function PhotographyTeaser({
  photographs,
  copy,
}: PhotographyTeaserProps) {
  return (
    <ToneZone
      id="photography"
      aria-labelledby="photo-title"
      className="page-x bg-surface py-section text-ink"
      data-tone="darkroom"
    >
      <div className="mx-auto grid max-w-page gap-y-16 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <p className="eyebrow text-ink-muted" data-reveal>
            Photography
          </p>
          <CopyText
            as="h2"
            copy={copy.title}
            id="photo-title"
            className="mt-4 font-display text-display-l"
            data-reveal="lines"
          />
        </div>
        <div
          className="flex flex-col items-start gap-8 lg:col-span-4 lg:col-start-9 lg:self-end"
          data-reveal
        >
          <CopyText as="p" copy={copy.intro} className="text-ink-muted" />
          <LinkButton href="/photography">Enter the journal</LinkButton>
        </div>

        <ul
          aria-label="Photographs"
          className="grid gap-10 sm:grid-cols-2 lg:col-span-12 lg:mt-12 lg:grid-cols-12 lg:gap-x-6"
        >
          {photographs.map((photo, i) => {
            const place = placement[i] ?? placement[0]!;
            return (
              <li key={photo.id} className={cn(place.li)}>
                <figure>
                  <div data-reveal="unveil" className="overflow-hidden">
                    <div data-reveal-inner>
                      <ArtMedia media={photo.media} sizes={place.sizes} />
                    </div>
                  </div>
                  <figcaption className="mt-3 flex justify-between gap-4 text-caption text-ink-muted">
                    <span>
                      {photo.source === "placeholder"
                        ? "Caption to come"
                        : photo.label}
                    </span>
                    <span className="tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </ToneZone>
  );
}
