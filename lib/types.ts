/** A framed work. The front of the mesh faces local +Z before rotationY is applied. */
export type ArtworkPlacement = {
  id: string;
  position: readonly [number, number, number];
  rotationY: number;
  width: number;
  height: number;
  /** Seed for the generated painting. Each work gets its own field. */
  seed: number;
};
