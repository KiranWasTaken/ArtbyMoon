import Link from "next/link";
import { CopyText } from "@/components/ui/CopyText";
import { Handnote } from "@/components/ui/Handnote";
import { LinkButton } from "@/components/ui/LinkButton";
import { artworksCopy } from "@/content/copy/artworks";
import type { Copy, CollectionStyle } from "@/content/types";
import { site } from "@/lib/site";
import { EmptyFrame } from "./EmptyFrame";

interface CollectionEmptyProps {
  /** Presentation style: decides which object is drawn. */
  collection: CollectionStyle;
  title: Copy;
  text: Copy;
  headingLevel?: "h2" | "h3";
  /** Show "All collections" (on collection pages; the overview already lists them). */
  showAllLink?: boolean;
}

/**
 * Shown where work will hang once it is photographed: the collection's
 * object drawn in pencil, and where to see new work in the meantime.
 */
export function CollectionEmpty({
  collection,
  title,
  text,
  headingLevel: H = "h2",
  showAllLink,
}: CollectionEmptyProps) {
  return (
    <div className="grid items-center gap-16 py-8 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-16 lg:py-16">
      <div className="relative mx-auto w-40 md:w-full" data-reveal="draw">
        <EmptyFrame collection={collection} className="w-full" />
        <Handnote className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <CopyText copy={artworksCopy.empty.note} />
        </Handnote>
      </div>
      <div className="flex max-w-lg flex-col items-start gap-6" data-reveal>
        <CopyText as={H} copy={title} className="font-display text-display-m" />
        <CopyText as="p" copy={text} className="text-lede text-ink-muted" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <LinkButton href={site.instagram.url} variant="solid">
            Follow @{site.instagram.handle}
          </LinkButton>
          {showAllLink && (
            <Link href="/artworks" className="ink-link eyebrow">
              All collections →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
