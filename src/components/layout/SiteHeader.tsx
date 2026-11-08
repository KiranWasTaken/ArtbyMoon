"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/cn";
import { ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { useLenis } from "@/lib/motion/SmoothScroll";
import { primaryNav, site } from "@/lib/site";

/**
 * Transparent over the hero, then a solid paper bar that tucks away while
 * reading downwards and returns on any upward scroll. State lives in data
 * attributes so scrolling never re-renders React.
 */
export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const getLenis = useLenis();

  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        header.dataset.scrolled = String(y > 8);
        header.dataset.hidden = String(self.direction === 1 && y > 240);
      },
    });
  });

  const openMenu = () => {
    dialogRef.current?.showModal();
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
  };
  const closeMenu = () => dialogRef.current?.close();
  const onMenuClosed = () => {
    getLenis()?.start();
    document.documentElement.style.overflow = "";
  };

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      data-hidden="false"
      className={cn(
        "page-x fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-transparent text-ink md:h-20",
        "transition-[translate,background-color,border-color] duration-(--duration-ui) ease-brush",
        "data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-line data-[scrolled=true]:bg-surface",
      )}
    >
      <Link
        href="/"
        className="font-display text-[1.85rem] leading-none tracking-[-0.01em]"
        aria-label={`${site.name}, home`}
      >
        <Wordmark />
      </Link>

      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-8">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className="eyebrow relative py-2 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-(--duration-ui) after:ease-brush hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={openMenu}
        className="eyebrow -mr-3 min-h-12 px-3 lg:hidden"
        aria-haspopup="dialog"
      >
        Menu
      </button>

      <dialog
        ref={dialogRef}
        onClose={onMenuClosed}
        aria-label="Site menu"
        className={cn(
          "page-x m-0 h-dvh max-h-none w-full max-w-none bg-surface text-ink backdrop:bg-transparent",
          "opacity-100 transition-opacity duration-(--duration-ui) ease-brush starting:opacity-0",
        )}
      >
        <div className="flex h-16 items-center justify-between md:h-20">
          <span className="font-display text-[1.85rem] leading-none tracking-[-0.01em]">
            <Wordmark />
          </span>
          <button
            type="button"
            onClick={closeMenu}
            className="eyebrow -mr-3 min-h-12 px-3"
            autoFocus
          >
            Close
          </button>
        </div>
        <nav aria-label="Primary" className="mt-[8vh]">
          <ol className="flex flex-col">
            {primaryNav.map((item, i) => (
              <li
                key={item.href}
                className="border-t border-line last:border-b"
              >
                <Link
                  href={item.href}
                  onNavigate={closeMenu}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-3 font-display text-display-m aria-[current=page]:text-accent-ink"
                >
                  <span className="eyebrow w-6 text-ink-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <a
          href={site.instagram.url}
          rel="me"
          className="eyebrow ink-link mt-10 inline-block"
        >
          Instagram @{site.instagram.handle}
        </a>
      </dialog>
    </header>
  );
}
