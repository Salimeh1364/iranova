import { COLUMNS, COLUMN, PASSAGES, PLAYER, ROOMS } from "@/scene/hall";

/** A floor rectangle. Y is ignored: the visitor stays at eye height. */
export type Aabb = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type WalkPoint = {
  x: number;
  z: number;
};

const radius = PLAYER.radius;

function insetRoom(room: (typeof ROOMS)[number]): Aabb {
  // Pull every wall in by the body radius so the visitor cannot stand inside the plaster.
  return {
    minX: room.minX + radius,
    maxX: room.maxX - radius,
    minZ: room.minZ + radius,
    maxZ: room.maxZ - radius,
  };
}

function passageBox(passage: (typeof PASSAGES)[number]): Aabb {
  // The thin axis is extended into both rooms, or the body would stop on the threshold.
  if (passage.axis === "z") {
    return {
      minX: passage.minX + radius,
      maxX: passage.maxX - radius,
      minZ: passage.minZ - radius,
      maxZ: passage.maxZ + radius,
    };
  }
  return {
    minX: passage.minX - radius,
    maxX: passage.maxX + radius,
    minZ: passage.minZ + radius,
    maxZ: passage.maxZ - radius,
  };
}

const WALKABLE: readonly Aabb[] = [...ROOMS.map(insetRoom), ...PASSAGES.map(passageBox)];

function contains(x: number, z: number, box: Aabb) {
  return x >= box.minX && x <= box.maxX && z >= box.minZ && z <= box.maxZ;
}

function insideGallery(x: number, z: number) {
  return WALKABLE.some((box) => contains(x, z, box));
}

function hitsColumn(x: number, z: number) {
  const limit = COLUMN.radius + radius;
  return COLUMNS.some((column) => {
    const dx = x - column.x;
    const dz = z - column.z;
    return dx * dx + dz * dz < limit * limit;
  });
}

function allowed(x: number, z: number) {
  return insideGallery(x, z) && !hitsColumn(x, z);
}

/**
 * Move on X first, then Z. A blocked axis is dropped so the body slides along a wall or a column.
 * The visitor can cross a passage because those openings are part of the walkable set.
 */
export function moveWithinHall(x: number, z: number, nextX: number, nextZ: number): WalkPoint {
  let px = nextX;
  if (!allowed(px, z)) px = x;

  let pz = nextZ;
  if (!allowed(px, pz)) pz = z;

  return { x: px, z: pz };
}
