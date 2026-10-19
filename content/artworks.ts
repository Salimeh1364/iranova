import type { ArtworkPlacement } from "@/lib/types";

const frameY = 1.85;
const leftX = -3.05;
const rightX = 3.05;

/**
 * Four empty frames, two on each exhibition wall.
 * rotationY turns the frame's front (local +Z) toward the center of the hall.
 * Titles and images can be added on these records later.
 */
export const artworks: readonly ArtworkPlacement[] = [
  { id: "west-near", position: [leftX, frameY, 2.2], rotationY: Math.PI / 2 },
  { id: "west-far", position: [leftX, frameY, -1.8], rotationY: Math.PI / 2 },
  { id: "east-near", position: [rightX, frameY, 2.2], rotationY: -Math.PI / 2 },
  { id: "east-far", position: [rightX, frameY, -1.8], rotationY: -Math.PI / 2 },
];
