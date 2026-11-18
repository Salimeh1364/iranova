"use client";

import { palette } from "@/lib/palette";
import { HALL, PLAN } from "@/scene/hall";
import { ExteriorSteps } from "@/scene/architecture/ExteriorSteps";
import { GlassDoor } from "@/scene/architecture/GlassDoor";

/**
 * Rectangular entrance in the +Z wall.
 * White jambs and a head, glass doors that slide open, and a stone landing with steps outside.
 * No sill. The gallery floor is the threshold.
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
// How far the bead steps into the opening, so it does not share a face with the casing.
const REVEAL = 0.015;

// Inner face of the entrance wall. The foyer is toward -Z.
// The molding is set 1 cm into that face so the back is buried in the plaster.
const FACE = -HALL.wallThickness / 2 + 0.01;

/** #f8fafc, roughness 0.72. Matte, so the relief reads in the daylight. */
function Trim() {
  return <meshStandardMaterial color={palette.trim} roughness={0.72} metalness={0} />;
}

export function EntrancePortal() {
  return (
    <group position={[0, 0, PLAN.spineNear]}>
      {/* Lintel in the wall color, from the head of the opening up to the ceiling. */}
      <mesh position={[0, (OPEN_H + HALL.wallHeight) / 2, 0]} receiveShadow>
        <boxGeometry args={[OPEN_W, HALL.wallHeight - OPEN_H, HALL.wallThickness]} />
        <meshStandardMaterial color={palette.plaster} roughness={0.85} metalness={0} />
      </mesh>

      <Casing />
      <InnerLip />
      {/* Leaves sit in the wall plane and slide aside as someone approaches. */}
      <GlassDoor width={OPEN_W} height={OPEN_H} />
      {/* Landing and steps outside. The garden photograph stays where it is. */}
      <ExteriorSteps />
    </group>
  );
}

/** Jambs and head. No sill, so the threshold is the gallery floor. */
function Casing() {
  const half = OPEN_W / 2;
  const z = FACE - CASING_D / 2;

  return (
    <group>
      <Bar position={[-half - MOLD / 2, OPEN_H / 2, z]} size={[MOLD, OPEN_H, CASING_D]} />
      <Bar position={[half + MOLD / 2, OPEN_H / 2, z]} size={[MOLD, OPEN_H, CASING_D]} />
      {/* Head sits on the jambs and runs out to their outer edges. */}
      <Bar position={[0, OPEN_H + MOLD / 2, z]} size={[OPEN_W + MOLD * 2, MOLD, CASING_D]} />
    </group>
  );
}

/** Bead along the inner edge of the casing. It projects farther into the foyer. */
function InnerLip() {
  const half = OPEN_W / 2;
  const z = FACE - LIP_D / 2;
  const jambTop = OPEN_H - REVEAL;
  const jambY = jambTop / 2;
  // Shifted into the opening by REVEAL, off the casing's inner face.
  const jambX = half + LIP / 2 - REVEAL;

  return (
    <group>
      <Bar position={[-jambX, jambY, z]} size={[LIP, jambTop, LIP_D]} />
      <Bar position={[jambX, jambY, z]} size={[LIP, jambTop, LIP_D]} />
      {/* Head drops slightly into the opening and covers the jamb tops. */}
      <Bar
        position={[0, OPEN_H - REVEAL + LIP / 2, z]}
        size={[OPEN_W + LIP * 2, LIP, LIP_D]}
      />
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
