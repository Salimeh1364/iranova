import type { ArtworkPlacement } from "@/lib/types";
import { COLUMNS, HALL, PLAN, PLAYER } from "@/scene/hall";

/** Every portrait uses the same sheet size, in meters. */
const FRAME_W = 1.05;
const FRAME_H = 1.32;

/**
 * Center height of every frame.
 * Matches the visitor's eye, so the eight portraits share one line.
 */
const EYE = PLAYER.eyeHeight;

const half = HALL.wallThickness / 2;
/** How far the frame anchor stands proud of the inner plaster. */
const PROUD = 0.04;

type Column = { readonly x: number; readonly z: number };
type Along = "x" | "z";

/** Column coordinates along one wall, low to high, without duplicates. */
function columnsAlong(axis: Along, keep: (column: Column) => boolean): number[] {
  const values = COLUMNS.filter(keep).map((column) => (axis === "x" ? column.x : column.z));
  return [...new Set(values)].sort((a, b) => a - b);
}

/** The first and last column in a run. Two columns are the usual gallery bay. */
function ends(values: number[], label: string): readonly [number, number] {
  if (values.length < 2) {
    throw new Error(`Expected two columns for the ${label}`);
  }
  return [values[0], values[values.length - 1]];
}

/** One frame centered between two columns, so both side gaps match. */
function betweenColumns(a: number, b: number): number {
  return (a + b) / 2;
}

/**
 * One frame in the bay from a column to an inside corner.
 * The plaster beside the column equals the plaster at the corner.
 */
function besideColumn(column: number, corner: number): number {
  const span = Math.abs(corner - column);
  const gap = (span - FRAME_W) / 2;
  const dir = corner > column ? 1 : -1;
  return column + dir * (gap + FRAME_W / 2);
}

/**
 * Two frames between two columns.
 * Three equal gaps: column, frame, frame, column.
 */
function pairBetween(a: number, b: number): readonly [number, number] {
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  const gap = (high - low - FRAME_W * 2) / 3;
  return [low + gap + FRAME_W / 2, high - gap - FRAME_W / 2];
}

// Foyer columns stand at the same two depths on the left and the right.
const [foyerLow, foyerHigh] = ends(
  columnsAlong("z", (column) => column.z > PLAN.divideZ && column.x < 0),
  "foyer",
);
// East-gallery columns, the pair in front of the long olive wall.
const [eastFarColumn, eastNearColumn] = ends(
  columnsAlong("z", (column) => column.x > 1 && column.z < PLAN.divideZ && column.z > PLAN.spineFar),
  "east gallery",
);
// Columns close enough to the far wall to block a portrait.
const [farWestColumn, farEastColumn] = ends(
  columnsAlong(
    "x",
    (column) => column.x > PLAN.spineLeft && column.x < PLAN.spineRight && column.z - PLAN.spineFar < 5,
  ),
  "far wall",
);
const foyerHangZ = betweenColumns(foyerLow, foyerHigh);
// Same plaster gap used between the foyer columns, repeated on the entrance side of the outer column.
const foyerGap = (Math.abs(foyerHigh - foyerLow) - FRAME_W) / 2;
const foyerDoorZ = foyerHigh + foyerGap + FRAME_W / 2;
const eastBetweenZ = betweenColumns(eastFarColumn, eastNearColumn);
// Inner face of the far wall, where the east wall ends.
const eastFarZ = besideColumn(eastFarColumn, PLAN.spineFar + half);
const [farLeftX, farRightX] = pairBetween(farWestColumn, farEastColumn);

const westX = PLAN.spineLeft + half + PROUD;
const eastX = PLAN.spineRight - half - PROUD;
const farZ = PLAN.spineFar + half + PROUD;

// The entrance-side frame must keep a margin before the portal wall.
const entranceInner = PLAN.spineNear - half;
if (entranceInner - (foyerDoorZ + FRAME_W / 2) < 0.55) {
  throw new Error("Foyer portrait beside the entrance meets the portal wall");
}

export type PortraitSlotName = keyof typeof PORTRAIT_SLOTS;

/**
 * Eight hang points.
 * Each one sits in open plaster, clear of the column shafts.
 * The foyer, the east gallery wall, and the far wall are the runs wide enough
 * for a full frame beside the columns. The other walls stay bare.
 */
export const PORTRAIT_SLOTS = {
  // Foyer, left wall, between the two columns.
  foyerWest: slot(westX, foyerHangZ, Math.PI / 2),
  // Foyer, left wall, on the entrance side of the outer column. Same gap as foyerWest.
  foyerWestDoor: slot(westX, foyerDoorZ, Math.PI / 2),
  // Foyer, right wall. Both depths mirror the left wall.
  foyerEast: slot(eastX, foyerHangZ, -Math.PI / 2),
  foyerEastDoor: slot(eastX, foyerDoorZ, -Math.PI / 2),
  // Main gallery, east wall, in the bay between its two columns.
  galleryEastBetween: slot(eastX, eastBetweenZ, -Math.PI / 2),
  // Main gallery, east wall, from the southern column out to the far corner.
  galleryEastFar: slot(eastX, eastFarZ, -Math.PI / 2),
  // Far wall of the main gallery. Equal gaps from column to frame to frame to column.
  galleryFarLeft: slot(farLeftX, farZ, 0, "x"),
  galleryFarRight: slot(farRightX, farZ, 0, "x"),
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
 * Reject a hang that still falls behind a nearby column.
 * A column counts when it stands within 4.5 m of the wall.
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
    if (edge < 1) {
      throw new Error(
        `Frame at ${x.toFixed(2)}, ${z.toFixed(2)} is only ${edge.toFixed(2)} m clear of the column at ${column.x}, ${column.z}`,
      );
    }
  }
}
