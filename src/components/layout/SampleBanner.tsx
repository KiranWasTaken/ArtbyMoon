import { sampleMode } from "@/lib/content/artworks";

/**
 * Visible on every page when the site is built with ARTBYMOON_SAMPLE_CONTENT=1,
 * so a sample-content build can never be mistaken for the real site.
 */
export function SampleBanner() {
  if (!sampleMode) return null;
  return (
    <p
      role="note"
      className="eyebrow fixed bottom-3 left-3 z-[75] bg-vermilion-deep px-3 py-2 text-paper-50 shadow-lift"
    >
      Sample content preview · not ArtbyMoon&apos;s work
    </p>
  );
}
