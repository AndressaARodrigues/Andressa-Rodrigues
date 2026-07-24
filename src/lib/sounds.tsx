import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type SoundName = "whoosh" | "click" | "pop" | "crumple" | "minimize" | "sent" | "received";

interface SoundsCtx {
  muted: boolean;
  setMuted: (m: boolean) => void;
  play: (name: SoundName) => void;
}

const SoundsContext = createContext<SoundsCtx | null>(null);
const KEY = "portfolio-muted";

function isMusicPlaying(): boolean {
  if (typeof document === "undefined") return false;
  const els = document.querySelectorAll("audio");
  for (const a of Array.from(els)) if (!a.paused) return true;
  return false;
}

export function SoundsProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored != null) setMutedState(stored === "1");
    } catch { /* noop */ }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    try { localStorage.setItem(KEY, m ? "1" : "0"); } catch { /* noop */ }
  }, []);

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  };

  const play = useCallback((name: SoundName) => {
    if (muted) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duck = isMusicPlaying() ? 0.4 : 1;
    const master = ctx.createGain();
    master.gain.value = 0.12 * duck;
    master.connect(ctx.destination);

    const tone = (freq: number, dur: number, type: OscillatorType, startVol: number, endVol = 0.0001, freqEnd?: number, delay = 0) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, now + delay);
      if (freqEnd != null) o.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + delay + dur);
      g.gain.setValueAtTime(startVol, now + delay);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), now + delay + dur);
      o.connect(g); g.connect(master);
      o.start(now + delay); o.stop(now + delay + dur + 0.02);
    };

    switch (name) {
      case "whoosh": {
        // filtered noise sweep
        const bufSize = 0.35 * ctx.sampleRate;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(400, now);
        bp.frequency.exponentialRampToValueAtTime(1800, now + 0.3);
        bp.Q.value = 0.8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        src.connect(bp); bp.connect(g); g.connect(master);
        src.start(now); src.stop(now + 0.36);
        break;
      }
      case "minimize": {
        tone(700, 0.22, "sine", 0.5, 0.0001, 260);
        break;
      }
      case "click": {
        tone(2200, 0.03, "square", 0.35);
        break;
      }
      case "pop": {
        tone(320, 0.09, "sine", 0.6, 0.0001, 760);
        break;
      }
      case "crumple": {
        // burst of noise
        const bufSize = 0.4 * ctx.sampleRate;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
          const env = Math.exp(-i / (bufSize * 0.25));
          data[i] = (Math.random() * 2 - 1) * env;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 1200;
        const g = ctx.createGain();
        g.gain.value = 0.5;
        src.connect(hp); hp.connect(g); g.connect(master);
        src.start(now); src.stop(now + 0.42);
        break;
      }
      case "sent": {
        // soft upward swoosh
        tone(520, 0.18, "sine", 0.35, 0.0001, 1200);
        break;
      }
      case "received": {
        // gentle two-tone ping
        tone(880, 0.12, "sine", 0.3, 0.0001, 880, 0);
        tone(1320, 0.18, "sine", 0.28, 0.0001, 1320, 0.08);
        break;
      }
    }
  }, [muted]);

  return <SoundsContext.Provider value={{ muted, setMuted, play }}>{children}</SoundsContext.Provider>;
}

export function useSounds() {
  const ctx = useContext(SoundsContext);
  if (!ctx) throw new Error("useSounds outside SoundsProvider");
  return ctx;
}

// Non-hook access for imperative modules (WindowManager helpers)
let externalPlay: ((n: SoundName) => void) | null = null;
export function registerExternalPlayer(fn: ((n: SoundName) => void) | null) {
  externalPlay = fn;
}
export function playSound(n: SoundName) { externalPlay?.(n); }
