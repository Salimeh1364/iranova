import type { ArtworkPlacement } from "@/lib/types";
import { COLUMNS, HALL, PLAN, PLAYER } from "@/scene/hall";

/**
 * Landscape sheet sizes, in meters.
 * The long wing walls take the wide frames. Tighter bays step down
 * just enough to keep a margin beside the nearest column.
 */
const WIDE = { width: 1.92, height: 1.26 };
const MID = { width: 1.72, height: 1.14 };
const ROOM = { width: 1.62, height: 1.08 };
const BAY = { width: 1.4, height: 0.94 };

/** Same eye line as the portraits. */
const EYE = PLAYER.eyeHeight;

const half = HALL.wallThickness / 2;
const PROUD = 0.04;

type Along = "x" | "z";

const wingColumns = COLUMNS.filter((column) => column.x < PLAN.spineLeft && column.x > PLAN.wingLeft);
const wingWestColumn = wingColumns.reduce((left, column) => (column.x < left.x ? column : left));
const wingEastColumn = wingColumns.reduce((right, column) => (column.x > right.x ? column : right));

const innerWest = PLAN.wingLeft + half;
const innerEast = PLAN.spineLeft - half;
const passageInner = PLAN.divideZ - half;

const galleryWestColumn = COLUMNS.find(
  (column) => column.x < 0 && column.z < PLAN.divideZ && column.z > PLAN.wingNear && column.x > PLAN.spineLeft,
);
if (!galleryWestColumn) {
  throw new Error("Expected the column in front of the gallery's west wall");
}

const wingWestX = PLAN.wingLeft + half + PROUD;
const galleryWestX = PLAN.spineLeft + half + PROUD;
const farZ = PLAN.spineFar + half + PROUD;
const nearZ = PLAN.wingNear - half - PROUD;

/** Center of the open span between two edges. */
function centered(a: number, b: number) {
  return (a + b) / 2;
}

/**
 * Sit the frame a fixed margin in from one end of a wall.
 * Used where centering the bay would slide the picture behind a column.
 */
function insetFrom(end: number, toward: number, width: number, margin: number) {
  const dir = Math.sign(toward - end) || 1;
  return end + dir * (margin + width / 2);
}

// Pulled into the west corner. Centering this bay left the frame behind the close column.
const farWestX = insetFrom(innerWest, wingWestColumn.x, MID.width, 0.38);
const nearWestX = centered(innerWest, wingWestColumn.x);
const farEastX = centered(wingEastColumn.x, innerEast);
const nearEastX = insetFrom(innerEast, wingEastColumn.x, ROOM.width, 0.32);
const westMidZ = centered(wingWestColumn.z, wingEastColumn.z);
const galleryWestZ = centered(galleryWestColumn.z, passageInner);

export type LandmarkSlotName = keyof typeof LANDMARK_SLOTS;

/**
 * The west wing is the landmark room. One more frame fills the short
 * west wall of the main gallery, north of the wing doorway.
 */
export const LANDMARK_SLOTS = {
  // Far wall of the wing, west of the near column.
  wingFarWest: hang(farWestX, farZ, 0, "x", MID),
  // Far wall of the wing, in the wide bay toward the gallery.
  wingFarEast: hang(farEastX, farZ, 0, "x", WIDE),
  // Near wall of the wing, centered in the bay. That column stands well back from this wall.
  wingNearWest: hang(nearWestX, nearZ, Math.PI, "x", MID),
  // Near wall, pulled toward the corner so the close column stays beside it.
  wingNearEast: hang(nearEastX, nearZ, Math.PI, "x", ROOM),
  // Long west wall, centered between the two wing columns.
  wingWest: hang(wingWestX, westMidZ, Math.PI / 2, "z", BAY),
  // Main gallery, the west wall north of the wing opening.
  galleryWest: hang(galleryWestX, galleryWestZ, Math.PI / 2, "z", BAY),
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
    if (edge < 0.58) {
      throw new Error(
        `Landmark at ${x.toFixed(2)}, ${z.toFixed(2)} is only ${edge.toFixed(2)} m clear of the column at ${column.x}, ${column.z}`,
      );
    }
  }
}
