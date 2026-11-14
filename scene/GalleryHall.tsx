"use client";

import { Suspense } from "react";
import { artworks } from "@/content/artworks";
import { ArtFrame } from "@/scene/artwork/ArtFrame";
import { Columns } from "@/scene/architecture/Columns";
import { EntranceDoor } from "@/scene/architecture/EntranceDoor";
import { GalleryRooms } from "@/scene/architecture/GalleryRooms";
import { GardenView } from "@/scene/architecture/GardenView";
import { CeilingLights } from "@/scene/lighting/CeilingLights";
import { SpotlightGroup } from "@/scene/lighting/SpotlightGroup";

/**
 * Foyer, main gallery, and west wing.
 * +Z is the open portal. The garden sits just outside it.
 */
export function GalleryHall() {
  return (
    <group>
      <GalleryRooms />
      <Columns />
      <EntranceDoor />
      {/* The photograph loads on its own, so the hall can draw first. */}
      <Suspense fallback={null}>
        <GardenView />
      </Suspense>
      <CeilingLights />
      <SpotlightGroup placements={artworks} />
      {artworks.map((placement) => (
        <ArtFrame key={placement.id} placement={placement} />
      ))}
    </group>
  );
}
