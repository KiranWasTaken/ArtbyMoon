# 02 · Design system

Source of truth: `src/app/globals.css` (tokens) and `src/lib/motion/tokens.ts` (motion). The live reference is `/design-system`. This document explains the reasoning.

## Colour

Two layers:

- **Raw palette:** defined in `@theme static`. Tailwind's default palette is removed, so only studio colours exist.
- **Semantic tokens:** `surface`, `surface-raised`, `ink`, `ink-muted`, `ink-faint`, `line`, `line-strong`, `accent`, `accent-ink` and `focus`. These remap under `[data-tone="darkroom"]`. **Components use semantic tokens only**, which is what lets any section or route switch tone without any component changes.

| Group    | Values                                                                                                                                                                                    | Role                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Paper    | 50 `#faf7f1` · 100 `#f4efe6` · 200 `#eae2d3` · 300 `#dcd1bd`                                                                                                                              | Surfaces. Page = 100, raised cards = 50  |
| Ink      | 950 `#1b1a17` · 700 `#4a463f` · 500 `#6b655c` · 300 `#a39c90`                                                                                                                             | Text and rules. Warm black, never `#000` |
| Night    | 950 `#121110` · 900 `#1c1a18` · 800 `#2a2724` · 300 `#9c958a` · 100 `#e9e3d8`                                                                                                             | Darkroom tone                            |
| Pigments | vermilion `#c24f2b` (deep `#a5391f`) · cobalt `#165ab0` · indigo `#26355b` · turquoise `#329597` · lavender `#556292` · rose `#c7679c` · sap `#627d40` · ochre `#ca972b` · tape `#e6d8b4` | Accents, sampled from her work           |

**Contrast (WCAG 2.x, computed live on `/design-system`):**

- Ink 950 on paper: about 15.2:1.
- Ink 500 on paper: about 5.0:1, the minimum for captions.
- Ink 300 is decorative only.
- Vermilion on paper: about 4.1:1, for marks, large text and UI only. Small accent text uses vermilion-deep (about 5.7:1).
- Cobalt focus ring on paper: about 5.9:1.
- Night 300 on night 950: about 6.4:1.

**Pigment rule:** vermilion is the only interface accent. The other pigments appear as placeholder washes, collection coding and status dots. Accents are marks, not fills: an underline, a dot, a peg or a focus ring is fine. A big coloured panel is not, because it would compete with the paintings.

**Calibration (done against the reference screenshot):**

- **Method:** k-means clustering over the saturated pixels of her Instagram grid (`screenshot/…art-by-moon….png`). Interface chrome, white polaroid frames and greys were excluded; the brown clusters were dropped because they are mostly wooden-table props in her flat-lays, not paint.
- **What recurs in her work:**
  - rust and vermilion reds (autumn scenes, _Kumari_)
  - cobalt and indigo night skies
  - turquoise (bookmark backgrounds)
  - lavender and periwinkle (lavender fields, floral bookmarks)
  - magenta-rose (cherry blossoms, florals)
  - sap greens (landscapes)
  - autumn gold
- **Interface implication:** her work is vivid and saturated ("Spreading joy of color!" in her bio). That is the strongest argument for a neutral, warm-paper interface: the UI supplies calm, the paintings supply colour.
- **Re-check later:** Instagram thumbnails are compressed and filtered. Once individual photographs exist, re-sample about 20 works, adjust the tokens and re-check contrast.

Per-artwork tint: `ImageAsset.dominantColor` (from the CMS image palette) can subtly tint an artwork's detail page.

## Typography

The voice of an independent gallery's catalogue: a calm, high-contrast display serif for titles, a quiet geometric grotesk for everything you read or tap, and a pencilled hand for the margins.

