/**
 * Procedural "map photo" generator for post locations.
 *
 * The app is fully local (no backend, no API keys), so instead of calling a
 * real static-map service this draws a stylized street-map snapshot — blocks,
 * parks, roads, a radius ring and a red pin labelled with the location — as a
 * self-contained SVG data: URI, deterministic per location string. Same
 * philosophy as doodleAvatars.js: procedural, offline, renders anywhere an
 * <img src> is accepted (feed cards, modals, the create-post preview).
 *
 * The image is a "photo", not themed UI — it keeps its light map colours in
 * dark mode exactly like a real map tile would.
 */

const W = 600;
const H = 400;
const CX = W / 2;
const PIN_TIP_Y = 210; // where the pin points

/* Deterministic RNG (same construction as doodleAvatars.js). */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
};

const escapeXml = (s) =>
  String(s).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));

/* Map palette — light "paper map" tones, like a real tile render. */
const COLORS = {
  paper: "#E9EDE0",
  water: "#BFD9EA",
  waterEdge: "#A7C6DC",
  park: "#CFE3BC",
  block: "#F8F9F3",
  blockEdge: "#DFE3D4",
  roadCasing: "#D8DCCB",
  road: "#FFFFFF",
  pin: "#E64A57",
  ink: "#1A1D13",
};

const buildMapSvg = (location) => {
  const rng = mulberry32(hashString(`${location}|map`));
  const rot = (rng() * 16 - 8).toFixed(1); // slight grid rotation → organic feel

  /* Water — a soft bay in one corner, sometimes absent. */
  const corners = [[0, 0], [W, 0], [0, H], [W, H]];
  const [wx, wy] = corners[Math.floor(rng() * 4)];
  const water = rng() < 0.65
    ? `<circle cx="${wx}" cy="${wy}" r="${150 + rng() * 70}" fill="${COLORS.water}" stroke="${COLORS.waterEdge}" stroke-width="3"/>`
    : "";

  /* City blocks + parks on a rotated grid; roads run along the grid gaps. */
  const cellW = 80;
  const cellH = 70;
  let blocks = "";
  for (let gx = -2; gx < 10; gx++) {
    for (let gy = -2; gy < 8; gy++) {
      const roll = rng();
      if (roll < 0.22) continue; // empty lot — lets the paper show through
      const x = gx * cellW - 90 + rng() * 6;
      const y = gy * cellH - 60 + rng() * 6;
      const fill = roll < 0.38 ? COLORS.park : COLORS.block;
      blocks += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${cellW - 14}" height="${cellH - 14}" rx="7" fill="${fill}" stroke="${COLORS.blockEdge}" stroke-width="1.5"/>`;
    }
  }

  /* Roads: casing pass then fill pass so junctions merge cleanly. */
  const lines = [];
  for (let gx = -1; gx < 9; gx++) lines.push({ x1: gx * cellW - 97, y1: -80, x2: gx * cellW - 97 + rng() * 8 - 4, y2: H + 80, main: gx % 3 === 0 });
  for (let gy = -1; gy < 7; gy++) lines.push({ x1: -80, y1: gy * cellH - 67, x2: W + 80, y2: gy * cellH - 67 + rng() * 8 - 4, main: gy % 2 === 0 });
  const roadPass = (color, extra) =>
    lines
      .map((l) => `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${color}" stroke-width="${(l.main ? 13 : 8) + extra}" stroke-linecap="round"/>`)
      .join("");

  /* Location label chip, centred near the bottom. */
  const labelText = location.length > 34 ? `${location.slice(0, 33)}…` : location;
  const chipW = Math.min(28 + labelText.length * 8.6, W - 60);

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="system-ui, sans-serif">` +
    `<rect width="${W}" height="${H}" fill="${COLORS.paper}"/>` +
    water +
    `<g transform="rotate(${rot} ${CX} ${H / 2})">` +
    blocks +
    roadPass(COLORS.roadCasing, 5) +
    roadPass(COLORS.road, 0) +
    `</g>` +
    /* pin: shadow, teardrop, inner dot */
    `<ellipse cx="${CX}" cy="${PIN_TIP_Y + 4}" rx="14" ry="5" fill="rgba(26,29,19,0.18)"/>` +
    `<path d="M${CX} ${PIN_TIP_Y} C ${CX - 13} ${PIN_TIP_Y - 16} ${CX - 24} ${PIN_TIP_Y - 26} ${CX - 24} ${PIN_TIP_Y - 40} A 24 24 0 1 1 ${CX + 24} ${PIN_TIP_Y - 40} C ${CX + 24} ${PIN_TIP_Y - 26} ${CX + 13} ${PIN_TIP_Y - 16} ${CX} ${PIN_TIP_Y} Z" fill="${COLORS.pin}" stroke="#FFFFFF" stroke-width="3"/>` +
    `<circle cx="${CX}" cy="${PIN_TIP_Y - 42}" r="9" fill="#FFFFFF"/>` +
    /* label chip */
    `<rect x="${CX - chipW / 2}" y="336" width="${chipW}" height="38" rx="19" fill="#FFFFFF" stroke="${COLORS.blockEdge}" stroke-width="1.5"/>` +
    `<text x="${CX}" y="361" text-anchor="middle" font-size="16" font-weight="600" fill="${COLORS.ink}">${escapeXml(labelText)}</text>` +
    /* compass */
    `<circle cx="552" cy="48" r="20" fill="#FFFFFF" stroke="${COLORS.blockEdge}" stroke-width="1.5"/>` +
    `<path d="M552 36 L557 52 L552 48 L547 52 Z" fill="${COLORS.pin}"/>` +
    `<text x="552" y="62" text-anchor="middle" font-size="9" font-weight="700" fill="${COLORS.ink}">N</text>` +
    `</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const cache = new Map();

/**
 * Map photo for a location string (empty location → empty string, i.e. no
 * preview / no photo).
 */
export const getMapSnapshot = (location = "") => {
  const loc = String(location).trim();
  if (!loc) return "";
  if (!cache.has(loc)) cache.set(loc, buildMapSvg(loc));
  return cache.get(loc);
};
