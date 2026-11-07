import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { Handnote } from "@/components/ui/Handnote";
import { LinkButton } from "@/components/ui/LinkButton";
import { pagesCopy } from "@/content/copy/pages";
import { site } from "@/lib/site";

/** Blank prints pegged to a darkroom line: x, width, height, drop (viewBox units). */
const prints = [
  { x: 28, w: 96, h: 66, drop: 14 },
  { x: 150, w: 62, h: 86, drop: 8 },
  { x: 238, w: 88, h: 60, drop: 20 },
];

/**
 * No photographs yet: an honest blank, drawn in pencil rather than filled
 * with stand-in imagery.
 */
export function PhotographyEmpty() {
  const copy = pagesCopy.photography;
  return (
    <RevealScope aria-labelledby="photography-empty-title">
      <div className="grid items-center gap-16 border-t border-line py-14 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16 lg:py-20">
        <div className="relative" data-reveal="draw">
          <svg
            viewBox="0 0 350 140"
            aria-hidden="true"
            className="h-auto w-full overflow-visible text-ink-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          >
            <path data-draw d="M2 12 C 120 22, 230 22, 348 12" />
            {prints.map((p) => (
              <g key={p.x}>
                <path
                  data-draw
                  d={`M${p.x + p.w / 2 - 3} ${14 + p.drop / 3} v10 h6 v-10 z`}
                />
                <path
                  data-draw
                  d={`M${p.x} ${20 + p.drop} h${p.w} v${p.h} h${-p.w} z`}
                />
              </g>
            ))}
          </svg>
          <Handnote className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <CopyText copy={copy.emptyNote} />
          </Handnote>
        </div>
        <div className="flex max-w-lg flex-col items-start gap-6" data-reveal>
          <CopyText
            as="h2"
            id="photography-empty-title"
            copy={copy.emptyTitle}
            className="font-display text-display-m"
          />
          <CopyText
            as="p"
            copy={copy.emptyText}
            className="text-lede text-ink-muted"
          />
          <LinkButton href={site.instagram.url} variant="solid">
            Follow @{site.instagram.handle}
          </LinkButton>
        </div>
      </div>
    </RevealScope>
  );
}
