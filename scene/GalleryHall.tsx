"use client";

import { Suspense } from "react";
import { figurePlacements, figures } from "@/content/famousFigures";
import { PortraitFrame } from "@/scene/artwork/PortraitFrame";
import { Columns } from "@/scene/architecture/Columns";
import { EntrancePortal } from "@/scene/architecture/EntrancePortal";
import { GalleryRooms } from "@/scene/architecture/GalleryRooms";
import { GardenView } from "@/scene/architecture/GardenView";
import { CeilingLights } from "@/scene/lighting/CeilingLights";
import { SunShafts } from "@/scene/lighting/SunShafts";
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
      <EntrancePortal />
      {/* The photograph loads on its own, so the hall can draw first. */}
      <Suspense fallback={null}>
        <GardenView />
      </Suspense>
      <CeilingLights />
      <SunShafts />
      <SpotlightGroup placements={figurePlacements} />
      {figures.map((figure) => (
        <PortraitFrame key={figure.id} figure={figure} />
      ))}
    </group>
  );
}
