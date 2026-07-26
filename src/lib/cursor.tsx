import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import pinkArrow from "@/assets/cursors/pink-arrow.png";

export type CursorId = "default" | "pink-arrow";

interface CursorOption {
  id: CursorId;
  label: string;
  /** CSS `cursor` value; "auto" for the system default. */
  css: string;
}

export const CURSORS: CursorOption[] = [
  { id: "default", label: "Default", css: "auto" },
  { id: "pink-arrow", label: "Pink Arrow", css: `url(${pinkArrow}) 2 0, auto` },
];

interface CursorCtx {
  cursorId: CursorId;
  setCursorId: (id: CursorId) => void;
}

const CursorContext = createContext<CursorCtx | null>(null);
const KEY = "portfolio-cursor";
const STYLE_TAG_ID = "portfolio-cursor-override";

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorId, setCursorIdState] = useState<CursorId>("default");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as CursorId | null;
      if (stored && CURSORS.some((c) => c.id === stored)) setCursorIdState(stored);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    const option = CURSORS.find((c) => c.id === cursorId) ?? CURSORS[0];

    let styleEl = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_TAG_ID;
      document.head.appendChild(styleEl);
    }

    // "auto" (padrão) simplesmente remove nosso override, deixando o CSS normal do app valer
    styleEl.textContent =
      option.id === "default" ? "" : `*, *::before, *::after { cursor: ${option.css} !important; }`;
  }, [cursorId]);

  const setCursorId = (id: CursorId) => {
    setCursorIdState(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      /* noop */
    }
  };

  const value = useMemo(() => ({ cursorId, setCursorId }), [cursorId]);

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor outside CursorProvider");
  return ctx;
}