| Role               | Face                                         | Why                                                                                                                                                                                                                                       |
| ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display            | **Instrument Serif** (400, roman and italic) | Narrow, high-contrast and unhurried at large sizes, like gallery titling. Its italic is the site's expressive voice (the wordmark's _Moon_, captions, quotes).                                                                            |
| Interface and text | **DM Sans** (variable 100–1000, `opsz` axis) | A quiet geometric grotesk; the optical-size axis keeps small labels open and running text even. Used for body text, navigation, buttons, labels and captions.                                                                             |
| Accent             | **Caveat** (400–700), _interim_              | Pencilled annotations only: the `Handnote` margin notes (homepage sections, empty states, the @art.by.moon_ handle on About) and the message-starter preview on Contact. Stand-in for ArtbyMoon's own handwriting, to be digitised later. |

All fonts are OFL-licensed and self-hosted by `next/font/google` at build time (`src/lib/fonts.ts`), with `display: swap`: there are no requests to a font service at runtime. Instrument Serif roman, DM Sans and Caveat are preloaded; the Instrument Serif italic is a separate file that is **not** preloaded, so it never competes with first paint. The social-preview image (`src/app/opengraph-image.tsx`) uses the same face from bundled TTFs in `assets/fonts/` (licence: `assets/fonts/OFL-InstrumentSerif.txt`).

### Tokens

Set in `src/app/globals.css` and used through Tailwind utilities:

| Token (Tailwind)                 | CSS variable                                              |
| -------------------------------- | --------------------------------------------------------- |
| `font-display`                   | `--font-display` → `--font-instrument` (Instrument Serif) |
| `font-display` + `italic`        | `--font-instrument-italic` (see rule below)               |
| `font-sans` (the `body` default) | `--font-sans` → `--font-dm-sans` (DM Sans)                |
| `font-hand`                      | `--font-hand` → `--font-caveat` (Caveat)                  |

Italic display text, including an italic word inside a heading, is selected by `.font-display.italic, .font-display .italic`, which points at the italic file. `.font-display` also sets `font-synthesis: none`: Instrument Serif has one weight, so the browser must never fake a bold or an italic.

### Scale

Fluid (`clamp`, no breakpoint jumps). Display sizes run about 10% larger than a book serif would need, because Instrument Serif is narrow: the same line lengths, more presence. Its fine hairlines need only gentle negative tracking.

| Token                | Size (min → max) | Line height / tracking | Face, weight         |
| -------------------- | ---------------- | ---------------------- | -------------------- |
| `display-xl`         | 80px → 264px     | 0.84 / −0.022em        | Instrument Serif 400 |
| `display-l`          | 52px → 132px     | 0.9 / −0.018em         | Instrument Serif 400 |
| `display-m`          | 40px → 76px      | 0.98 / −0.012em        | Instrument Serif 400 |
| `title`              | 26px → 40px      | 1.08 / −0.005em        | Instrument Serif 400 |
| `lede`               | 19px → 23px      | 1.5                    | DM Sans 400          |
| `body`               | 17px             | 1.65                   | DM Sans 400          |
| `caption`            | 14px             | 1.5                    | DM Sans 400          |
| `label` (`.eyebrow`) | 12px, uppercase  | 1.3 / +0.12em          | DM Sans 500          |

The homepage hero name is the one deliberate exception: it is sized to the hero wall (`14cqi` on desktop, `clamp(4.4rem, 1.5rem + 14.6vw, 14.6rem)` below) so the name, brush stroke and crescent keep their composition.

### The wordmark

**Artby**_Moon_: "Artby" in Instrument Serif roman, "Moon" in its italic, a quiet nod to @art.by.moon\_ and the crescent that accompanies it. It is one component, `src/components/ui/Wordmark.tsx`, used in the header, the mobile menu and the footer; the homepage hero and the social-preview image set it the same way. It reads as a single word ("ArtbyMoon") to screen readers, and is a single inline element, so a flex parent can't split it. Header size: 1.85rem, −0.01em.

### Italic usage

Italic is reserved for the artist's voice and for things still to come:

