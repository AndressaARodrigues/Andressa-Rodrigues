import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import rio from "@/assets/wallpapers/wp-rio.jpg.asset.json";
import italy from "@/assets/wallpapers/wp-italy.jpg.asset.json";
import japan from "@/assets/wallpapers/wp-japan.jpg.asset.json";
import bigsur from "@/assets/wallpapers/wp-bigsur.jpg.asset.json";

export type WallpaperId = "theme" | "rio" | "italy" | "japan" | "bigsur";

export interface WallpaperOption {
  id: WallpaperId;
  label: string;
  url?: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  { id: "theme", label: "Theme Color" },
  { id: "rio", label: "Rio de Janeiro", url: rio.url },
  { id: "italy", label: "Amalfi Coast", url: italy.url },
  { id: "japan", label: "Mount Fuji", url: japan.url },
  { id: "bigsur", label: "Big Sur", url: bigsur.url },
];

interface Ctx {
  id: WallpaperId;
  setId: (id: WallpaperId) => void;
  current: WallpaperOption;
}

const WallpaperContext = createContext<Ctx | null>(null);
const KEY = "portfolio-wallpaper";

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [id, setIdState] = useState<WallpaperId>("theme");
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY) as WallpaperId | null;
      if (v && WALLPAPERS.some((w) => w.id === v)) setIdState(v);
    } catch { /* noop */ }
  }, []);
  const setId = (v: WallpaperId) => {
    setIdState(v);
    try { localStorage.setItem(KEY, v); } catch { /* noop */ }
  };
  const current = WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
  return <WallpaperContext.Provider value={{ id, setId, current }}>{children}</WallpaperContext.Provider>;
}

export function useWallpaper() {
  const ctx = useContext(WallpaperContext);
  if (!ctx) throw new Error("useWallpaper outside WallpaperProvider");
  return ctx;
}
