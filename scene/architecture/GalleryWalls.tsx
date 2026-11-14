"use client";

import { palette } from "@/lib/palette";
import { HALL, PLAN } from "@/scene/hall";
import { PlasterSurface } from "@/scene/materials/PlasterSurface";

const T = HALL.wallThickness;
const H = HALL.wallHeight;

export type WallSlabProps = {
  /** Center of the slab, in meters. */
  position: readonly [number, number, number];
  /** Width, height, and depth of the box, in meters. */
  size: readonly [number, number, number];
};

/**
 * Olive walls of the foyer, the main gallery, and the west wing.
 * Doorways are gaps between slabs. The entrance itself has no lintel here.
 */
export function GalleryWalls() {
  return (
    <group>
      <FoyerWalls />
      <MainHallWalls />
      <WingWalls />
    </group>
  );
}

/** One plaster slab. Color comes from the palette. Roughness 0.85 keeps it matte. */
export function WallSlab({ position, size }: WallSlabProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <PlasterSurface color={palette.plaster} roughness={0.85} />
    </mesh>
  );
}

/** Foyer shell and the wall that separates it from the main gallery. */
function FoyerWalls() {
  const midY = H / 2;
  const foyerLength = PLAN.spineNear - PLAN.divideZ;
  const foyerCenterZ = (PLAN.spineNear + PLAN.divideZ) / 2;
  const jamb = PLAN.spineRight - PLAN.passageHalf;
  const jambCenter = (PLAN.spineLeft + -PLAN.passageHalf) / 2;
  // Side pier of the entrance. Width is the wall outside the 4.4 m opening.
  const entranceSide = PLAN.spineRight - PLAN.entranceHalf;
  const entranceCenter = (PLAN.spineRight + PLAN.entranceHalf) / 2;

  return (
    <group>
      {/* Left and right walls of the foyer. */}
      <WallSlab position={[PLAN.spineLeft, midY, foyerCenterZ]} size={[T, H, foyerLength]} />
      <WallSlab position={[PLAN.spineRight, midY, foyerCenterZ]} size={[T, H, foyerLength]} />

      {/* Entrance wall, either side of the rectangular opening. The floor line is open. */}
      <WallSlab position={[-entranceCenter, midY, PLAN.spineNear]} size={[entranceSide, H, T]} />
      <WallSlab position={[entranceCenter, midY, PLAN.spineNear]} size={[entranceSide, H, T]} />

      <WallSlab position={[jambCenter, midY, PLAN.divideZ]} size={[jamb, H, T]} />
      <WallSlab position={[-jambCenter, midY, PLAN.divideZ]} size={[jamb, H, T]} />
      {/* Lintel over the foyer passage, from the head of the opening up to the ceiling. */}
      <WallSlab
        position={[0, (PLAN.openingHeight + H) / 2, PLAN.divideZ]}
        size={[PLAN.passageHalf * 2, H - PLAN.openingHeight, T]}
      />
    </group>
  );
}

/** Main gallery shell. The west side is open into the wing except around that doorway. */
function MainHallWalls() {
  const midY = H / 2;
  const rightLength = PLAN.divideZ - PLAN.spineFar;
  const rightCenterZ = (PLAN.divideZ + PLAN.spineFar) / 2;
  const farWidth = PLAN.spineRight - PLAN.wingLeft;
  const farCenterX = (PLAN.spineRight + PLAN.wingLeft) / 2;

  const aboveDoor = PLAN.sideDoorFar - PLAN.spineFar;
  const aboveCenter = (PLAN.sideDoorFar + PLAN.spineFar) / 2;
  const belowDoor = PLAN.wingNear - PLAN.sideDoorNear;
  const belowCenter = (PLAN.wingNear + PLAN.sideDoorNear) / 2;
  const northLength = PLAN.divideZ - PLAN.wingNear;
  const northCenter = (PLAN.divideZ + PLAN.wingNear) / 2;

  return (
    <group>
      <WallSlab position={[PLAN.spineRight, midY, rightCenterZ]} size={[T, H, rightLength]} />
      {/* Far wall, shared by the gallery and the wing. */}
      <WallSlab position={[farCenterX, midY, PLAN.spineFar]} size={[farWidth, H, T]} />
      {/* West wall north of the wing, solid exterior. */}
      <WallSlab position={[PLAN.spineLeft, midY, northCenter]} size={[T, H, northLength]} />
      {/* Jambs of the wing doorway. */}
      <WallSlab position={[PLAN.spineLeft, midY, aboveCenter]} size={[T, H, aboveDoor]} />
      <WallSlab position={[PLAN.spineLeft, midY, belowCenter]} size={[T, H, belowDoor]} />
      <WallSlab
        position={[
          PLAN.spineLeft,
          (PLAN.openingHeight + H) / 2,
          (PLAN.sideDoorFar + PLAN.sideDoorNear) / 2,
        ]}
        size={[T, H - PLAN.openingHeight, PLAN.sideDoorNear - PLAN.sideDoorFar]}
      />
    </group>
  );
}

/** West wing, closed on three sides and open to the gallery through the doorway. */
function WingWalls() {
  const midY = H / 2;
  const length = PLAN.wingNear - PLAN.spineFar;
  const centerZ = (PLAN.wingNear + PLAN.spineFar) / 2;
  const width = PLAN.spineLeft - PLAN.wingLeft;
  const centerX = (PLAN.spineLeft + PLAN.wingLeft) / 2;

  return (
    <group>
      <WallSlab position={[PLAN.wingLeft, midY, centerZ]} size={[T, H, length]} />
      <WallSlab position={[centerX, midY, PLAN.wingNear]} size={[width, H, T]} />
    </group>
  );
}
