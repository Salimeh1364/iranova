import { HALL, PLAN } from "@/scene/hall";

/**
 * Stone landing and steps outside the garden doors.
 * World +Z runs out of the foyer. The photograph stays farther out than the last tread.
 */

const halfWall = HALL.wallThickness / 2;

export const TERRACE = {
  /** Entrance wall center. The portal group sits here. */
  wallZ: PLAN.spineNear,
  /** Wider than the opening, so the landing reads as a small balcony. */
  halfWidth: PLAN.entranceHalf + 0.8,
  /** Just outside the outer plaster. */
  landingZ: PLAN.spineNear + halfWall - 0.02,
  landingDepth: 1.45,
  steps: 4,
  rise: 0.11,
  tread: 0.42,
} as const;

/** World Z where the landing ends and the first drop begins. */
export function landingEndZ() {
  return TERRACE.landingZ + TERRACE.landingDepth;
}

/** World Z of the outer nosing. */
export function stepsEndZ() {
  return landingEndZ() + TERRACE.steps * TERRACE.tread;
}

/**
 * Height of the outdoor floor at this point.
 * 0 on the landing and indoors. Each tread is one rise lower.
 */
export function terraceFloor(x: number, z: number) {
  if (Math.abs(x) > TERRACE.halfWidth || z < TERRACE.landingZ || z > stepsEndZ()) return 0;
  const along = z - landingEndZ();
  if (along <= 0) return 0;
  const index = Math.min(TERRACE.steps - 1, Math.floor(along / TERRACE.tread));
  return -(index + 1) * TERRACE.rise;
}
