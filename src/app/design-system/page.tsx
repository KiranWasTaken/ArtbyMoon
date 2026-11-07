import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MotionLab } from "@/components/design-system/MotionLab";
import { RevealScope } from "@/components/motion/RevealScope";
import { BrushStroke } from "@/components/ui/BrushStroke";
import { Handnote } from "@/components/ui/Handnote";
import { LinkButton } from "@/components/ui/LinkButton";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";
import { StatusChip, workshopStatuses } from "@/components/ui/StatusChip";
import { WallLabel } from "@/components/ui/WallLabel";
import {
  JournalContents,
  JournalList,
} from "@/components/journal/JournalPreview";
import {
  WorkshopEmpty,
  WorkshopTicket,
} from "@/components/workshops/WorkshopTicket";
import { journalCategories } from "@/content/artist/journal";
import {
  sampleJournalPosts,
  sampleWorkshops,
} from "@/content/placeholder/samples";
import type { PlaceholderKind } from "@/content/types";
import { contrastRatio, wcagRating } from "@/lib/color";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const PAPER = "#f4efe6";
const NIGHT = "#121110";

interface Swatch {
  name: string;
  token: string;
  hex: string;
  use: string;
  /** Background to measure text contrast against. */
  on?: string;
}

const palette: Array<{ group: string; note: string; swatches: Swatch[] }> = [
  {
    group: "Paper",
    note: "Warm ivory surfaces. The default page is paper-100; raised cards use paper-50.",
    swatches: [
      {
        name: "Paper 50",
        token: "paper-50",
        hex: "#faf7f1",
        use: "Raised surfaces, cards",
      },
      {
        name: "Paper 100",
        token: "paper-100",
        hex: PAPER,
        use: "Page surface",
      },
      {
        name: "Paper 200",
        token: "paper-200",
        hex: "#eae2d3",
        use: "Placeholders, wells",
      },
      {
        name: "Paper 300",
        token: "paper-300",
        hex: "#dcd1bd",
        use: "Deep paper, mounts",
      },
    ],
  },
  {
    group: "Ink",
    note: "Warm black, never pure #000. Contrast measured against paper-100.",
    swatches: [
      {
        name: "Ink 950",
        token: "ink-950",
        hex: "#1b1a17",
        use: "Text, rules",
        on: PAPER,
      },
      {
        name: "Ink 700",
        token: "ink-700",
        hex: "#4a463f",
        use: "Secondary text",
        on: PAPER,
      },
      {
        name: "Ink 500",
        token: "ink-500",
        hex: "#6b655c",
        use: "Captions, metadata",
        on: PAPER,
      },
      {
        name: "Ink 300",
        token: "ink-300",
        hex: "#a39c90",
        use: "Decorative only",
        on: PAPER,
      },
    ],
  },
  {
    group: "Night: the darkroom",
    note: "Photography and artwork viewing. Contrast measured against night-950.",
    swatches: [
      {
        name: "Night 950",
        token: "night-950",
        hex: NIGHT,
        use: "Darkroom surface",
      },
      {
        name: "Night 900",
        token: "night-900",
        hex: "#1c1a18",
        use: "Raised dark surface",
      },
      {
        name: "Night 100",
        token: "night-100",
        hex: "#e9e3d8",
        use: "Darkroom text",
        on: NIGHT,
      },
      {
        name: "Night 300",
        token: "night-300",
        hex: "#9c958a",
        use: "Darkroom captions",
        on: NIGHT,
      },
    ],
  },
  {
    group: "Pigments",
    note: "Sampled from ArtbyMoon's Instagram grid: the rust reds, cobalt night skies, turquoise, lavender, magenta blossoms, greens and autumn gold that recur in her work. Used as marks (an underline, a dot, a focus ring) and placeholder washes, never as large fills competing with the work.",
    swatches: [
      {
        name: "Vermilion",
        token: "vermilion",
        hex: "#c24f2b",
        use: "The one UI accent: marks, large text",
        on: PAPER,
      },
      {
        name: "Vermilion deep",
        token: "vermilion-deep",
        hex: "#a5391f",
        use: "Accent text, links",
        on: PAPER,
      },
      {
        name: "Cobalt",
        token: "cobalt",
        hex: "#165ab0",
        use: "Focus ring",
        on: PAPER,
      },
      {
        name: "Indigo",
        token: "indigo",
        hex: "#26355b",
        use: "Night-sky wash",
        on: PAPER,
      },
      {
        name: "Turquoise",
        token: "turquoise",
        hex: "#329597",
        use: "Placeholder wash",
        on: PAPER,
      },
      {
        name: "Lavender",
        token: "lavender",
        hex: "#556292",
        use: "Placeholder wash",
        on: PAPER,
      },
      {
        name: "Rose",
        token: "rose",
        hex: "#c7679c",
        use: "Bookmarks collection",
        on: PAPER,
      },
      {
        name: "Sap green",
        token: "sap",
        hex: "#627d40",
        use: "Status: open",
        on: PAPER,
      },
      {
        name: "Ochre",
        token: "ochre",
        hex: "#ca972b",
        use: "Pegs, notes, status: waitlist",
        on: PAPER,
      },
    ],
  },
];

