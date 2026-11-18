/**
 * Even centers along one plaster run.
 * A single frame is centered. Several frames share equal end margins and equal gaps.
 * Columns listed here stand against that wall; a frame must clear the shaft.
 */

const SHAFT_CLEAR = 0.3;

/** Centers from `start` toward `end`. Throws if a column still covers a frame. */
export function frameCenters(
  start: number,
  end: number,
  count: number,
  frame: number,
  columns: readonly number[],
): number[] {
  const low = Math.min(start, end);
  const high = Math.max(start, end);
  const length = high - low;
  // Equal end margins. With one frame this is simply the centered hang.
  const margin = (length - frame * count) / (count + 1);
  if (margin < 0.05) {
    throw new Error(`Wall from ${low.toFixed(2)} to ${high.toFixed(2)} cannot hold ${count} frames`);
  }

  const centers = Array.from({ length: count }, (_, index) => {
    return low + margin + frame / 2 + index * (frame + margin);
  });

  for (const center of centers) {
    for (const column of columns) {
      const clear = Math.abs(center - column) - frame / 2;
      if (clear < SHAFT_CLEAR) {
        throw new Error(
          `Frame at ${center.toFixed(2)} is only ${clear.toFixed(2)} m clear of the column at ${column.toFixed(2)}`,
        );
      }
    }
  }

  return start <= end ? centers : centers.slice().reverse();
}

type ColumnPoint = { readonly x: number; readonly z: number };

/**
 * Columns flush to this wall.
 * `axis` "z" is a wall that runs north–south (the coordinate kept is z).
 */
export function columnsOnWall(columns: readonly ColumnPoint[], axis: "x" | "z", wall: number): number[] {
  return columns
    .filter((column) => {
      const plane = axis === "z" ? Math.abs(wall - column.x) : Math.abs(wall - column.z);
      // The base sits about 0.3 m off the plaster. Anything farther is another wall.
      return plane < 0.5;
    })
    .map((column) => (axis === "z" ? column.z : column.x));
}
