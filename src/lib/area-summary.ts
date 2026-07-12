import { getForecast, getWeatherWarnings } from "@/lib/providers/weather";
import { getNearbyActiveJkmPps } from "@/lib/providers/jkm-pps";
import type { AppLocation, AreaSummary } from "@/types";

export async function buildAreaSummary(location: AppLocation): Promise<AreaSummary> {
  const forecastLocation = location.district === "Hulu Langat" ? "Hulu Langat" : location.district ?? location.name;
  const [forecastResult, warningResult, ppsResult] = await Promise.allSettled([
    getForecast(forecastLocation),
    getWeatherWarnings(),
    getNearbyActiveJkmPps(location.coordinates),
  ]);
  const pps = ppsResult.status === "fulfilled" ? ppsResult.value : [];
  const warnings = warningResult.status === "fulfilled" ? warningResult.value.filter((warning) => warningAppliesToLocation([warning.title, warning.description, warning.titleMs, warning.descriptionMs].filter(Boolean).join(" "), location)) : [];
  return {
    location,
    nearbyRiverStations: [],
    weatherWarnings: warnings,
    forecast: forecastResult.status === "fulfilled" ? forecastResult.value : [],
    nearbyPps: pps,
    retrievedAt: new Date().toISOString(),
    dataAvailability: {
      river: { available: false, message: "River-station readings are available from Public InfoBanjir but are not shown because they require local threshold context to interpret safely." },
      warnings: warningResult.status === "fulfilled" ? { available: true } : { available: false, message: "Weather warnings are temporarily unavailable." },
      forecast: forecastResult.status === "fulfilled" && forecastResult.value.length > 0 ? { available: true } : { available: false, message: "A forecast for this location is temporarily unavailable." },
      pps: ppsResult.status === "fulfilled" && pps.length > 0
        ? { available: true, message: "Current official JKM listings found nearby. Confirm status before travelling." }
        : ppsResult.status === "rejected"
          ? { available: false, message: "Live JKM evacuation-centre data is temporarily unavailable." }
          : { available: false },
    },
    mode: "live",
  };
}

function warningAppliesToLocation(text: string, location: AppLocation): boolean {
  const haystack = text.toLowerCase();
  const terms = [location.name, location.district, location.state === "Malaysia" ? undefined : location.state]
    .filter((term): term is string => Boolean(term))
    .flatMap((term) => [term.toLowerCase(), ...term.toLowerCase().split(/[,/\s]+/).filter((part) => part.length >= 5 && part !== "malaysia" && !/^\d+$/.test(part))]);
  return terms.some((term) => haystack.includes(term));
}
