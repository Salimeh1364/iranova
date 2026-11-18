import { COLUMN, HALL, PLAN } from "@/scene/hall";

// The whole rubai. No caption, no number, no shop mark.
// Right and left are as you face the passage from the entrance.
const RIGHT_LINES = [
  "دنیا همه هیچ",
  "و اهل دنیا همه هیچ",
  "ای هیچ برای هیچ",
  "بر هیچ مپیچ",
] as const;

const LEFT_LINES = [
  "دانی که پس از عمر",
  "چه ماند باقی",
  "مهر است و محبت است",
  "و باقی همه هیچ",
] as const;

// Soft charcoal. Warm and muted, so the ink sits on the olive plaster.
const INK = "#4a453f";

/** One inscription, in meters, proud of the plaster. */
export type VerseHang = {
  position: readonly [number, number, number];
  rotationY: number;
  width: number;
  height: number;
  lines: readonly string[];
};

const half = HALL.wallThickness / 2;
// Just clear of the plaster, so the ink does not flicker against the wall.
const PROUD = 0.02;

// The passage wall faces the foyer. The visitor looks at this face from the entrance.
const faceZ = PLAN.divideZ + half + PROUD;

// The pier between the jamb column and the corner column. The ink stays clear of both capitals.
const sideInner = PLAN.spineRight - half;
const pastCapital = COLUMN.radius * 2 + 0.16;
const pierLow = PLAN.passageHalf + pastCapital;
const pierHigh = sideInner - pastCapital;
const width = pierHigh - pierLow;
const centerX = (pierLow + pierHigh) / 2;

const sheet = { width, height: width * (1500 / 1400) };
const eye = 2.55;

/**
 * Left and right walls of the arch between the foyer and the main hall.
 * The plane faces the entrance. Right carries the first couplet.
 */
export const VERSE_HANGS: readonly VerseHang[] = [
  {
    position: [centerX, eye, faceZ],
    rotationY: 0,
    ...sheet,
    lines: RIGHT_LINES,
  },
  {
    position: [-centerX, eye, faceZ],
    rotationY: 0,
    ...sheet,
    lines: LEFT_LINES,
  },
];

let nastaliq: Promise<string> | null = null;

/** Self-hosted Nastaʿliq. Kept off the Google font loader. */
export function loadNastaliq() {
  if (!nastaliq) {
    nastaliq = (async () => {
      const face = new FontFace("IranovaNastaliq", "url(/fonts/noto-nastaliq-urdu.woff2)");
      await face.load();
      document.fonts.add(face);
      return "IranovaNastaliq";
    })();
  }
  return nastaliq;
}

/** Paint one half of the poem. Empty pixels stay transparent. */
export function paintVerse(canvas: HTMLCanvasElement, lines: readonly string[], family: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = INK;
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // One size for the whole panel, taken from the longest line.
  const maxWidth = canvas.width * 0.84;
  const size = Math.min(...lines.map((line) => fitSize(ctx, line, family, maxWidth)));
  ctx.font = `${size}px ${family}`;

  // Nastaʿliq marks sit well outside the em box, so the step is generous.
  const step = size * 2.6;
  const stack = step * lines.length;
  const scale = Math.min(1, (canvas.height * 0.8) / stack);
  const drawn = size * scale;
  const drawnStep = step * scale;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  // A shallow drop toward the left, the way a Nastaʿliq line is set.
  ctx.rotate(-0.03);
  ctx.font = `${drawn}px ${family}`;
  ctx.textAlign = "center";

  const top = -((lines.length - 1) * drawnStep) / 2;
  lines.forEach((line, index) => {
    // Each line steps a little to the left, so the block cascades.
    const drift = (index - (lines.length - 1) / 2) * drawn * 0.35;
    ctx.fillText(line, -drift, top + index * drawnStep);
  });
  ctx.restore();
}

function fitSize(ctx: CanvasRenderingContext2D, line: string, family: string, maxWidth: number) {
  let size = 280;
  ctx.font = `${size}px ${family}`;
  while (ctx.measureText(line).width > maxWidth && size > 48) {
    size -= 4;
    ctx.font = `${size}px ${family}`;
  }
  return size;
}
