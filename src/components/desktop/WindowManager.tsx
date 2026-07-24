import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { playSound } from "@/lib/sounds";

export type AppId = "finder" | "terminal" | "mail" | "pdf" | "solitaire" | "readme" | "music" | "messages" | "settings" | "imageviewer";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  data?: Record<string, unknown>;
  opening?: boolean;
}

interface WindowContextValue {
  windows: WindowState[];
  active: WindowState | null;
  open: (appId: AppId, opts?: { title?: string; data?: Record<string, unknown>; width?: number; height?: number }) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  maximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  updateData: (id: string, data: Record<string, unknown>) => void;
}

const WindowContext = createContext<WindowContextValue | null>(null);

const APP_DEFAULT_TITLES: Record<AppId, string> = {
  finder: "Finder",
  terminal: "Terminal",
  mail: "Mail",
  pdf: "Preview",
  solitaire: "Solitaire",
  readme: "TextEdit",
  music: "Music",
  messages: "Messages",
  settings: "System Settings",
  imageviewer: "Photos",
};

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const zCounter = useRef(1000);
  const idCounter = useRef(0);

  const open = useCallback<WindowContextValue["open"]>((appId, opts) => {
    const id = `w-${++idCounter.current}`;
    zCounter.current += 1;
    const width = opts?.width ?? 720;
    const height = opts?.height ?? 480;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const x = Math.max(20, Math.round((vw - width) / 2 + (Math.random() - 0.5) * 60));
    const y = Math.max(40, Math.round((vh - height) / 2 + (Math.random() - 0.5) * 40));
    const w: WindowState = {
      id,
      appId,
      title: opts?.title ?? APP_DEFAULT_TITLES[appId],
      x,
      y,
      width,
      height,
      z: zCounter.current,
      minimized: false,
      maximized: false,
      data: opts?.data,
      opening: true,
    };
    setWindows((ws) => [...ws, w]);
    playSound("whoosh");
    setTimeout(() => {
      setWindows((ws) => ws.map((x) => (x.id === id ? { ...x, opening: false } : x)));
    }, 220);
  }, []);

  const close = useCallback((id: string) => {
    playSound("whoosh");
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const focus = useCallback((id: string) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
  }, []);

  const minimize = useCallback((id: string) => {
    playSound("minimize");
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)));
  }, []);

  const maximize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const move = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const updateData = useCallback((id: string, data: Record<string, unknown>) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, data: { ...w.data, ...data } } : w)));
  }, []);

  const active = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (!visible.length) return null;
    return visible.reduce((a, b) => (a.z > b.z ? a : b));
  }, [windows]);

  const value: WindowContextValue = {
    windows,
    active,
    open,
    close,
    focus,
    minimize,
    maximize,
    move,
    updateData,
  };

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used within WindowProvider");
  return ctx;
}
