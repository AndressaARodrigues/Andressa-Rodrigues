import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CatModeValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const CatModeContext = createContext<CatModeValue | null>(null);
const KEY = "portfolio-cat-mode";

export function CatModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored != null) setEnabledState(stored === "1");
    } catch {
      /* noop */
    }
  }, []);

  const setEnabled = (next: boolean) => {
    setEnabledState(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* noop */
    }
  };

  const value = useMemo(() => ({ enabled, setEnabled }), [enabled]);

  return <CatModeContext.Provider value={value}>{children}</CatModeContext.Provider>;
}

export function useCatMode() {
  const ctx = useContext(CatModeContext);
  if (!ctx) throw new Error("useCatMode outside CatModeProvider");
  return ctx;
}