const typeScale = [
  {
    token: "display-xl",
    sample: "ArtbyMoon",
    family: "Fraunces · SOFT 60 · opsz auto",
    cls: "font-display text-display-xl",
  },
  {
    token: "display-l",
    sample: "Inside the studio",
    family: "Fraunces",
    cls: "font-display text-display-l",
  },
  {
    token: "display-m",
    sample: "Canvas paintings",
    family: "Fraunces",
    cls: "font-display text-display-m",
  },
  {
    token: "title",
    sample: "Title to be confirmed",
    family: "Fraunces italic",
    cls: "font-display text-title italic",
  },
  {
    token: "lede",
    sample:
      "Introductory paragraphs set a little larger, in the interface grotesk.",
    family: "Schibsted Grotesk",
    cls: "text-lede",
  },
  {
    token: "body",
    sample:
      "Running text for journal posts, workshop details and artwork notes. 17px with generous leading, about 65 characters per line.",
    family: "Schibsted Grotesk",
    cls: "text-body max-w-prose",
  },
  {
    token: "caption",
    sample: "Acrylic on canvas · dimensions · year",
    family: "Schibsted Grotesk",
    cls: "text-caption text-ink-muted",
  },
  {
    token: "label",
    sample: "Collection 04 · Bookmarks",
    family: "Schibsted Grotesk, uppercase, +0.14em",
    cls: "eyebrow",
  },
  {
    token: "hand",
    sample: "a pencilled note in the margin",
    family: "Caveat (interim for ArtbyMoon's own lettering)",
    cls: "font-hand text-[1.65rem] text-ink-muted",
  },
];

const spacing = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48];
const placeholderKinds: Array<{
  kind: PlaceholderKind;
  w: number;
  h: number;
  width: string;
}> = [
  { kind: "canvas", w: 4, h: 5, width: "w-40" },
  { kind: "abstract", w: 1, h: 1, width: "w-40" },
  { kind: "polaroid", w: 0.82, h: 1, width: "w-36" },
  { kind: "sketch", w: 3, h: 4, width: "w-36" },
  { kind: "bookmark", w: 1, h: 3.4, width: "w-16" },
  { kind: "photo", w: 3, h: 2, width: "w-56" },
];

