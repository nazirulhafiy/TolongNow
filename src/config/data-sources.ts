export type DataSource = {
  id: string;
  name: string;
  pasarApiEntryName: string;
  pasarApiEntryId: string;
  pasarApiUrl: string;
  provider: string;
  officialUrl: string;
  endpoint: string;
  usedFor: string;
  authentication: string;
  dataType: "live" | "forecast" | "static" | "demonstration-only";
  revalidation: string;
  limitations: string;
  productionUsage: boolean;
};

export const dataSources: DataSource[] = [
  {
    id: "met-forecast",
    name: "MET Malaysia 7-day weather forecast",
    pasarApiEntryName: "7-day weather forecast (live)",
    pasarApiEntryId: "weather/forecast",
    pasarApiUrl: "https://pasarapi.xyz/apis/weather/forecast",
    provider: "MET Malaysia via data.gov.my",
    officialUrl: "https://developer.data.gov.my/realtime-api/weather",
    endpoint: "https://api.data.gov.my/weather/forecast",
    usedFor: "Daily district forecasts and temperature range.",
    authentication: "No authentication required",
    dataType: "forecast",
    revalidation: "30 minutes",
    limitations: "District forecasts are not street-level observations and are supplied primarily in Bahasa Melayu.",
    productionUsage: true,
  },
  {
    id: "met-warning",
    name: "MET Malaysia weather warnings",
    pasarApiEntryName: "Weather warnings (live)",
    pasarApiEntryId: "weather/warning",
    pasarApiUrl: "https://pasarapi.xyz/apis/weather/warning",
    provider: "MET Malaysia via data.gov.my",
    officialUrl: "https://developer.data.gov.my/realtime-api/weather",
    endpoint: "https://api.data.gov.my/weather/warning",
    usedFor: "Current official weather warning text and validity periods.",
    authentication: "No authentication required",
    dataType: "live",
    revalidation: "5 minutes",
    limitations: "Warnings may cover broad areas and are shown in the official wording supplied by MET Malaysia.",
    productionUsage: true,
  },
  {
    id: "nominatim",
    name: "Nominatim geocoding",
    pasarApiEntryName: "Nominatim (OpenStreetMap)",
    pasarApiEntryId: "nominatim-osm",
    pasarApiUrl: "https://pasarapi.xyz/apis/nominatim-osm",
    provider: "OpenStreetMap contributors",
    officialUrl: "https://nominatim.org/release-docs/latest/api/Search/",
    endpoint: "https://nominatim.openstreetmap.org/search and /reverse",
    usedFor: "Submitted Malaysian place searches and reverse geocoding of user-approved browser coordinates; no keystroke autocomplete.",
    authentication: "No authentication; identifying User-Agent required",
    dataType: "live",
    revalidation: "Successful searches cached for 24 hours",
    limitations: "Public service is rate-limited to one request per second and results depend on OpenStreetMap coverage.",
    productionUsage: true,
  },
  {
    id: "jps-publicinfobanjir",
    name: "JPS Public InfoBanjir latest river readings",
    pasarApiEntryName: "River water levels & flood warnings (live)",
    pasarApiEntryId: "flood-warning",
    pasarApiUrl: "https://pasarapi.xyz/apis/flood-warning",
    provider: "Department of Irrigation and Drainage Malaysia (JPS)",
    officialUrl: "https://publicinfobanjir.water.gov.my/",
    endpoint: "https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/latestreadingstrendabc.json",
    usedFor: "Technical adapter retained for future contextualized river information; not shown in the simplified user flow.",
    authentication: "No authentication; server-side request",
    dataType: "live",
    revalidation: "5 minutes",
    limitations: "Official but undocumented JSON with opaque keys and no SLA. TolongNow validates a conservative subset, rejects stale records and does not infer missing thresholds.",
    productionUsage: false,
  },
  {
    id: "jkm-active-pps",
    name: "JKM InfoBencana active evacuation centres",
    pasarApiEntryName: "Direct official integration",
    pasarApiEntryId: "direct-official",
    pasarApiUrl: "https://infobencanajkmv2.jkm.gov.my/landing/",
    provider: "Department of Social Welfare Malaysia (JKM)",
    officialUrl: "https://infobencanajkmv2.jkm.gov.my/landing/",
    endpoint: "https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=1",
    usedFor: "Current flood evacuation centres near the user, including coordinates, occupants, families and capacity.",
    authentication: "No authentication; server-side request",
    dataType: "live",
    revalidation: "5 minutes",
    limitations: "Official but undocumented internal JSON endpoint with no SLA, schema version, CORS or response timestamp. TolongNow validates a strict schema and falls back to the official JKM page when unavailable.",
    productionUsage: true,
  },
  {
    id: "jps-flood-rejected",
    name: "JPS river water levels and flood warnings",
    pasarApiEntryName: "River water levels & flood warnings (live)",
    pasarApiEntryId: "flood-warning",
    pasarApiUrl: "https://pasarapi.xyz/apis/flood-warning",
    provider: "Department of Irrigation and Drainage Malaysia via data.gov.my",
    officialUrl: "https://developer.data.gov.my/realtime-api/flood-warning",
    endpoint: "https://api.data.gov.my/flood-warning",
    usedFor: "Reconnaissance only; not presented as a production live source.",
    authentication: "No authentication required",
    dataType: "live",
    revalidation: "Not applicable",
    limitations: "Live verification on 11 July 2026 returned observations timestamped 23 February 2024, so the source was rejected for current conditions.",
    productionUsage: false,
  },
];

export const productionDataSources = dataSources.filter((source) => source.productionUsage);
export const productionApiCount = productionDataSources.length;
