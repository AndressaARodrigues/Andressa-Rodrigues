import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Cloud, Sun, CloudRain, CloudSnow, CloudFog, CloudLightning, Moon } from "lucide-react";
import { LAYERS } from "@/lib/layers";

const WIDTH = 224;
const HEIGHT = 220;
const RIGHT = 24;
const TOP = 44;

interface WeatherData {
  temp: number;
  code: number;
  high: number;
  low: number;
  isDay: boolean;
  hourly: { time: string; temp: number; code: number }[];
}

function conditionLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Mostly Clear";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "—";
}

function conditionGradient(code: number, isDay: boolean): string {
  if (!isDay) return "from-[#1b2a4a] via-[#243b6b] to-[#0f1a33]";
  if (code === 0 || code <= 2) return "from-[#4aa3ff] via-[#6cb8ff] to-[#a8d4ff]";
  if (code === 3) return "from-[#6f88a8] via-[#8ea5c1] to-[#b6c6d8]";
  if (code >= 45 && code <= 48) return "from-[#8a9ba8] via-[#a4b3bf] to-[#c8d1d8]";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return "from-[#3d5a80] via-[#5a7ba8] to-[#8ba4c4]";
  if (code >= 71 && code <= 77) return "from-[#8fb4d8] via-[#c4d9ee] to-[#e6efff]";
  if (code >= 95) return "from-[#2a2a3d] via-[#4b4a6b] to-[#6a6790]";
  return "from-[#4aa3ff] to-[#a8d4ff]";
}

function CondIcon({
  code,
  isDay,
  className,
}: {
  code: number;
  isDay: boolean;
  className?: string;
}) {
  const c = className ?? "w-6 h-6";
  if (!isDay && (code === 0 || code <= 2)) return <Moon className={`${c} text-white`} />;
  if (code === 0 || code <= 2) return <Sun className={`${c} text-yellow-200`} />;
  if (code === 3) return <Cloud className={`${c} text-white`} />;
  if (code >= 45 && code <= 48) return <CloudFog className={`${c} text-white`} />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return <CloudRain className={`${c} text-white`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`${c} text-white`} />;
  if (code >= 95) return <CloudLightning className={`${c} text-white`} />;
  return <Cloud className={`${c} text-white`} />;
}

export function WeatherWidget() {
  const { t } = useI18n();
  const [data, setData] = useState<WeatherData | null>(null);
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=-30.0331&longitude=-51.2300&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1";
        const r = await fetch(url);
        const j = (await r.json()) as {
          current: { temperature_2m: number; weather_code: number; is_day: number };
          hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] };
          daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
        };
        const nowIdx = Math.max(
          0,
          j.hourly.time.findIndex((t) => new Date(t).getTime() >= Date.now()),
        );
        const hourly = Array.from({ length: 8 }).map((_, i) => {
          const idx = Math.min(nowIdx + i, j.hourly.time.length - 1);
          return {
            time: j.hourly.time[idx],
            temp: j.hourly.temperature_2m[idx],
            code: j.hourly.weather_code[idx],
          };
        });
        setData({
          temp: j.current.temperature_2m,
          code: j.current.weather_code,
          isDay: j.current.is_day === 1,
          high: j.daily.temperature_2m_max[0],
          low: j.daily.temperature_2m_min[0],
          hourly,
        });
      } catch {
        /* noop */
      }
    };
    load();
    const i = window.setInterval(load, 15 * 60 * 1000);
    return () => window.clearInterval(i);
  }, []);

  const gradient = data ? conditionGradient(data.code, data.isDay) : "from-[#4aa3ff] to-[#a8d4ff]";
  const x = Math.max(24, width - WIDTH - RIGHT);

  return (
    <div
      style={{ left: x, top: TOP, zIndex: LAYERS.widget, width: WIDTH }}
      className={`fixed rounded-2xl bg-linear-to-b ${gradient} border border-white/30 shadow-2xl p-3.5 text-white select-none overflow-hidden`}
    >
      <div>
        <div className="text-[13px] font-semibold leading-tight drop-shadow">
          {t("portoAlegre").split(",")[0]}
        </div>
        <div className="text-[10px] opacity-80 uppercase tracking-wider">{t("weather")}</div>
        <div className="mt-1 flex items-start justify-between">
          <div className="text-5xl font-thin tabular-nums leading-none drop-shadow">
            {data ? Math.round(data.temp) : "—"}°
          </div>
          {data && <CondIcon code={data.code} isDay={data.isDay} className="w-8 h-8 drop-shadow" />}
        </div>
        <div className="mt-1 text-[11px] opacity-95">
          {data ? conditionLabel(data.code) : "Loading..."}
        </div>
        {data && (
          <div className="text-[11px] opacity-80 tabular-nums">
            H:{Math.round(data.high)}° L:{Math.round(data.low)}°
          </div>
        )}
      </div>
      {data && (
        <div className="mt-3 pt-2 border-t border-white/25 flex justify-between">
          {data.hourly.map((h, i) => {
            const d = new Date(h.time);
            const label = i === 0 ? "Now" : d.getHours().toString();
            return (
              <div key={h.time} className="flex flex-col items-center gap-0.5 text-[10px]">
                <div className="opacity-90">{label}</div>
                <CondIcon code={h.code} isDay className="w-3.5 h-3.5" />
                <div className="tabular-nums font-medium">{Math.round(h.temp)}°</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
