import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Default social preview for every page without its own image: typographic,
 * in the site's ivory and ink, with ArtbyMoon's crescent. It shows no artwork,
 * so it never stands in for her work. Artwork pages override it with the
 * artwork's photograph once one exists.
 */
export const alt = "ArtbyMoon: paintings, polaroids, bookmarks and photographs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fraunces = await readFile(
  join(process.cwd(), "assets/fonts/Fraunces-Regular.ttf"),
);

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        background: "#f4efe6",
        color: "#1b1a17",
        fontFamily: "Fraunces",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <span
          style={{ fontSize: 156, lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          ArtbyMoon
        </span>
        <svg
          width="56"
          height="56"
          viewBox="0 0 100 100"
          style={{ marginLeft: 22, marginTop: 6 }}
        >
          <path
            d="M34.5 11 A42 42 0 1 0 85.6 72.3 A40 40 0 0 1 34.5 11 Z"
            fill="#c24f2b"
          />
        </svg>
      </div>
      <svg
        width="620"
        height="28"
        viewBox="0 0 600 40"
        style={{ marginTop: 8 }}
      >
        <path
          d="M6 27 C 110 14, 250 31, 372 19 S 548 12, 594 21"
          stroke="#c24f2b"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span style={{ marginTop: 40, fontSize: 34, color: "#6b655c" }}>
        Paintings · Polaroids · Bookmarks · Photographs
      </span>
      <span style={{ marginTop: 14, fontSize: 28, color: "#6b655c" }}>
        @art.by.moon_
      </span>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 400 },
      ],
    },
  );
}
