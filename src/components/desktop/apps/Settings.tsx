import { useState } from "react";
import { useTheme, type ThemeMode } from "@/lib/theme";
import { useI18n, type Lang } from "@/lib/i18n";
import { useSounds } from "@/lib/sounds";
import { useWallpaper, WALLPAPERS } from "@/lib/wallpaper";
import { Palette, Languages, Volume2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Settings() {
  const [panel, setPanel] = useState<"appearance" | "wallpaper" | "language" | "sound">(
    "appearance",
  );
  const { t } = useI18n();
  return (
    <div className="w-full h-full flex">
      <aside className="w-48 border-r border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 p-2 text-sm">
        <Btn
          active={panel === "appearance"}
          onClick={() => setPanel("appearance")}
          icon={<Palette className="w-4 h-4" />}
          label={t("appearance")}
        />
        <Btn
          active={panel === "wallpaper"}
          onClick={() => setPanel("wallpaper")}
          icon={<ImageIcon className="w-4 h-4" />}
          label={t("wallpaper")}
        />
        <Btn
          active={panel === "language"}
          onClick={() => setPanel("language")}
          icon={<Languages className="w-4 h-4" />}
          label={t("language")}
        />
        <Btn
          active={panel === "sound"}
          onClick={() => setPanel("sound")}
          icon={<Volume2 className="w-4 h-4" />}
          label={t("sound")}
        />
      </aside>
      <div className="flex-1 p-6 overflow-auto">
        {panel === "appearance" ? (
          <AppearancePanel />
        ) : panel === "wallpaper" ? (
          <WallpaperPanel />
        ) : panel === "language" ? (
          <LanguagePanel />
        ) : (
          <SoundPanel />
        )}
      </div>
    </div>
  );
}

function WallpaperPanel() {
  const { id, setId } = useWallpaper();
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("wallpaper")}</h2>
      <div className="grid grid-cols-3 gap-3">
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            onClick={() => setId(w.id)}
            className={cn(
              "rounded-xl p-2 border-2 transition-all text-left",
              id === w.id
                ? "border-pink-400"
                : "border-transparent hover:border-black/10 dark:hover:border-white/10",
            )}
          >
            <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-linear-to-br from-[#ffd1dc] to-[#c48a8a]">
              {w.url && (
                <img
                  src={w.url}
                  alt={w.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="text-xs font-medium truncate">
              {w.id === "theme" ? t("themeColor") : w.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Btn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded",
        active ? "bg-blue-500 text-white" : "hover:bg-black/5 dark:hover:bg-white/5",
      )}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

function AppearancePanel() {
  const { mode, setMode } = useTheme();
  const { t } = useI18n();
  const opts: { v: ThemeMode; label: string }[] = [
    { v: "light", label: t("light") },
    { v: "dark", label: t("dark") },
    { v: "auto", label: t("auto") },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("appearance")}</h2>
      <div className="grid grid-cols-3 gap-3">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => setMode(o.v)}
            className={cn(
              "rounded-xl p-3 border-2 transition-all text-left",
              mode === o.v
                ? "border-pink-400"
                : "border-transparent hover:border-black/10 dark:hover:border-white/10",
            )}
          >
            <div
              className={cn(
                "w-full h-20 rounded-lg mb-2 flex items-center justify-center",
                o.v === "light" && "bg-neutral-100",
                o.v === "dark" && "bg-neutral-900",
                o.v === "auto" && "bg-linear-to-r from-neutral-100 to-neutral-900",
              )}
            >
              <div
                className={cn(
                  "w-12 h-8 rounded shadow border",
                  o.v === "dark" ? "bg-neutral-800 border-white/10" : "bg-white border-black/10",
                )}
              />
            </div>
            <div className="text-sm font-medium">{o.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LanguagePanel() {
  const { lang, setLang, t } = useI18n();
  const opts: { v: Lang; label: string }[] = [
    { v: "en", label: "English" },
    { v: "pt-BR", label: "Português (BR)" },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("language")}</h2>
      <div className="space-y-2 max-w-sm">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => setLang(o.v)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg border-2",
              lang === o.v
                ? "border-pink-400 bg-pink-50 dark:bg-pink-500/10"
                : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <span>{o.label}</span>
            {lang === o.v && <span className="text-pink-500">●</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function SoundPanel() {
  const { t } = useI18n();
  const { muted, setMuted, play } = useSounds();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("sound")}</h2>
      <div className="max-w-md space-y-4">
        <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-black/10 dark:border-white/10">
          <div>
            <div className="font-medium">{t("systemSounds")}</div>
            <div className="text-sm opacity-70 mt-1">{t("systemSoundsDesc")}</div>
          </div>
          <button
            onClick={() => {
              const next = !muted;
              setMuted(next);
              if (!next) setTimeout(() => play("pop"), 50);
            }}
            className={cn(
              "shrink-0 relative w-12 h-7 rounded-full transition-colors",
              muted ? "bg-neutral-400/40" : "bg-pink-400",
            )}
            aria-label={muted ? t("unmute") : t("mute")}
          >
            <span
              className={cn(
                "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all",
                muted ? "left-0.5" : "left-5.5",
              )}
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => play("whoosh")}
            className="px-3 py-2 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
          >
            Whoosh
          </button>
          <button
            onClick={() => play("click")}
            className="px-3 py-2 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
          >
            Click
          </button>
          <button
            onClick={() => play("pop")}
            className="px-3 py-2 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
          >
            Pop
          </button>
          <button
            onClick={() => play("crumple")}
            className="px-3 py-2 rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
          >
            Crumple
          </button>
        </div>
      </div>
    </div>
  );
}
