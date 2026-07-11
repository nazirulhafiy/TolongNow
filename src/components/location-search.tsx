"use client";

import React, { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PinIcon, ArrowIcon } from "@/components/icons";
import { usePreferences } from "@/components/preferences";

type Result = { id: string; name: string; latitude: number; longitude: number; district?: string; state?: string };

export function LocationSearch() {
  const { t } = usePreferences();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const go = (result: Result) => { const params = new URLSearchParams({ lat: String(result.latitude), lng: String(result.longitude), name: result.name }); if (result.district) params.set("district", result.district); if (result.state) params.set("state", result.state); router.push(`/area/selected-location?${params}`); };
  async function search(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError(""); setResults([]);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResults(data.results);
      if (data.results.length === 1) go(data.results[0]);
      if (!data.results.length) setError(t.noLocation);
    } catch { setError(t.searchUnavailable); }
    finally { setLoading(false); }
  }
  function locate() {
    setError("");
    if (!navigator.geolocation) return setError(t.locationUnsupported);
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const fallback = { id: "current", name: t.currentLocation, latitude: coords.latitude, longitude: coords.longitude };
        try {
          const response = await fetch(`/api/reverse-geocode?lat=${encodeURIComponent(coords.latitude)}&lng=${encodeURIComponent(coords.longitude)}`);
          const data = await response.json();
          setLoading(false);
          go(response.ok && data.result ? data.result : fallback);
        } catch {
          setLoading(false);
          go(fallback);
        }
      },
      () => { setLoading(false); setError(t.locationDeniedPilot); searchInputRef.current?.focus(); },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }
  return <div className="location-tool" id="location-search">
    <button className="button button-primary button-wide" onClick={locate} disabled={loading}><PinIcon /> {t.useLocation}</button>
    <div className="privacy-note"><span className="privacy-dot"/>{t.privacyNote}</div>
    <div className="divider"><span>{t.searchDivider}</span></div>
    <form onSubmit={search} className="search-form"><label htmlFor="location">{t.searchLabel}</label><div className="search-row"><div className="input-wrap"><PinIcon/><input ref={searchInputRef} id="location" value={query} onChange={(e) => { setQuery(e.target.value); if (error) setError(""); }} placeholder={t.searchPlaceholder} minLength={2} required /></div><button className="button button-dark" disabled={loading}>{loading ? t.checking : t.findHelp}<ArrowIcon /></button></div></form>
    {error && <p className="form-error" role="alert">{error}</p>}
    {results.length > 1 && <ul className="search-results" aria-label={t.locationResults}>{results.map((result) => <li key={result.id}><button onClick={() => go(result)}><PinIcon/><span>{result.name}</span><ArrowIcon/></button></li>)}</ul>}
  </div>;
}
