"use client";

import { useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { getWalkLocked, subscribeWalkLock } from "@/scene/controls/walkSession";

/**
 * Click target for pointer lock. It stays in the document while hidden,
 * because the control binds its click listener once and would lose a remounted button.
 */
export function WalkPrompt() {
  const { messages } = useI18n();
  const locked = useSyncExternalStore(subscribeWalkLock, getWalkLocked, () => false);

  return (
    <button
      id="walk-start"
      type="button"
      className={locked ? "walk-prompt is-hidden" : "walk-prompt"}
      aria-hidden={locked}
      tabIndex={locked ? -1 : 0}
      suppressHydrationWarning
    >
      <strong>{messages.gallery.walkStart}</strong>
      <span>{messages.gallery.walkHint}</span>
    </button>
  );
}
