"use client";

import { palette } from "@/lib/palette";
import { COLUMN, COLUMNS, HALL } from "@/scene/hall";

/**
 * Tall off-white columns under the ceiling.
 * #f8fafc against the olive walls, so the shafts read as the light structure.
 */
export function Columns() {
  return (
    <group>
      {COLUMNS.map((column) => (
        <Column key={`${column.x}-${column.z}`} x={column.x} z={column.z} />
      ))}
    </group>
  );
}

function Column({ x, z }: { x: number; z: number }) {
  const base = 0.1;
  const capital = 0.12;
  const shaftHeight = HALL.wallHeight - base - capital;

  return (
    <group position={[x, 0, z]}>
      {/* Base. 16 sides, #f8fafc, roughness 0.82. Casts into the one daylight shadow. */}
      <mesh position={[0, base / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[COLUMN.radius, COLUMN.radius + 0.02, base, 16]} />
        <meshStandardMaterial color={palette.trim} roughness={0.82} metalness={0} />
      </mesh>
      {/* Shaft. #f8fafc, roughness 0.86, so it stays matte beside the glossy floor. */}
      <mesh position={[0, base + shaftHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[COLUMN.shaft, COLUMN.shaft, shaftHeight, 16]} />
        <meshStandardMaterial color={palette.trim} roughness={0.86} metalness={0} />
      </mesh>
      {/* Capital, where the shaft meets the ceiling. #f8fafc, roughness 0.8. */}
      <mesh position={[0, HALL.wallHeight - capital / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[COLUMN.radius + 0.02, COLUMN.shaft + 0.04, capital, 16]} />
        <meshStandardMaterial color={palette.trim} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}
