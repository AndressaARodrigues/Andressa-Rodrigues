import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useWeather, conditionKey, conditionGradient } from "@/lib/weather";
import { WeatherIcon } from "@/components/desktop/WeatherIcon";
import { useWindows } from "@/components/desktop/WindowManager";
import { LAYERS } from "@/lib/layers";
import { hourLabel } from "@/lib/date";

const WIDTH = 340;
const RIGHT = 24;
const TOP = 44;

interface Pos {
  x: number;
  y: number;
}

function anchorTopRight(): Pos {
  const vw = document.documentElement.clientWidth;
  return { x: Math.max(RIGHT, vw - WIDTH - RIGHT), y: TOP };
}

export function WeatherWidget() {
  const { t, lang } = useI18n();
  const data = useWeather();
  const { open } = useWindows();

  const [pos, setPos] = useState<Pos | null>(null);
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

  if (!pos) return null;

  const gradient = data ? conditionGradient(data.code, data.isDay) : "from-[#4aa3ff] to-[#a8d4ff]";
  const hourly = data?.hourly ?? [];

  return (
    <div
      ref={containerRef}
      style={{ left: pos.x, top: pos.y, zIndex: LAYERS.widget, width: WIDTH }}
      className={`fixed rounded-2xl bg-linear-to-b ${gradient} border border-white/30 shadow-2xl p-4 text-white select-none overflow-hidden animate-scale-in`}
    >
      <div
        className="cursor-grab active:cursor-grabbing"
        onDoubleClick={() => open("weather")}
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
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <div className="text-lg font-semibold leading-tight drop-shadow">
              {t("portoAlegre").split(",")[0]}
            </div>
            <div className="text-5xl font-thin tabular-nums leading-none drop-shadow mt-1">
              {data ? Math.round(data.temp) : "—"}°
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end gap-1">
            <div>
              {data && (
                <WeatherIcon code={data.code} isDay={data.isDay} className="w-9 h-9 drop-shadow" />
              )}
            </div>
            <div className="mt-1 text-sm opacity-95">
              {data ? t(conditionKey(data.code)) : t("loading")}
            </div>
          </div>
        </div>

        {data && (
          <div className="mt-3 pt-2.5 flex justify-between">
            {hourly.slice(0, 6).map((h, i) => {
              return (
                <div key={h.time} className="flex flex-col items-center gap-1 text-[10px]">
                  <div className="opacity-90">{hourLabel(h.time, i, t, lang)}</div>
                  <WeatherIcon code={h.code} isDay className="w-4 h-4" />
                  <div className="tabular-nums font-medium text-[12px]">{Math.round(h.temp)}°</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
