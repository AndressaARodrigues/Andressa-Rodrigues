import { useEffect, useRef } from "react";
import { Cat } from "lucide-react";
import { useCatMode } from "@/lib/cat";
import { cn } from "@/lib/utils";

export function CatChase() {
  const { enabled } = useCatMode();
  const yarnRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const yarnPos = useRef({ x: 0, y: 0 });
  const catPos = useRef({ x: 0, y: 0 });
  const prevCat = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle("cat-mode", enabled);
    if (!enabled) {
      document.body.classList.remove("cat-mode");
      return;
    }

    const startX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    const startY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
    targetRef.current = { x: startX, y: startY };
    yarnPos.current = { x: startX, y: startY };
    catPos.current = { x: startX - 80, y: startY + 24 };
    prevCat.current = { ...catPos.current };

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const step = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;

      yarnPos.current.x += (tx - yarnPos.current.x) * 0.42;
      yarnPos.current.y += (ty - yarnPos.current.y) * 0.42;

      const catTargetX = yarnPos.current.x - 72;
      const catTargetY = yarnPos.current.y + 20;
      catPos.current.x += (catTargetX - catPos.current.x) * 0.16;
      catPos.current.y += (catTargetY - catPos.current.y) * 0.16;

      const vx = catPos.current.x - prevCat.current.x;
      const vy = catPos.current.y - prevCat.current.y;
      const tilt = Math.max(-12, Math.min(12, vx * 0.35));
      const squash = Math.min(1.08, 1 + Math.abs(vy) * 0.002);

      if (yarnRef.current) {
        yarnRef.current.style.transform = `translate3d(${yarnPos.current.x}px, ${yarnPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (catRef.current) {
        catRef.current.style.transform = `translate3d(${catPos.current.x}px, ${catPos.current.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg) scale(${squash})`;
      }
      prevCat.current = { ...catPos.current };
      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("cat-mode");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[950]">
      <div
        ref={yarnRef}
        className="absolute left-0 top-0 h-5 w-5 rounded-full bg-gradient-to-br from-rose-200 to-pink-500 shadow-[0_0_18px_rgba(236,72,153,0.35)]"
      >
        <div className="absolute inset-1 rounded-full border border-white/70" />
        <div className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-full bg-gradient-to-b from-pink-300/0 via-pink-300/60 to-pink-100/0" />
      </div>
      <div
        ref={catRef}
        className={cn(
          "absolute left-0 top-0 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-neutral-900 shadow-[0_12px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm",
        )}
      >
        <Cat className="h-5 w-5 text-neutral-800" />
        <div className="text-xs font-medium tracking-wide">pspsps</div>
      </div>
    </div>
  );
}

