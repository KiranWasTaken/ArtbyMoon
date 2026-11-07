import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: "solid" | "line";
};

/** Rectangular, hairline-framed call to action. No rounded "app" buttons. */
export function LinkButton({
  variant = "line",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={cn(
        "eyebrow group inline-flex min-h-12 items-center gap-3 border px-5 transition-colors duration-(--duration-ui) ease-brush",
        variant === "solid"
          ? "border-ink bg-ink text-surface hover:border-accent-ink hover:bg-accent-ink"
          : "border-line-strong text-ink hover:bg-ink hover:text-surface",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-(--duration-ui) ease-brush group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
