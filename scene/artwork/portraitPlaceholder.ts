/**
 * A painted stand-in for a portrait that is not in `public/images/figures` yet.
 * It is a bust in flat color, not a likeness and not a photograph.
 */

type Palette = {
  ground: string;
  sky: string;
  cloth: string;
  skin: string;
  line: string;
};

const PALETTES: readonly Palette[] = [
  { ground: "#c5d2c0", sky: "#e7efe4", cloth: "#6e7f74", skin: "#e4cbb4", line: "#8a9a86" },
  { ground: "#d5d0c4", sky: "#efe8dc", cloth: "#7a6858", skin: "#efd0b4", line: "#a08b72" },
  { ground: "#c9d0c8", sky: "#e4eee8", cloth: "#3f5c56", skin: "#e8cbb0", line: "#279c99" },
  { ground: "#ddd4c6", sky: "#f4eee4", cloth: "#8a5a48", skin: "#f0d2ba", line: "#d4a64a" },
];

const cache = new Map<number, HTMLCanvasElement>();

/** One canvas per seed. Later frames reuse it. */
export function getPlaceholderCanvas(seed: number): HTMLCanvasElement {
  const cached = cache.get(seed);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  // Portrait ratio, modest pixels. Eight of these stay cheap.
  canvas.width = 640;
  canvas.height = 800;
  paint(canvas, seed);
  cache.set(seed, canvas);
  return canvas;
}

/** Data URL for the HTML biography panel, from the same painting. */
export function placeholderDataUrl(seed: number): string {
  return getPlaceholderCanvas(seed).toDataURL("image/jpeg", 0.85);
}

function paint(canvas: HTMLCanvasElement, seed: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const tone = PALETTES[Math.abs(seed) % PALETTES.length];
  const width = canvas.width;
  const height = canvas.height;

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, tone.sky);
  sky.addColorStop(1, tone.ground);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Shoulders, a simple block under the head.
  ctx.fillStyle = tone.cloth;
  ctx.beginPath();
  ctx.moveTo(width * 0.16, height);
  ctx.lineTo(width * 0.3, height * 0.62);
  ctx.lineTo(width * 0.7, height * 0.62);
  ctx.lineTo(width * 0.84, height);
  ctx.closePath();
  ctx.fill();

  // Head. No features, so the stand-in is not a false likeness.
  ctx.fillStyle = tone.skin;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.4, width * 0.16, height * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = tone.line;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.28, height * 0.9);
  ctx.lineTo(width * 0.72, height * 0.9);
  ctx.stroke();
}
