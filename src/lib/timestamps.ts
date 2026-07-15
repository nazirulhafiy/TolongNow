export function isStale(timestamp?: string, maxAgeMinutes = 60, now = new Date()): boolean {
  if (!timestamp) return true;
  const parsed = parseMalaysiaTimestamp(timestamp);
  if (Number.isNaN(parsed.getTime())) return true;
  return now.getTime() - parsed.getTime() > maxAgeMinutes * 60_000;
}

export function formatTimestamp(value?: string, locale = "en-MY"): string {
  if (!value) return "Timestamp unavailable";
  const parsed = parseMalaysiaTimestamp(value);
  if (Number.isNaN(parsed.getTime())) return "Timestamp unavailable";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kuching" }).format(parsed);
}

export function parseMalaysiaTimestamp(value: string): Date {
  const normalized = value.trim().replace(" ", "T");
  const hasExplicitTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  return new Date(hasExplicitTimezone ? normalized : `${normalized}+08:00`);
}
