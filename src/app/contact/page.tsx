import { EnquiryGuide } from "@/components/contact/EnquiryGuide";
import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { pagesCopy } from "@/content/copy/pages";
import { getContact } from "@/lib/content/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with ArtbyMoon about artwork, commissions, collaborations or workshops, by direct message on Instagram.",
  path: "/contact",
});

/**
 * No form: there is no submission service yet, so nothing here pretends to
 * send. Visitors message ArtbyMoon on Instagram; this page helps them start.
 * The Instagram account and any extra contact lines come from the published
 * artist profile (refreshed by the webhook when the profile is published).
 */
export default async function ContactPage() {
  const copy = pagesCopy.contact;
  const { instagram, lines } = await getContact();
  return (
    <>
      <RevealScope
        aria-labelledby="contact-title"
        className="page-x pt-32 pb-14 md:pt-40 lg:pb-20"
      >
        <div className="mx-auto grid max-w-page gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-ink-muted" data-reveal>
              Contact
            </p>
            <CopyText
              as="h1"
              id="contact-title"
              copy={copy.title}
              className="mt-4 font-display text-display-xl"
              data-reveal="lines"
            />
          </div>
          <div
            className="flex flex-col items-start gap-6 lg:col-span-5"
            data-reveal
          >
            <CopyText
              as="p"
              copy={copy.intro}
              className="text-lede text-ink-muted"
            />
            <a
              href={instagram.messageUrl}
              target="_blank"
              rel="noopener"
              className="group inline-flex max-w-full items-baseline gap-3 font-display text-display-m"
            >
              <span className="ink-link min-w-0 [overflow-wrap:anywhere]">
                @{instagram.handle}
              </span>
              <span
                aria-hidden="true"
                className="text-title text-accent transition-transform group-hover:translate-x-1"
              >
                ↗
              </span>
              <span className="sr-only">
                Message on Instagram (opens in a new tab)
              </span>
            </a>
            {lines.length > 0 && (
              <dl className="flex flex-col gap-3">
                {lines.map((line) => (
                  <div key={line.label + line.value}>
                    <dt className="eyebrow text-ink-muted">{line.label}</dt>
                    <dd className="mt-1">
                      {line.href ? (
                        <a
                          href={line.href}
                          className="ink-link"
                          {...(line.href.startsWith("https:") && {
                            target: "_blank",
                            rel: "noopener",
                          })}
                        >
                          {line.value}
                        </a>
                      ) : (
                        line.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="flex items-start gap-3 border-l-2 border-ochre pl-4 text-caption text-ink-muted">
              <CopyText copy={copy.external} />
            </p>
          </div>
        </div>
      </RevealScope>

      <RevealScope aria-label="Enquiry guide" className="page-x pb-section">
        <div
          className="mx-auto max-w-page border-t border-line pt-14 lg:pt-20"
          data-reveal
        >
          <EnquiryGuide messageUrl={instagram.messageUrl} />
        </div>
      </RevealScope>
    </>
  );
}
