import Link from "next/link";
import type { ReactNode } from "react";
import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { Crescent } from "@/components/ui/Crescent";
import { Handnote } from "@/components/ui/Handnote";
import type { HomeContent } from "@/lib/content/home";

interface ClosingInvitationProps {
  copy: HomeContent["copy"]["closing"];
  instagram: HomeContent["profile"]["instagram"];
}

function Door({
  href,
  eyebrow,
  title,
  children,
  external,
}: {
  href: string;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "group flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:bg-surface-raised md:p-8";
  const body = (
    <>
      <span className="eyebrow text-ink-muted">{eyebrow}</span>
      <span className="font-display text-title break-words">{title}</span>
      <span className="text-ink-muted">{children}</span>
      <span
        aria-hidden="true"
        className="mt-auto pt-4 text-title text-accent transition-transform duration-500 ease-brush group-hover:translate-x-2"
      >
        →
      </span>
    </>
  );
  return external ? (
    <a href={href} rel="me" className={className}>
      {body}
    </a>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}

/** The last word on the homepage: her moon, and three clear ways onward. */
export function ClosingInvitation({ copy, instagram }: ClosingInvitationProps) {
  return (
    <RevealScope
      id="say-hello"
      aria-labelledby="closing-title"
      className="page-x pb-section"
    >
      <div className="mx-auto max-w-page border-t border-line-strong pt-section">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7">
            <p className="eyebrow text-ink-muted" data-reveal>
              Before you go
            </p>
            <CopyText
              as="h2"
              copy={copy.title}
              id="closing-title"
              className="mt-4 font-display text-display-xl"
              data-reveal="lines"
            />
            <CopyText
              as="p"
              copy={copy.intro}
              className="mt-14 max-w-md text-lede text-ink-muted"
              data-reveal
            />
          </div>
          <div
            className="relative hidden justify-self-end sm:block lg:col-span-4 lg:col-start-9"
            data-reveal="draw"
          >
            <Crescent
              variant="line"
              className="aspect-square w-40 text-ink md:w-56 lg:w-64"
            />
            <Handnote className="absolute top-full right-1/2 mt-2 whitespace-nowrap">
              art by moon
            </Handnote>
          </div>
        </div>

        <ul
          className="mt-16 grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line lg:mt-24"
          data-reveal
        >
          <li className="border-b border-line md:border-b-0">
            <Door href="/artworks" eyebrow="Explore" title="View the artworks">
              <CopyText copy={copy.explore} />
            </Door>
          </li>
          <li className="border-b border-line md:border-b-0">
            <Door href="/contact" eyebrow="Commission" title="Start an enquiry">
              <CopyText copy={copy.commission} />
            </Door>
          </li>
          <li>
            <Door
              href={instagram.url}
              external
              eyebrow="Follow on Instagram"
              title={`@${instagram.handle}`}
            >
              <CopyText copy={copy.follow} />
            </Door>
          </li>
        </ul>
      </div>
    </RevealScope>
  );
}
