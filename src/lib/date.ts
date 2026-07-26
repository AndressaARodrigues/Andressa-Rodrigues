export function formatEmailDate(isoDate: string, lang: "en" | "pt-BR"): string {
  const date = new Date(isoDate + "T00:00:00");
  const currentYear = new Date().getFullYear();
  const isSameYear = date.getFullYear() === currentYear;

  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    year: isSameYear ? undefined : "numeric",
  }).format(date);
}

export function dayLabel(
  dateStr: string,
  index: number,
  t: (key: "today") => string,
  lang: "en" | "pt-BR",
): string {
  if (index === 0) return t("today");
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat(lang, { weekday: "short" }).format(d);
}

export function hourLabel(
  timeStr: string,
  index: number,
  t: (key: "now") => string,
  lang: "en" | "pt-BR",
): string {
  if (index === 0) return t("now");
  const d = new Date(timeStr);
  return new Intl.DateTimeFormat(lang, { hour: "numeric" }).format(d);
}
