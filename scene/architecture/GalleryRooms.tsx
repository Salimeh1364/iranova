"use client";

import { useMemo } from "react";
import { Shape, ShapeGeometry, DoubleSide } from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import { palette } from "@/lib/palette";
import { HALL, PLAN } from "@/scene/hall";
import { GalleryWalls } from "@/scene/architecture/GalleryWalls";
import { getConcreteTexture } from "@/scene/materials/surfaces";

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
      {/* #f0eee9. Satin, not a mirror: roughness 0.5 and a weak blurred reflection. */}
      <mesh geometry={plan} receiveShadow>
        <MeshReflectorMaterial
          map={stone}
          color={palette.stone}
          roughness={0.5}
          metalness={0.04}
          mirror={0}
          resolution={128}
          blur={[120, 40]}
          mixBlur={0.7}
          mixStrength={0.12}
          depthScale={0.25}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
        />
      </mesh>

      {/* Off-white ceiling, #f8fafc, roughness 0.9. Double-sided so the soffit is visible from below. */}
      <mesh geometry={plan} position={[0, H, 0]}>
        <meshStandardMaterial color={palette.trim} roughness={0.9} metalness={0} side={DoubleSide} />
      </mesh>

      <GalleryWalls />
    </group>
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
