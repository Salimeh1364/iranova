"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { getDeviceProfile, getServerDeviceProfile, subscribeDeviceProfile } from "@/lib/deviceProfile";
import { clearStick, setStick } from "@/scene/controls/touchSteer";

const RADIUS = 42;

/**
 * Walk pad for a finger. Dragging the hall itself turns the view;
 * this pad only moves the body.
 */
export function TouchSteer() {
  const { messages } = useI18n();
  const profile = useSyncExternalStore(subscribeDeviceProfile, getDeviceProfile, getServerDeviceProfile);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const origin = useRef<{ x: number; y: number } | null>(null);

  if (!profile.touch) return null;

  const end = () => {
    origin.current = null;
    setKnob({ x: 0, y: 0 });
    clearStick();
  };

  return (
    <div className="touch-steer">
      <p className="touch-hint">{messages.gallery.touchHint}</p>
      <div
        className="touch-stick"
        aria-label={messages.gallery.touchPad}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          origin.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerMove={(event) => {
          const start = origin.current;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          const length = Math.hypot(dx, dy) || 1;
          const reach = Math.min(length, RADIUS);
          const knobX = (dx / length) * reach;
          const knobY = (dy / length) * reach;
          setKnob({ x: knobX, y: knobY });
          // Up on the screen is forward. A small rest zone ignores a resting finger.
          const x = knobX / RADIUS;
          const y = -knobY / RADIUS;
          if (Math.hypot(x, y) < 0.16) {
            setStick({ x: 0, y: 0 });
            return;
          }
          setStick({ x, y });
        }}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
      >
        <span className="touch-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
      </div>
    </div>
  );
}
