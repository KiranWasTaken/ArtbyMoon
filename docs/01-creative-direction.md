# 01 · Creative direction: "The Open Studio"

## The idea

The site is ArtbyMoon's studio with the door left open. Visitors aren't browsing a catalogue; they're walking into a working room where paintings are pinned to the wall, bookmarks dry on a line, sketches lie on the table and photographs wait in a darkened corner.

That single metaphor decides most design questions:

| Studio reality                    | Interface expression                                                       |
| --------------------------------- | -------------------------------------------------------------------------- |
| Paper, card stock, primed canvas  | Warm ivory surfaces, a fine grain, material-specific placeholder textures  |
| Pencil rulings, ink               | 1px hairlines, ink-black type (warm, never pure #000)                      |
| Masking tape, pegs, a drying line | Tape strips and pegs on the **home page only**, where the tone is informal |
| A loaded brush                    | One vermilion brush stroke per page, under a key word                      |
| Margin notes                      | A handwritten annotation, at most one per view                             |
| A gallery wall label              | Museum-style captions: title, medium, size, year, but only when supplied   |
| The darkroom                      | A dark viewing tone for photography and close artwork viewing              |

## The arc: from studio to gallery

The informality is deliberate and **bounded**. The home page is the studio (tilted pieces, tape, a pencilled note). As visitors go deeper, the presentation straightens into a gallery:

- **Home:** playful, tactile, layered. Work is pinned at slight angles that straighten on hover.
- **Collections:** curated and disciplined. Square edges, consistent margins, true aspect ratios, no tape.
- **Artwork detail:** museum-quiet. A mounted image (passe-partout margin plus hairline), a wall label, optional darkroom tone.
- **Photography:** the darkroom. The interface recedes so the images carry the page.

This keeps the personality of a working artist without turning her paintings into props for a theme.

## Principles

1. **The work is the loudest thing on the page.** Accents are marks (an underline, a dot, a focus ring), never fills that compete with a painting. Palette, type and motion all defer to the artwork.
2. **Curated, not mass-produced.** Asymmetric compositions, varied proportions, generous whitespace. Never a uniform grid of identical squares, and never crop a painting to fit a layout.
3. **Tactile, not skeuomorphic.** Paper grain, tape and pegs are suggested in a few pixels of texture and shape, never rendered as photographic props.
4. **Her hand, not a font's.** The handwritten accent is a stand-in (Caveat). The intended final version is ArtbyMoon's own lettering, digitised from her bookmark calligraphy. Likewise, her signature is the natural candidate for the wordmark.
5. **Honest by construction.** No invented titles, dates, prices, testimonials or biography. Missing facts render as clearly labelled gaps ("Title to be confirmed", "To be announced") and disappear once real content exists.

## Why this isn't a template

- The layouts come from objects in her practice (a canvas on a wall, a bookmark on a line, a print in a darkroom), not from generic "portfolio grid" patterns.
- The single pinned horizontal sequence is used where the objects demand it: bookmarks are slim, tall and meant to be seen side by side.
- Restraint is the luxury signal. One brush stroke, one note, one choreographed moment per view.

## The homepage as a walk through the studio (Phase 2)

Each section is a different place in the studio, so composition and rhythm change while the identity holds:

| Section          | Place                        | Composition                                                                                                        |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Hero             | The wall                     | Taped pieces around the name. The "i" is dotted with her crescent moon, which rises after the letters in the intro |
| Explore the work | The index                    | Editorial rows. Cursor preview on desktop, thumbnails on touch                                                     |
| Canvas paintings | The gallery                  | Mounted works at true proportions, sticky text column                                                              |
| Polaroids        | The desk                     | Polaroids dealt onto lined notebook paper                                                                          |
| Bookmarks        | The drying line              | The one pinned horizontal sequence; swipe row on mobile                                                            |
| Photography      | The darkroom                 | The page dims; the section carries its own dark tokens                                                             |
| Workshops        | The noticeboard              | A paper ticket, or an honest "To be announced" ticket                                                              |
| Journal          | The notebook's contents page | Sections listed with dotted leaders, or the latest entries                                                         |
| Closing          | The door                     | A pencil crescent draws itself, then three ways onward                                                             |

The informal-to-formal arc still holds: tape only on the wall, mounts in the gallery, paper and pegs where objects are handled.

## What the reference screenshot showed

Source: a full-page capture of her Instagram profile, `screenshot/screencapture-instagram-art-by-moon-….png` (git-ignored, reference only). It shows the handle **@art.by.moon_** ("ARTBYMOON 🌙") and about 160 posts.

- **Colour is the point of her work:** saturated night skies, magenta blossoms, lavender fields, autumn golds, turquoise. Pigment tokens were recalibrated from it (doc 02). This confirms the neutral ivory interface: the UI must stay calm so her colour can be loud.
- **Polaroids are a signature series.** Many works are small paintings in white polaroid-style frames with **handwritten captions**, often with a drawn music-player bar. "Polaroids" is also one of her own story highlights, alongside For Sale/Sold, Paintings, Christmas, Autumn Love and Bookmarks. Added as its own collection in Phase 2 (doc 03).
- **Her handwriting is already part of the work,** in polaroid captions and bookmark calligraphy. That strongly supports principle 4: digitise her hand for the accent face and annotations.
- **She presents work as tactile flat-lays:** lined notebook paper, petals, pinecones, feathers and dried flowers. The paper-and-studio direction comes from her own presentation habits, not from a theme.
- **The moon is her own mark** (handle and 🌙). The favicon is now an ink crescent. A crescent-plus-signature wordmark is worth exploring with her.
- **Selling is already happening** ("DM for order", a For Sale/Sold highlight). This supports the `availability` field and artwork enquiry flow.
- Captions on her posts carry real titles (e.g. _Kumari_, _Flamingo_, _Midnight Bloom_). These can seed the intake spreadsheet, but **only with her confirmation**. Nothing from the screenshot is used as site content or imagery.

## Open questions for ArtbyMoon

- Her own words for the hero line, collection descriptions and the handwritten note. All current copy is draft copy based only on the brief.
- Polaroids now has its own collection; confirm the name and summary. Should seasonal work (Christmas, Autumn Love) appear as series?
- Whether she'd like her signature (with the crescent) as the wordmark, and samples of her lettering for the handwritten accent.
- Domain and preferred contact channels. The Instagram link is now set to @art.by.moon_ from the screenshot; please confirm.
