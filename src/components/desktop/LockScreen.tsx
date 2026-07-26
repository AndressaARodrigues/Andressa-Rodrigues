import { useEffect, useState } from "react";
import { useIdleLock } from "@/lib/idleLock";
import { useI18n } from "@/lib/i18n";
import { useWallpaper } from "@/lib/wallpaper";
import { useTheme } from "@/lib/theme";
import { LAYERS } from "@/lib/layers";
import { cn } from "@/lib/utils";

const UNLOCK_ANIM_MS = 500;
const ROUNDED_FONT = "'Nunito', system-ui, sans-serif";

export function LockScreen() {
  const { locked, unlock } = useIdleLock();
  const { t, lang } = useI18n();
  const { current } = useWallpaper();
  const { resolved } = useTheme();
  const [now, setNow] = useState(() => new Date());
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (!locked) return;
    const i = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(i);
  }, [locked]);

  useEffect(() => {
    if (locked) setDismissing(false);
  }, [locked]);

  if (!locked) return null;

  const handleDismiss = () => {
    if (dismissing) return;
    setDismissing(true);
    window.setTimeout(unlock, UNLOCK_ANIM_MS);
  };

  const time = new Intl.DateTimeFormat(lang, { hour: "numeric", minute: "2-digit" }).format(now);
  const date = new Intl.DateTimeFormat(lang, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(now);

  const glassTextStyle: React.CSSProperties = {
    fontFamily: ROUNDED_FONT,
    color: "transparent",
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    // backdropFilter: "blur(14px) saturate(160%)",
    WebkitBackdropFilter: "blur(14px) saturate(160%)",
  };

  return (
    <div
      className={cn(
        "fixed inset-0 overflow-hidden cursor-pointer select-none transition-transform duration-500 ease-in",
        dismissing ? "-translate-y-full" : "translate-y-0",
      )}
      style={{ zIndex: LAYERS.overlay + 10 }}
      onClick={handleDismiss}
      onKeyDown={handleDismiss}
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0">
        {current.url ? (
          <img src={current.url} alt="" className="w-full h-full object-cover scale-110 blur-xl" />
        ) : (
          <div
            className={cn(
              "w-full h-full scale-110 blur-xl bg-linear-to-br",
              resolved === "dark"
                ? "from-[#1c1b2e] via-[#3b2b4a] to-[#5a2a3a]"
                : "from-[#ffd1dc] via-[#e490a6] to-[#bb7272]",
            )}
          />
        )}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="absolute top-[12%] inset-x-0 flex flex-col items-center px-4">
        <div className="text-lg font-semibold capitalize" style={glassTextStyle}>
          {date}
        </div>
        <div
          className="text-8xl font-extrabold tabular-nums leading-none mt-1"
          style={glassTextStyle}
        >
          {time}
        </div>
      </div>

      <div
        className="absolute bottom-[20%] inset-x-0 flex flex-col items-center gap-2"
        style={{ fontFamily: ROUNDED_FONT }}
      >
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-300 to-fuchsia-500 flex items-center justify-center text-white text-xl font-bold shadow-xl ring-2 ring-white/40">
          A
        </div>
        <div className="text-white text-sm font-semibold drop-shadow">Andressa</div>
        <div className="text-white/70 text-xs font-medium">{t("clickToUnlock")}</div>
      </div>
    </div>
  );
}
