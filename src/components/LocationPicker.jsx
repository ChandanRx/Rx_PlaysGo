"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { DEFAULT_APP_COORDS } from "../shared/geo";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

// A coral map pin drawn as an inline SVG so Leaflet never has to fetch its
// default marker PNGs (which 404 under Next's bundler).
const pinIcon = L.divIcon({
  className: "location-picker-pin",
  html: `<svg viewBox="0 0 24 24" width="30" height="30" fill="#ff5a5f" stroke="#ffffff" stroke-width="1.4">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
    <circle cx="12" cy="9" r="2.6" fill="#ffffff" stroke="none"/>
  </svg>`,
  iconSize: [30, 30],
  iconAnchor: [15, 28],
});

// Best-effort reverse geocode via OSM Nominatim. Returns a short label or null;
// never throws so a picked pin still works offline / when the service is down.
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.display_name) return null;
    return data.display_name.split(",").slice(0, 3).join(",").trim();
  } catch {
    return null;
  }
};

// Interactive map for picking a post's location. Emits { lat, lng } (and a
// best-effort address label) whenever the pin moves. `value` seeds the pin.
const LocationPicker = ({ value, onPick }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const { coords: currentCoords } = useCurrentLocation();
  const [status, setStatus] = useState("");

  // Keep the latest onPick in a ref so map handlers bound once stay current.
  const onPickRef = useRef(onPick);
  useEffect(() => { onPickRef.current = onPick; }, [onPick]);

  const emit = async (lat, lng) => {
    onPickRef.current?.({ lat, lng });
    setStatus("Locating address…");
    const label = await reverseGeocode(lat, lng);
    if (label) onPickRef.current?.({ lat, lng }, label);
    setStatus(label || `Pinned at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  };

  const place = (lat, lng, { pan = false } = {}) => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        emit(p.lat, p.lng);
      });
      markerRef.current = marker;
    }
    if (pan) map.setView([lat, lng], Math.max(map.getZoom(), 14));
  };

  // Init the map once on mount.
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const start = value || currentCoords || DEFAULT_APP_COORDS;
    const map = L.map(containerRef.current, {
      center: [start.lat, start.lng],
      zoom: 13,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (e) => {
      place(e.latlng.lat, e.latlng.lng);
      emit(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    if (value) place(value.lat, value.lng);
    // Leaflet needs a size recompute once its container is laid out.
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect an externally set value (e.g. after "use my location") onto the pin.
  useEffect(() => {
    if (value && mapRef.current) place(value.lat, value.lng, { pan: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.lat, value?.lng]);

  const useMyLocation = () => {
    const c = currentCoords || DEFAULT_APP_COORDS;
    place(c.lat, c.lng, { pan: true });
    emit(c.lat, c.lng);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] text-[var(--text-muted)]">
          Tap the map to drop a pin, or drag it to fine-tune.
        </p>
        <button
          type="button"
          onClick={useMyLocation}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--text-body)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          <MapPinIcon className="h-3.5 w-3.5 text-[var(--brand)]" />
          Use my location
        </button>
      </div>
      <div
        ref={containerRef}
        className="relative isolate h-64 w-full overflow-hidden rounded-xl border border-[var(--border-subtle)]"
      />
      {status && (
        <p className="flex items-center gap-1 text-[12px] font-medium text-[var(--text-body)]">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
          <span className="truncate">{status}</span>
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
