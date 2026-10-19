"use client";

import { useMemo } from "react";
import { artworks } from "@/content/artworks";
import { ArtFrame } from "@/scene/artwork/ArtFrame";
import { GalleryWall } from "@/scene/architecture/GalleryWall";
import { ReflectivePool } from "@/scene/architecture/ReflectivePool";
import { VaultedArch } from "@/scene/architecture/VaultedArch";
import { WindowArch } from "@/scene/architecture/WindowArch";
import { SpotlightGroup } from "@/scene/lighting/SpotlightGroup";
import { BAY_DEPTH, HALL } from "@/scene/hall";
import { getConcreteTexture } from "@/scene/materials/surfaces";

/**
 * The grand hall, assembled from one repeated vault bay and shared walls.
 * +Z is the standing point. -Z is the arched window. The pool sits on the centerline.
 */
export function GalleryHall() {
  const concrete = useMemo(() => getConcreteTexture(), []);
  const bayStarts = Array.from({ length: HALL.bays }, (_, index) => HALL.length / 2 - index * BAY_DEPTH);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[HALL.width, HALL.length]} />
        <meshPhysicalMaterial
          map={concrete}
          color="#ffffff"
          roughness={0.42}
          metalness={0.02}
          clearcoat={0.12}
          clearcoatRoughness={0.55}
        />
      </mesh>

      <GalleryWall side="left" />
      <GalleryWall side="right" />

      {/* Brick side walls carry the vault. The white partitions stand in front of them. */}
      <mesh position={[-HALL.width / 2, HALL.wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[HALL.wallThickness, HALL.wallHeight, HALL.length]} />
        <meshStandardMaterial color="#d4b896" roughness={0.9} />
      </mesh>
      <mesh position={[HALL.width / 2, HALL.wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[HALL.wallThickness, HALL.wallHeight, HALL.length]} />
        <meshStandardMaterial color="#d4b896" roughness={0.9} />
      </mesh>

      {bayStarts.map((z) => (
        <VaultedArch key={z} z={z} />
      ))}

      <WindowArch />

      {/* Closes the entrance end, behind the camera, so the vault does not open onto the background. */}
      <mesh position={[0, HALL.wallHeight / 2, HALL.length / 2]} receiveShadow>
        <boxGeometry args={[HALL.width, HALL.wallHeight, HALL.wallThickness]} />
        <meshStandardMaterial color="#f7f4ef" roughness={0.92} />
      </mesh>

      <ReflectivePool />
      <SpotlightGroup placements={artworks} />
      {artworks.map((placement) => (
        <ArtFrame key={placement.id} placement={placement} />
      ))}
    </group>
  );
}
