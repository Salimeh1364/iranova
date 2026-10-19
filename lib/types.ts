/** A frame hung in the hall. The front of the mesh faces local +Z before rotationY is applied. */
export type ArtworkPlacement = {
  id: string;
  position: readonly [number, number, number];
  rotationY: number;
};