- the _Moon_ of the wordmark;
- polaroid captions and the artist's own note on an artwork page (`ArtworkDetail`);
- the "In her words" quote on the About page and quotes in journal posts (`RichText`);
- "pending" values: an untitled work on a wall label (`WallLabel`), the _TBA_ stub of an unscheduled Paint with Moon session.

Rules:

- Display type is only ever Instrument Serif, at weight 400.
- Interface labels are only ever the uppercase DM Sans `.eyebrow`.
- Handwriting (Caveat) is only for annotations, never for content or navigation.
- Measure is capped at `max-w-prose` (38rem).

## Spacing and layout

- **Base unit:** 4px (Tailwind default). The scale in use is 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192.
- **`gutter`:** `clamp(1rem → 2.75rem)`. Page side padding, 16px on phones.
- **`section`:** `clamp(5rem → 9.5rem)`. Vertical rhythm between major sections (reduced in Phase 2: two adjacent sections at the old maximum left about 400px of empty paper).
- **`max-w-page`:** 100rem. On very wide screens there is more paper, not bigger art.
- **Grid:** 4 / 6 / 12 columns (phone / tablet / desktop). Asymmetry comes from spans and offsets, not from abandoning the grid.
- **Breakpoints:** Tailwind defaults. Complex compositions (studio wall, pinned sequences) only activate at `lg` (64rem).

## Lines, surfaces and objects

| Treatment    | Spec                                                              | Where                                              |
| ------------ | ----------------------------------------------------------------- | -------------------------------------------------- |
| Hairline     | 1px `line` (ink at 14%)                                           | Dividers, card edges, index rows                   |
| Rule         | 1px `line-strong`                                                 | Editorial emphasis, sparingly                      |
| Mount        | Paper margin plus hairline                                        | Artwork detail (passe-partout)                     |
| Tape         | Translucent `tape` with torn `clip-path` ends                     | Home or studio contexts only. Never in collections |
| Peg and line | Ochre peg, 1px thread                                             | Bookmark line                                      |
| Perforation  | Radial-dot edge                                                   | Paint with Moon session ticket                     |
| Grain        | One tiled SVG noise layer, no blend modes                         | Global; lighter in darkroom                        |
| Shadows      | `rest` and `lift` only                                            | Objects resting on the wall, and on hover          |
| Radius       | 0 everywhere; 2px for bookmarks; full round for status chips only |                                                    |

## Motion principles

1. **Brush, not bounce.** Two curves: `brush` = `cubic-bezier(0.22,1,0.36,1)` (default, decelerating) and `ink` = `cubic-bezier(0.65,0,0.35,1)` (symmetric wipes and tone changes). No elastic, overshoot or spin.
2. **The work moves least.** Artwork is revealed (clip-path unveil, gentle settle from 1.12 scale) but never skewed or warped. Parallax stays under 10% and never applies to body text.
3. **One gesture at a time.** Each view gets one choreographed moment. The home intro takes about 2 seconds total.
4. **Never a gate.** There is no preloader and no scroll-jacking of content. Elements hidden for an intro are hidden only when JS is running and motion is allowed, and a CSS failsafe reveals them after 3.5s regardless.
5. **Reduced motion is a first-class mode.** Lenis is not started, and GSAP `matchMedia` skips every reveal, pin and parallax. Pinned sequences become native scroll rows, and pages are complete and static.

**Durations:**

| Use                  | Duration    |
| -------------------- | ----------- |
| Micro (hover colour) | 160ms       |
| UI (underline, menu) | 320ms       |
| Reveal               | 1.1s        |
| Tone change          | 900ms (CSS) |

**Stagger:** chars 40ms · lines 90ms · items 120ms.

**Interaction decisions:**

- **Hover:** pinned pieces straighten and lift. Index rows nudge right and show a cursor-trailing preview (fine pointers only). Underlines lift off like a pen stroke.
- **No custom cursor.** The index preview already gives desktop pointers a rich hover. A global custom cursor would hurt usability (precision, accessibility, input lag) without adding meaning. We'll revisit only for a specific context, such as a "View" label inside the gallery.
