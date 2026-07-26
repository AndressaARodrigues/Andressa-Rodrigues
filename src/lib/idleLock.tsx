import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const IDLE_TIMEOUT_MS = 1 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"] as const;

interface IdleLockCtx {
  locked: boolean;
  unlock: () => void;
}

const IdleLockContext = createContext<IdleLockCtx | null>(null);

export function IdleLockProvider({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setLocked(true), IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    resetTimer();
    const onActivity = () => {
      if (!locked) resetTimer();
    };
    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  const unlock = () => {
    setLocked(false);
    resetTimer();
  };

  return <IdleLockContext.Provider value={{ locked, unlock }}>{children}</IdleLockContext.Provider>;
}

export function useIdleLock() {
  const ctx = useContext(IdleLockContext);
  if (!ctx) throw new Error("useIdleLock outside IdleLockProvider");
  return ctx;
}
