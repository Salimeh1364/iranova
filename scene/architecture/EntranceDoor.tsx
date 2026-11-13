"use client";

import { palette } from "@/lib/palette";
import { HALL, PLAN } from "@/scene/hall";

/**
 * Open rectangular portal in the +Z wall.
 * A thick white casing stands off the olive plaster and casts into the daylight shadow.
 */

// Clear opening, 4.4 m wide and 4.6 m tall.
const OPEN_W = PLAN.entranceHalf * 2;
const OPEN_H = PLAN.openingHeight;

// Face width of the casing, and how far it stands off the inner plaster.
const MOLD = 0.24;
const CASING_D = 0.12;
// Narrower bead on the inner edge, proud of the casing.
const LIP = 0.1;
const LIP_D = 0.18;
// Low threshold so the rectangle closes at the floor.
const SILL_H = 0.1;
// How far the bead steps into the opening, so it does not share a face with the casing.
const REVEAL = 0.015;

// Inner face of the entrance wall. The foyer is toward -Z.
// The molding is set 1 cm into that face so the back is buried in the plaster.
const FACE = -HALL.wallThickness / 2 + 0.01;

/** #f8fafc, roughness 0.72. Matte, so the relief reads in the daylight. */
function Trim() {
  return <meshStandardMaterial color={palette.trim} roughness={0.72} metalness={0} />;
}

export function EntranceDoor() {
  return (
    <group position={[0, 0, PLAN.spineNear]}>
      {/* Olive lintel, #8a9a86, from the head of the opening up to the ceiling. */}
      <mesh position={[0, (OPEN_H + HALL.wallHeight) / 2, 0]} receiveShadow>
        <boxGeometry args={[OPEN_W, HALL.wallHeight - OPEN_H, HALL.wallThickness]} />
        <meshStandardMaterial color={palette.plaster} roughness={0.85} metalness={0} />
      </mesh>

      <Casing />
      <InnerLip />
    </group>
  );
}

/** Wide band around the rectangle. Jambs stop at the head so the corners do not overlap. */
function Casing() {
  const half = OPEN_W / 2;
  const z = FACE - CASING_D / 2;
  const jambHeight = OPEN_H - SILL_H;
  const jambY = SILL_H + jambHeight / 2;

  return (
    <group>
      <Bar position={[-half - MOLD / 2, jambY, z]} size={[MOLD, jambHeight, CASING_D]} />
      <Bar position={[half + MOLD / 2, jambY, z]} size={[MOLD, jambHeight, CASING_D]} />
      {/* Head sits on the jambs and runs out to their outer edges. */}
      <Bar position={[0, OPEN_H + MOLD / 2, z]} size={[OPEN_W + MOLD * 2, MOLD, CASING_D]} />
      <Bar position={[0, SILL_H / 2, z]} size={[OPEN_W, SILL_H, CASING_D]} />
    </group>
  );
}

/** Bead along the inner edge of the casing. It projects farther into the foyer. */
function InnerLip() {
  const half = OPEN_W / 2;
  const z = FACE - LIP_D / 2;
  const jambBottom = SILL_H + LIP;
  const jambTop = OPEN_H - REVEAL;
  const jambHeight = jambTop - jambBottom;
  const jambY = (jambBottom + jambTop) / 2;
  // Shifted into the opening by REVEAL, off the casing's inner face.
  const jambX = half + LIP / 2 - REVEAL;

  return (
    <group>
      <Bar position={[-jambX, jambY, z]} size={[LIP, jambHeight, LIP_D]} />
      <Bar position={[jambX, jambY, z]} size={[LIP, jambHeight, LIP_D]} />
      {/* Head drops slightly into the opening and covers the jamb tops. */}
      <Bar
        position={[0, OPEN_H - REVEAL + LIP / 2, z]}
        size={[OPEN_W + LIP * 2, LIP, LIP_D]}
      />
      <Bar position={[0, SILL_H + LIP / 2, z]} size={[OPEN_W - REVEAL * 2, LIP, LIP_D]} />
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
      <Trim />
    </mesh>
  );
}
