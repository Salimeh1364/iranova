"use client";

import { palette } from "@/lib/palette";
import { HALL } from "@/scene/hall";

/**
 * Ceiling rails.
 * Each one is a white box and a glowing core. The core is emissive, not a spotlight,
 * so the lines stay bright without extra light calculations.
 */

type Rail = {
  id: string;
  x: number;
  z: number;
  length: number;
  axis: "x" | "z";
};

const RAILS: readonly Rail[] = [
  { id: "foyer-west", x: -1.7, z: 5.0, length: 7.2, axis: "z" },
  { id: "foyer-east", x: 1.7, z: 5.0, length: 7.2, axis: "z" },
  { id: "gallery-west", x: -1.7, z: -5.2, length: 9.0, axis: "z" },
  { id: "gallery-east", x: 1.7, z: -5.2, length: 9.0, axis: "z" },
  { id: "wing", x: -10.0, z: -7.2, length: 6.6, axis: "x" },
];

export function CeilingLights() {
  return (
    <group>
      {RAILS.map((rail) => (
        <LedRail key={rail.id} rail={rail} />
      ))}
    </group>
  );
}

function LedRail({ rail }: { rail: Rail }) {
  const y = HALL.wallHeight - 0.03;
  const alongZ = rail.axis === "z";
  // Channel cross-section is 16 cm by 3 cm. Length follows the rail.
  const channel: [number, number, number] = alongZ
    ? [0.16, 0.03, rail.length]
    : [rail.length, 0.03, 0.16];
  const core: [number, number, number] = alongZ
    ? [0.06, 0.01, rail.length - 0.1]
    : [rail.length - 0.1, 0.01, 0.06];

  return (
    <group position={[rail.x, y, rail.z]}>
      {/* #f8fafc housing, roughness 0.8. */}
      <mesh>
        <boxGeometry args={channel} />
        <meshStandardMaterial color={palette.trim} roughness={0.8} metalness={0} />
      </mesh>
      {/* White core. Unlit by the scene, so it stays a clear line. */}
      <mesh position={[0, -0.016, 0]}>
        <boxGeometry args={core} />
        <meshStandardMaterial
          color={palette.white}
          emissive={palette.white}
          emissiveIntensity={3}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
