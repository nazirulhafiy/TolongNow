export type Coordinates = { latitude: number; longitude: number };

export type RiverStatus = "normal" | "alert" | "warning" | "danger" | "unknown";
export type RiverTrend = "rising" | "falling" | "steady" | "unknown";

export type RiverStation = {
  id: string;
  name: string;
  district?: string;
  state?: string;
  coordinates?: Coordinates;
  waterLevel?: number;
  normalThreshold?: number;
  alertThreshold?: number;
  warningThreshold?: number;
  dangerThreshold?: number;
  statusThreshold?: number;
  status: RiverStatus;
  trend: RiverTrend;
  observedAt?: string;
  officialProvider: string;
  sourceUrl: string;
  pasarApiEntryId?: string;
  isStale?: boolean;
};

export type WeatherForecast = {
  location: string;
  date: string;
  description: string;
  morning?: string;
  afternoon?: string;
  night?: string;
  minTemperature?: number;
  maxTemperature?: number;
  officialProvider: string;
  sourceUrl: string;
  pasarApiEntryId: string;
};

export type WeatherWarning = {
  id: string;
  title: string;
  description: string;
  affectedAreas: string[];
  issuedAt?: string;
  validFrom?: string;
  validUntil?: string;
  officialProvider: string;
  sourceUrl: string;
  pasarApiEntryId: string;
};

export type PpsStatus = "active" | "historical" | "inactive" | "unknown";
export type PpsLocation = {
  id: string;
  name: string;
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  status: PpsStatus;
  sourceTitle: string;
  sourceUrl: string;
  sourcePublishedAt?: string;
  lastVerifiedAt: string;
  notes?: string;
  distanceKm?: number;
  victimCount?: number;
  familyCount?: number;
  capacityPercent?: number;
};

export type EmergencyContact = {
  id: string;
  agency: string;
  purpose: string;
  phone?: string;
  website?: string;
  coverage: string;
  sourceUrl: string;
  lastVerifiedAt: string;
};

export type AppLocation = {
  slug: string;
  name: string;
  district?: string;
  state?: string;
  coordinates: Coordinates;
  isPilot: boolean;
};

export type Availability = { available: boolean; message?: string };
export type AreaSummary = {
  location: AppLocation;
  nearbyRiverStations: RiverStation[];
  weatherWarnings: WeatherWarning[];
  forecast: WeatherForecast[];
  nearbyPps: PpsLocation[];
  retrievedAt: string;
  dataAvailability: {
    river: Availability;
    warnings: Availability;
    forecast: Availability;
    pps: Availability;
  };
  mode: "live" | "demonstration";
};
