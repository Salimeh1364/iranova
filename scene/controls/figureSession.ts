type Listener = () => void;

let selectedId: string | null = null;
const listeners = new Set<Listener>();

/** The open biography, shared by the frames and the side panel. */
export function subscribeFigure(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSelectedFigureId() {
  return selectedId;
}

export function selectFigure(id: string | null) {
  if (selectedId === id) return;
  selectedId = id;
  // Leave walking mode so the panel can be read with the cursor.
  if (id && document.pointerLockElement) document.exitPointerLock();
  listeners.forEach((listener) => listener());
}
