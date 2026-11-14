// Soft solo piano, synthesized in the browser.
// The gallery does not depend on an audio file, so playback works offline.

// A minor, then F, C, and G. Each chord is a low voicing plus one octave.
const CHORDS: readonly (readonly number[])[] = [
  [45, 52, 57, 64],
  [41, 48, 53, 60],
  [48, 55, 60, 64],
  [43, 50, 55, 62],
];

// A short original line in A minor. It walks above the chords.
const MELODY: readonly number[] = [76, 72, 69, 67, 64, 69, 72, 74];

const BEAT = 0.82;
// Heard level after the fade-in. Notes themselves stay quiet.
const LEVEL = 0.7;
const FLOOR = 0.0008;

/** MIDI note number to hertz. A4 is 69. */
function frequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

/**
 * Schedules a calm piano loop on one AudioContext.
 * Create it from a click or key press so the browser allows sound.
 */
export class AmbientPiano {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private timer = 0;
  private muteTimer = 0;
  private nextAt = 0;
  private step = 0;
  private silenced = false;

  /** Begin the loop and fade the volume up. Safe to call again. */
  start() {
    const ctx = this.ensure();
    this.silenced = false;
    window.clearTimeout(this.muteTimer);
    void ctx.resume();
    if (!this.timer) {
      this.nextAt = ctx.currentTime + 0.08;
      this.pump();
      // Look ahead so notes are queued before they should be heard.
      this.timer = window.setInterval(() => this.pump(), 400);
    }
    this.fadeTo(LEVEL, 2.6);
  }

  /** Fade out and pause, or fade back in. */
  setMuted(muted: boolean) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    window.clearTimeout(this.muteTimer);
    if (muted) {
      this.silenced = true;
      this.fadeTo(FLOOR, 0.5);
      this.muteTimer = window.setTimeout(() => {
        if (!this.silenced) return;
        window.clearInterval(this.timer);
        this.timer = 0;
        void ctx.suspend();
      }, 540);
      return;
    }
    this.silenced = false;
    void ctx.resume().then(() => {
      if (!this.timer) {
        this.nextAt = ctx.currentTime + 0.08;
        this.pump();
        this.timer = window.setInterval(() => this.pump(), 400);
      }
      this.fadeTo(LEVEL, 0.9);
    });
  }

  /** Stop the loop and release the audio device. */
  dispose() {
    window.clearInterval(this.timer);
    window.clearTimeout(this.muteTimer);
    this.timer = 0;
    const ctx = this.ctx;
    this.ctx = null;
    this.master = null;
    this.bus = null;
    if (ctx) void ctx.close();
  }

  private ensure() {
    if (this.ctx && this.master && this.bus) return this.ctx;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    const bus = ctx.createGain();
    master.gain.value = FLOOR;
    bus.gain.value = 1;

    // A short, dark echo. The feedback stays well below 1 so it cannot howl.
    const delay = ctx.createDelay(1);
    const feedback = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    delay.delayTime.value = 0.42;
    feedback.gain.value = 0.26;
    tone.type = "lowpass";
    tone.frequency.value = 1400;

    bus.connect(master);
    bus.connect(delay);
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    feedback.connect(master);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    this.bus = bus;
    return ctx;
  }

  private fadeTo(value: number, seconds: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const from = Math.max(master.gain.value, FLOOR);
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(from, now);
    master.gain.exponentialRampToValueAtTime(Math.max(value, FLOOR), now + seconds);
  }

  /** Queue the next beats that fall inside the lookahead window. */
  private pump() {
    const ctx = this.ctx;
    if (!ctx || this.silenced) return;
    const horizon = ctx.currentTime + 1.4;
    if (this.nextAt < ctx.currentTime) this.nextAt = ctx.currentTime + 0.06;

    while (this.nextAt < horizon) {
      const chordIndex = Math.floor(this.step / 8) % CHORDS.length;
      const beat = this.step % 8;
      if (beat === 0) {
        CHORDS[chordIndex].forEach((midi, index) => {
          // Spread the chord by a few milliseconds so it is not a single click.
          this.play(midi, this.nextAt + index * 0.035, 0.4, 4.8);
        });
      }
      if (beat % 2 === 1) {
        const note = MELODY[(chordIndex * 2 + beat) % MELODY.length];
        this.play(note, this.nextAt, 0.3, 2.2);
      }
      this.nextAt += BEAT;
      this.step += 1;
    }
  }

  /** One soft hammer: a triangle body, a quiet octave, and a closing filter. */
  private play(midi: number, time: number, velocity: number, duration: number) {
    const ctx = this.ctx;
    const bus = this.bus;
    if (!ctx || !bus) return;

    const fundamental = frequency(midi);
    const body = ctx.createOscillator();
    const partial = ctx.createOscillator();
    const partialGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const amp = ctx.createGain();

    body.type = "triangle";
    partial.type = "sine";
    // A tiny pitch fall imitates the hammer strike without a noise burst.
    body.frequency.setValueAtTime(fundamental * 1.012, time);
    body.frequency.exponentialRampToValueAtTime(fundamental, time + 0.06);
    partial.frequency.value = fundamental * 2;
    partial.detune.value = 4;
    partialGain.gain.value = 0.15;

    filter.type = "lowpass";
    filter.Q.value = 0.5;
    filter.frequency.setValueAtTime(1200 + velocity * 800, time);
    filter.frequency.exponentialRampToValueAtTime(640, time + duration);

    const peak = 0.085 * velocity;
    amp.gain.setValueAtTime(FLOOR, time);
    amp.gain.exponentialRampToValueAtTime(Math.max(peak, FLOOR), time + 0.02);
    amp.gain.exponentialRampToValueAtTime(FLOOR, time + duration);

    body.connect(filter);
    partial.connect(partialGain);
    partialGain.connect(filter);
    filter.connect(amp);
    amp.connect(bus);

    const end = time + duration + 0.05;
    body.start(time);
    partial.start(time);
    body.stop(end);
    partial.stop(end);
    body.onended = () => {
      body.disconnect();
      partial.disconnect();
      partialGain.disconnect();
      filter.disconnect();
      amp.disconnect();
    };
  }
}
