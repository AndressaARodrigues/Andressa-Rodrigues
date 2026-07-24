import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { useWindows, type WindowState } from "./WindowManager";
import { cn } from "@/lib/utils";
import { LAYERS } from "@/lib/layers";

export function Window({ window: w, children }: { window: WindowState; children: ReactNode }) {
  const { focus, close, minimize, maximize, move } = useWindows();
  const dragging = useRef<{ dx: number; dy: number } | null>(null);
  const [closing, setClosing] = useState(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (w.maximized) return;
    dragging.current = { dx: e.clientX - w.x, dy: e.clientY - w.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const nx = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragging.current.dx));
    const ny = Math.max(28, Math.min(window.innerHeight - 60, e.clientY - dragging.current.dy));
    move(w.id, nx, ny);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => close(w.id), 180);
  };

  const style: React.CSSProperties = w.maximized
    ? { top: 28, left: 0, width: "100vw", height: "calc(100vh - 28px - 96px)", zIndex: Math.max(LAYERS.window, w.z) }
    : { top: w.y, left: w.x, width: w.width, height: w.height, zIndex: Math.max(LAYERS.window, w.z) };

  if (w.minimized) return null;

  return (
    <div
      className={cn(
        "fixed rounded-xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-card/95 backdrop-blur-xl flex flex-col transition-[transform,opacity] duration-200",
        w.opening && "scale-95 opacity-0",
        closing && "scale-95 opacity-0",
        !w.opening && !closing && "scale-100 opacity-100",
      )}
      style={style}
      onMouseDown={() => focus(w.id)}
    >
      <div
        className="h-8 flex items-center px-3 gap-2 bg-gradient-to-b from-white/90 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border-b border-black/10 dark:border-white/10 select-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => maximize(w.id)}
      >
        <div className="flex items-center gap-1.5 group">
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-95 flex items-center justify-center"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-black/60">×</span>
          </button>
          <button
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimize(w.id);
            }}
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-95 flex items-center justify-center"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-black/60">−</span>
          </button>
          <button
            aria-label="Maximize"
            onClick={(e) => {
              e.stopPropagation();
              maximize(w.id);
            }}
            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-95 flex items-center justify-center"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-black/60">+</span>
          </button>
        </div>
        <div className="flex-1 text-center text-xs font-medium text-neutral-700 dark:text-neutral-200 truncate">{w.title}</div>
        <div className="w-14" />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-background">{children}</div>
    </div>
  );
}

export function useEscapeClose(id: string) {
  const { active, close } = useWindows();
  useEffect(() => {
    if (active?.id !== id) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (e.metaKey || e.ctrlKey)) close(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, id, close]);
}

