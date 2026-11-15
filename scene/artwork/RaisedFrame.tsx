"use client";

import { Texture } from "three";
import { palette } from "@/lib/palette";
import { useArtworkClick } from "@/scene/artwork/frameClick";

// Portrait molding: a deep white casing, the same weight as the entrance.
const PORTRAIT = { border: 0.13, casing: 0.085, lip: 0.055, lipDepth: 0.14, reveal: 0.008 };
// Landmark molding: a thin, shallow border so the photograph stays the large part of the sheet.
const LANDMARK = { border: 0.042, casing: 0.032, lip: 0.016, lipDepth: 0.05, reveal: 0.003 };
// The anchor is already 4 cm proud of the plaster. The back sits just off that.
const BACK = 0.015;
const PLATE_H = 0.22;
const PLATE_GAP = 0.07;

export type RaisedFrameProps = {
  width: number;
  height: number;
  position: readonly [number, number, number];
  rotationY: number;
  map: Texture;
  plate: Texture;
  onSelect: () => void;
  /** Thin museum border for the landmark room. Portraits keep the deeper casing. */
  slim?: boolean;
};

/**
 * The shared white beveled frame: casing, lip, photograph, and nameplate.
 * Portraits and landmark photographs both hang in this molding.
 */
export function RaisedFrame({
  width,
  height,
  position,
  rotationY,
  map,
  plate,
  onSelect,
  slim = false,
}: RaisedFrameProps) {
  const molding = slim ? LANDMARK : PORTRAIT;
  const casingZ = BACK + molding.casing / 2;
  const lipZ = BACK + molding.lipDepth / 2;
  const openingW = width - molding.border * 2;
  const openingH = height - molding.border * 2;
  const lipX = width / 2 - molding.border + molding.lip / 2 - molding.reveal;
  const lipY = height / 2 - molding.border + molding.lip / 2 - molding.reveal;
  const stileH = openingH - molding.reveal * 2;
  // The molding is not part of the hit target. Only the picture and the nameplate are.
  const select = useArtworkClick(onSelect);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Outer casing, #f8fafc, roughness 0.72. Stiles run the full height. */}
      <Bar position={[-width / 2 + molding.border / 2, 0, casingZ]} size={[molding.border, height, molding.casing]} />
      <Bar position={[width / 2 - molding.border / 2, 0, casingZ]} size={[molding.border, height, molding.casing]} />
      <Bar position={[0, height / 2 - molding.border / 2, casingZ]} size={[openingW, molding.border, molding.casing]} />
      <Bar position={[0, -height / 2 + molding.border / 2, casingZ]} size={[openingW, molding.border, molding.casing]} />

      <Bar position={[-lipX, 0, lipZ]} size={[molding.lip, stileH, molding.lipDepth]} />
      <Bar position={[lipX, 0, lipZ]} size={[molding.lip, stileH, molding.lipDepth]} />
      <Bar position={[0, lipY, lipZ]} size={[openingW + molding.lip * 2, molding.lip, molding.lipDepth]} />
      <Bar position={[0, -lipY, lipZ]} size={[openingW + molding.lip * 2, molding.lip, molding.lipDepth]} />

      {/* Photograph, cropped to cover the opening. A still click here opens the panel. */}
      <mesh position={[0, 0, BACK + 0.02]} {...select}>
        <planeGeometry args={[openingW - 0.02, openingH - 0.02]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0} />
      </mesh>

      {/* Nameplate. The same click rule as the photograph. */}
      <mesh position={[0, -height / 2 - PLATE_GAP - PLATE_H / 2, casingZ]} {...select}>
        <planeGeometry args={[width, PLATE_H]} />
        <meshStandardMaterial map={plate} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

/** Opening aspect (width / height) inside the molding. Used to crop the photograph. */
export function openingAspect(width: number, height: number, slim = false) {
  const border = (slim ? LANDMARK : PORTRAIT).border;
  return (width - border * 2) / (height - border * 2);
}

/** Swallow a press on the molding so it cannot fall through to the picture. */
function stopFrameEvent(event: { stopPropagation: () => void }) {
  event.stopPropagation();
}

function Bar({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
      onPointerDown={stopFrameEvent}
      onPointerMove={stopFrameEvent}
      onPointerUp={stopFrameEvent}
      onClick={stopFrameEvent}
    >
      <boxGeometry args={size} />
      {/* #f8fafc, roughness 0.72, matching the entrance casing. */}
      <meshStandardMaterial color={palette.trim} roughness={0.72} metalness={0} />
    </mesh>
  );
}
