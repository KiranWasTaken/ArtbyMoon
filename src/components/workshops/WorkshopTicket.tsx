import type { ReactNode } from "react";
import { CopyText } from "@/components/ui/CopyText";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusChip } from "@/components/ui/StatusChip";
import type { Copy, Workshop } from "@/content/types";
import { formatDuration, formatEventDate } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * A workshop as a paper ticket: a date stub, a perforation, and details.
 * Only fields ArtbyMoon supplied are shown; nothing is filled in.
 */
function Ticket({
  stub,
  children,
  className,
}: {
  stub: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "relative grid grid-cols-[5.5rem_1fr] bg-surface-raised shadow-rest sm:grid-cols-[7rem_1fr]",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-1 border-r border-dashed border-line-strong/30 px-2 py-8 text-center">
        {stub}
      </div>
      {/* punched notches at the perforation */}
      <span
        aria-hidden="true"
        className="absolute -top-2 left-[5.5rem] size-4 -translate-x-1/2 rounded-full bg-surface sm:left-[7rem]"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-2 left-[5.5rem] size-4 -translate-x-1/2 rounded-full bg-surface sm:left-[7rem]"
      />
      <div className="flex min-w-0 flex-col gap-6 p-6 md:p-8">{children}</div>
    </article>
  );
}

function Detail({
  label,
  children,
  wide,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("border-t border-line pt-3", wide && "sm:col-span-2")}>
      <dt className="eyebrow text-ink-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

const cta = (workshop: Workshop) => {
  if (workshop.bookingUrl && workshop.status === "open")
    return { href: workshop.bookingUrl, label: "Reserve a seat" };
  if (workshop.bookingUrl && workshop.status === "waitlist")
    return { href: workshop.bookingUrl, label: "Join the waitlist" };
  return { href: "/contact", label: "Ask about this session" };
};

export function WorkshopTicket({
  workshop,
  headingLevel: H = "h3",
}: {
  workshop: Workshop;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  const when = workshop.startsAt
    ? formatEventDate(workshop.startsAt, workshop.timeZone)
    : null;
  const deadline = workshop.registrationDeadline
    ? formatEventDate(workshop.registrationDeadline, workshop.timeZone)
    : null;
  const action = cta(workshop);

  return (
    <Ticket
      stub={
        when ? (
          <>
            <span className="font-display text-display-m leading-none tabular-nums">
              {when.day}
            </span>
            <span className="eyebrow text-ink-muted">{when.month}</span>
          </>
        ) : (
          <span className="eyebrow text-ink-muted">Date TBA</span>
        )
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <H className="font-display text-title">
          {workshop.title ?? "Paint with Moon session, title to be confirmed"}
        </H>
        <StatusChip status={workshop.status} />
      </div>
      {workshop.summary && <p className="text-ink-muted">{workshop.summary}</p>}
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {when && (
          <Detail label="When" wide>
            {when.full}, {when.time}
          </Detail>
        )}
        {workshop.durationMinutes != null && (
          <Detail label="Duration">
            {formatDuration(workshop.durationMinutes)}
          </Detail>
        )}
        {workshop.location && (
          <Detail label="Where">{workshop.location}</Detail>
        )}
        {workshop.priceLabel && (
          <Detail label="Price">{workshop.priceLabel}</Detail>
        )}
        {workshop.seats != null && (
          <Detail label="Seats">{workshop.seats}</Detail>
        )}
        {deadline && (
          <Detail label="Book by" wide>
            {deadline.full}, {deadline.time}
          </Detail>
        )}
      </dl>
      {workshop.bookingNote && !workshop.bookingUrl && (
        <p className="text-ink-muted">{workshop.bookingNote}</p>
      )}
      <LinkButton
        href={action.href}
        variant={action.href === "/contact" ? "line" : "solid"}
        className="self-start"
      >
        {action.label}
      </LinkButton>
    </Ticket>
  );
}

/** The graceful state when nothing is published: a blank ticket, honestly labelled. */
export function WorkshopEmpty({
  message,
  headingLevel: H = "h3",
}: {
  message: Copy;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Ticket
      stub={
        <span className="font-display text-title text-ink-muted italic">
          TBA
        </span>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <H className="eyebrow">Next session</H>
        <StatusChip status="to-be-announced" />
      </div>
      <CopyText
        as="p"
        copy={message}
        className="font-display text-title text-balance"
      />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <LinkButton href="/contact" variant="solid">
          Ask about Paint with Moon
        </LinkButton>
        <a href={site.instagram.url} className="ink-link eyebrow" rel="me">
          Updates on @{site.instagram.handle}
        </a>
      </div>
    </Ticket>
  );
}
