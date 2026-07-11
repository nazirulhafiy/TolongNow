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
  if (validFrom && new Date(validFrom) > now) return false;
  if (validUntil && new Date(validUntil) < now) return false;
  return true;
}
