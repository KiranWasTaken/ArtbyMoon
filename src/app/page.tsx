import { BookmarkLine } from "@/components/home/BookmarkLine";
import { CanvasEditorial } from "@/components/home/CanvasEditorial";
import { ClosingInvitation } from "@/components/home/ClosingInvitation";
import { ExploreIndex } from "@/components/home/ExploreIndex";
import { HeroStudioWall } from "@/components/home/HeroStudioWall";
import { JournalSection } from "@/components/home/JournalSection";
import { PhotographyTeaser } from "@/components/home/PhotographyTeaser";
import { PolaroidTable } from "@/components/home/PolaroidTable";
import { WorkshopsSection } from "@/components/home/WorkshopsSection";
import { getHomeContent } from "@/lib/content/home";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  description: site.description,
  path: "/",
});

/**
 * Homepage. Rhythm moves from the informal studio (taped wall) through the
 * gallery (mounted canvases), the desk (polaroids on notebook paper), the
 * drying line (bookmarks, the one pinned sequence), the darkroom
 * (photography), and back into the light for workshops, journal and a
 * closing invitation. All data comes from getHomeContent().
 * In production, a section with no published work yet (canvas, polaroids,
 * bookmarks, photography) is left out rather than shown with placeholders;
 * workshops and journal keep their designed empty states.
 */
export default async function HomePage() {
  const home = await getHomeContent();
  const { copy } = home;

  return (
    <>
      <HeroStudioWall items={home.studioWall} copy={copy.hero} />
      <ExploreIndex rooms={home.explore} title={copy.explore.title} />
      {home.canvas.subjects.length > 0 && (
        <CanvasEditorial canvas={home.canvas} note={copy.canvas.note} />
      )}
      {home.polaroids.items.length > 0 && (
        <PolaroidTable polaroids={home.polaroids} note={copy.polaroids.note} />
      )}
      {home.bookmarks.items.length > 0 && (
        <BookmarkLine bookmarks={home.bookmarks} />
      )}
      {home.photographs.length > 0 && (
        <PhotographyTeaser
          photographs={home.photographs}
          copy={copy.photography}
        />
      )}
      <WorkshopsSection workshops={home.workshops} copy={copy.workshops} />
      <JournalSection journal={home.journal} copy={copy.journal} />
      <ClosingInvitation
        copy={copy.closing}
        instagram={home.profile.instagram}
      />
    </>
  );
}
