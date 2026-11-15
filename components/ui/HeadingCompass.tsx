"use client";

import { useSyncExternalStore } from "react";
import { getDeviceProfile, getServerDeviceProfile, subscribeDeviceProfile } from "@/lib/deviceProfile";
import { getHeading, subscribeHeading } from "@/scene/controls/headingSession";

/**
 * A small rose. N stays toward the far end of the hall,
 * so a turn swings the letter instead of the room.
 */
export function HeadingCompass() {
  const profile = useSyncExternalStore(subscribeDeviceProfile, getDeviceProfile, getServerDeviceProfile);
  const heading = useSyncExternalStore(subscribeHeading, getHeading, () => 0);
  if (!profile.touch) return null;

  return (
    <div className="heading-compass" aria-hidden="true">
      <span style={{ transform: `rotate(${-heading}rad)` }}>N</span>
    </div>
  );
}
