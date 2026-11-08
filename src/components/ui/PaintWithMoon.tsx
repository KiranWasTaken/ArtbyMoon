/**
 * "Paint with Moon" for display headings, set like the ArtbyMoon wordmark:
 * roman, with "Moon" in the Instrument Serif italic. Reads as plain text to
 * screen readers. Use inside an element that has `font-display`; the italic
 * file is selected by `.font-display .italic` in globals.css. Labels and
 * navigation use the plain text "Paint with Moon".
 */
export function PaintWithMoon() {
  // One inline element, so a flex parent can't split it.
  return (
    <span>
      Paint with <span className="italic">Moon</span>
    </span>
  );
}
