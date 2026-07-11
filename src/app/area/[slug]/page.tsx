import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPilotArea, isInsidePilotArea } from "@/config/pilot-areas";
import { buildAreaSummary } from "@/lib/area-summary";
import { reverseGeocodeMalaysia } from "@/lib/providers/geocoding";
import { sriMudaDemonstration } from "@/data/demo-scenarios/sri-muda-2021";
import { AreaContent } from "@/components/area-content";
import type { AppLocation } from "@/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Area information" };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AreaPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const demo = query.demo === "true";
  let location: AppLocation | undefined = getPilotArea(slug);
  if (slug === "selected-location") {
    const lat = Number(query.lat), lng = Number(query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -1 || lat > 8 || lng < 99 || lng > 120) notFound();
    const coordinates = { latitude: lat, longitude: lng };
    const name = typeof query.name === "string" ? query.name : "Selected location";
    const requestedDistrict = typeof query.district === "string" ? query.district : undefined;
    let resolvedArea;
    if (!requestedDistrict) {
      try { resolvedArea = await reverseGeocodeMalaysia(coordinates); } catch { resolvedArea = undefined; }
    }
    location = { slug, name, district: requestedDistrict ?? resolvedArea?.district ?? inferDistrict(name), state: typeof query.state === "string" ? query.state : resolvedArea?.state ?? "Malaysia", coordinates, isPilot: isInsidePilotArea(coordinates) };
  }
  if (!location) notFound();
  const summary = demo ? sriMudaDemonstration : await buildAreaSummary(location);
  return <AreaContent summary={summary} demo={demo}/>;
}
function inferDistrict(name: string): string | undefined { const first = name.split(",")[0]?.trim(); return first && first !== "Selected location" && first !== "My current location" ? first : undefined; }
