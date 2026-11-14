"use client";

import { Texture } from "three";
import { palette } from "@/lib/palette";

// Border, casing, and the proud inner bead. Same white as the entrance.
const BORDER = 0.13;
const CASING_D = 0.085;
const LIP = 0.055;
const LIP_D = 0.14;
// The anchor is already 4 cm proud of the plaster. The back sits just off that.
const BACK = 0.015;
const REVEAL = 0.008;
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
}: RaisedFrameProps) {
  const casingZ = BACK + CASING_D / 2;
  const lipZ = BACK + LIP_D / 2;
  const openingW = width - BORDER * 2;
  const openingH = height - BORDER * 2;
  const lipX = width / 2 - BORDER + LIP / 2 - REVEAL;
  const lipY = height / 2 - BORDER + LIP / 2 - REVEAL;
  const stileH = openingH - REVEAL * 2;

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {/* Outer casing, #f8fafc, roughness 0.72. Stiles run the full height. */}
      <Bar position={[-width / 2 + BORDER / 2, 0, casingZ]} size={[BORDER, height, CASING_D]} />
      <Bar position={[width / 2 - BORDER / 2, 0, casingZ]} size={[BORDER, height, CASING_D]} />
      <Bar position={[0, height / 2 - BORDER / 2, casingZ]} size={[openingW, BORDER, CASING_D]} />
      <Bar position={[0, -height / 2 + BORDER / 2, casingZ]} size={[openingW, BORDER, CASING_D]} />

      <Bar position={[-lipX, 0, lipZ]} size={[LIP, stileH, LIP_D]} />
      <Bar position={[lipX, 0, lipZ]} size={[LIP, stileH, LIP_D]} />
      <Bar position={[0, lipY, lipZ]} size={[openingW + LIP * 2, LIP, LIP_D]} />
      <Bar position={[0, -lipY, lipZ]} size={[openingW + LIP * 2, LIP, LIP_D]} />

      {/* Photograph, cropped to cover the opening. */}
      <mesh position={[0, 0, BACK + 0.02]}>
        <planeGeometry args={[openingW - 0.02, openingH - 0.02]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0, -height / 2 - PLATE_GAP - PLATE_H / 2, casingZ]}>
        <planeGeometry args={[width, PLATE_H]} />
        <meshStandardMaterial map={plate} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

/** Opening aspect (width / height) inside the molding. Used to crop the photograph. */
export function openingAspect(width: number, height: number) {
  return (width - BORDER * 2) / (height - BORDER * 2);
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
