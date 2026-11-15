"use client";

import { useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { getDeviceProfile, getServerDeviceProfile, subscribeDeviceProfile } from "@/lib/deviceProfile";
import { getWalkLocked, subscribeWalkLock } from "@/scene/controls/walkSession";

/**
 * Click target for pointer lock. It stays in the document while hidden,
 * because the control binds its click listener once and would lose a remounted button.
 */
export function WalkPrompt() {
  const { messages } = useI18n();
  const locked = useSyncExternalStore(subscribeWalkLock, getWalkLocked, () => false);
  const profile = useSyncExternalStore(subscribeDeviceProfile, getDeviceProfile, getServerDeviceProfile);
  // A phone never locks the pointer. The pad replaces this button, which stays mounted for the desktop listener.
  const hidden = locked || profile.touch;

  return (
    <button
      id="walk-start"
      type="button"
      className={hidden ? "walk-prompt is-hidden" : "walk-prompt"}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      suppressHydrationWarning
    >
      <strong>{messages.gallery.walkStart}</strong>
      <span>{messages.gallery.walkHint}</span>
    </button>
  );
}
