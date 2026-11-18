import type { ArtworkPlacement } from "@/lib/types";
import { COLUMNS, HALL, PLAN, PLAYER } from "@/scene/hall";
import { columnsOnWall, frameCenters } from "@/scene/layout/frameLine";

/**
 * Sheet size, in meters.
 * The original portrait: 1.40 × 1.78, before the later enlargements.
 */
const FRAME_W = 1.4;
const FRAME_H = 1.78;

/**
 * Center height of every frame.
 * Matches the visitor's eye, so the portraits share one line.
 */
const EYE = PLAYER.eyeHeight;

const half = HALL.wallThickness / 2;
/** How far the frame anchor stands proud of the inner plaster. */
const PROUD = 0.04;

type Along = "x" | "z";

const westX = PLAN.spineLeft + half + PROUD;
const eastX = PLAN.spineRight - half - PROUD;
const farZ = PLAN.spineFar + half + PROUD;

// Plaster ends, inner face to inner face. Openings count as an end.
const foyerLow = PLAN.divideZ + half;
const foyerHigh = PLAN.spineNear - half;
const galleryLow = PLAN.spineFar + half;
const galleryHigh = PLAN.divideZ - half;
const galleryWestLow = PLAN.sideDoorNear;
const sideLow = PLAN.spineLeft + half;
const sideHigh = PLAN.spineRight - half;

// Foyer side walls: two portraits, equal margins, the same on the left and the right.
const foyerZ = frameCenters(foyerLow, foyerHigh, 2, FRAME_W, columnsOnWall(COLUMNS, "z", westX));
// Main gallery, east wall. Two portraits across the full run.
const eastZ = frameCenters(galleryLow, galleryHigh, 2, FRAME_W, columnsOnWall(COLUMNS, "z", eastX));
// Far wall of the main gallery, between the west pier and the east wall.
const farX = frameCenters(sideLow, sideHigh, 2, FRAME_W, columnsOnWall(COLUMNS, "x", farZ));
// One portrait, centered on the partition beside the passage.
const [galleryWestZ] = frameCenters(
  galleryWestLow,
  galleryHigh,
  1,
  FRAME_W,
  columnsOnWall(COLUMNS, "z", westX),
);

export type PortraitSlotName = keyof typeof PORTRAIT_SLOTS;

/**
 * Nine hang points.
 * One frame is centered on its wall. Two frames share the wall with equal margins.
 */
export const PORTRAIT_SLOTS = {
  // Foyer, left wall. Nearer the passage, then nearer the entrance.
  foyerWest: slot(westX, foyerZ[0], Math.PI / 2),
  foyerWestDoor: slot(westX, foyerZ[1], Math.PI / 2),
  // Foyer, right wall. The same two depths.
  foyerEast: slot(eastX, foyerZ[0], -Math.PI / 2),
  foyerEastDoor: slot(eastX, foyerZ[1], -Math.PI / 2),
  // Partition beside the passage, facing the arch. Turned 90 degrees off the calligraphy wall.
  galleryWestEntry: slot(westX, galleryWestZ, Math.PI / 2),
  // Main gallery, east wall. Far end, then the half nearer the passage.
  galleryEastFar: slot(eastX, eastZ[0], -Math.PI / 2),
  galleryEastBetween: slot(eastX, eastZ[1], -Math.PI / 2),
  // Far wall of the main gallery. Left, then right.
  galleryFarLeft: slot(farX[0], farZ, 0, "x"),
  galleryFarRight: slot(farX[1], farZ, 0, "x"),
} as const;

/** Build the placement record a portrait frame expects. */
export function portraitPlacement(id: string, name: PortraitSlotName, seed: number): ArtworkPlacement {
  const { position, rotationY } = PORTRAIT_SLOTS[name];
  return {
    id,
    position,
    rotationY,
    width: FRAME_W,
    height: FRAME_H,
    seed,
  };
}

type PortraitSlot = {
  position: readonly [number, number, number];
  rotationY: number;
};

/** Hang a frame. `along` is the wall direction used to test column clearance. */
function slot(x: number, z: number, rotationY: number, along: Along = "z"): PortraitSlot {
  const hung: PortraitSlot = { position: [x, EYE, z], rotationY };
  assertClear(hung, along);
  return hung;
}

/**
 * Reject a hang that still falls behind a column.
 * A column against the wall must clear the shaft. One out in the room must stay off the sheet.
 */
function assertClear(hung: PortraitSlot, along: Along) {
  const [x, y, z] = hung.position;
  if (Math.abs(y - EYE) > 0.001) {
    throw new Error("Portrait frames must share one eye height");
  }
  for (const column of COLUMNS) {
    const plane = along === "z" ? Math.abs(x - column.x) : Math.abs(z - column.z);
    if (plane > 4.5) continue;
    const delta = along === "z" ? Math.abs(z - column.z) : Math.abs(x - column.x);
    const edge = delta - FRAME_W / 2;
    const needed = plane < 0.5 ? 0.28 : 0.9;
    if (edge < needed) {
      throw new Error(
        `Frame at ${x.toFixed(2)}, ${z.toFixed(2)} is only ${edge.toFixed(2)} m clear of the column at ${column.x}, ${column.z}`,
      );
    }
  }
}
