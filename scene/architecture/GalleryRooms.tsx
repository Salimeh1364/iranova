"use client";

import { useMemo } from "react";
import { Shape, ShapeGeometry, DoubleSide } from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import { palette } from "@/lib/palette";
import { HALL, PLAN } from "@/scene/hall";
import { getConcreteTexture } from "@/scene/materials/surfaces";
import { PlasterSurface } from "@/scene/materials/PlasterSurface";

const T = HALL.wallThickness;
const H = HALL.wallHeight;

/**
 * The L of rooms: foyer, main gallery, and west wing, with doorway gaps.
 * Floor and ceiling share one plan so the wing is not a separate box.
 */
export function GalleryRooms() {
  const plan = useMemo(() => createPlanGeometry(), []);
  const stone = useMemo(() => getConcreteTexture(), []);

  return (
    <group>
      {/* #dcdad5. A 128px reflection, so the sheen stays soft and the extra pass stays small. */}
      <mesh geometry={plan} receiveShadow>
        <MeshReflectorMaterial
          map={stone}
          color={palette.stone}
          roughness={0.38}
          metalness={0.05}
          mirror={0}
          resolution={128}
          blur={[80, 24]}
          mixBlur={0.55}
          mixStrength={0.22}
          depthScale={0.4}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
        />
      </mesh>

      {/* Off-white ceiling, #f8fafc, roughness 0.9. Double-sided so the soffit is visible from below. */}
      <mesh geometry={plan} position={[0, H, 0]}>
        <meshStandardMaterial color={palette.trim} roughness={0.9} metalness={0} side={DoubleSide} />
      </mesh>

      <FoyerWalls />
      <GalleryWalls />
      <WingWalls />
    </group>
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
      <Slab position={[PLAN.spineLeft, midY, foyerCenterZ]} size={[T, H, foyerLength]} />
      <Slab position={[PLAN.spineRight, midY, foyerCenterZ]} size={[T, H, foyerLength]} />

      {/* Entrance wall, either side of the 4.4 m rectangular opening. */}
      <Slab position={[-entranceCenter, midY, PLAN.spineNear]} size={[entranceSide, H, T]} />
      <Slab position={[entranceCenter, midY, PLAN.spineNear]} size={[entranceSide, H, T]} />

      {/* Passage wall, left of the doorway. */}
      <Slab
        position={[jambCenter, midY, PLAN.divideZ]}
        size={[jamb, H, T]}
      />
      {/* Passage wall, right of the doorway. */}
      <Slab
        position={[-jambCenter, midY, PLAN.divideZ]}
        size={[jamb, H, T]}
      />
      {/* Lintel over the passage, from the head of the opening up to the ceiling. */}
      <Slab
        position={[0, (PLAN.openingHeight + H) / 2, PLAN.divideZ]}
        size={[PLAN.passageHalf * 2, H - PLAN.openingHeight, T]}
      />
    </group>
  );
}

/** Main gallery shell. The west side is open into the wing except around that doorway. */
function GalleryWalls() {
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
      {/* Right wall of the main gallery. */}
      <Slab position={[PLAN.spineRight, midY, rightCenterZ]} size={[T, H, rightLength]} />
      {/* Far wall, shared by the gallery and the wing. */}
      <Slab position={[farCenterX, midY, PLAN.spineFar]} size={[farWidth, H, T]} />
      {/* West wall north of the wing, solid exterior. */}
      <Slab position={[PLAN.spineLeft, midY, northCenter]} size={[T, H, northLength]} />
      {/* Jambs of the wing doorway. */}
      <Slab position={[PLAN.spineLeft, midY, aboveCenter]} size={[T, H, aboveDoor]} />
      <Slab position={[PLAN.spineLeft, midY, belowCenter]} size={[T, H, belowDoor]} />
      {/* Lintel over the wing doorway. */}
      <Slab
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
      <Slab position={[PLAN.wingLeft, midY, centerZ]} size={[T, H, length]} />
      <Slab position={[centerX, midY, PLAN.wingNear]} size={[width, H, T]} />
    </group>
  );
}

/** One plaster slab. Color is #8a9a86, roughness 0.85, so the olive stays matte. */
function Slab({
  position,
  size,
}: {
  position: readonly [number, number, number];
  size: readonly [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <PlasterSurface color={palette.plaster} roughness={0.85} />
    </mesh>
  );
}

/**
 * L-shaped plan in the ground plane.
 * ShapeGeometry is built in XY. rotateX(-90°) lays it on XZ with the normal pointing up,
 * and shape Y is stored as -Z so world Z stays positive toward the entrance.
 */
function createPlanGeometry() {
  const shape = new Shape();
  const point = (x: number, z: number) => {
    shape.lineTo(x, -z);
  };

  // Entrance-right corner, then around the L.
  shape.moveTo(PLAN.spineRight, -PLAN.spineNear);
  point(PLAN.spineRight, PLAN.spineFar);
  point(PLAN.wingLeft, PLAN.spineFar);
  point(PLAN.wingLeft, PLAN.wingNear);
  point(PLAN.spineLeft, PLAN.wingNear);
  point(PLAN.spineLeft, PLAN.spineNear);
  shape.closePath();

  const geometry = new ShapeGeometry(shape);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}
