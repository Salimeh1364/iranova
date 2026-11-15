type Listener = () => void;

let heading = 0;
const listeners = new Set<Listener>();

/** Yaw in radians. 0 faces deeper into the hall, toward -Z. */
export function subscribeHeading(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getHeading() {
  return heading;
}

export function setHeading(next: number) {
  // Skip tiny turns so the compass does not redraw every frame.
  if (Math.abs(next - heading) < 0.05) return;
  heading = next;
  listeners.forEach((listener) => listener());
}
