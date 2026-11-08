import Link from "next/link";
import { Crescent } from "@/components/ui/Crescent";
import { Wordmark } from "@/components/ui/Wordmark";
import { footerNav, site } from "@/lib/site";

/** Quiet by design: the homepage's closing section carries the invitation. */
export function SiteFooter() {
  return (
    <footer className="page-x border-t border-line pt-16 pb-10">
      <div className="mx-auto flex max-w-page flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-title"
          aria-label={`${site.name}, home`}
        >
          <Wordmark />
          <Crescent className="size-4 text-accent" />
        </Link>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="ink-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-16 flex max-w-page flex-col gap-2 border-t border-line pt-6 text-caption text-ink-muted sm:flex-row sm:justify-between">
        <p>
          © {site.name} 2026. All artwork shown remains the property of the
          artist. Created By:{" "}
          <a
            href="https://www.kiran-shrestha.com.np/"
            target="_blank"
            rel="noopener"
            className="ink-link"
          >
            Kiran Shrestha
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        <a href={site.instagram.url} className="ink-link self-start" rel="me">
          Instagram @{site.instagram.handle}
        </a>
      </div>
    </footer>
  );
}
