import { useEffect, useState } from "react";
import { Apple } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function BootScreen({ onDone }: { onDone: () => void }) {
  const { resolved } = useTheme();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDone, 450);
  };

  return (
    <div
      onClick={finish}
      className={cn(
        "fixed inset-0 z-3000 flex flex-col items-center justify-center cursor-pointer transition-all duration-500",
        resolved === "dark" ? "bg-black text-white" : "bg-white text-neutral-900",
        leaving ? "opacity-0 scale-105" : "opacity-100 scale-100",
      )}
    >
      <Apple size={64} className="drop-shadow-sm mb-10" strokeWidth={1.2} />
      <div
        className={cn(
          "h-1 w-56 rounded-full overflow-hidden",
          resolved === "dark" ? "bg-white/15" : "bg-black/10",
        )}
      >
        <div
          className={cn(
            "h-full transition-[width] duration-100",
            resolved === "dark" ? "bg-white/90" : "bg-neutral-900/90",
          )}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="mt-6 text-xs opacity-50 tracking-wide">click anywhere to skip</div>
    </div>
  );
}
