import { Shape, type Path } from "three";

type CurveTarget = Shape | Path;

type ArchCurve = {
  /** How far across the span the crown controls sit. Higher is rounder. */
  shoulder?: number;
  /** How high the first controls rise, as a fraction of the arch height. */
  lift?: number;
};

/**
 * Appends a shallow Persian arch from the left spring (-half, 0) to the right spring (half, 0).
 * Default controls keep a vault wide and low. A window can pass a rounder curve.
 */
export function traceArchForward(
  target: CurveTarget,
  half: number,
  rise: number,
  move: boolean,
  curve: ArchCurve = {},
) {
  const shoulder = curve.shoulder ?? 0.22;
  const lift = curve.lift ?? 0.18;
  if (move) target.moveTo(-half, 0);
  target.bezierCurveTo(-half, rise * lift, -half * shoulder, rise, 0, rise);
  target.bezierCurveTo(half * shoulder, rise, half, rise * lift, half, 0);
}

/** Same arch, drawn right to left, so a band or a hole keeps a consistent winding. */
export function traceArchReverse(
  target: CurveTarget,
  half: number,
  rise: number,
  curve: ArchCurve = {},
) {
  const shoulder = curve.shoulder ?? 0.22;
  const lift = curve.lift ?? 0.18;
  target.bezierCurveTo(half, rise * lift, half * shoulder, rise, 0, rise);
  target.bezierCurveTo(-half * shoulder, rise, -half, rise * lift, -half, 0);
}

/** Closed arch profile: outer curve, then a smaller inner curve back. Suitable for extrusion. */
export function createArchBandShape(half: number, rise: number, thickness: number) {
  const shape = new Shape();
  const innerHalf = Math.max(half - thickness, half * 0.5);
  const innerRise = Math.max(rise - thickness, rise * 0.45);

  traceArchForward(shape, half, rise, true);
  shape.lineTo(innerHalf, 0);
  traceArchReverse(shape, innerHalf, innerRise);
  shape.closePath();
  return shape;
}

/** Filled arch opening, used for the window glass. */
export function createArchFillShape(half: number, rise: number, curve?: ArchCurve) {
  const shape = new Shape();
  traceArchForward(shape, half, rise, true, curve);
  shape.closePath();
  return shape;
}
