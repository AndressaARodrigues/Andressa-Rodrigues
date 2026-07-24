import { useState } from "react";
import { useWindows, type AppId } from "./WindowManager";
import {
  Terminal as TerminalIcon,
  Mail,
  Gamepad2,
  Trash2,
  Music,
  MessageCircle,
  FolderClosed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface DockApp {
  id: AppId | "trash" | "music-widget";
  label: string;
  icon: React.ReactNode;
  bg: string;
}

export function Dock({
  onToggleMusic,
  musicVisible,
}: {
  onToggleMusic: () => void;
  musicVisible: boolean;
}) {
  const { open, windows } = useWindows();
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);

  const apps: DockApp[] = [
    {
      id: "finder",
      label: t("finder"),
      icon: <FolderClosed />,
      bg: "from-pink-400 to-fuchsia-500",
    },
    {
      id: "terminal",
      label: t("terminal"),
      icon: <TerminalIcon />,
      bg: "from-neutral-800 to-black",
    },
    {
      id: "messages",
      label: t("messages"),
      icon: <MessageCircle />,
      bg: "from-green-400 to-emerald-600",
    },
    { id: "music-widget", label: t("music"), icon: <Music />, bg: "from-pink-400 to-fuchsia-600" },
    { id: "mail", label: t("mail"), icon: <Mail />, bg: "from-blue-400 to-indigo-600" },
    {
      id: "solitaire",
      label: t("solitaire"),
      icon: <Gamepad2 />,
      bg: "from-emerald-500 to-green-700",
    },
    { id: "trash", label: t("trash"), icon: <Trash2 />, bg: "from-neutral-300 to-neutral-500" },
  ];

  const running = new Set(windows.map((w) => w.appId));

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-999" style={{ overflow: "visible" }}>
      <div
        className="flex items-end gap-1.5 px-3 py-2 rounded-2xl bg-white/25 dark:bg-white/10 backdrop-blur-2xl border border-white/40 dark:border-white/15 shadow-2xl relative"
        onMouseLeave={() => setHover(null)}
        style={{ overflow: "visible" }}
      >
        {apps.map((app, i) => {
          const distance = hover === null ? 0 : Math.abs(hover - i);
          const scale =
            hover === null
              ? 1
              : distance === 0
                ? 1.5
                : distance === 1
                  ? 1.25
                  : distance === 2
                    ? 1.1
                    : 1;
          const isActive =
            app.id === "music-widget"
              ? musicVisible
              : app.id !== "trash" && running.has(app.id as AppId);
          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center"
              style={{ overflow: "visible" }}
            >
              <div
                className={cn(
                  "absolute -top-9 z-10000 px-2 py-1 rounded-md text-xs bg-black/80 text-white whitespace-nowrap transition-opacity pointer-events-none shadow-lg",
                  hover === i ? "opacity-100" : "opacity-0",
                )}
              >
                {app.label}
              </div>
              <button
                onMouseEnter={() => setHover(i)}
                onClick={() => {
                  if (app.id === "trash") return;
                  if (app.id === "music-widget") {
                    onToggleMusic();
                    return;
                  }
                  open(app.id as AppId);
                }}
                style={{
                  transform: `scale(${scale}) translateY(${(scale - 1) * -8}px)`,
                  transformOrigin: "bottom",
                }}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-linear-to-br transition-transform duration-150 ease-out",
                  app.bg,
                )}
              >
                <div className="w-6 h-6 flex items-center justify-center">{app.icon}</div>
              </button>
              {isActive && (
                <div className="w-1 h-1 mt-0.5 rounded-full bg-black/60 dark:bg-white/70" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
