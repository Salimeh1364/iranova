import {
  CanvasTexture,
  LinearSRGBColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type CanvasTexture as CanvasTextureType,
} from "three";

const SHEET = 512;
const BRICK_WIDTH = 78;
const BRICK_HEIGHT = 32;
  const MORTAR = 14;

let brickTexture: CanvasTextureType | null = null;
let brickBump: CanvasTextureType | null = null;
let concreteTexture: CanvasTextureType | null = null;
let plasterBump: CanvasTextureType | null = null;
let marbleTexture: CanvasTextureType | null = null;

type DrawContext = CanvasRenderingContext2D;

function requireContext(canvas: HTMLCanvasElement, label: string) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error(`${label} texture requires a 2D canvas.`);
  return context;
}

function finishTexture(canvas: HTMLCanvasElement, colorSpace: CanvasTextureType["colorSpace"]) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = colorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/** Running-bond courses. The same grid is drawn into the color sheet and the bump sheet. */
function paintBrickCourses(context: DrawContext, paintBrick: (warmth: number) => string, mortar: string) {
  context.fillStyle = mortar;
  context.fillRect(0, 0, SHEET, SHEET);

  const rowHeight = BRICK_HEIGHT + MORTAR;
  for (let row = 0, y = MORTAR; y < SHEET; row += 1, y += rowHeight) {
    const offset = row % 2 === 0 ? 0 : BRICK_WIDTH / 2;
    for (let x = -BRICK_WIDTH + offset; x < SHEET; x += BRICK_WIDTH + MORTAR) {
      const warmth = (row * 13 + Math.floor(x)) % 18;
      context.fillStyle = paintBrick(warmth);
      context.fillRect(x, y, BRICK_WIDTH, BRICK_HEIGHT);
    }
  }
}

/**
 * Cream and sand brick for the vault and the window wall.
 * A canvas keeps the hall free of image files and network requests.
 */
export function getBrickTexture() {
  if (brickTexture) return brickTexture;

  const canvas = document.createElement("canvas");
  canvas.width = SHEET;
  canvas.height = SHEET;
  const context = requireContext(canvas, "Brick");

  paintBrickCourses(
    context,
    (warmth) => `rgb(${226 + warmth}, ${198 + Math.floor(warmth * 0.4)}, ${162})`,
    "#8d7360",
  );

  brickTexture = finishTexture(canvas, SRGBColorSpace);
  return brickTexture;
}

/**
 * Height data for the same bond. Mortar is dark, so the joints recede under the bump.
 * Linear color space keeps the values from being gamma-corrected into the wrong height.
 */
export function getBrickBump() {
  if (brickBump) return brickBump;

  const canvas = document.createElement("canvas");
  canvas.width = SHEET;
  canvas.height = SHEET;
  const context = requireContext(canvas, "Brick bump");

  paintBrickCourses(context, (warmth) => `rgb(${188 + warmth}, ${188 + warmth}, ${188 + warmth})`, "#6e655c");

  brickBump = finishTexture(canvas, LinearSRGBColorSpace);
  return brickBump;
}

/** Fine speckle for the polished concrete. The floor reflector tints this toward light grey. */
export function getConcreteTexture() {
  if (concreteTexture) return concreteTexture;

  const canvas = document.createElement("canvas");
  canvas.width = SHEET;
  canvas.height = SHEET;
  const context = requireContext(canvas, "Concrete");

  context.fillStyle = "#e4eaf0";
  context.fillRect(0, 0, SHEET, SHEET);

  let seed = 42;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed & 0xfffffff) / 0xfffffff;
  };

  for (let index = 0; index < 2400; index += 1) {
    const gray = 188 + Math.floor(random() * 48);
    context.fillStyle = `rgba(${gray}, ${gray + 2}, ${gray + 8}, 0.35)`;
    context.fillRect(random() * SHEET, random() * SHEET, 1 + random() * 2, 1 + random() * 2);
  }

  concreteTexture = finishTexture(canvas, SRGBColorSpace);
  concreteTexture.repeat.set(6, 10);
  return concreteTexture;
}

/** A barely-there grain so plaster is not a flat shader color. */
export function getPlasterBump() {
  if (plasterBump) return plasterBump;

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = requireContext(canvas, "Plaster");
  context.fillStyle = "#b4b4b4";
  context.fillRect(0, 0, 128, 128);

  let seed = 19;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed & 0xfffffff) / 0xfffffff;
  };

  for (let index = 0; index < 700; index += 1) {
    const tone = 150 + Math.floor(random() * 40);
    context.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
    context.fillRect(random() * 128, random() * 128, 1, 1);
  }

  plasterBump = finishTexture(canvas, LinearSRGBColorSpace);
  plasterBump.repeat.set(2, 3);
  return plasterBump;
}

/** Pale stone with a few soft veins, used on the pool coping. */
export function getMarbleTexture() {
  if (marbleTexture) return marbleTexture;

  const canvas = document.createElement("canvas");
  canvas.width = SHEET;
  canvas.height = SHEET;
  const context = requireContext(canvas, "Marble");
  context.fillStyle = "#f4f1eb";
  context.fillRect(0, 0, SHEET, SHEET);

  context.strokeStyle = "rgba(196, 186, 172, 0.55)";
  context.lineWidth = 2;
  for (let vein = 0; vein < 7; vein += 1) {
    context.beginPath();
    context.moveTo(0, 40 + vein * 68);
    context.bezierCurveTo(160, 20 + vein * 70, 320, 90 + vein * 50, SHEET, 30 + vein * 64);
    context.stroke();
  }

  marbleTexture = finishTexture(canvas, SRGBColorSpace);
  marbleTexture.repeat.set(1, 3);
  return marbleTexture;
}
