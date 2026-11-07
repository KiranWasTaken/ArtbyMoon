import { LinkButton } from "@/components/ui/LinkButton";

/** Unknown collection or artwork slug under /artworks. */
export default function ArtworkNotFound() {
  return (
    <section className="page-x flex min-h-[80svh] flex-col justify-center pt-28 pb-16">
      <div className="mx-auto w-full max-w-page">
        <p className="eyebrow text-ink-muted">Not found</p>
        <h1 className="mt-4 max-w-3xl font-display text-display-l text-balance">
          This piece isn&apos;t on the wall.
        </h1>
        <p className="mt-6 max-w-lg text-lede text-ink-muted">
          The link may be mistyped, or the work may have moved to a different
          collection.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/artworks" variant="solid">
            All artworks
          </LinkButton>
          <LinkButton href="/">Back to the studio</LinkButton>
        </div>
      </div>
    </section>
  );
}
