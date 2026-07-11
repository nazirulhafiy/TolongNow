import { z } from "zod";
import type { WeatherForecast, WeatherWarning } from "@/types";
import { isWarningCurrentlyValid } from "@/lib/status";

const FORECAST_ENDPOINT = "https://api.data.gov.my/weather/forecast";
const WARNING_ENDPOINT = "https://api.data.gov.my/weather/warning";

const forecastSchema = z.array(z.object({
  location: z.object({ location_id: z.string(), location_name: z.string() }),
  date: z.string(),
  morning_forecast: z.string().nullish(),
  afternoon_forecast: z.string().nullish(),
  night_forecast: z.string().nullish(),
  summary_forecast: z.string().nullish(),
  min_temp: z.number().nullish(),
  max_temp: z.number().nullish(),
}));

const warningSchema = z.array(z.object({
  warning_issue: z.object({ issued: z.string().nullish(), title_bm: z.string().nullish(), title_en: z.string().nullish() }),
  valid_from: z.string().nullish(),
  valid_to: z.string().nullish(),
  heading_en: z.string().nullish(),
  heading_bm: z.string().nullish(),
  text_en: z.string().nullish(),
  text_bm: z.string().nullish(),
}).passthrough());

async function fetchJson(url: string, revalidate: number): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(url, { signal: controller.signal, next: { revalidate } });
    if (!response.ok) throw new Error(`Provider returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function getForecast(locationName: string): Promise<WeatherForecast[]> {
  const url = `${FORECAST_ENDPOINT}?contains=${encodeURIComponent(locationName)}@location__location_name`;
  const rows = forecastSchema.parse(await fetchJson(url, 1800));
  return rows.map((row) => ({
    location: row.location.location_name,
    date: row.date,
    description: row.summary_forecast ?? row.afternoon_forecast ?? "Forecast description unavailable",
    morning: row.morning_forecast ?? undefined,
    afternoon: row.afternoon_forecast ?? undefined,
    night: row.night_forecast ?? undefined,
    minTemperature: row.min_temp ?? undefined,
    maxTemperature: row.max_temp ?? undefined,
    officialProvider: "MET Malaysia via data.gov.my",
    sourceUrl: FORECAST_ENDPOINT,
    pasarApiEntryId: "weather/forecast",
  })).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getWeatherWarnings(now = new Date()): Promise<WeatherWarning[]> {
  const rows = warningSchema.parse(await fetchJson(WARNING_ENDPOINT, 300));
  return rows.map((row, index) => ({
    id: `${row.warning_issue.issued ?? "warning"}-${index}`,
    title: row.heading_en ?? row.warning_issue.title_en ?? row.heading_bm ?? "Official weather warning",
    description: row.text_en ?? row.text_bm ?? "See the official source for details.",
    titleMs: row.heading_bm ?? row.warning_issue.title_bm ?? undefined,
    descriptionMs: row.text_bm ?? undefined,
    affectedAreas: [],
    issuedAt: row.warning_issue.issued ?? undefined,
    validFrom: row.valid_from ?? undefined,
    validUntil: row.valid_to ?? undefined,
    officialProvider: "MET Malaysia via data.gov.my",
    sourceUrl: WARNING_ENDPOINT,
    pasarApiEntryId: "weather/warning",
  })).filter((warning) => isWarningCurrentlyValid(warning.validFrom, warning.validUntil, now));
}
