import type { ArtworkPlacement } from "@/lib/types";

const hangY = 1.7;

/**
 * Works on the foyer walls, the main gallery, and the west wing.
 * rotationY turns local +Z toward the room.
 * Positions sit 4 cm inside the plaster face.
 */
export const artworks: readonly ArtworkPlacement[] = [
  {
    id: "foyer-west",
    // Left foyer wall, inner face x = -5.41.
    position: [-5.37, hangY, 5.2],
    rotationY: Math.PI / 2,
    width: 1.25,
    height: 1.55,
    seed: 5,
  },
  {
    id: "foyer-east",
    // Right foyer wall, inner face x = 5.41.
    position: [5.37, hangY, 4.4],
    rotationY: -Math.PI / 2,
    width: 1.2,
    height: 1.45,
    seed: 13,
  },
  {
    id: "gallery-far-west",
    // Far wall of the main gallery, inner face z = -10.91.
    position: [-2.3, hangY, -10.87],
    rotationY: 0,
    width: 1.7,
    height: 1.2,
    seed: 21,
  },
  {
    id: "gallery-far-east",
    position: [2.2, hangY, -10.87],
    rotationY: 0,
    width: 1.4,
    height: 1.15,
    seed: 29,
  },
  {
    id: "gallery-east",
    position: [5.37, hangY, -5.8],
    rotationY: -Math.PI / 2,
    width: 1.15,
    height: 1.4,
    seed: 37,
  },
  {
    id: "wing-west",
    // Outer wall of the wing, inner face x = -14.41.
    position: [-14.37, hangY, -7.2],
    rotationY: Math.PI / 2,
    width: 1.35,
    height: 1.6,
    seed: 45,
  },
];
