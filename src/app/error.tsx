"use client";

import { useEffect } from "react";
import { LinkButton } from "@/components/ui/LinkButton";

/**
 * Shown only if a page that was never cached can't load its content (e.g.
 * Sanity is briefly unreachable). Pages already cached keep being served
 * during an outage and never reach this. No internal details are shown.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-x flex min-h-svh flex-col justify-center pt-24 pb-16">
      <meta name="robots" content="noindex" />
      <div className="mx-auto w-full max-w-page">
        <p className="eyebrow text-ink-muted">Temporarily unavailable</p>
        <h1 className="mt-4 max-w-4xl font-display text-display-l">
          This page couldn’t load just now.
        </h1>
        <p className="mt-6 max-w-prose text-ink-muted">
          Please try again in a moment.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="eyebrow inline-flex min-h-12 cursor-pointer items-center border border-ink bg-ink px-5 text-surface transition-colors duration-(--duration-ui) ease-brush hover:border-accent-ink hover:bg-accent-ink"
          >
            Try again
          </button>
          <LinkButton href="/">Back to the studio</LinkButton>
        </div>
      </div>
    </section>
  );
}
