export function isStale(timestamp?: string, maxAgeMinutes = 60, now = new Date()): boolean {
  if (!timestamp) return true;
  const parsed = new Date(timestamp.replace(" ", "T") + (timestamp.includes("T") ? "" : "+08:00"));
  if (Number.isNaN(parsed.getTime())) return true;
  return now.getTime() - parsed.getTime() > maxAgeMinutes * 60_000;
}

export function formatTimestamp(value?: string, locale = "en-MY"): string {
  if (!value) return "Timestamp unavailable";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Timestamp unavailable";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kuching" }).format(parsed);
}
