import { ClampToEdgeWrapping, Texture } from "three";

/**
 * Crop a photograph the way CSS `object-fit: cover` does.
 * `biasY` is 0 at the top of the picture and 1 at the bottom.
 * Portraits use a low bias so the face stays in the opening.
 */
export function applyCover(texture: Texture, viewAspect: number, biasY = 0.5) {
  const image = texture.image as { width?: number; height?: number } | undefined;
  if (!image?.width || !image?.height) return;

  const imageAspect = image.width / image.height;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);

  if (imageAspect > viewAspect) {
    // Wider than the opening: crop the sides, keep the full height.
    const repeatX = viewAspect / imageAspect;
    texture.repeat.x = repeatX;
    texture.offset.x = (1 - repeatX) / 2;
    return;
  }

  // Taller than the opening: crop top and bottom.
  // With Three's default flipY, a small offset keeps the top of the picture.
  const repeatY = imageAspect / viewAspect;
  texture.repeat.y = repeatY;
  texture.offset.y = (1 - repeatY) * biasY;
}
