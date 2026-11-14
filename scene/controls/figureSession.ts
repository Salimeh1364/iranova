type Listener = () => void;

export type ExhibitSelection = { kind: "figure" | "landmark"; id: string } | null;

let selected: ExhibitSelection = null;
const listeners = new Set<Listener>();

function publish(next: ExhibitSelection) {
  if (selected?.kind === next?.kind && selected?.id === next?.id) return;
  selected = next;
  // Leave walking mode so the panel can be read with the cursor.
  if (next && document.pointerLockElement) document.exitPointerLock();
  listeners.forEach((listener) => listener());
}

/** The open panel, shared by the frames and the side panel. */
export function subscribeFigure(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSelectedExhibit(): ExhibitSelection {
  return selected;
}

export function getSelectedFigureId() {
  return selected?.kind === "figure" ? selected.id : null;
}

export function selectFigure(id: string | null) {
  publish(id ? { kind: "figure", id } : null);
}

export function selectLandmark(id: string | null) {
  publish(id ? { kind: "landmark", id } : null);
}
