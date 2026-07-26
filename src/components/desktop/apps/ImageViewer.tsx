import { useEffect, useState } from "react";
import { PICTURES } from "@/lib/filesystem";
import type { WindowState } from "../WindowManager";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageViewer({ window: w }: { window: WindowState }) {
  const startId = (w.data?.pictureId as string | undefined) ?? PICTURES[0].id;
  const startIdx = Math.max(
    0,
    PICTURES.findIndex((p) => p.id === startId),
  );
  const [i, setI] = useState(startIdx);
  const pic = PICTURES[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + PICTURES.length) % PICTURES.length);
      if (e.key === "ArrowRight") setI((x) => (x + 1) % PICTURES.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white">
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <img
          key={pic.id}
          src={pic.src}
          alt={pic.caption.en}
          className="max-w-full max-h-full object-contain animate-fade-in"
        />
        <button
          onClick={() => setI((x) => (x - 1 + PICTURES.length) % PICTURES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setI((x) => (x + 1) % PICTURES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="px-4 py-3 text-center text-sm bg-black/60">
        <div>{pic.caption.en}</div>
        <div className="text-[11px] opacity-60 mt-0.5">
          {i + 1} / {PICTURES.length}
        </div>
      </div>
    </div>
  );
}
