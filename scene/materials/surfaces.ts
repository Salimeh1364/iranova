import {
  CanvasTexture,
  LinearSRGBColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type CanvasTexture as CanvasTextureType,
} from "three";
import { palette } from "@/lib/palette";

const SHEET = 512;

let concreteTexture: CanvasTextureType | null = null;
let plasterBump: CanvasTextureType | null = null;

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

/**
 * Polished concrete. Base is #dcdad5, with a tighter speckle toward #c5c3bd.
 * A canvas keeps the floor free of image files.
 */
export function getConcreteTexture() {
  if (concreteTexture) return concreteTexture;

  const canvas = document.createElement("canvas");
  canvas.width = SHEET;
  canvas.height = SHEET;
  const context = requireContext(canvas, "Concrete");

  // #dcdad5 light concrete. Specks stay near #c5c3bd so the slab reads as one floor.
  context.fillStyle = palette.stone;
  context.fillRect(0, 0, SHEET, SHEET);

  let seed = 42;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed & 0xfffffff) / 0xfffffff;
  };

  for (let index = 0; index < 2200; index += 1) {
    const tone = 186 + Math.floor(random() * 30);
    // Neutral grey speckle, slightly darker than #dcdad5.
    context.fillStyle = `rgba(${tone}, ${tone}, ${tone - 2}, 0.22)`;
    context.fillRect(random() * SHEET, random() * SHEET, 1 + random() * 2, 1 + random() * 2);
  }

  concreteTexture = finishTexture(canvas, SRGBColorSpace);
  concreteTexture.repeat.set(5, 6);
  return concreteTexture;
}

/** A faint grain so painted walls are not a flat shader color. */
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
