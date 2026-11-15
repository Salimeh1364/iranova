import type { ArtworkPlacement } from "@/lib/types";
import { COLUMNS, HALL, PLAN, PLAYER } from "@/scene/hall";

/**
 * One landscape sheet for every landmark, in meters.
 * About a fifth larger than the 1.40 × 0.94 hang, still 3:2,
 * so the back room reads as one grand set.
 */
const SHEET = { width: 1.68, height: 1.12 };

/** Same eye line as the portraits. */
const EYE = PLAYER.eyeHeight;

const half = HALL.wallThickness / 2;
const PROUD = 0.04;

type Along = "x" | "z";

const innerWest = PLAN.wingLeft + half;
const innerEast = PLAN.spineLeft - half;

const wingWestX = PLAN.wingLeft + half + PROUD;
const farZ = PLAN.spineFar + half + PROUD;
const nearZ = PLAN.wingNear - half - PROUD;

const innerFar = PLAN.spineFar + half;
const innerNear = PLAN.wingNear - half;

// Equal plaster at both ends of the far and near walls. The same X is used on both, so opposite frames line up.
const endX = 0.55;
const westX = innerWest + endX + SHEET.width / 2;
const eastX = innerEast - endX - SHEET.width / 2;

// The west wall is shorter, so the same sheet sits closer to the ends and still clears the columns.
const endZ = 0.18;
const southZ = innerFar + endZ + SHEET.width / 2;
const northZ = innerNear - endZ - SHEET.width / 2;
// Midway between the end frames, so the three west-wall sheets share equal gaps.
const centerZ = (southZ + northZ) / 2;

export type LandmarkSlotName = keyof typeof LANDMARK_SLOTS;

/**
 * Every landmark hangs in the west wing, the back room, on one shared sheet.
 * Far and near walls mirror each other. The west wall carries three sheets on one line.
 */
export const LANDMARK_SLOTS = {
  // Far wall, west end. Same X as the near wall's west frame.
  wingFarWest: hang(westX, farZ, 0, "x", SHEET),
  // Far wall, east end. Same X as the near wall's east frame.
  wingFarEast: hang(eastX, farZ, 0, "x", SHEET),
  // Near wall, west end.
  wingNearWest: hang(westX, nearZ, Math.PI, "x", SHEET),
  // Near wall, east end.
  wingNearEast: hang(eastX, nearZ, Math.PI, "x", SHEET),
  // Long west wall, south end.
  wingWest: hang(wingWestX, southZ, Math.PI / 2, "z", SHEET),
  // Long west wall, the open center between the two end frames.
  wingWestCenter: hang(wingWestX, centerZ, Math.PI / 2, "z", SHEET),
  // Long west wall, north end. Same inset as the south frame.
  wingWestNorth: hang(wingWestX, northZ, Math.PI / 2, "z", SHEET),
} as const;

export function landmarkPlacement(
  id: string,
  name: LandmarkSlotName,
  seed: number,
): ArtworkPlacement {
  const slot = LANDMARK_SLOTS[name];
  return {
    id,
    position: slot.position,
    rotationY: slot.rotationY,
    width: slot.width,
    height: slot.height,
    seed,
  };
}

type Size = { width: number; height: number };

function hang(x: number, z: number, rotationY: number, along: Along, size: Size) {
  const hung = {
    position: [x, EYE, z] as const,
    rotationY,
    width: size.width,
    height: size.height,
  };
  assertClear(hung.position, along, size.width);
  return hung;
}

/** A column within 5.2 m of the wall must leave plaster beside the frame. */
function assertClear(position: readonly [number, number, number], along: Along, width: number) {
  const [x, y, z] = position;
  if (Math.abs(y - EYE) > 0.001) {
    throw new Error("Landmark frames must share the portrait eye height");
  }
  for (const column of COLUMNS) {
    const plane = along === "z" ? Math.abs(x - column.x) : Math.abs(z - column.z);
    if (plane > 5.2) continue;
    const delta = along === "z" ? Math.abs(z - column.z) : Math.abs(x - column.x);
    const edge = delta - width / 2;
    // Shaft radius is 0.2 m. 0.44 m to the center still leaves plaster beside the shaft.
    if (edge < 0.44) {
      throw new Error(
        `Landmark at ${x.toFixed(2)}, ${z.toFixed(2)} is only ${edge.toFixed(2)} m clear of the column at ${column.x}, ${column.z}`,
      );
    }
  }
}
