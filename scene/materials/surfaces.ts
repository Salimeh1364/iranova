import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type CanvasTexture as CanvasTextureType,
} from "three";

let brickTexture: CanvasTextureType | null = null;
let concreteTexture: CanvasTextureType | null = null;

/**
 * One generated brick sheet, reused by every vault and the window wall.
 * A canvas keeps the hall free of image files and network requests.
 */
export function getBrickTexture() {
  if (brickTexture) return brickTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Brick texture requires a 2D canvas.");

  context.fillStyle = "#f7f1e6";
  context.fillRect(0, 0, 256, 256);

  const brickWidth = 56;
  const brickHeight = 26;
  const mortar = 4;
  const rowHeight = brickHeight + mortar;

  for (let row = 0, y = mortar; y < 256; row += 1, y += rowHeight) {
    const offset = row % 2 === 0 ? 0 : brickWidth / 2;
    for (let x = -brickWidth + offset; x < 256; x += brickWidth + mortar) {
      const warmth = (row * 17 + x) % 16;
      // Sand and cream clay, clustered around #d4b896. The material tint stays white so this color is not doubled.
      context.fillStyle = `rgb(${228 + warmth}, ${204 + Math.floor(warmth * 0.25)}, ${176})`;
      context.fillRect(x, y, brickWidth, brickHeight);
    }
  }

  brickTexture = new CanvasTexture(canvas);
  brickTexture.colorSpace = SRGBColorSpace;
  brickTexture.wrapS = RepeatWrapping;
  brickTexture.wrapT = RepeatWrapping;
  brickTexture.needsUpdate = true;
  return brickTexture;
}

/** Soft, non-repeating speckle so the concrete floor is not a flat fill. */
export function getConcreteTexture() {
  if (concreteTexture) return concreteTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Concrete texture requires a 2D canvas.");

  context.fillStyle = "#e2e8f0";
  context.fillRect(0, 0, 256, 256);

  let seed = 42;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed & 0xfffffff) / 0xfffffff;
  };

  for (let index = 0; index < 1800; index += 1) {
    const gray = 196 + Math.floor(random() * 40);
    context.fillStyle = `rgba(${gray}, ${gray + 2}, ${gray + 6}, 0.4)`;
    context.fillRect(random() * 256, random() * 256, 1 + random() * 2, 1 + random() * 2);
  }

  concreteTexture = new CanvasTexture(canvas);
  concreteTexture.colorSpace = SRGBColorSpace;
  concreteTexture.wrapS = RepeatWrapping;
  concreteTexture.wrapT = RepeatWrapping;
  concreteTexture.repeat.set(5, 9);
  concreteTexture.needsUpdate = true;
  return concreteTexture;
}
