type Listener = () => void;

export type FrameHintState = {
  /** CSS pixels from the left of the gallery. */
  x: number;
  /** CSS pixels from the top of the gallery. */
  y: number;
  on: boolean;
};

const hidden: FrameHintState = { x: 0, y: 0, on: false };

let state: FrameHintState = hidden;
let hover: { x: number; y: number; z: number } | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** The picture or nameplate under the cursor, in world meters. */
export function setFrameHover(point: { x: number; y: number; z: number } | null) {
  hover = point;
}

export function getFrameHover() {
  return hover;
}

export function subscribeFrameHint(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFrameHint() {
  return state;
}

export function getServerFrameHint(): FrameHintState {
  return hidden;
}

/** Skip tiny shifts so the label does not re-render every frame. */
export function publishFrameHint(next: FrameHintState) {
  if (!next.on) {
    if (!state.on) return;
    state = { x: state.x, y: state.y, on: false };
    emit();
    return;
  }
  if (state.on && Math.abs(state.x - next.x) < 2 && Math.abs(state.y - next.y) < 2) return;
  state = next;
  emit();
}
