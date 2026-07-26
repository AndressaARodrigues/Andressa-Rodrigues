import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface CheatModeCtx {
  active: boolean;
  trigger: () => void;
}

const CheatModeContext = createContext<CheatModeCtx | null>(null);

export function CheatModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);

  const trigger = useCallback(() => {
    setActive(true);
    window.setTimeout(() => setActive(false), 4000);
  }, []);

  return (
    <CheatModeContext.Provider value={{ active, trigger }}>{children}</CheatModeContext.Provider>
  );
}

export function useCheatMode() {
  const ctx = useContext(CheatModeContext);
  if (!ctx) throw new Error("useCheatMode outside CheatModeProvider");
  return ctx;
}
