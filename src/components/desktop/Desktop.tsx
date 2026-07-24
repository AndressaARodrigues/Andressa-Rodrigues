import { useEffect, useState } from "react";
import { WindowProvider, useWindows } from "@/components/desktop/WindowManager";
import { MenuBar } from "@/components/desktop/MenuBar";
import { Dock } from "@/components/desktop/Dock";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { Window } from "@/components/desktop/Window";
import { Finder } from "@/components/desktop/apps/Finder";
import { Terminal } from "@/components/desktop/apps/Terminal";
import { MailApp } from "@/components/desktop/apps/Mail";
import { PdfViewer } from "@/components/desktop/apps/PdfViewer";
import { Solitaire } from "@/components/desktop/apps/Solitaire";
import { Readme } from "@/components/desktop/apps/Readme";
import { MusicPlayer } from "@/components/desktop/apps/MusicPlayer";
import { Messages } from "@/components/desktop/apps/Messages";
import { Settings } from "@/components/desktop/apps/Settings";
import { ImageViewer } from "@/components/desktop/apps/ImageViewer";
import { WeatherWidget } from "@/components/desktop/WeatherWidget";
import { MusicWidget, useMusicWidgetVisible } from "@/components/desktop/MusicWidget";
import { BootScreen } from "@/components/desktop/BootScreen";
import { StickyNote } from "@/components/desktop/StickyNote";
import { Spotlight } from "@/components/desktop/Spotlight";
import { CatChase } from "@/components/desktop/CatChase";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { MusicProvider, useMusic } from "@/lib/music";
import { SoundsProvider, useSounds, registerExternalPlayer } from "@/lib/sounds";
import { WallpaperProvider, useWallpaper } from "@/lib/wallpaper";
import { CatModeProvider } from "@/lib/cat";
import { LAYERS } from "@/lib/layers";
import { cn } from "@/lib/utils";

export function Desktop() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <WallpaperProvider>
          <SoundsProvider>
            <CatModeProvider>
              <MusicProvider>
                <WindowProvider>
                  <DesktopInner />
                </WindowProvider>
              </MusicProvider>
            </CatModeProvider>
          </SoundsProvider>
        </WallpaperProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

function DesktopInner() {
  const musicWidget = useMusicWidgetVisible();
  const { pause } = useMusic();
  const { play } = useSounds();
  const [booted, setBooted] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [welcomeKey, setWelcomeKey] = useState(0);

  useEffect(() => {
    registerExternalPlayer(play);
    return () => registerExternalPlayer(null);
  }, [play]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        setSpotlight((s) => {
          if (!s) play("pop");
          return !s;
        });
      } else if (e.key === "Escape" && spotlight) {
        setSpotlight(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [play, spotlight]);

  const reopenWelcome = () => {
    setWelcomeOpen(true);
    setWelcomeKey((k) => k + 1);
    play("pop");
  };

  const closeWelcome = () => {
    setWelcomeOpen(false);
    play("crumple");
  };

  return (
    <div className="fixed inset-0 overflow-hidden text-foreground select-none transition-colors duration-500">
      <Wallpaper />
      <MenuBar
        onOpenSpotlight={() => {
          play("pop");
          setSpotlight(true);
        }}
        welcomeNoteOpen={welcomeOpen}
        onToggleWelcomeNote={() => (welcomeOpen ? closeWelcome() : reopenWelcome())}
      />
      <WeatherWidget />
      <MusicWidget
        visible={musicWidget.visible}
        onClose={() => {
          pause();
          musicWidget.set(false);
        }}
      />
      <DesktopIcons />
      {booted && welcomeOpen && <StickyNote key={welcomeKey} onClose={closeWelcome} />}
      <CatChase />
      <WindowsLayer />
      <Dock onToggleMusic={musicWidget.toggle} musicVisible={musicWidget.visible} />
      <Spotlight open={spotlight} onClose={() => setSpotlight(false)} />
      <KonamiListener />
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
    </div>
  );
}

function Wallpaper() {
  const { resolved } = useTheme();
  const { current } = useWallpaper();
  const isImage = !!current.url;
  return (
    <div className="absolute inset-0" style={{ zIndex: LAYERS.wallpaper }}>
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          !isImage && resolved === "dark" ? "opacity-0" : !isImage ? "opacity-100" : "opacity-0",
          "bg-gradient-to-br from-[#ffd1dc] via-[#f4a7bc] to-[#c48a8a]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          !isImage && resolved === "dark" ? "opacity-100" : "opacity-0",
          "bg-gradient-to-br from-[#1c1b2e] via-[#3b2b4a] to-[#5a2a3a]",
        )}
      />
      {isImage && (
        <div
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
          style={{ backgroundImage: `url(${current.url})` }}
        />
      )}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(1200px 800px at 20% 20%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(900px 600px at 80% 90%, rgba(0,0,0,0.35), transparent 60%)",
        }}
      />
    </div>
  );
}

function WindowsLayer() {
  const { windows } = useWindows();
  return (
    <>
      {windows.map((w) => (
        <Window key={w.id} window={w}>
          {renderApp(w.appId, w)}
        </Window>
      ))}
    </>
  );
}

function renderApp(appId: string, w: import("@/components/desktop/WindowManager").WindowState) {
  switch (appId) {
    case "finder":
      return <Finder window={w} />;
    case "terminal":
      return <Terminal window={w} />;
    case "mail":
      return <MailApp />;
    case "pdf":
      return <PdfViewer />;
    case "solitaire":
      return <Solitaire />;
    case "readme":
      return <Readme window={w} />;
    case "music":
      return <MusicPlayer />;
    case "messages":
      return <Messages />;
    case "settings":
      return <Settings />;
    case "imageviewer":
      return <ImageViewer window={w} />;
    default:
      return null;
  }
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function KonamiListener() {
  const { open } = useWindows();
  const [party, setParty] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const keyBuffer = (window as Window & { __konamiBuffer?: string[] }).__konamiBuffer ?? [];
      const next = [...keyBuffer, k].slice(-KONAMI.length);
      (window as Window & { __konamiBuffer?: string[] }).__konamiBuffer = next;
      if (next.length === KONAMI.length && next.every((v, i) => v === KONAMI[i])) {
        setParty(true);
        window.setTimeout(() => setParty(false), 4000);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        open("terminal");
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        open("finder");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 transition-opacity duration-500", party ? "opacity-100" : "opacity-0")}
      style={{ zIndex: LAYERS.overlay }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 via-yellow-400/30 to-cyan-400/40 animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl font-black text-white drop-shadow-2xl tracking-widest">★ CHEAT MODE ★</div>
      </div>
    </div>
  );
}

