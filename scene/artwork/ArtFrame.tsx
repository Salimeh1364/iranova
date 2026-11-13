"use client";

import { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { palette } from "@/lib/palette";
import type { ArtworkPlacement } from "@/lib/types";
import { paintAbstract } from "@/scene/artwork/abstractPanel";

export type ArtFrameProps = {
  placement: ArtworkPlacement;
};

// Border width, casing depth, and the proud inner bead. Same white as the entrance.
const BORDER = 0.11;
const CASING_D = 0.07;
const LIP = 0.045;
const LIP_D = 0.12;
// Back face sits just off the plaster. The anchor is already 4 cm inside the wall.
const BACK = 0.015;
// Steps the bead into the opening so it does not share a face with the casing.
const REVEAL = 0.008;

/**
 * Raised white molding around a generated painting.
 * The casing and the inner bead are separate bars, so the center stays open.
 */
export function ArtFrame({ placement }: ArtFrameProps) {
  const { width, height, seed } = placement;
  const map = useMemo(() => {
    const texture = new CanvasTexture(paintAbstract(seed));
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [seed]);

  const casingZ = BACK + CASING_D / 2;
  const lipZ = BACK + LIP_D / 2;
  const openingW = width - BORDER * 2;
  const openingH = height - BORDER * 2;
  // Bead sits on the inner edge of the casing and stands proud of it.
  const lipX = width / 2 - BORDER + LIP / 2 - REVEAL;
  const lipY = height / 2 - BORDER + LIP / 2 - REVEAL;
  const stileH = openingH - REVEAL * 2;

  return (
    <group position={placement.position} rotation={[0, placement.rotationY, 0]}>
      {/* Outer casing, #f8fafc, roughness 0.72. Stiles run the full height. */}
      <Bar position={[-width / 2 + BORDER / 2, 0, casingZ]} size={[BORDER, height, CASING_D]} />
      <Bar position={[width / 2 - BORDER / 2, 0, casingZ]} size={[BORDER, height, CASING_D]} />
      <Bar position={[0, height / 2 - BORDER / 2, casingZ]} size={[openingW, BORDER, CASING_D]} />
      <Bar position={[0, -height / 2 + BORDER / 2, casingZ]} size={[openingW, BORDER, CASING_D]} />

      {/* Inner bead. Stiles stop where the rails begin, so the corners stay clean. */}
      <Bar position={[-lipX, 0, lipZ]} size={[LIP, stileH, LIP_D]} />
      <Bar position={[lipX, 0, lipZ]} size={[LIP, stileH, LIP_D]} />
      <Bar position={[0, lipY, lipZ]} size={[openingW + LIP * 2, LIP, LIP_D]} />
      <Bar position={[0, -lipY, lipZ]} size={[openingW + LIP * 2, LIP, LIP_D]} />

      {/* Painting sits in the rabbet, behind the bead. */}
      <mesh position={[0, 0, BACK + 0.02]}>
        <planeGeometry args={[openingW - 0.02, openingH - 0.02]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

function Bar({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      {/* #f8fafc, roughness 0.72, matching the entrance casing. */}
      <meshStandardMaterial color={palette.trim} roughness={0.72} metalness={0} />
    </mesh>
  );
}
