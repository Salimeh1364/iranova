/**
 * Interconnected gallery, in meters.
 * +Z is the open entrance. -Z runs through the foyer into the main gallery.
 * The side wing opens to the west (-X) off the main gallery.
 * Y is up.
 */
export const HALL = {
  // 5.6 m, raised from 4.4 m so the taller doorways still have a lintel.
  wallHeight: 5.6,
  wallThickness: 0.18,
} as const;

/** Outer corners of the L. Walls are centered on these lines. */
export const PLAN = {
  spineLeft: -5.5,
  spineRight: 5.5,
  spineFar: -11,
  spineNear: 9.5,
  /** Wall between the foyer and the main gallery. */
  divideZ: 0.5,
  wingLeft: -14.5,
  wingNear: -3.2,
  /** Foyer passage, 4.4 m clear. Was 2.7 m. Measured at the wall center. */
  passageHalf: 2.2,
  /** Side wing opening, 4.8 m along Z. Was 2.8 m. */
  sideDoorFar: -9.6,
  sideDoorNear: -4.8,
  /** Rectangular entrance, 4.4 m wide along X. Was 3.0 m. */
  entranceHalf: 2.2,
  /** Sill-to-head height of the entrance and both interior doorways. Was 3.3 m. */
  openingHeight: 4.6,
} as const;

/** Shaft and capital used by every column, and by walking clearance. */
export const COLUMN = {
  shaft: 0.2,
  /** Collision radius, wide enough to include the capital. */
  radius: 0.32,
} as const;

const halfWall = HALL.wallThickness / 2;
const r = COLUMN.radius;

// One base-radius in from the inner plaster, so the column sits flush to the wall.
const xWest = PLAN.spineLeft + halfWall + r;
const xEast = PLAN.spineRight - halfWall - r;
const xWingWest = PLAN.wingLeft + halfWall + r;
const xWingEast = PLAN.spineLeft - halfWall - r;

const zEntrance = PLAN.spineNear - halfWall - r;
const zFoyerArch = PLAN.divideZ + halfWall + r;
const zGalleryArch = PLAN.divideZ - halfWall - r;
const zFar = PLAN.spineFar + halfWall + r;
const zWingNear = PLAN.wingNear - halfWall - r;

// Just beside the opening, so the shaft flanks the jamb and the doorway stays clear.
const xEntranceJamb = PLAN.entranceHalf + r;
const xArchJamb = PLAN.passageHalf + r;
const zDoorNear = PLAN.sideDoorNear + r;
const zDoorFar = PLAN.sideDoorFar - r;

/**
 * Columns at arch jambs and room corners only.
 * Nothing stands in the middle of a room or in front of a wall.
 * A short door pier keeps the jamb column and skips a second corner shaft.
 */
export const COLUMNS = [
  // Entrance wall, seen from the foyer.
  { x: -xEntranceJamb, z: zEntrance },
  { x: xEntranceJamb, z: zEntrance },
  { x: xWest, z: zEntrance },
  { x: xEast, z: zEntrance },
  // Passage between the foyer and the main gallery, foyer side.
  { x: -xArchJamb, z: zFoyerArch },
  { x: xArchJamb, z: zFoyerArch },
  { x: xWest, z: zFoyerArch },
  { x: xEast, z: zFoyerArch },
  // Same passage, gallery side.
  { x: -xArchJamb, z: zGalleryArch },
  { x: xArchJamb, z: zGalleryArch },
  { x: xWest, z: zGalleryArch },
  { x: xEast, z: zGalleryArch },
  // Wing doorway. Gallery face, then the wing face.
  { x: xWest, z: zDoorNear },
  { x: xWest, z: zDoorFar },
  { x: xWingEast, z: zDoorNear },
  { x: xWingEast, z: zDoorFar },
  // Outer corners of the wing.
  { x: xWingWest, z: zFar },
  { x: xWingWest, z: zWingNear },
  // Far corner of the main gallery. The other far corner is the door pier above.
  { x: xEast, z: zFar },
] as const;

/**
 * Clear interiors, measured to the inner face of the plaster.
 * Passages are the holes through the dividing walls. Walking insets these by the body radius.
 */
export const ROOMS = [
  // Foyer, from the passage wall to the open entrance.
  {
    minX: PLAN.spineLeft + halfWall,
    maxX: PLAN.spineRight - halfWall,
    minZ: PLAN.divideZ + halfWall,
    maxZ: PLAN.spineNear - halfWall,
  },
  // Main gallery, from the far wall to the passage wall.
  {
    minX: PLAN.spineLeft + halfWall,
    maxX: PLAN.spineRight - halfWall,
    minZ: PLAN.spineFar + halfWall,
    maxZ: PLAN.divideZ - halfWall,
  },
  // Side wing, west of the main gallery.
  {
    minX: PLAN.wingLeft + halfWall,
    maxX: PLAN.spineLeft - halfWall,
    minZ: PLAN.spineFar + halfWall,
    maxZ: PLAN.wingNear - halfWall,
  },
] as const;

export const PASSAGES = [
  // Foyer to main gallery. Thin along Z.
  {
    axis: "z" as const,
    minX: -PLAN.passageHalf,
    maxX: PLAN.passageHalf,
    minZ: PLAN.divideZ - halfWall,
    maxZ: PLAN.divideZ + halfWall,
  },
  // Main gallery to the side wing. Thin along X.
  {
    axis: "x" as const,
    minX: PLAN.spineLeft - halfWall,
    maxX: PLAN.spineLeft + halfWall,
    minZ: PLAN.sideDoorFar,
    maxZ: PLAN.sideDoorNear,
  },
] as const;

/**
 * Starting pose, inside the foyer, looking through the passage into the next room.
 */
export const CAMERA_FIT = {
  eye: [0.6, 1.62, 7.4] as const,
  lookAt: [-0.4, 1.7, -1.5] as const,
  fov: 58,
} as const;

/** Body size used by the walker. Eye height matches the starting camera. */
export const PLAYER = {
  eyeHeight: CAMERA_FIT.eye[1],
  radius: 0.36,
  speed: 2.7,
} as const;
