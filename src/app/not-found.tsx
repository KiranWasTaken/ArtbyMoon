import { LinkButton } from "@/components/ui/LinkButton";

export default function NotFound() {
  return (
    <section className="page-x flex min-h-svh flex-col justify-center pt-24 pb-16">
      <div className="mx-auto w-full max-w-page">
        <p className="eyebrow text-ink-muted">Not found</p>
        <h1 className="mt-4 max-w-4xl font-display text-display-l">
          This room of the studio is still being set up.
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/" variant="solid">
            Back to the studio
          </LinkButton>
          <LinkButton href="/artworks">View the artworks</LinkButton>
        </div>
      </div>
    </section>
  );
}
