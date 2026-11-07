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
 */
export default async function HomePage() {
  const home = await getHomeContent();
  const { copy } = home;

  return (
    <>
      <HeroStudioWall items={home.studioWall} copy={copy.hero} />
      <ExploreIndex rooms={home.explore} title={copy.explore.title} />
      <CanvasEditorial canvas={home.canvas} note={copy.canvas.note} />
      <PolaroidTable polaroids={home.polaroids} note={copy.polaroids.note} />
      <BookmarkLine bookmarks={home.bookmarks} />
      <PhotographyTeaser
        photographs={home.photographs}
        copy={copy.photography}
      />
      <WorkshopsSection workshops={home.workshops} copy={copy.workshops} />
      <JournalSection journal={home.journal} copy={copy.journal} />
      <ClosingInvitation
        copy={copy.closing}
        instagram={home.profile.instagram}
      />
    </>
  );
}
