import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { PaintWithMoon } from "@/components/ui/PaintWithMoon";
import {
  WorkshopEmpty,
  WorkshopTicket,
} from "@/components/workshops/WorkshopTicket";
import { pagesCopy } from "@/content/copy/pages";
import { getUpcomingWorkshops } from "@/lib/content/workshops";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Paint with Moon",
  description:
    "Paint with Moon: painting sessions with ArtbyMoon. New dates are announced here.",
  path: "/workshops",
});

/**
 * Published sessions as tickets, or the honest "To be announced" ticket.
 * Booking is an external link per workshop (no booking backend).
 */
export default async function WorkshopsPage() {
  const workshops = await getUpcomingWorkshops();
  const copy = pagesCopy.workshops;
  return (
    <RevealScope
      aria-labelledby="workshops-page-title"
      className="page-x pt-32 pb-section md:pt-40"
    >
      <div className="mx-auto grid max-w-page gap-x-6 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-ink-muted" data-reveal>
            Join in
          </p>
          <h1
            id="workshops-page-title"
            className="mt-4 font-display text-display-l"
            data-reveal="lines"
          >
            <PaintWithMoon />
          </h1>
          <CopyText
            as="p"
            copy={copy.intro}
            className="mt-6 max-w-prose text-lede text-ink-muted"
            data-reveal
          />
        </div>
        <div
          className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7 lg:pt-10"
          data-reveal
        >
          {workshops.length > 0 ? (
            workshops.map((w) => (
              <WorkshopTicket key={w.slug} workshop={w} headingLevel="h2" />
            ))
          ) : (
            <WorkshopEmpty message={copy.empty} headingLevel="h2" />
          )}
        </div>
      </div>
    </RevealScope>
  );
}
