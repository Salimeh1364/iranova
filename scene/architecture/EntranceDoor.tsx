"use client";

import { palette } from "@/lib/palette";
import { HALL, PLAN } from "@/scene/hall";

/**
 * Open rectangular portal in the +Z wall.
 * The casing is jambs and a head only. The floor line stays clear.
 * Three shallow steps rise from the courtyard to that open threshold.
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

// Shallow public steps. Rise 14 cm, tread 46 cm, wider than the opening.
const STEP_COUNT = 3;
const STEP_RISE = 0.14;
const STEP_TREAD = 0.46;
const STEP_THICK = 0.07;
const STEP_WIDTH = OPEN_W + 1.6;
// Tucked slightly under the outer plaster so the top tread meets the floor.
const STEP_START = HALL.wallThickness / 2 - 0.04;

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
      {/* Outside the wall, in +Z. The opening above them stays empty. */}
      <EntrySteps />
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

/**
 * Three stone treads outside the portal.
 * The nearest is flush with the floor. Each one beyond it drops 14 cm.
 * Slabs stay thin so the edge facing the foyer reads as a step.
 */
function EntrySteps() {
  return (
    <group>
      {Array.from({ length: STEP_COUNT }, (_, index) => {
        const top = -index * STEP_RISE;
        const z = STEP_START + index * STEP_TREAD + STEP_TREAD / 2;
        // Outer lip, a few centimeters proud, in a deeper stone so the nose catches light.
        const noseZ = STEP_START + (index + 1) * STEP_TREAD - 0.025;

        return (
          <group key={index}>
            <mesh position={[0, top - STEP_THICK / 2, z]} castShadow receiveShadow>
              <boxGeometry args={[STEP_WIDTH, STEP_THICK, STEP_TREAD]} />
              {/* #dcdad5, roughness 0.58. Pale stone, softer than the polished floor. */}
              <meshStandardMaterial color={palette.stone} roughness={0.58} metalness={0.04} />
            </mesh>
            <mesh position={[0, top - 0.02, noseZ]} castShadow receiveShadow>
              <boxGeometry args={[STEP_WIDTH + 0.02, 0.04, 0.05]} />
              {/* #c5c3bd, the deeper stone, along the nosing. */}
              <meshStandardMaterial color={palette.stoneDeep} roughness={0.72} metalness={0} />
            </mesh>
          </group>
        );
      })}
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
