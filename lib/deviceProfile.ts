export type GalleryTier = "phone" | "tablet" | "desktop";

/** What the hall should spend on this screen. */
export type DeviceProfile = {
  tier: GalleryTier;
  /** Coarse pointer: drag to look, pad to walk. */
  touch: boolean;
  dprMax: number;
  antialias: boolean;
  /** The daylight shadow map. Phones skip it. */
  shadows: boolean;
  shadowMap: number;
  /** Floor reflection size. 0 draws a plain stone floor. */
  reflector: number;
};

const DESKTOP: DeviceProfile = {
  tier: "desktop",
  touch: false,
  dprMax: 1.25,
  antialias: true,
  shadows: true,
  shadowMap: 512,
  reflector: 128,
};

let current: DeviceProfile = DESKTOP;

function measure(): DeviceProfile {
  if (typeof window === "undefined") return DESKTOP;

  const width = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const touchScreen = navigator.maxTouchPoints > 0;
  const handheld = coarse || touchScreen;
  // A narrow window cannot rely on pointer lock, even when a mouse is attached.
  const phone = width <= 768;
  const tablet = !phone && width <= 1180 && handheld;

  if (phone) {
    return {
      tier: "phone",
      touch: true,
      dprMax: 1,
      antialias: false,
      shadows: false,
      shadowMap: 256,
      reflector: 0,
    };
  }
  if (tablet) {
    return {
      tier: "tablet",
      touch: true,
      dprMax: 1.15,
      antialias: true,
      shadows: true,
      shadowMap: 256,
      reflector: 64,
    };
  }
  return DESKTOP;
}

function same(a: DeviceProfile, b: DeviceProfile) {
  return a.tier === b.tier && a.touch === b.touch && a.dprMax === b.dprMax && a.shadows === b.shadows;
}

export function getDeviceProfile() {
  const next = measure();
  // Keep the same object while the screen class is unchanged.
  if (!same(next, current)) current = next;
  return current;
}

/** First paint matches the server, then the live screen replaces it. */
export function getServerDeviceProfile() {
  return DESKTOP;
}

export function subscribeDeviceProfile(listener: () => void) {
  const notify = () => {
    const next = measure();
    if (same(next, current)) return;
    current = next;
    listener();
  };

  const coarse = window.matchMedia("(pointer: coarse)");
  window.addEventListener("resize", notify);
  coarse.addEventListener("change", notify);
  return () => {
    window.removeEventListener("resize", notify);
    coarse.removeEventListener("change", notify);
  };
}
