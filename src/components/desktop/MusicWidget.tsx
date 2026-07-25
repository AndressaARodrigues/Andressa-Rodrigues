import { useEffect, useState } from "react";
import { useMusic } from "@/lib/music";
import { Play, Pause, SkipBack, SkipForward, Music as MusicIcon, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWindows } from "@/components/desktop/WindowManager";
import { LAYERS } from "@/lib/layers";

const WIDTH = 340;
const HEIGHT = 130;
const RIGHT = 24;
const TOP = 44 + 220 + 12;

export function useMusicWidgetVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("music-widget-visible");
      if (raw !== null) setVisible(raw === "1");
    } catch {
      /* noop */
    }
  }, []);
  const set = (v: boolean) => {
    setVisible(v);
    try {
      localStorage.setItem("music-widget-visible", v ? "1" : "0");
    } catch {
      /* noop */
    }
  };
  return { visible, set, toggle: () => set(!visible) };
}

export function MusicWidget({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { track, playing, progress, duration, hasAudio, artworks, toggle, next, prev } = useMusic();
  const { open } = useWindows();
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pct = duration ? (progress / duration) * 100 : 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const artwork = artworks[track.id];
  const x = Math.max(24, width - WIDTH - RIGHT);

  if (!visible) return null;

  const openWindow = () => open("music", { width: 720, height: 520 });

  return (
    <div
      style={{ left: x, top: TOP, width: WIDTH, zIndex: LAYERS.widget + 1 }}
      className="fixed rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl text-foreground overflow-hidden select-none"
    >
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={openWindow}
          className={cn(
            "group relative w-14 h-14 rounded-lg bg-linear-to-br shadow-md flex items-center justify-center overflow-hidden shrink-0",
            track.color,
          )}
          aria-label="Open Music"
        >
          {artwork ? (
            <img src={artwork} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <MusicIcon className="w-6 h-6 text-white/80 drop-shadow" />
          )}
          {playing && (
            <div className="absolute inset-0 flex items-end gap-0.5 p-1.5 bg-black/20">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="flex-1 bg-white/80 rounded-sm"
                  style={{ animation: `eq 0.8s ease-in-out ${i * 0.1}s infinite`, height: "30%" }}
                />
              ))}
            </div>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40 flex items-center justify-center">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </button>
        <button type="button" onClick={openWindow} className="flex-1 min-w-0 text-left">
          <div className="text-[13px] font-semibold truncate leading-tight hover:underline">
            {track.title}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">{track.artist}</div>
          <div className="mt-1.5 h-0.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500 transition-[width]" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] mt-0.5 text-muted-foreground tabular-nums">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </button>
        <button
          onClick={onClose}
          className="absolute top-1.5 right-1.5 p-0.5 rounded-full text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Hide music player"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 pb-3">
        <button
          onClick={prev}
          className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={toggle}
          disabled={!hasAudio}
          className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed"
          title={hasAudio ? "" : "Loading preview..."}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={next}
          className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
      <style>{`@keyframes eq { 0%,100% { height: 20%; } 50% { height: 85%; } }`}</style>
    </div>
  );
}
