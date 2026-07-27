import sun from "@/assets/weather/sun.png";
import sunCloudy from "@/assets/weather/sunCloudy.png";
import cloud from "@/assets/weather/cloudy.png";
import rain from "@/assets/weather/rain.png";
import storm from "@/assets/weather/storm.png";
import snow from "@/assets/weather/snow.png";
import wind from "@/assets/weather/wind.png";

const ICONS = {
  clear: sun,
  partlyCloudy: sunCloudy,
  cloudy: cloud,
  rain: rain,
  storm: storm,
  snow: snow,
  wind: wind,
} as const;

type IconKey = keyof typeof ICONS;

function resolveIcon(code: number): IconKey {
  if (code === 0) return "clear";
  if (code <= 2) return "partlyCloudy";
  if (code === 3) return "cloudy";
  if (code >= 45 && code <= 48) return "wind";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

export function WeatherIcon({
  code,
  isDay,
  className,
}: {
  code: number;
  isDay: boolean;
  className?: string;
}) {
  const c = className ?? "w-6 h-6";
  const key = resolveIcon(code);
  return <img src={ICONS[key]} alt="" className={`${c} object-contain`} draggable={false} />;
}
