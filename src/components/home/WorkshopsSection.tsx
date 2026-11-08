import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { PaintWithMoon } from "@/components/ui/PaintWithMoon";
import {
  WorkshopEmpty,
  WorkshopTicket,
} from "@/components/workshops/WorkshopTicket";
import type { Copy, Workshop } from "@/content/types";

interface WorkshopsSectionProps {
  workshops: Workshop[];
  copy: { intro: Copy; empty: Copy };
}

/** Published sessions as tickets, or one honest "To be announced" ticket. */
export function WorkshopsSection({ workshops, copy }: WorkshopsSectionProps) {
  const shown = workshops.slice(0, 3);
  return (
    <RevealScope
      id="workshops"
      aria-labelledby="workshops-title"
      className="page-x py-section"
    >
      <div className="mx-auto grid max-w-page gap-14 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <p className="eyebrow text-ink-muted" data-reveal>
            Join in
          </p>
          <h2
            id="workshops-title"
            className="mt-4 font-display text-display-l"
            data-reveal="lines"
          >
            <PaintWithMoon />
          </h2>
          <CopyText
            as="p"
            copy={copy.intro}
            className="mt-6 max-w-prose text-lede text-ink-muted"
            data-reveal
          />
        </div>

        <div
          className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7 lg:self-end"
          data-reveal
        >
          {shown.length > 0 ? (
            shown.map((workshop) => (
              <WorkshopTicket key={workshop.slug} workshop={workshop} />
            ))
          ) : (
            <WorkshopEmpty message={copy.empty} />
          )}
        </div>
      </div>
    </RevealScope>
  );
}
