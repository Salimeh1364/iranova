"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { AmbientTrack } from "@/lib/ambientTrack";

// Movement keys that mean the visitor has started to walk.
const MOVE_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

/**
 * Hall recording from `/audio/iranian-ambient.mp3`.
 * Browsers block sound until a gesture, so the loop waits for the first
 * walk key, a drag or click in the scene, or a press of this button.
 * A missing file leaves the button in place and plays nothing.
 */
export function AmbientAudioPlayer() {
  const { messages } = useI18n();
  const track = useRef<AmbientTrack | null>(null);
  const started = useRef(false);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const engine = new AmbientTrack();
    track.current = engine;

    // The first qualifying gesture starts the file and fades it in.
    const begin = () => {
      if (started.current || mutedRef.current) return;
      started.current = true;
      engine.start();
    };

    const onKey = (event: KeyboardEvent) => {
      if (!MOVE_KEYS.has(event.code)) return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      begin();
    };

    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      // Canvas click or drag, and the walk control, both count as entering the hall.
      if (target.closest("canvas") || target.closest("#walk-start")) begin();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      engine.dispose();
      track.current = null;
    };
  }, []);

  const onToggle = () => {
    const engine = track.current;
    if (!engine) return;
    // The button itself is a gesture, so it can start the music before a walk.
    if (!started.current) {
      started.current = true;
      mutedRef.current = false;
      setMuted(false);
      engine.start();
      return;
    }
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    engine.setMuted(next);
  };

  return (
    <button
      type="button"
      className="audio-toggle"
      aria-pressed={muted}
      aria-label={muted ? messages.audio.unmute : messages.audio.mute}
      onClick={onToggle}
    >
      {muted ? <SpeakerOffIcon /> : <SpeakerIcon />}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10v4h3.2L12 18V6L7.2 10H4zm9.2-2.2a4.5 4.5 0 0 1 0 8.4M15.6 5.2a7.5 7.5 0 0 1 0 13.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10v4h3.2L12 18V6L7.2 10H4zm11 2.5 4 4m0-4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
