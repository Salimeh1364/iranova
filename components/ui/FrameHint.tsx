"use client";

import { useSyncExternalStore } from "react";
import { getDeviceProfile, getServerDeviceProfile, subscribeDeviceProfile } from "@/lib/deviceProfile";
import { useI18n } from "@/i18n/I18nProvider";
import { getFrameHint, getServerFrameHint, subscribeFrameHint } from "@/scene/controls/frameHintSession";

/**
 * A small glass label over the frame the visitor is near, or the one under the cursor.
 */
export function FrameHint() {
  const hint = useSyncExternalStore(subscribeFrameHint, getFrameHint, getServerFrameHint);
  const profile = useSyncExternalStore(subscribeDeviceProfile, getDeviceProfile, getServerDeviceProfile);
  const { messages } = useI18n();
  const label = profile.touch ? messages.gallery.frameHintTouch : messages.gallery.frameHint;

  return (
    <p
      className={hint.on ? "frame-hint is-on" : "frame-hint"}
      style={{ left: hint.x, top: hint.y }}
      aria-hidden={hint.on ? undefined : true}
      suppressHydrationWarning
    >
      {label}
    </p>
  );
}
