"use client";

import { useMemo } from "react";
import { ExtrudeGeometry } from "three";
import { BAY_DEPTH, HALL, INNER_SPAN } from "@/scene/hall";
import { createArchBandShape } from "@/scene/geometry/archProfile";
import { getBrickTexture } from "@/scene/materials/surfaces";

export type VaultedArchProps = {
  /** World Z of the bay's entrance edge. The bay extends toward -Z. */
  z: number;
};

/**
 * One bay of the brick vault.
 * The profile is extruded along local Z by a full bay, then the mesh is
 * lifted so the springs sit on top of the side walls.
 */
export function VaultedArch({ z }: VaultedArchProps) {
  const shell = useMemo(() => {
    const shape = createArchBandShape(INNER_SPAN / 2, HALL.vaultRise, HALL.vaultThickness);
    const geometry = new ExtrudeGeometry(shape, {
      depth: BAY_DEPTH,
      bevelEnabled: false,
      curveSegments: 20,
    });
    // ExtrudeGeometry grows toward +Z. Shift it so the bay occupies [z - bay, z].
    geometry.translate(0, 0, -BAY_DEPTH);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const rib = useMemo(() => {
    const shape = createArchBandShape(INNER_SPAN / 2, HALL.vaultRise, HALL.vaultThickness * 0.72);
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: false,
      curveSegments: 16,
    });
    geometry.translate(0, 0, -0.08);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const brick = useMemo(() => getBrickTexture(), []);

  return (
    <group position={[0, HALL.wallHeight, z]}>
      <mesh geometry={shell} castShadow receiveShadow>
        <meshStandardMaterial
          map={brick}
          color="#ffffff"
          emissive="#f4e6cf"
          emissiveIntensity={0.16}
          roughness={0.82}
          metalness={0}
        />
      </mesh>
      <mesh geometry={rib} position={[0, -0.02, 0]} castShadow>
        <meshStandardMaterial color="#e4c9a4" roughness={0.78} />
      </mesh>
      {/* A soft wash under the crown. No shadow map: the sun already casts the hall shadow. */}
      <pointLight
        position={[0, HALL.vaultRise - 0.45, -BAY_DEPTH / 2]}
        intensity={0.55}
        distance={7.5}
        decay={2}
        color="#fff4e4"
      />
    </group>
  );
}
