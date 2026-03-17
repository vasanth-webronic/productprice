"use client";

import { useState } from "react";
import { SEARCH_RADIUS_KM } from "@/lib/config";

interface Props {
  onSearch: (lat: number, lon: number) => void;
  loading: boolean;
}

export default function LocationForm({ onSearch, loading }: Props) {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [geoError, setGeoError] = useState("");

  function useMyLocation() {
    setGeoError("");
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLon(String(pos.coords.longitude));
      },
      () => setGeoError("Location access denied. Enter coordinates manually.")
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const la = parseFloat(lat);
    const lo = parseFloat(lon);
    if (isNaN(la) || isNaN(lo)) return;
    onSearch(la, lo);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g. 59.3293"
            className="w-44 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="number"
            step="any"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="e.g. 18.0686"
            className="w-44 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          className="rounded-lg border border-blue-500 text-blue-600 px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
        >
          📍 Use my location
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 text-white px-6 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading…" : `Search (${SEARCH_RADIUS_KM} km radius)`}
        </button>
      </div>
      {geoError && <p className="text-sm text-red-600">{geoError}</p>}
    </form>
  );
}
