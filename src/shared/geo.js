// Geolocation helpers — turn the viewer's live position into a per-post
// "X km away" label. Posts carry { lat, lng } coords; the viewer's coords come
// from the browser (see useCurrentLocation). Everything is client-safe: the
// stored-coords helpers no-op during SSR.

// Fallback "app location" used until the browser grants geolocation — central
// Ahmedabad (Lal Darwaja / Bhadra), so distances stay sensible on first paint.
export const DEFAULT_APP_COORDS = { lat: 23.0225, lng: 72.5714 };

export const USER_COORDS_KEY = "quibly_user_coords";

const toRad = (deg) => (deg * Math.PI) / 180;

// Great-circle distance in kilometres between two { lat, lng } points.
export const haversineKm = (a, b) => {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export const formatDistance = (km) => {
  if (km == null || Number.isNaN(km)) return null;
  if (km < 0.1) return "Nearby";
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
};

// Distance label from the viewer to a post. Falls back to the default app
// location while we wait for a real fix; returns null only when the post has
// no coords, so callers can fall back to any stored distance string.
export const distanceLabel = (fromCoords, post) => {
  if (!post?.coords) return null;
  return formatDistance(haversineKm(fromCoords || DEFAULT_APP_COORDS, post.coords));
};

export const getStoredUserCoords = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_COORDS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUserCoords = (coords) => {
  if (typeof window === "undefined" || !coords) return;
  window.localStorage.setItem(USER_COORDS_KEY, JSON.stringify(coords));
};
