// Looping hall music from a real recording.
// A missing file stays silent. Nothing is synthesized.

const TRACK = "/audio/iranian-ambient.mp3";
// A 200 answer. The route checks the file so a missing mp3 is not requested.
const LEVEL = 0.7;
const FADE_IN = 2.8;

/**
 * Plays `/audio/iranian-ambient.mp3` after a user gesture.
 * If the file is not in `public/audio` yet, start and mute do nothing.
 */
export class AmbientTrack {
  private audio: HTMLAudioElement | null = null;
  private probe: Promise<boolean> | null = null;
  private fadeTimer = 0;
  private token = 0;
  private silenced = false;

  /** Begin the loop and raise the volume. Safe to call again. */
  start() {
    this.silenced = false;
    const token = ++this.token;
    void this.playFromGesture(token);
  }

  /** Fade out and pause, or bring the recording back. */
  setMuted(muted: boolean) {
    if (muted) {
      this.silenced = true;
      // Drop any fade-in that has not reached the file yet.
      this.token += 1;
      this.fadeTo(0, 0.5, () => {
        this.audio?.pause();
      });
      return;
    }
    this.silenced = false;
    const token = ++this.token;
    void this.playFromGesture(token);
  }

  /** Stop the recording and release the element. */
  dispose() {
    this.token += 1;
    window.clearInterval(this.fadeTimer);
    const audio = this.audio;
    this.audio = null;
    this.probe = null;
    if (!audio) return;
    audio.pause();
  }

  private async playFromGesture(token: number) {
    const ready = await this.ensure();
    const audio = this.audio;
    if (!ready || !audio || token !== this.token || this.silenced) return;
    audio.loop = true;
    if (audio.paused) audio.volume = 0;
    try {
      await audio.play();
    } catch {
      // A rejected play stays silent. The page does not report it.
      return;
    }
    if (token !== this.token || this.silenced) {
      audio.pause();
      return;
    }
    this.fadeTo(LEVEL, FADE_IN);
  }

  /** One quiet check. A missing file never builds a player and never requests the mp3. */
  private ensure() {
    if (!this.probe) this.probe = this.load();
    return this.probe;
  }

  private async load() {
    try {
      const response = await fetch("/api/ambient-track");
      if (!response.ok) return false;
      const body = (await response.json()) as { ready?: boolean };
      if (!body.ready) return false;
      const audio = new Audio();
      // Swallow a later decode or network failure so it cannot surface as an exception.
      audio.onerror = () => undefined;
      audio.preload = "auto";
      audio.src = TRACK;
      audio.volume = 0;
      this.audio = audio;
      return true;
    } catch {
      return false;
    }
  }

  private fadeTo(target: number, seconds: number, done?: () => void) {
    const audio = this.audio;
    window.clearInterval(this.fadeTimer);
    if (!audio) {
      done?.();
      return;
    }
    const from = audio.volume;
    const start = performance.now();
    const ms = Math.max(seconds, 0.05) * 1000;
    this.fadeTimer = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms);
      audio.volume = from + (target - from) * t;
      if (t < 1) return;
      window.clearInterval(this.fadeTimer);
      done?.();
    }, 40);
  }
}
