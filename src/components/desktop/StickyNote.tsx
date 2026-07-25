import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSounds } from "@/lib/sounds";
import { LAYERS } from "@/lib/layers";

const WIDTH = 256;
const HEIGHT = 170;
const TOP = 44;

export function StickyNote({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { play } = useSounds();
  const [pos, setPos] = useState<{ x: number; y: number }>(() => ({
    x: Math.max(
      24,
      Math.round(((typeof window !== "undefined" ? window.innerWidth : 1200) - WIDTH) / 2),
    ),
    y: TOP,
  }));
  const dragRef = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const posRef = useRef(pos);
  posRef.current = pos;

  useEffect(() => {
    const centerX = Math.max(
      24,
      Math.round(((typeof window !== "undefined" ? window.innerWidth : 1200) - WIDTH) / 2),
    );
    setPos({ x: centerX, y: TOP });
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const nx = e.clientX - dragRef.current.dx;
      const ny = e.clientY - dragRef.current.dy;
      if (Math.abs(nx - posRef.current.x) > 2 || Math.abs(ny - posRef.current.y) > 2)
        dragRef.current.moved = true;
      setPos({ x: nx, y: ny });
    };
    const onUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div
      className="fixed select-none shadow-2xl animate-scale-in"
      style={{
        left: pos.x,
        top: pos.y,
        width: WIDTH,
        zIndex: LAYERS.widget + 3,
        transform: "rotate(-3deg)",
      }}
    >
      <div
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, moved: false };
        }}
        className="cursor-grab active:cursor-grabbing bg-linear-to-br from-[#fff2a8] to-[#ffe27a] text-neutral-800 p-4 pt-3 rounded-sm relative"
        style={{
          fontFamily: "'Caveat', 'Segoe Script', cursive",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              play("crumple");
              onClose();
            }}
            aria-label="Close sticky note"
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 border border-red-700/40 flex items-center justify-center text-[8px] text-red-900/0 hover:text-red-900"
          >
            ×
          </button>
          <div className="h-2 w-14 rounded-sm bg-black/5" />
        </div>
        <div className="text-[15px] leading-snug whitespace-pre-wrap">{t("stickyWelcome")}</div>
      </div>
    </div>
  );
}
