"use client";

import { useId, useState } from "react";
import { CopyText } from "@/components/ui/CopyText";
import { pagesCopy, type EnquiryKind } from "@/content/copy/pages";
import { cn } from "@/lib/cn";

type CopyState = "idle" | "copied" | "error";

/**
 * Choose what the message is about, see what helps to include, copy a short
 * starter and open Instagram. Nothing is submitted from this site: the only
 * "success" state is a real one (the text reached the clipboard).
 */
export function EnquiryGuide({ messageUrl }: { messageUrl: string }) {
  const [kind, setKind] = useState<EnquiryKind>("artwork");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const groupId = useId();
  const enquiry = pagesCopy.enquiries.find((e) => e.id === kind)!;
  const starterId = `${groupId}-starter`;

  const choose = (next: EnquiryKind) => {
    setKind(next);
    setCopyState("idle");
  };

  const copyStarter = async () => {
    try {
      await navigator.clipboard.writeText(enquiry.starter);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
      <fieldset className="lg:col-span-5">
        <legend className="eyebrow text-ink-muted">
          What is your message about?
        </legend>
        <div className="mt-5 flex flex-col">
          {pagesCopy.enquiries.map((e) => (
            <label
              key={e.id}
              className={cn(
                "group flex cursor-pointer items-start gap-4 border-t border-line py-4 last:border-b",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--focus)",
              )}
            >
              <input
                type="radio"
                name={groupId}
                value={e.id}
                checked={kind === e.id}
                onChange={() => choose(e.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-1.5 size-4 shrink-0 rounded-full border border-line-strong transition-colors peer-checked:border-[5px] peer-checked:border-accent"
              />
              <span className="flex flex-col gap-1">
                <span className="font-display text-title group-hover:text-accent-ink">
                  {e.title}
                </span>
                <CopyText
                  copy={e.description}
                  className="text-caption text-ink-muted"
                />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <section
        aria-labelledby={`${groupId}-panel`}
        className="self-start bg-surface-raised p-6 shadow-rest md:p-8 lg:col-span-6 lg:col-start-7"
      >
        <h2 id={`${groupId}-panel`} className="font-display text-display-m">
          {enquiry.title}
        </h2>
        {enquiry.tips.length > 0 && (
          <div className="mt-6">
            <p className="eyebrow text-ink-muted">Helpful to include</p>
            <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 marker:text-accent">
              {enquiry.tips.map((tip) => (
                <CopyText key={tip.text} as="li" copy={tip} />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <p className="eyebrow text-ink-muted" id={`${starterId}-label`}>
            A message to start with
          </p>
          <p
            id={starterId}
            aria-labelledby={`${starterId}-label`}
            className="mt-3 font-hand text-[1.65rem] leading-snug select-all"
          >
            {enquiry.starter}…
          </p>
          <CopyText
            as="p"
            copy={pagesCopy.contact.starterHint}
            className="mt-2 text-caption text-ink-muted"
          />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyStarter}
              aria-describedby={starterId}
              className="eyebrow inline-flex min-h-12 items-center border border-line-strong px-5 transition-colors duration-(--duration-ui) hover:bg-ink hover:text-surface"
            >
              {copyState === "copied" ? "Copied ✓" : "Copy message"}
            </button>
            <a
              href={messageUrl}
              target="_blank"
              rel="noopener"
              className="eyebrow inline-flex min-h-12 items-center gap-3 border border-ink bg-ink px-5 text-surface transition-colors duration-(--duration-ui) hover:border-accent-ink hover:bg-accent-ink"
            >
              Open Instagram
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <p className="mt-3 min-h-5 text-caption" role="status">
            {copyState === "copied" && (
              <span className="text-ink-muted">
                Copied. Paste it into your Instagram message.
              </span>
            )}
            {copyState === "error" && (
              <span className="text-accent-ink">
                Your browser didn&apos;t allow copying. Select the message above
                and copy it instead.
              </span>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
