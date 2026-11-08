/**
 * The ArtbyMoon wordmark: "Artby" in Instrument Serif roman, "Moon" in its
 * italic, a quiet nod to @art.by.moon_. Reads as one word ("ArtbyMoon") to
 * screen readers. Use inside an element that has `font-display`; the italic
 * file is selected by `.font-display .italic` in globals.css.
 */
export function Wordmark() {
  // One inline element, so a flex parent (the footer link) can't split it.
  return (
    <span>
      Artby<span className="italic">Moon</span>
    </span>
  );
}
