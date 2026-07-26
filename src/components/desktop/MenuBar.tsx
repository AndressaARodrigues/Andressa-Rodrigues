import { useEffect, useRef, useState } from "react";
import { useWindows } from "./WindowManager";
import { Apple, Wifi, Battery, Search, Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useSounds } from "@/lib/sounds";
import { LAYERS } from "@/lib/layers";

export function MenuBar({
  onOpenSpotlight,
  welcomeNoteOpen,
  onToggleWelcomeNote,
}: {
  onOpenSpotlight: () => void;
  welcomeNoteOpen: boolean;
  onToggleWelcomeNote: () => void;
}) {
  const { active, open } = useWindows();
  const { resolved, setMode } = useTheme();
  const { t } = useI18n();
  const { muted, setMuted } = useSounds();
  const [time, setTime] = useState(() => new Date());
  const [appleOpen, setAppleOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setAppleOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const APP_LABEL: Record<string, string> = {
    finder: t("portfolioName"),
    terminal: t("terminal"),
    mail: t("mail"),
    pdf: t("preview"),
    solitaire: t("solitaire"),
    readme: t("aboutMe"),
    music: t("music"),
    messages: t("messages"),
    settings: t("settings"),
    imageviewer: t("adventures"),
  };
  const activeName = active ? (APP_LABEL[active.appId] ?? t("portfolioName")) : t("portfolioName");
  const timeStr = time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div
      className="fixed top-0 inset-x-0 h-7 text-black dark:text-white text-[13px] flex items-center px-3 gap-4 select-none border-b border-white/40 dark:border-white/15 bg-white/25 dark:bg-white/10 backdrop-blur-2xl shadow-2xl"
      style={{ zIndex: LAYERS.overlay }}
    >
      <div className="flex items-center gap-4" ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => setAppleOpen((o) => !o)}
            className="flex items-center opacity-95 hover:opacity-100"
            aria-label="Apple menu"
          >
            <Apple size={15} className="drop-shadow" />
          </button>
          {appleOpen && (
            <div className="absolute left-0 top-6 min-w-60 rounded-md bg-white/90 dark:bg-neutral-800/95 backdrop-blur-xl text-neutral-900 dark:text-neutral-100 text-[13px] shadow-2xl border border-black/10 dark:border-white/10 py-1">
              <div className="px-3 py-1.5 opacity-60 cursor-default">{t("aboutThisPortfolio")}</div>
              <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
              <button
                className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  setAppleOpen(false);
                  onToggleWelcomeNote();
                }}
              >
                {welcomeNoteOpen ? t("hideWelcomeNote") : t("showWelcomeNote")}
              </button>
              <button
                className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  setAppleOpen(false);
                  open("readme");
                }}
              >
                {t("aboutMe")}
              </button>
              <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
              <button
                className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  setAppleOpen(false);
                  open("settings");
                }}
              >
                {t("settings")}...
              </button>
              <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
              <div className="px-3 py-1.5 opacity-60 cursor-default">{t("sleep")}</div>
              <div className="px-3 py-1.5 opacity-60 cursor-default">{t("restart")}</div>
              <div className="px-3 py-1.5 opacity-60 cursor-default">{t("shutDown")}</div>
            </div>
          )}
        </div>
        <span className="font-semibold">{activeName}</span>
        <span className="hidden sm:inline opacity-80">File</span>
        <span className="hidden sm:inline opacity-80">Edit</span>
        <span className="hidden sm:inline opacity-80">View</span>
        <span className="hidden sm:inline opacity-80">Window</span>
        <span className="hidden sm:inline opacity-80">Help</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3 opacity-90">
        <button
          onClick={() => setMode(resolved === "dark" ? "light" : "dark")}
          className="opacity-90 hover:opacity-100"
          aria-label="Toggle theme"
        >
          {resolved === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button
          onClick={() => setMuted(!muted)}
          className="opacity-90 hover:opacity-100"
          aria-label={muted ? t("unmute") : t("mute")}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <Battery size={16} />
        <Wifi size={14} />
        <button
          onClick={onOpenSpotlight}
          aria-label="Spotlight Search"
          className="opacity-90 hover:opacity-100"
        >
          <Search size={13} />
        </button>
        <span className="tabular-nums">{dateStr}</span>
        <span className="tabular-nums">{timeStr}</span>
      </div>
    </div>
  );
}
