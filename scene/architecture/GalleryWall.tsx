"use client";

import { EXHIBITION, HALL } from "@/scene/hall";
import { BrickSurface } from "@/scene/materials/BrickSurface";
import { PlasterSurface } from "@/scene/materials/PlasterSurface";

export type GalleryWallProps = {
  side: "left" | "right";
};

/**
 * A freestanding plaster partition inside the brick hall.
 * It stops short of the window wall so the arch remains visible down the room.
 * A stone skirting keeps the plaster from meeting the reflective floor in a hard edge.
 */
export function GalleryWall({ side }: GalleryWallProps) {
  const x = side === "left" ? -EXHIBITION.partitionX : EXHIBITION.partitionX;
  const length = HALL.length - 4;

  return (
    <group position={[x, HALL.wallHeight / 2, 0.3]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[EXHIBITION.partitionThickness, HALL.wallHeight, length]} />
        <PlasterSurface />
      </mesh>
      <mesh position={[0, -HALL.wallHeight / 2 + 0.07, 0]} receiveShadow>
        <boxGeometry args={[EXHIBITION.partitionThickness + 0.04, 0.14, length]} />
        <meshStandardMaterial color="#e6e0d6" roughness={0.42} metalness={0.04} />
      </mesh>
      {/* A brick course where the partition meets the vault, so the plaster does not float. */}
      <mesh position={[0, HALL.wallHeight / 2 - 0.08, 0]} castShadow>
        <boxGeometry args={[EXHIBITION.partitionThickness + 0.06, 0.16, length]} />
        <BrickSurface bumpScale={0.02} roughness={0.74} />
      </mesh>
    </group>
  );
}
