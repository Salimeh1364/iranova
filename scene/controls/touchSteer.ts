/** Shared by the on-screen pad and the walker. x is right, y is forward. */
export type Stick = {
  x: number;
  y: number;
};

let stick: Stick = { x: 0, y: 0 };
let lookX = 0;
let lookY = 0;

export function setStick(next: Stick) {
  stick = next;
}

export function clearStick() {
  stick = { x: 0, y: 0 };
}

export function readStick() {
  return stick;
}

/** Pixels of a touch drag, applied on the next frame. */
export function addLook(dx: number, dy: number) {
  lookX += dx;
  lookY += dy;
}

export function takeLook() {
  const next = { x: lookX, y: lookY };
  lookX = 0;
  lookY = 0;
  return next;
}
