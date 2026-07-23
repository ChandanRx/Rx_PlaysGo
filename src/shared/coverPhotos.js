/**
 * PlaysGo profile cover set.
 *
 * Eight ready-made cover "photos" for the profile banner. To stay consistent
 * with the doodle avatars (see doodleAvatars.js) these are self-contained SVG
 * `data:` URIs — vivid gradient artworks with a soft bokeh + concentric-ring
 * motif — so they render anywhere an `<img src>` is used with no network
 * assets, no files, nothing to lazy-fetch. Each is a wide 800×260 banner that
 * `object-cover`s cleanly into the header at any width.
 */

// Shared decorative overlay — translucent white bokeh discs + a couple of faint
// concentric rings. Identical across every cover so the set reads as one system;
// only the gradient palette changes.
const DECO =
  "<g fill='#ffffff'>" +
  "<circle cx='662' cy='54' r='128' fill-opacity='0.10'/>" +
  "<circle cx='748' cy='26' r='64' fill-opacity='0.12'/>" +
  "<circle cx='128' cy='236' r='96' fill-opacity='0.08'/>" +
  "<circle cx='360' cy='210' r='40' fill-opacity='0.10'/>" +
  "</g>" +
  "<g fill='none' stroke='#ffffff' stroke-opacity='0.12' stroke-width='2'>" +
  "<circle cx='700' cy='44' r='150'/>" +
  "<circle cx='700' cy='44' r='206'/>" +
  "</g>";

const buildCover = (stops) => {
  const grad = stops
    .map((c, i) => `<stop offset='${Math.round((i / (stops.length - 1)) * 100)}%' stop-color='${c}'/>`)
    .join("");
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='260' viewBox='0 0 800 260'>" +
    `<defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>${grad}</linearGradient></defs>` +
    "<rect width='800' height='260' fill='url(#g)'/>" +
    DECO +
    "</svg>";
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// name + gradient palette for each of the eight covers.
const COVER_DEFS = [
  { id: "coral-blaze", name: "Coral Blaze", stops: ["#FF9A6C", "#FF6B6B", "#C0396A"] },
  { id: "ocean-deep",  name: "Ocean Deep",  stops: ["#38BDF8", "#3B82F6", "#1E3A8A"] },
  { id: "pitch-green", name: "Pitch Green", stops: ["#4ADE80", "#16A34A", "#065F46"] },
  { id: "violet-dusk", name: "Violet Dusk", stops: ["#A78BFA", "#8B5CF6", "#6D28D9"] },
  { id: "sunset",      name: "Sunset",      stops: ["#FBBF24", "#FB7185", "#EF4444"] },
  { id: "teal-mint",   name: "Teal Mint",   stops: ["#5EEAD4", "#14B8A6", "#0F766E"] },
  { id: "midnight",    name: "Midnight",    stops: ["#475569", "#1E293B", "#0F172A"] },
  { id: "rose-gold",   name: "Rose Gold",   stops: ["#F9A8D4", "#F472B6", "#FB923C"] },
];

export const COVER_PHOTOS = COVER_DEFS.map(({ id, name, stops }) => ({
  id,
  name,
  url: buildCover(stops),
}));

// Stable per-user default so different profiles don't all share one cover when
// they haven't chosen their own — derived from a small hash of their handle/id.
const hashString = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
};

export const coverForUser = (profile = {}) => {
  if (profile.coverImage) return profile.coverImage;
  const seed = profile.username || profile.id || profile.email || "";
  return COVER_PHOTOS[hashString(seed) % COVER_PHOTOS.length].url;
};
