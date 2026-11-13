"use client";

import { PLAN } from "@/scene/hall";

/**
 * Garden outside the open portal.
 * Rounded shrubs and a few canopies, each with a low segment count.
 * Near plants are lighter. Far plants are deeper green, so the layers read as depth.
 */

type Shrub = {
  x: number;
  z: number;
  /** Sphere radius, in meters. */
  radius: number;
  y: number;
  color: string;
};

type Tree = {
  x: number;
  z: number;
  trunk: number;
  canopy: number;
};

// Close to the portal, then a middle band, then a darker far band.
const SHRUBS: readonly Shrub[] = [
  { x: -3.1, z: 1.8, radius: 0.55, y: 0.42, color: "#8eae78" },
  { x: -2.2, z: 2.3, radius: 0.72, y: 0.5, color: "#7da56c" },
  { x: 2.6, z: 1.9, radius: 0.62, y: 0.46, color: "#93b17c" },
  { x: 3.4, z: 2.6, radius: 0.8, y: 0.55, color: "#6f9860" },
  { x: -4.2, z: 4.2, radius: 0.9, y: 0.62, color: "#5f8654" },
  { x: -0.4, z: 4.8, radius: 0.7, y: 0.5, color: "#6a915c" },
  { x: 1.8, z: 4.4, radius: 0.85, y: 0.58, color: "#587e4e" },
  { x: 4.6, z: 5.2, radius: 0.75, y: 0.52, color: "#4f7348" },
  { x: -2.8, z: 7.4, radius: 1.05, y: 0.7, color: "#466844" },
  { x: 0.6, z: 7.8, radius: 0.95, y: 0.64, color: "#3f5e3c" },
  { x: 3.2, z: 7.2, radius: 1.1, y: 0.72, color: "#4a6d46" },
];

const TREES: readonly Tree[] = [
  { x: -5.2, z: 6.4, trunk: 1.5, canopy: 0.85 },
  { x: 5.4, z: 6.8, trunk: 1.7, canopy: 0.95 },
  { x: 0.2, z: 9.2, trunk: 1.9, canopy: 1.05 },
];

export function GardenView() {
  return (
    <group position={[0, 0, PLAN.spineNear]}>
      {/* Lawn. Roughness 0.92, so daylight sits on it without a mirror. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#b7c9a2" roughness={0.92} metalness={0} />
      </mesh>
      {SHRUBS.map((shrub) => (
        <mesh key={`${shrub.x}-${shrub.z}`} position={[shrub.x, shrub.y, shrub.z]}>
          {/* 16 by 12. Smooth enough to read as a shrub, still a light mesh. */}
          <sphereGeometry args={[shrub.radius, 16, 12]} />
          <meshStandardMaterial color={shrub.color} roughness={0.86} metalness={0} />
        </mesh>
      ))}
      {TREES.map((tree) => (
        <group key={`${tree.x}-${tree.z}`} position={[tree.x, 0, tree.z]}>
          <mesh position={[0, tree.trunk / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.1, tree.trunk, 6]} />
            <meshStandardMaterial color="#6a5344" roughness={0.9} metalness={0} />
          </mesh>
          <mesh position={[0, tree.trunk + tree.canopy * 0.45, 0]}>
            <sphereGeometry args={[tree.canopy, 16, 12]} />
            <meshStandardMaterial color="#4d7348" roughness={0.88} metalness={0} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
