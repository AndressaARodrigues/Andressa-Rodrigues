import { useEffect, useState } from "react";

export interface HourPoint {
  time: string;
  temp: number;
  code: number;
}
export interface DayPoint {
  date: string;
  code: number;
  high: number;
  low: number;
}

export interface WeatherData {
  temp: number;
  code: number;
  isDay: boolean;
  high: number;
  low: number;
  hourly: HourPoint[];
  daily: DayPoint[];
}

const LAT = -30.0331;
const LON = -51.23;
const REFRESH_MS = 15 * 60 * 1000;

let cache: WeatherData | null = null;
let inflight: Promise<void> | null = null;
const listeners = new Set<(d: WeatherData) => void>();

async function fetchWeather(): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,weather_code,is_day` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=7`;
  const r = await fetch(url);
  const j = (await r.json()) as {
    current: { temperature_2m: number; weather_code: number; is_day: number };
    hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
  };

  const nowIdx = Math.max(
    0,
    j.hourly.time.findIndex((t) => new Date(t).getTime() >= Date.now()),
  );
  const hourly = Array.from({ length: 24 }).map((_, i) => {
    const idx = Math.min(nowIdx + i, j.hourly.time.length - 1);
    return {
      time: j.hourly.time[idx],
      temp: j.hourly.temperature_2m[idx],
      code: j.hourly.weather_code[idx],
    };
  });

  const daily = j.daily.time.map((date, i) => ({
    date,
    code: j.daily.weather_code[i],
    high: j.daily.temperature_2m_max[i],
    low: j.daily.temperature_2m_min[i],
  }));

  return {
    temp: j.current.temperature_2m,
    code: j.current.weather_code,
    isDay: j.current.is_day === 1,
    high: j.daily.temperature_2m_max[0],
    low: j.daily.temperature_2m_min[0],
    hourly,
    daily,
  };
}

function notify(d: WeatherData) {
  cache = d;
  listeners.forEach((l) => l(d));
}

async function load() {
  if (inflight) return inflight;
  inflight = fetchWeather()
    .then(notify)
    .catch(() => {})
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Shared weather data — fetched once, reused by the widget and the full app. */
export function useWeather(): WeatherData | null {
  const [data, setData] = useState<WeatherData | null>(cache);

  useEffect(() => {
    listeners.add(setData);
    if (!cache) load();
    const i = window.setInterval(load, REFRESH_MS);
    return () => {
      listeners.delete(setData);
      window.clearInterval(i);
    };
  }, []);

  return data;
}

export type ConditionKey =
  | "condClear"
  | "condMostlyClear"
  | "condCloudy"
  | "condFog"
  | "condDrizzle"
  | "condRain"
  | "condSnow"
  | "condShowers"
  | "condThunderstorm";

export function conditionKey(code: number): ConditionKey {
  if (code === 0) return "condClear";
  if (code <= 2) return "condMostlyClear";
  if (code === 3) return "condCloudy";
  if (code === 45 || code === 48) return "condFog";
  if (code >= 51 && code <= 57) return "condDrizzle";
  if (code >= 61 && code <= 67) return "condRain";
  if (code >= 71 && code <= 77) return "condSnow";
  if (code >= 80 && code <= 82) return "condShowers";
  return "condThunderstorm";
}

export function conditionGradient(code: number, isDay: boolean): string {
  if (!isDay) return "from-[#1b2a4a] via-[#243b6b] to-[#0f1a33]";
  if (code === 0 || code <= 2) return "from-[#4aa3ff] via-[#6cb8ff] to-[#a8d4ff]";
  if (code === 3) return "from-[#6f88a8] via-[#8ea5c1] to-[#b6c6d8]";
  if (code >= 45 && code <= 48) return "from-[#8a9ba8] via-[#a4b3bf] to-[#c8d1d8]";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return "from-[#3d5a80] via-[#5a7ba8] to-[#8ba4c4]";
  if (code >= 71 && code <= 77) return "from-[#8fb4d8] via-[#c4d9ee] to-[#e6efff]";
  return "from-[#2a2a3d] via-[#4b4a6b] to-[#6a6790]";
}
