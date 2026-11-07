// Generates synthetic "SAMPLE IMAGE" JPEGs used only in sample-content mode
// (ARTBYMOON_SAMPLE_CONTENT=1). They exercise the real image pipeline at the
// proportions of each format and are deliberately not artwork.
// Usage: node scripts/generate-sample-images.mjs
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const out = join(
  import.meta.dirname,
  "..",
  "src",
  "content",
  "placeholder",
  "sample-images",
);
mkdirSync(out, { recursive: true });

const samples = [
  // Photography samples (dark tones, photo proportions)
  {
    name: "photo-3x2",
    w: 2400,
    h: 1600,
    a: "#1c1a18",
    b: "#556292",
    label: "photo 3:2",
  },
  {
    name: "photo-2x3",
    w: 1600,
    h: 2400,
    a: "#2a2724",
    b: "#ca972b",
    label: "photo 2:3",
  },
  {
    name: "photo-4x5",
    w: 1600,
    h: 2000,
    a: "#121110",
    b: "#329597",
    label: "photo 4:5",
  },
  {
    name: "photo-1x1",
    w: 1800,
    h: 1800,
    a: "#26355b",
    b: "#1c1a18",
    label: "photo 1:1",
  },
  {
    name: "photo-16x9",
    w: 2400,
    h: 1350,
    a: "#2a2724",
    b: "#c24f2b",
    label: "photo 16:9",
  },
  {
    name: "canvas-4x5",
    w: 1600,
    h: 2000,
    a: "#627d40",
    b: "#e6d8b4",
    label: "4:5",
  },
  {
    name: "canvas-4x3",
    w: 2000,
    h: 1500,
    a: "#c24f2b",
    b: "#ca972b",
    label: "4:3",
  },
  {
    name: "canvas-3x4",
    w: 1500,
    h: 2000,
    a: "#26355b",
    b: "#c7679c",
    label: "3:4",
  },
  {
    name: "canvas-1x1",
    w: 1800,
    h: 1800,
    a: "#c7679c",
    b: "#f4efe6",
    label: "1:1",
  },
  {
    name: "abstract-1x1",
    w: 1800,
    h: 1800,
    a: "#165ab0",
    b: "#329597",
    label: "1:1",
  },
  {
    name: "abstract-3x4",
    w: 1500,
    h: 2000,
    a: "#556292",
    b: "#c24f2b",
    label: "3:4",
  },
  {
    name: "polaroid",
    w: 1230,
    h: 1500,
    a: "#329597",
    b: "#ca972b",
    label: "polaroid",
    frame: "polaroid",
  },
  {
    name: "bookmark",
    w: 600,
    h: 2040,
    a: "#c7679c",
    b: "#556292",
    label: "1:3.4",
  },
  {
    name: "detail-3x2",
    w: 1800,
    h: 1200,
    a: "#ca972b",
    b: "#627d40",
    label: "3:2 · extra view",
  },
];

function svg({ w, h, a, b, label, frame }) {
  const min = Math.min(w, h);
  const win =
    frame === "polaroid"
      ? { x: w * 0.06, y: w * 0.06, w: w * 0.88, h: w * 0.88 }
      : { x: 0, y: 0, w, h };
  const big = Math.round(min * 0.075);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <pattern id="p" width="${big * 9}" height="${big * 2.4}" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
      <text x="0" y="${big}" font-family="Arial, sans-serif" font-weight="700" font-size="${big * 0.55}" fill="#fff" fill-opacity="0.16" letter-spacing="${big * 0.08}">SAMPLE IMAGE · NOT ARTWORK</text>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${frame === "polaroid" ? "#faf7f1" : "#ddd"}"/>
  <rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" fill="url(#g)"/>
  <rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" fill="url(#p)"/>
  <rect x="${win.x + win.w * 0.08}" y="${win.y + win.h / 2 - big * 1.1}" width="${win.w * 0.84}" height="${big * 2.2}" fill="#1b1a17" fill-opacity="0.72"/>
  <text x="${win.x + win.w / 2}" y="${win.y + win.h / 2 + big * 0.32}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${big * 0.82}" fill="#f4efe6" letter-spacing="${big * 0.06}">SAMPLE · ${label}</text>
  ${frame === "polaroid" ? `<line x1="${w * 0.14}" x2="${w * 0.78}" y1="${h * 0.93}" y2="${h * 0.925}" stroke="#1b1a17" stroke-opacity="0.25" stroke-width="3"/>` : ""}
</svg>`;
}

for (const s of samples) {
  await sharp(Buffer.from(svg(s)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(out, `${s.name}.jpg`));
  console.log("wrote", s.name);
}
