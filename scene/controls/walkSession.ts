type Listener = () => void;

let locked = false;
const listeners = new Set<Listener>();

/** Pointer lock is shared by the walker and the on-screen prompt. The canvas is not remounted. */
export function subscribeWalkLock(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getWalkLocked() {
  return locked;
}

export function setWalkLocked(next: boolean) {
  if (locked === next) return;
  locked = next;
  listeners.forEach((listener) => listener());
}
