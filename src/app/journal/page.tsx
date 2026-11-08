import {
  JournalContents,
  JournalList,
} from "@/components/journal/JournalPreview";
import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { homeCopy } from "@/content/copy/home";
import { getJournalPosts, journalCategories } from "@/lib/content/journal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Journal",
  description:
    "Art stories, process notes, announcements, exhibitions and Paint with Moon updates from ArtbyMoon.",
  path: "/journal",
});

/** All published journal entries, or the journal's contents page while there are none. */
export default async function JournalPage() {
  const posts = await getJournalPosts();
  const copy = homeCopy.journal;
  return (
    <RevealScope
      aria-labelledby="journal-page-title"
      className="page-x pt-32 pb-section md:pt-40"
    >
      <div className="mx-auto grid max-w-page gap-x-6 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-ink-muted" data-reveal>
            Journal &amp; announcements
          </p>
          <CopyText
            as="h1"
            id="journal-page-title"
            copy={copy.title}
            className="mt-4 font-display text-display-l"
            data-reveal="lines"
          />
          <CopyText
            as="p"
            copy={copy.intro}
            className="mt-6 max-w-sm text-ink-muted"
            data-reveal
          />
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal>
          {posts.length > 0 ? (
            <JournalList
              posts={posts}
              categories={journalCategories}
              headingLevel="h2"
            />
          ) : (
            <JournalContents categories={journalCategories} />
          )}
        </div>
      </div>
    </RevealScope>
  );
}
