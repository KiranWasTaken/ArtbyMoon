import type { WorkshopStatus } from "@/content/types";
import { cn } from "@/lib/cn";

const statuses: Record<WorkshopStatus, { label: string; dot: string }> = {
  "to-be-announced": {
    label: "To be announced",
    dot: "border border-ink-muted",
  },
  open: { label: "Booking open", dot: "bg-sap" },
  waitlist: { label: "Waitlist", dot: "bg-ochre" },
  full: { label: "Fully booked", dot: "bg-vermilion" },
  past: { label: "Past session", dot: "bg-ink-faint" },
};

export function StatusChip({
  status,
  className,
}: {
  status: WorkshopStatus;
  className?: string;
}) {
  const s = statuses[status];
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-2 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export const workshopStatuses = Object.keys(statuses) as WorkshopStatus[];
