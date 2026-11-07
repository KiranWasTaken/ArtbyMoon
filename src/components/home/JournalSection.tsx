import Link from "next/link";
import {
  JournalContents,
  JournalList,
} from "@/components/journal/JournalPreview";
import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { Handnote } from "@/components/ui/Handnote";
import type { Copy } from "@/content/types";
import type { HomeContent } from "@/lib/content/home";

interface JournalSectionProps {
  journal: HomeContent["journal"];
  copy: { title: Copy; intro: Copy; empty: Copy };
}

export function JournalSection({ journal, copy }: JournalSectionProps) {
  const hasPosts = journal.posts.length > 0;
  return (
    <RevealScope
      id="journal"
      aria-labelledby="journal-title"
      className="page-x pb-section"
    >
      <div className="mx-auto grid max-w-page gap-12 border-t border-line pt-section lg:grid-cols-12 lg:gap-x-6">
        <div className="flex flex-col items-start gap-6 lg:col-span-4">
          <p className="eyebrow text-ink-muted" data-reveal>
            Journal &amp; announcements
          </p>
          <CopyText
            as="h2"
            copy={copy.title}
            id="journal-title"
            className="font-display text-display-l"
            data-reveal="lines"
          />
          <CopyText
            as="p"
            copy={copy.intro}
            className="max-w-sm text-ink-muted"
            data-reveal
          />
          {!hasPosts && (
            <span data-reveal>
              <Handnote>
                <CopyText copy={copy.empty} />
              </Handnote>
            </span>
          )}
          {hasPosts && (
            <Link href="/journal" className="ink-link eyebrow" data-reveal>
              All entries →
            </Link>
          )}
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal>
          {hasPosts ? (
            <JournalList
              posts={journal.posts}
              categories={journal.categories}
            />
          ) : (
            <JournalContents categories={journal.categories} />
          )}
        </div>
      </div>
    </RevealScope>
  );
}
