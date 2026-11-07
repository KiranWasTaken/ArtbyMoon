import { RevealScope } from "@/components/motion/RevealScope";
import { PhotoJournal } from "@/components/photography/PhotoJournal";
import { PhotographyEmpty } from "@/components/photography/PhotographyEmpty";
import { CopyText } from "@/components/ui/CopyText";
import { pagesCopy } from "@/content/copy/pages";
import { filterCategories, getPhotographs } from "@/lib/content/photography";
import { RouteTone } from "@/lib/motion/RouteTone";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Photography",
  description:
    "ArtbyMoon's photography: a visual journal, including behind-the-scenes moments from the studio.",
  path: "/photography",
});

/** The darkroom: the whole route (header and footer too) takes the dark tone. */
export default async function PhotographyPage() {
  const photographs = await getPhotographs();
  const copy = pagesCopy.photography;

  return (
    <>
      <RouteTone tone="darkroom" />
      <RevealScope
        aria-labelledby="photography-title"
        className="page-x pt-32 pb-14 md:pt-40 lg:pb-20"
      >
        <div className="mx-auto grid max-w-page gap-x-6 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-ink-muted" data-reveal>
              Photography
            </p>
            <CopyText
              as="h1"
              id="photography-title"
              copy={copy.title}
              className="mt-4 font-display text-display-l"
              data-reveal="lines"
            />
          </div>
          <div
            className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9"
            data-reveal
          >
            <CopyText
              as="p"
              copy={copy.intro}
              className="text-lede text-ink-muted"
            />
            {photographs.length > 0 && (
              <p className="eyebrow text-ink-muted tabular-nums">
                {photographs.length}{" "}
                {photographs.length === 1 ? "photograph" : "photographs"}
              </p>
            )}
          </div>
        </div>
      </RevealScope>

      <section aria-label="Photographs" className="page-x pb-section">
        <div className="mx-auto max-w-page">
          {photographs.length > 0 ? (
            <PhotoJournal
              photographs={photographs}
              categories={filterCategories(photographs)}
            />
          ) : (
            <PhotographyEmpty />
          )}
        </div>
      </section>
    </>
  );
}
