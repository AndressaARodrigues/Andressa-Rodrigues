import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PICTURES } from "@/lib/filesystem";
import { useWindows } from "@/components/desktop/WindowManager";
import { LAYERS } from "@/lib/layers";

const WIDTH = 260;
const RIGHT = 24;

const TOP = 44 + 220 + 12 + 130 + 12;
const ROTATE_MS = 6000;

interface Pos {
  x: number;
  y: number;
}

function anchorTopRight(): Pos {
  const vw = document.documentElement.clientWidth;
  return { x: Math.max(RIGHT, vw - WIDTH - RIGHT), y: TOP };
}

export function PhotosWidget() {
  const { tl } = useI18n();
  const { open } = useWindows();

  const [pos, setPos] = useState<Pos | null>(null);
  const [index, setIndex] = useState(0);
  const dragged = useRef(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPos(anchorTopRight());
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (!dragged.current) setPos(anchorTopRight());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const i = window.setInterval(() => {
      if (!drag.current) setIndex((n) => (n + 1) % PICTURES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(i);
  }, []);

  if (!pos) return null;

  const pic = PICTURES[index];

  const openWindow = () =>
    open("imageviewer", { width: 900, height: 640, data: { pictureId: pic.id } });

  return (
    <div
      ref={containerRef}
      style={{ left: pos.x, top: pos.y, width: WIDTH, zIndex: LAYERS.widget }}
      className="fixed rounded-2xl bg-white/25 dark:bg-white/10 backdrop-blur-2xl border border-white/40 dark:border-white/15 shadow-2xl overflow-hidden select-none animate-scale-in"
    >
      <div
        className="cursor-grab active:cursor-grabbing"
        onDoubleClick={openWindow}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          const rect = containerRef.current?.getBoundingClientRect();
          drag.current = {
            dx: e.clientX - (rect?.left ?? pos.x),
            dy: e.clientY - (rect?.top ?? pos.y),
          };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          dragged.current = true;
          setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
        }}
        onPointerUp={(e) => {
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
          drag.current = null;
        }}
      >
        <div className="relative w-full aspect-4/3 bg-black/20">
          <img
            key={pic.id}
            src={pic.src}
            alt={tl(pic.caption)}
            className="absolute inset-0 w-full h-full object-cover animate-fade-in"
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-6 pb-2">
            <div className="text-white text-[12px] font-medium truncate drop-shadow">
              {tl(pic.caption)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 py-2">
          {PICTURES.map((p, i) => (
            <button
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Photo ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? "bg-pink-500" : "bg-black/20 dark:bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
