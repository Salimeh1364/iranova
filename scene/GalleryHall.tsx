"use client";

import { useMemo } from "react";
import { BoxGeometry } from "three";
import { artworks } from "@/content/artworks";
import { ArtFrame } from "@/scene/artwork/ArtFrame";
import { GalleryWall } from "@/scene/architecture/GalleryWall";
import { PlasterPier } from "@/scene/architecture/PlasterPier";
import { PolishedFloor } from "@/scene/architecture/PolishedFloor";
import { ReflectivePool } from "@/scene/architecture/ReflectivePool";
import { VaultedArch } from "@/scene/architecture/VaultedArch";
import { WindowArch } from "@/scene/architecture/WindowArch";
import { SpotlightGroup } from "@/scene/lighting/SpotlightGroup";
import { BAY_DEPTH, EXHIBITION, HALL } from "@/scene/hall";
import { tileByPosition } from "@/scene/geometry/surfaceUvs";
import { BrickSurface } from "@/scene/materials/BrickSurface";
import { PlasterSurface } from "@/scene/materials/PlasterSurface";

/**
 * The grand hall, assembled from one repeated vault bay and shared walls.
 * +Z is the standing point. -Z is the arched window. The pool sits on the centerline.
 */
export function GalleryHall() {
  const bayStarts = Array.from({ length: HALL.bays }, (_, index) => HALL.length / 2 - index * BAY_DEPTH);
  const pierX = EXHIBITION.partitionX - 0.22;
  const sideWall = useMemo(() => {
    const geometry = new BoxGeometry(HALL.wallThickness, HALL.wallHeight, HALL.length);
    // Position-based UVs keep a brick about a handspan wide along the long wall.
    tileByPosition(
      geometry,
      (_x, _y, z) => (z / HALL.length) * 42,
      (_x, y) => (y / HALL.wallHeight) * 10,
    );
    return geometry;
  }, []);

  return (
    <group>
      <PolishedFloor />

      <GalleryWall side="left" />
      <GalleryWall side="right" />

      {EXHIBITION.pierZ.flatMap((z) => [
        <PlasterPier key={`west-${z}`} position={[-pierX, 0, z]} />,
        <PlasterPier key={`east-${z}`} position={[pierX, 0, z]} />,
      ])}

      {/* Brick side walls carry the vault. The plaster partitions stand in front of them. */}
      <mesh geometry={sideWall} position={[-HALL.width / 2, HALL.wallHeight / 2, 0]} receiveShadow>
        <BrickSurface bumpScale={0.03} roughness={0.86} />
      </mesh>
      <mesh geometry={sideWall} position={[HALL.width / 2, HALL.wallHeight / 2, 0]} receiveShadow>
        <BrickSurface bumpScale={0.03} roughness={0.86} />
      </mesh>

      {bayStarts.map((z) => (
        <VaultedArch key={z} z={z} />
      ))}

      <WindowArch />

      {/* Closes the entrance end, behind the camera, so the vault does not open onto the background. */}
      <mesh position={[0, HALL.wallHeight / 2, HALL.length / 2]} receiveShadow>
        <boxGeometry args={[HALL.width, HALL.wallHeight, HALL.wallThickness]} />
        <PlasterSurface />
      </mesh>

      <ReflectivePool />
      <SpotlightGroup placements={artworks} />
      {artworks.map((placement) => (
        <ArtFrame key={placement.id} placement={placement} />
      ))}
    </group>
  );
}
