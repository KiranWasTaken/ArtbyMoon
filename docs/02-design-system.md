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

| Role               | Face                                                         | Why                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display            | **Fraunces** (variable, with `opsz`, `SOFT` and `WONK` axes) | Editorial serif with soft, almost brushed terminals at `SOFT 60`. `opsz` keeps huge sizes delicate. More personal than the Didone "luxury" default. |
| Interface and text | **Schibsted Grotesk**                                        | A grotesk designed for a newspaper: editorial, neutral, legible at small sizes, with a hint of character.                                           |
| Accent             | **Caveat**, _interim_                                        | Stand-in for ArtbyMoon's own handwriting (digitise from bookmark calligraphy, then self-host via `next/font/local`).                                |

All three fonts are OFL-licensed, self-hosted by `next/font`, and use `display: swap`.

Fluid scale (`clamp`, no breakpoint jumps):

| Token                | Size            | Line height / tracking |
| -------------------- | --------------- | ---------------------- |
| `display-xl`         | 72px → 240px    | 0.84 / −0.04em         |
| `display-l`          | 48px → 120px    | 0.92 / −0.03em         |
| `display-m`          | 36px → 68px     | 1.0 / −0.02em          |
| `title`              | 24px → 36px     | 1.15                   |
| `lede`               | 19px → 23px     | 1.5                    |
| `body`               | 17px            | 1.65                   |
| `caption`            | 14px            | 1.45                   |
| `label` (`.eyebrow`) | 12px, uppercase | +0.14em                |

Rules:

- Display type is only ever Fraunces.
- Interface labels are only ever the uppercase grotesk.
- Italics are reserved for "pending" values and wall-label titles.
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
| Perforation  | Radial-dot edge                                                   | Workshop registration card                         |
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
