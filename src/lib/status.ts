import type { PpsStatus, RiverStatus } from "@/types";

export const ppsStatusLabels: Record<PpsStatus, string> = {
  active: "Active now",
  historical: "Previously used as an evacuation centre",
  inactive: "Confirmed inactive",
  unknown: "Current operating status unknown",
};

export function normalizeRiverStatus(value?: string | null): RiverStatus {
  const status = value?.toLowerCase();
  return status === "normal" || status === "alert" || status === "warning" || status === "danger" ? status : "unknown";
}

export function isWarningCurrentlyValid(validFrom?: string, validUntil?: string, now = new Date()): boolean {
  if (validFrom && parseMalaysiaTimestamp(validFrom) > now) return false;
  if (validUntil && parseMalaysiaTimestamp(validUntil) < now) return false;
  return true;
}

function parseMalaysiaTimestamp(value: string): Date {
  const normalized = value.trim().replace(" ", "T");
  const hasExplicitTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  return new Date(hasExplicitTimezone ? normalized : `${normalized}+08:00`);
}
