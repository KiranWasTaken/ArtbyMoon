"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { ScrollTrigger } from "@/lib/motion/gsap";

interface SubjectFilterProps {
  subjects: { slug: string; label: string }[];
  /** id of the GalleryWall this filter controls. */
  galleryId: string;
}

/**
 * Filters a server-rendered gallery by ?subject= without re-rendering it: a
 * scoped <style> hides non-matching items (and lets the rest reflow). The
 * subject is only accepted if it is one of the known slugs. Wrapped in
 * <Suspense> by the page; the fallback is SubjectFilterLinks with "All"
 * active, so prerendered HTML and no-JS visitors get plain links.
 */
export function SubjectFilter({ subjects, galleryId }: SubjectFilterProps) {
  const params = useSearchParams();
  const requested = params.get("subject");
  const active = subjects.some((s) => s.slug === requested) ? requested : null;

  // Hidden items change the layout: re-measure scroll-driven reveals.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [active]);

  const visible = active
    ? subjects.find((s) => s.slug === active)?.label
    : null;

  return (
    <>
      {active && (
        <style>{`#${galleryId} [data-gallery-item]:not([data-subjects~="${active}"]){display:none}#${galleryId} [data-gallery-item]{grid-column-start:auto}`}</style>
      )}
      <SubjectFilterLinks subjects={subjects} active={active} />
      <p className="sr-only" aria-live="polite">
        {visible ? `Showing ${visible}` : "Showing all subjects"}
      </p>
    </>
  );
}

export function SubjectFilterLinks({
  subjects,
  active,
}: {
  subjects: SubjectFilterProps["subjects"];
  active: string | null;
}) {
  const pathname = usePathname();
  const items = [{ slug: null, label: "All" }, ...subjects];
  return (
    <nav aria-label="Filter by subject">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const current = item.slug === active;
          return (
            <li key={item.slug ?? "all"}>
              <Link
                href={item.slug ? `${pathname}?subject=${item.slug}` : pathname}
                scroll={false}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "eyebrow inline-flex min-h-10 items-center rounded-full border px-4 transition-colors duration-(--duration-ui)",
                  current
                    ? "border-ink bg-ink text-surface"
                    : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
