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

/**
 * Column centers. Kept off the doorway centerlines.
 * Foyer: four columns. Main gallery: four. Wing: two.
 */
export const COLUMNS = [
  { x: -3.2, z: 6.4 },
  { x: 3.2, z: 6.4 },
  { x: -3.2, z: 2.8 },
  { x: 3.2, z: 2.8 },
  { x: -3.2, z: -2.2 },
  { x: 3.2, z: -2.2 },
  { x: -2.6, z: -8.8 },
  { x: 3.2, z: -6.6 },
  { x: -11.4, z: -8.4 },
  { x: -9.2, z: -5.6 },
] as const;

const halfWall = HALL.wallThickness / 2;

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