export default function DesignSystemPage() {
  return (
    <div className="page-x pt-32 pb-section">
      <div className="mx-auto max-w-page">
        <header className="grid gap-6 border-b border-line pb-16 lg:grid-cols-12">
          <p className="eyebrow text-ink-muted lg:col-span-3">
            Design system · Phase 1
          </p>
          <div className="lg:col-span-9">
            <h1 className="font-display text-display-l">The studio kit</h1>
            <p className="mt-6 max-w-prose text-lede text-ink-muted">
              Tokens, type, surfaces and motion for ArtbyMoon&apos;s portfolio.
              Everything here is defined once in{" "}
              <code className="text-ink">globals.css</code> and{" "}
              <code className="text-ink">lib/motion/tokens.ts</code>. Rationale
              lives in <code className="text-ink">docs/</code>.
            </p>
          </div>
        </header>

        <Section index="01" title="Colour">
          <div className="grid gap-16">
            {palette.map((group) => (
              <div key={group.group}>
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="font-display text-title">{group.group}</h3>
                  <p className="max-w-md text-caption text-ink-muted">
                    {group.note}
                  </p>
                </div>
                <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                  {group.swatches.map((s) => {
                    const ratio = s.on ? contrastRatio(s.hex, s.on) : null;
                    return (
                      <li key={s.token} className="border border-line">
                        <div
                          className="aspect-[4/3] border-b border-line"
                          style={{ backgroundColor: s.hex }}
                        />
                        <div className="flex flex-col gap-1 p-3 text-caption">
                          <span className="font-medium">{s.name}</span>
                          <code className="text-ink-muted">
                            {s.token} · {s.hex}
                          </code>
                          <span className="text-ink-muted">{s.use}</span>
                          {ratio !== null && (
                            <span className="eyebrow mt-1 tabular-nums">
                              {ratio.toFixed(2)}:1 · {wcagRating(ratio)}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section index="02" title="Typography">
          <ul className="grid">
            {typeScale.map((t) => (
              <li
                key={t.token}
                className="grid gap-3 border-t border-line py-6 lg:grid-cols-12 lg:items-baseline"
              >
                <div className="flex flex-col gap-1 lg:col-span-3">
                  <code className="text-caption">{t.token}</code>
                  <span className="text-caption text-ink-muted">
                    {t.family}
                  </span>
                </div>
                <p className={`${t.cls} min-w-0 overflow-hidden lg:col-span-9`}>
                  {t.sample}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section index="03" title="Spacing & layout">
          <div className="grid gap-12 lg:grid-cols-2">
            <ul className="grid gap-2">
              {spacing.map((n) => (
                <li key={n} className="flex items-center gap-4 text-caption">
                  <code className="w-10 text-ink-muted tabular-nums">{n}</code>
                  <span
                    className="h-3 bg-accent"
                    style={{ width: `${n * 4}px` }}
                  />
                  <span className="text-ink-muted tabular-nums">{n * 4}px</span>
                </li>
              ))}
            </ul>
            <dl className="grid content-start gap-6 text-caption">
              <Token
                name="gutter"
                value="clamp(1rem → 2.75rem)"
                note="Page side padding. 16px on phones."
              />
              <Token
                name="section"
                value="clamp(6rem → 13rem)"
                note="Vertical rhythm between homepage sections."
              />
              <Token
                name="max-w-page"
                value="100rem"
                note="Composition width; wider screens get more paper, not bigger art."
              />
              <Token
                name="max-w-prose"
                value="38rem"
                note="Reading measure for journal posts and notes."
              />
              <Token
                name="grid"
                value="4 / 6 / 12 columns"
                note="Phone / tablet / desktop. Asymmetry comes from spans and offsets, never from breaking the grid."
              />
            </dl>
          </div>
        </Section>

        <Section index="04" title="Lines, surfaces & objects">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            <Specimen
              label="Hairline · line"
              note="1px ink at 14%. Dividers, card edges."
            >
              <span className="block h-px w-full bg-line" />
            </Specimen>
            <Specimen
              label="Rule · line-strong"
              note="1px solid ink. Editorial emphasis, used sparingly."
            >
              <span className="block h-px w-full bg-line-strong" />
            </Specimen>
            <Specimen
              label="Mount"
              note="Passe-partout for artwork detail views: paper margin plus a hairline."
            >
              <div className="mx-auto w-36 border border-line bg-surface-raised p-4">
                <PlaceholderArt
                  kind="canvas"
                  aspect={{ w: 4, h: 5 }}
                  pigment="sap"
                />
              </div>
            </Specimen>
            <Specimen
              label="Tape"
              note="Studio-wall motif. Home page and playful contexts only, never in galleries."
            >
              <div className="relative mx-auto mt-4 w-32 shadow-rest">
                <PlaceholderArt
                  kind="sketch"
                  aspect={{ w: 4, h: 3 }}
                  pigment="ochre"
                />
                <span
                  aria-hidden="true"
                  className="tape -top-2 left-1/2 -translate-x-1/2 -rotate-2"
                />
              </div>
            </Specimen>
            <Specimen
              label="Rest → lift"
              note="Two shadows only. Objects rest on the wall and lift on hover."
            >
              <div className="flex justify-center gap-6">
                <span className="size-20 bg-surface-raised shadow-rest" />
                <span className="size-20 bg-surface-raised shadow-lift" />
              </div>
            </Specimen>
            <Specimen
              label="Radius"
              note="Square corners everywhere. 2px for bookmarks, full round for chips only."
            >
              <div className="flex items-center justify-center gap-6">
                <span className="size-14 border border-line-strong" />
                <span className="h-14 w-5 rounded-[2px] border border-line-strong" />
                <StatusChip status="open" />
              </div>
            </Specimen>
          </div>
        </Section>

        <Section index="05" title="Placeholders">
          <p className="max-w-prose text-ink-muted">
            Stand-ins until individual photographs exist. They hold the real
            aspect ratio, are always labelled, and use material textures (primed
            canvas, card stock, photo paper) so they can never pass for artwork.
          </p>
          <ul className="mt-10 flex flex-wrap items-end gap-8">
            {placeholderKinds.map((p) => (
              <li key={p.kind} className={p.width}>
                <PlaceholderArt
                  kind={p.kind}
                  aspect={{ w: p.w, h: p.h }}
                  pigment="ochre"
                />
                <code className="mt-2 block text-caption text-ink-muted">
                  {p.kind}
                </code>
              </li>
            ))}
          </ul>
        </Section>

        <Section index="06" title="Components">
          <div className="grid gap-10 md:grid-cols-2">
            <Specimen
              label="LinkButton"
              note="Hairline rectangle; solid for the one primary action per view."
            >
              <div className="flex flex-wrap gap-3">
                <LinkButton href="/design-system" variant="solid">
                  Primary
                </LinkButton>
                <LinkButton href="/design-system">Secondary</LinkButton>
              </div>
            </Specimen>
            <Specimen
              label="Ink link"
              note="Inline links: the underline is lifted off on hover like a pen stroke."
            >
              <p>
                Read the{" "}
                <a href="#" className="ink-link">
                  workshop notes
                </a>{" "}
                or{" "}
                <a href="#" className="ink-link">
                  get in touch
                </a>
                .
              </p>
            </Specimen>
            <Specimen
              label="StatusChip"
              note="Workshop availability. Status only; never invented dates or seats."
            >
              <div className="flex flex-wrap gap-2">
                {workshopStatuses.map((s) => (
                  <StatusChip key={s} status={s} />
                ))}
              </div>
            </Specimen>
            <Specimen
              label="WallLabel"
              note="Museum caption. Renders only supplied facts; missing ones read as pending."
            >
              <figure className="w-48">
                <PlaceholderArt
                  kind="canvas"
                  aspect={{ w: 4, h: 3 }}
                  pigment="vermilion"
                />
                <WallLabel
                  className="mt-3"
                  artwork={{
                    id: "ds",
                    slug: "ds",
                    collection: "canvas",
                    media: {
                      kind: "placeholder",
                      placeholder: "canvas",
                      aspect: { w: 4, h: 3 },
                    },
                  }}
                />
              </figure>
            </Specimen>
            <Specimen
              label="Handnote"
              note="Margin annotations. One per view at most."
            >
              <Handnote arrow="right">a note from the studio</Handnote>
            </Specimen>
            <Specimen
              label="BrushStroke"
              note="The single painterly gesture. Once per page, under a key word."
            >
              <div>
                <span className="font-display text-display-m">ArtbyMoon</span>
                <BrushStroke className="w-64" />
              </div>
            </Specimen>
          </div>
        </Section>

        <Section index="07" title="The darkroom tone">
          <div data-tone="darkroom" className="bg-surface p-8 text-ink md:p-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="eyebrow text-ink-muted">Photography</p>
                <p className="mt-4 font-display text-display-m">
                  Images first, interface receding
                </p>
                <p className="mt-4 text-ink-muted">
                  The same semantic tokens (surface, ink, line, accent)
                  remapped. Applied per route (photography, artwork viewer) or
                  per section via <code className="text-ink">ToneZone</code>.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <LinkButton href="/design-system" variant="solid">
                    Primary
                  </LinkButton>
                  <StatusChip status="open" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:col-span-6 lg:col-start-7">
                <PlaceholderArt kind="photo" aspect={{ w: 4, h: 5 }} />
                <PlaceholderArt kind="photo" aspect={{ w: 4, h: 5 }} />
              </div>
            </div>
          </div>
        </Section>

        <Section index="08" title="Content states">
          <p className="max-w-prose text-ink-muted">
            Workshops and the journal render whatever is published, or an honest
            empty state. The published examples below use{" "}
            <strong className="font-medium text-ink">
              component fixtures, not content
            </strong>{" "}
            (<code>content/placeholder/samples.ts</code>): placeholder titles
            and a far-future year. Add <code>?review</code> to any URL to
            highlight draft copy awaiting ArtbyMoon&apos;s approval.
          </p>
          <div className="mt-10 grid gap-10 xl:grid-cols-2">
            <Specimen
              label="Workshops · published (fixture)"
              note="Only supplied fields render; the call to action follows status and booking link."
            >
              <div className="flex w-full flex-col gap-8">
                {sampleWorkshops.map((w) => (
                  <WorkshopTicket key={w.slug} workshop={w} headingLevel="h4" />
                ))}
              </div>
            </Specimen>
            <Specimen
              label="Workshops · nothing published"
              note="The live homepage state today."
            >
              <WorkshopEmpty
                message={{
                  text: "No sessions are published right now. New dates will appear here first.",
                  status: "draft",
                }}
              />
            </Specimen>
            <Specimen
              label="Journal · published (fixture)"
              note="Latest entry leads; dates use <time> and never shift by time zone."
            >
              <JournalList
                posts={sampleJournalPosts}
                categories={journalCategories}
                headingLevel="h4"
              />
            </Specimen>
            <Specimen
              label="Journal · nothing published"
              note="The live homepage state today: a contents page, not invented articles."
            >
              <JournalContents categories={journalCategories} />
            </Specimen>
          </div>
        </Section>

        <Section index="09" title="Motion">
          <ul className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Brush, not bounce",
                "Decelerating strokes. No elastic, no overshoot, no spin.",
              ],
              [
                "The work moves least",
                "Artwork is revealed, never distorted: no skew, no warp, parallax under 10%.",
              ],
              [
                "One gesture at a time",
                "Each view has one choreographed moment; everything else is quiet.",
              ],
              [
                "Never a gate",
                "No preloader. Content exists without JS; reduced motion gets static, complete pages.",
              ],
            ].map(([title, body]) => (
              <li key={title} className="border-t border-line-strong pt-4">
                <p className="font-display text-title">{title}</p>
                <p className="mt-2 text-caption text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
          <MotionLab />
        </Section>
      </div>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <RevealScope
      aria-labelledby={`ds-${index}`}
      className="grid gap-10 border-b border-line py-20 lg:grid-cols-12"
    >
      <div className="lg:col-span-3">
        <p className="eyebrow text-ink-muted tabular-nums">{index}</p>
        <h2
          id={`ds-${index}`}
          className="mt-2 font-display text-display-m lg:text-[clamp(2rem,1rem+1.6vw,3rem)]"
          data-reveal="lines"
        >
          {title}
        </h2>
      </div>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </RevealScope>
  );
}

function Specimen({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border border-line p-6">
      <div className="flex min-h-28 flex-col justify-center">{children}</div>
      <div className="border-t border-line pt-4">
        <p className="eyebrow">{label}</p>
        <p className="mt-1 text-caption text-ink-muted">{note}</p>
      </div>
    </div>
  );
}

function Token({
  name,
  value,
  note,
}: {
  name: string;
  value: string;
  note: string;
}) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="flex justify-between gap-4">
        <code>{name}</code>
        <span className="text-ink-muted">{value}</span>
      </dt>
      <dd className="mt-1 text-ink-muted">{note}</dd>
    </div>
  );
}
