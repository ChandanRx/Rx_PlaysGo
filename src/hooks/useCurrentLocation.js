"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_APP_COORDS,
  getStoredUserCoords,
  setStoredUserCoords,
} from "../shared/geo";

// Module-level singleton so every card that wants the viewer's location shares
// ONE geolocation request and one cached result — mounting 30 post cards must
// not fire 30 permission prompts.
let cachedCoords = null; // last-known viewer coords (or default fallback)
let status = "idle"; // idle | prompting | granted | denied | unavailable
let inflight = false;
const listeners = new Set();

const notify = () =>
  listeners.forEach((cb) => cb({ coords: cachedCoords, status }));

const requestLocation = () => {
  if (inflight || status === "granted") return;

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    status = "unavailable";
    cachedCoords = getStoredUserCoords() || DEFAULT_APP_COORDS;
    notify();
    return;
  }

  inflight = true;
  status = "prompting";
  notify();

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      cachedCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setStoredUserCoords(cachedCoords);
      status = "granted";
      inflight = false;
      notify();
    },
    () => {
      status = "denied";
      cachedCoords = getStoredUserCoords() || DEFAULT_APP_COORDS;
      inflight = false;
      notify();
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
  );
};

// Returns { coords, status } for the current viewer. coords is null on the very
// first render (SSR-safe) and resolves after mount to either the granted fix, a
// previously stored fix, or the default app location.
export const useCurrentLocation = () => {
  const [state, setState] = useState({ coords: cachedCoords, status });

  useEffect(() => {
    listeners.add(setState);
    if (!cachedCoords) cachedCoords = getStoredUserCoords();
    setState({ coords: cachedCoords, status });
    requestLocation();
    return () => listeners.delete(setState);
  }, []);

  return state;
};

export default useCurrentLocation;
