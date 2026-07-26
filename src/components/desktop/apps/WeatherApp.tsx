import { useI18n } from "@/lib/i18n";
import { useWeather, conditionKey, conditionGradient } from "@/lib/weather";
import { WeatherIcon } from "@/components/desktop/WeatherIcon";
import { dayLabel, hourLabel } from "@/lib/date";

export function WeatherApp() {
  const { t, lang } = useI18n();
  const data = useWeather();

  const gradient = data ? conditionGradient(data.code, data.isDay) : "from-[#4aa3ff] to-[#a8d4ff]";
  const hourly = data?.hourly ?? [];
  const daily = data?.daily ?? [];

  return (
    <div className="w-full h-full overflow-auto text-white">
      <div className={`bg-linear-to-b ${gradient} px-6 pt-8 pb-6`}>
        <div className="text-2xl font-semibold drop-shadow">{t("portoAlegre").split(",")[0]}</div>
        <div className="text-sm opacity-90">{t("brazil")}</div>
        <div className="flex items-center gap-3 mt-2">
          <div className="text-7xl font-thin tabular-nums leading-none drop-shadow">
            {data ? Math.round(data.temp) : "—"}°
          </div>
          {data && (
            <WeatherIcon code={data.code} isDay={data.isDay} className="w-12 h-12 drop-shadow" />
          )}
        </div>
        <div className="mt-1 text-[15px] opacity-95">
          {data ? t(conditionKey(data.code)) : t("loading")}
        </div>
        {data && (
          <div className="text-[13px] opacity-80 tabular-nums mt-1">
            {t("high")}:{Math.round(data.high)}° {t("low")}:{Math.round(data.low)}°
          </div>
        )}
      </div>

      <div className="bg-background text-foreground">
        {/* Previsão por hora */}
        <div className="px-5 pt-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {t("hourlyForecast")}
          </div>
          <div className="flex gap-4 overflow-x-auto  scrollbar-hide pb-3 -mx-1 px-1">
            {hourly.slice(0, 24).map((h, i) => (
              <div key={h.time} className="flex flex-col items-center gap-1 shrink-0 w-11">
                <div className="text-[11px] text-muted-foreground">
                  {hourLabel(h.time, i, t, lang)}
                </div>
                <WeatherIcon code={h.code} isDay className="w-5 h-5 text-foreground" />
                <div className="text-[13px] font-medium tabular-nums">{Math.round(h.temp)}°</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border mx-5" />

        {/* Previsão semanal */}
        <div className="px-5 py-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {t("dailyForecast")}
          </div>
          <div className="flex flex-col divide-y divide-border">
            {daily.map((d, i) => (
              <div key={d.date} className="flex items-center justify-between py-2.5 text-sm">
                <div className="w-16 font-medium">{dayLabel(d.date, i, t, lang)}</div>
                <WeatherIcon code={d.code} isDay className="w-5 h-5 text-foreground" />
                <div className="flex-1 flex items-center justify-end gap-3 tabular-nums text-muted-foreground">
                  <span>{Math.round(d.low)}°</span>
                  <span className="font-medium text-foreground">{Math.round(d.high)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
