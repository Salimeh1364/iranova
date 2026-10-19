/**
 * Hall dimensions in meters.
 * The hall runs along Z: the camera stands toward +Z and looks toward the
 * window wall at -Z. X is left/right, Y is up.
 */
export const HALL = {
  width: 12,
  length: 28,
  wallHeight: 4.2,
  vaultRise: 1.7,
  vaultThickness: 0.28,
  bays: 5,
  wallThickness: 0.24,
} as const;

/** Length of one repeated vault bay. */
export const BAY_DEPTH = HALL.length / HALL.bays;

/** Clear width between the exhibition walls. The vault springs from this span. */
export const INNER_SPAN = HALL.width - HALL.wallThickness;

export const VAULT_CROWN = HALL.wallHeight + HALL.vaultRise;

/**
 * Fixed viewpoint. Free walking is a later milestone, so the lens only
 * reframes this same standing position when the window resizes.
 */
export const CAMERA_FIT = {
  eye: [0, 1.68, 8.2] as const,
  lookAt: [0, 1.85, -8] as const,
  /** Vertical field of view. Wide enough that the vault and both walls stay in one breath. */
  fov: 68,
};
