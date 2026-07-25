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
