import { useEffect } from "react";
import { useMusic, TRACKS } from "@/lib/music";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function MusicPlayer() {
  const { track, index, playing, progress, toggle, next, prev, select, artworks, pause } = useMusic();
  const { t } = useI18n();

  useEffect(() => pause, [pause]);

  const pct = track.duration ? (progress / track.duration) * 100 : 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const heroArt = artworks[track.id];

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 text-foreground">
      <div className="p-5 flex gap-4 items-center border-b border-black/10 dark:border-white/10">
        <div className={cn("w-24 h-24 rounded-xl bg-gradient-to-br shadow-lg relative overflow-hidden", track.color)}>
          {heroArt && <img src={heroArt} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 flex items-end gap-0.5 p-1.5">
            {playing &&
              [0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="flex-1 bg-white/70 rounded-sm"
                  style={{ animation: `eq 0.8s ease-in-out ${i * 0.1}s infinite`, height: "30%" }}
                />
              ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-semibold truncate">{track.title}</div>
          <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
          <div className="mt-3">
            <div className="h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-pink-400 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[11px] mt-1 text-muted-foreground tabular-nums">
              <span>{fmt(progress)}</span>
              <span>{fmt(track.duration)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={prev} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={toggle} className="p-2 rounded-full bg-pink-400 text-white hover:bg-pink-500">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={next} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground">{t("playlist")}</div>
        {TRACKS.map((tr, i) => {
          const art = artworks[tr.id];
          return (
            <button
              key={tr.id}
              onClick={() => select(i)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5",
                i === index && "bg-pink-100 dark:bg-pink-500/20",
              )}
            >
              <div className={cn("w-10 h-10 rounded bg-gradient-to-br overflow-hidden relative shrink-0", tr.color)}>
                {art && <img src={art} alt="" className="absolute inset-0 w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{tr.title}</div>
                <div className="text-xs text-muted-foreground truncate">{tr.artist}</div>
              </div>
              <div className="text-xs tabular-nums text-muted-foreground">{fmt(tr.duration)}</div>
            </button>
          );
        })}
      </div>
      <style>{`@keyframes eq { 0%,100% { height: 20%; } 50% { height: 85%; } }`}</style>
    </div>
  );
}

