/**
 * Date formatting for content. Always pass an explicit time zone so the
 * server-rendered text is identical everywhere (no hydration mismatch, no
 * times shifting with the server's locale). Never reads the current time.
 */

const LOCALE = "en-GB";

export function formatEventDate(iso: string, timeZone = "UTC") {
  const date = new Date(iso);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(LOCALE, { timeZone, ...options }).format(date);
  return {
    full: part({
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    day: part({ day: "numeric" }),
    month: part({ month: "short" }),
    time: part({ hour: "numeric", minute: "2-digit", timeZoneName: "short" }),
  };
}

/** Journal dates are calendar dates (YYYY-MM-DD), so format them in UTC. */
export function formatCalendarDate(isoDate: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h && `${h} h`, m && `${m} min`].filter(Boolean).join(" ");
}
