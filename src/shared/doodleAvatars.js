/**
 * PlaysGo doodle avatar set.
 *
 * A library of original, hand-drawn "editorial doodle" face avatars — the kind
 * of minimal illustrated portraits common in modern SaaS products. Every avatar
 * is generated procedurally from a pool of modular features (head, hair, eyes,
 * mouth, glasses, hats, beards, earrings…) and emitted as a self-contained SVG
 * `data:` URI, so it renders anywhere an `<img src>` is used — no network assets,
 * no files, nothing to lazy-fetch.
 *
 * Design language (kept identical across every avatar):
 *   • simple near-black outlines, round line caps/joins
 *   • soft monochrome (grayscale / beige) skin + hair fills
 *   • flat 2D vector, rounded organic shapes, slight hand-drawn wobble
 *   • minimal facial features, large expressive hair
 *   • fixed 100×100 viewBox and fixed feature proportions
 *
 * Accent colours (coral / orange / yellow / pink…) live on the *card* when an
 * avatar is selected — see AvatarPicker — the illustrations themselves stay
 * monochrome so they read on both white and coloured backgrounds.
 */

const INK = "#20201C";
const SW = 2.4;
// Shared stroke attributes — round caps/joins give the friendly hand-drawn feel.
const STROKE = `stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"`;

// Soft monochrome skin tones, light → deep. Grayscale + warm beige, no saturation.
const SKINS = [
  "#F3EFE8", "#ECE6DB", "#E1DACC", "#D3CABA", "#C2B8A6",
  "#AEA491", "#978C7A", "#7E7566", "#665E52", "#4E483F",
];

// Hair fills — mostly dark ink, plus a couple of soft grays/whites for range.
const HAIR_DARK = ["#26251F", "#2E2A24", "#1E1D19", "#3A342B"];
const HAIR_GRAY = ["#CFC9BF", "#B7B1A6", "#E4E0D7"];

// Fabric tones for head-wraps — kept monochrome like everything else.
const FABRIC = ["#D7D1C6", "#C4BDB0", "#E2DED4", "#B0A99C"];

// Muted accents used *sparingly* inside illustrations (blush, flower centre).
const BLUSH = "#E7A79E";
const FLOWER = ["#E7A79E", "#E9C15E", "#E39B6B"];

/* ── deterministic RNG so the set is stable across reloads/SSR ── */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const chance = (rng, p) => rng() < p;

/* ── geometry helpers — organic, slightly imperfect closed shapes ── */

// Smooth closed curve (Catmull-Rom → cubic bézier) through a ring of points.
function smoothClosed(points) {
  const p = points;
  const n = p.length;
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

// A blobby circle — the base for organic heads and hair masses.
function blob(cx, cy, rx, ry, count, wobble, rng) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const j = 1 + (rng() * 2 - 1) * wobble;
    pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
  }
  return smoothClosed(pts);
}

// A scalloped ring — reads as curls / afro / cloud hair. `depth` = bump height.
function scallop(cx, cy, r, bumps, depth) {
  let d = "";
  const step = (Math.PI * 2) / bumps;
  for (let i = 0; i < bumps; i++) {
    const a0 = i * step;
    const a1 = (i + 1) * step;
    const am = (a0 + a1) / 2;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const mx = cx + Math.cos(am) * (r + depth);
    const my = cy + Math.sin(am) * (r + depth);
    if (i === 0) d += `M${x0.toFixed(1)} ${y0.toFixed(1)}`;
    d += `Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d + "Z";
}

const fill = (path, color) => `<path d="${path}" fill="${color}" ${STROKE}/>`;

/* ── fixed feature coordinates (identical proportions everywhere) ── */
const EYE_Y = 49;
const EYE_L = 41;
const EYE_R = 59;
const MOUTH_Y = 63;

/* ── eyes ── */
const EYES = {
  dots: () =>
    `<circle cx="${EYE_L}" cy="${EYE_Y}" r="2.5" fill="${INK}"/><circle cx="${EYE_R}" cy="${EYE_Y}" r="2.5" fill="${INK}"/>`,
  ovals: () =>
    `<ellipse cx="${EYE_L}" cy="${EYE_Y}" rx="2" ry="3" fill="${INK}"/><ellipse cx="${EYE_R}" cy="${EYE_Y}" rx="2" ry="3" fill="${INK}"/>`,
  happy: () =>
    `<path d="M${EYE_L - 4} ${EYE_Y + 1}Q${EYE_L} ${EYE_Y - 4} ${EYE_L + 4} ${EYE_Y + 1}" fill="none" ${STROKE}/>` +
    `<path d="M${EYE_R - 4} ${EYE_Y + 1}Q${EYE_R} ${EYE_Y - 4} ${EYE_R + 4} ${EYE_Y + 1}" fill="none" ${STROKE}/>`,
  sleepy: () =>
    `<path d="M${EYE_L - 4} ${EYE_Y}Q${EYE_L} ${EYE_Y + 3} ${EYE_L + 4} ${EYE_Y}" fill="none" ${STROKE}/>` +
    `<path d="M${EYE_R - 4} ${EYE_Y}Q${EYE_R} ${EYE_Y + 3} ${EYE_R + 4} ${EYE_Y}" fill="none" ${STROKE}/>`,
  wink: () =>
    `<path d="M${EYE_L - 4} ${EYE_Y}Q${EYE_L} ${EYE_Y + 3} ${EYE_L + 4} ${EYE_Y}" fill="none" ${STROKE}/>` +
    `<circle cx="${EYE_R}" cy="${EYE_Y}" r="2.5" fill="${INK}"/>`,
  wide: () =>
    `<circle cx="${EYE_L}" cy="${EYE_Y}" r="3.4" fill="#fff" ${STROKE}/><circle cx="${EYE_L}" cy="${EYE_Y}" r="1.5" fill="${INK}"/>` +
    `<circle cx="${EYE_R}" cy="${EYE_Y}" r="3.4" fill="#fff" ${STROKE}/><circle cx="${EYE_R}" cy="${EYE_Y}" r="1.5" fill="${INK}"/>`,
};

/* ── eyebrows ── */
const BROWS = {
  none: () => "",
  flat: () =>
    `<path d="M${EYE_L - 4} 42h8" fill="none" ${STROKE}/><path d="M${EYE_R - 4} 42h8" fill="none" ${STROKE}/>`,
  raised: () =>
    `<path d="M${EYE_L - 4} 42q4 -2 8 0" fill="none" ${STROKE}/><path d="M${EYE_R - 4} 42q4 -2 8 0" fill="none" ${STROKE}/>`,
};

/* ── nose ── */
const NOSES = {
  none: () => "",
  dot: () => `<circle cx="50" cy="55" r="1.4" fill="${INK}"/>`,
  line: () => `<path d="M50 51v5" fill="none" ${STROKE}/>`,
  curve: () => `<path d="M49 52q-1.5 4 2 4.5" fill="none" ${STROKE}/>`,
};

/* ── mouth ── */
const MOUTHS = {
  smile: () => `<path d="M43 ${MOUTH_Y - 1}q7 7 14 0" fill="none" ${STROKE}/>`,
  soft: () => `<path d="M45 ${MOUTH_Y}q5 4 10 0" fill="none" ${STROKE}/>`,
  neutral: () => `<path d="M45 ${MOUTH_Y}h10" fill="none" ${STROKE}/>`,
  grin: () =>
    `<path d="M43 ${MOUTH_Y - 1}q7 8 14 0q-7 2 -14 0Z" fill="#fff" ${STROKE}/>`,
  o: () => `<ellipse cx="50" cy="${MOUTH_Y + 1}" rx="2.6" ry="3.2" fill="${INK}"/>`,
  smirk: () => `<path d="M44 ${MOUTH_Y}q7 3 12 -2" fill="none" ${STROKE}/>`,
};

/* ── glasses ── */
const GLASSES = {
  none: () => "",
  round: () =>
    `<circle cx="${EYE_L}" cy="${EYE_Y}" r="7" fill="none" ${STROKE}/><circle cx="${EYE_R}" cy="${EYE_Y}" r="7" fill="none" ${STROKE}/>` +
    `<path d="M48 ${EYE_Y}h4" ${STROKE}/><path d="M34 ${EYE_Y - 1}l-6 -2" ${STROKE}/><path d="M66 ${EYE_Y - 1}l6 -2" ${STROKE}/>`,
  square: () =>
    `<rect x="${EYE_L - 7}" y="${EYE_Y - 5}" width="14" height="10" rx="3" fill="none" ${STROKE}/>` +
    `<rect x="${EYE_R - 7}" y="${EYE_Y - 5}" width="14" height="10" rx="3" fill="none" ${STROKE}/>` +
    `<path d="M48 ${EYE_Y}h4" ${STROKE}/><path d="M34 ${EYE_Y - 1}l-6 -2" ${STROKE}/><path d="M66 ${EYE_Y - 1}l6 -2" ${STROKE}/>`,
  sun: () =>
    `<path d="M${EYE_L - 7} ${EYE_Y - 5}h14a1 1 0 0 1 1 1v5a5 5 0 0 1 -16 0v-5a1 1 0 0 1 1 -1Z" fill="${INK}" ${STROKE}/>` +
    `<path d="M${EYE_R - 8} ${EYE_Y - 5}h14a1 1 0 0 1 1 1v5a5 5 0 0 1 -16 0v-5a1 1 0 0 1 1 -1Z" fill="${INK}" ${STROKE}/>` +
    `<path d="M49 ${EYE_Y - 3}h3" ${STROKE}/>`,
};

/* ── facial hair ── */
const BEARDS = {
  none: () => "",
  beard: (c) =>
    fill(
      `M27 54c0 18 11 27 23 27s23 -9 23 -27c-6 11 -14 15 -23 15s-17 -4 -23 -15Z`,
      c
    ),
  mustache: () =>
    `<path d="M42 58q4 4 8 1q4 3 8 -1q-4 3 -8 1.5q-4 1.5 -8 -1.5Z" fill="${INK}" ${STROKE}/>`,
  stubble: () =>
    `<g fill="${INK}">` +
    [
      [38, 66], [43, 69], [48, 71], [52, 71], [57, 69], [62, 66],
      [40, 63], [45, 66], [50, 68], [55, 66], [60, 63],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9"/>`)
      .join("") +
    "</g>",
};

/* ── earrings ── */
const EARRINGS = {
  none: () => "",
  stud: () =>
    `<circle cx="25" cy="60" r="1.6" fill="${INK}"/><circle cx="75" cy="60" r="1.6" fill="${INK}"/>`,
  hoop: () =>
    `<circle cx="25" cy="62" r="3" fill="none" ${STROKE}/><circle cx="75" cy="62" r="3" fill="none" ${STROKE}/>`,
};

/* ── hairstyles — each returns { back, front } SVG fragments ──
 * `back` is painted behind the head, `front` over the forehead/hairline.
 */
const HAIR = {
  afro: (c) => ({ back: fill(scallop(50, 40, 25, 12, 4.5), c), front: "" }),
  curly: (c) => ({
    back: fill(scallop(50, 39, 24, 16, 3), c),
    front: fill(scallop(50, 40, 20, 10, 2.5), c),
  }),
  cloud: (c) => ({ back: fill(scallop(50, 38, 24, 9, 4), c), front: "" }),
  bun: (c) => ({
    back: fill("M50 12c-6 0 -10 4 -10 9s4 8 10 8 10 -3 10 -8 -4 -9 -10 -9Z", c),
    front: fill(
      "M27 46c0 -18 12 -24 23 -24s23 6 23 24c-7 -6 -14 -8 -23 -8s-16 2 -23 8Z",
      c
    ),
  }),
  topknot: (c) => ({
    back: fill("M50 10c-4 0 -7 3 -7 6s3 5 7 5 7 -2 7 -5 -3 -6 -7 -6Z", c),
    front: fill(
      "M28 44c1 -15 12 -22 22 -22s21 7 22 22c-7 -5 -13 -7 -22 -7s-15 2 -22 7Z",
      c
    ),
  }),
  short: (c) => ({
    back: "",
    front: fill(
      "M27 47c0 -19 12 -25 23 -25s23 6 23 25c-7 -7 -14 -9 -23 -9s-16 2 -23 9Z",
      c
    ),
  }),
  buzz: (c) => ({
    back: "",
    front: fill(
      "M29 45c1 -14 11 -20 21 -20s20 6 21 20c-6 -5 -13 -6 -21 -6s-15 1 -21 6Z",
      c
    ),
  }),
  sidepart: (c) => ({
    back: "",
    front:
      fill(
        "M27 46c0 -19 13 -25 23 -25s23 7 23 24c-6 -6 -12 -9 -19 -9 -9 0 -18 4 -27 10Z",
        c
      ) + `<path d="M44 26q10 3 20 12" fill="none" ${STROKE}/>`,
  }),
  spiky: (c) => ({
    back: "",
    front: fill(
      "M27 46l3 -15 5 12 5 -17 5 15 5 -15 5 17 4 -12 3 15c-7 -6 -13 -8 -21 -8s-16 2 -23 8Z",
      c
    ),
  }),
  long: (c) => ({
    back: fill(
      "M23 44c0 -16 12 -24 27 -24s27 8 27 24v38q-6 -3 -11 -1l-2 -22h-28l-2 22q-5 -2 -11 1Z",
      c
    ),
    front: fill(
      "M27 46c0 -18 12 -25 23 -25s23 7 23 25c-7 -7 -14 -9 -23 -9s-16 2 -23 9Z",
      c
    ),
  }),
  bob: (c) => ({
    back: fill(
      "M24 45c0 -17 12 -25 26 -25s26 8 26 25v20q0 8 -6 10l-3 -30h-34l-3 30q-6 -2 -6 -10Z",
      c
    ),
    front: fill(
      "M27 46c0 -18 12 -25 23 -25s23 7 23 25c-7 -6 -14 -8 -23 -8s-16 2 -23 8Z",
      c
    ),
  }),
  ponytail: (c) => ({
    back:
      fill(
        "M70 34c10 4 12 20 8 34 -2 7 -6 11 -9 12 3 -6 4 -12 2 -18 -2 -7 -5 -12 -9 -16Z",
        c
      ),
    front: fill(
      "M28 46c0 -18 12 -24 22 -24s22 6 22 24c-7 -6 -13 -8 -22 -8s-15 2 -22 8Z",
      c
    ),
  }),
  pigtails: (c) => ({
    back:
      fill("M24 46c-8 2 -11 12 -8 22 2 6 6 9 9 9 -3 -5 -4 -10 -3 -16 1 -6 2 -11 2 -15Z", c) +
      fill("M76 46c8 2 11 12 8 22 -2 6 -6 9 -9 9 3 -5 4 -10 3 -16 -1 -6 -2 -11 -2 -15Z", c),
    front: fill(
      "M28 46c0 -18 12 -24 22 -24s22 6 22 24c-7 -6 -13 -8 -22 -8s-15 2 -22 8Z",
      c
    ),
  }),
  locs: (c) => ({
    back:
      `<g fill="${c}" ${STROKE}>` +
      [26, 32, 68, 74].map((x) => `<rect x="${x - 2.5}" y="40" width="5" height="42" rx="2.5"/>`).join("") +
      "</g>",
    front: fill(
      "M27 46c0 -19 12 -25 23 -25s23 6 23 25c-7 -7 -14 -9 -23 -9s-16 2 -23 9Z",
      c
    ),
  }),
  bald: () => ({ back: "", front: "" }),
  hijab: (f) => ({
    back: fill(
      "M22 46c0 -20 13 -30 28 -30s28 10 28 30c0 6 -1 12 -3 18l6 22h-62l6 -22c-2 -6 -3 -12 -3 -18Z",
      f
    ),
    front: fill(
      "M26 60c0 16 10 26 24 26s24 -10 24 -26c-4 12 -13 18 -24 18s-20 -6 -24 -18Z",
      f
    ),
  }),
};
const HAIR_BIG_TOP = ["afro", "curly", "cloud", "bun", "topknot", "spiky", "pigtails"];

/* ── headwear — painted last, over hair ── */
const HATS = {
  none: () => "",
  cap: (c) =>
    fill("M25 42c1 -16 13 -24 25 -24s24 8 25 24c-8 -6 -17 -8 -25 -8s-17 2 -25 8Z", c) +
    fill("M25 42c-9 0 -15 4 -16 8 3 0 5 -1 8 -2 8 -3 20 -4 33 -4Z", c) +
    `<circle cx="50" cy="18" r="2.2" fill="${c}" ${STROKE}/>`,
  bucket: (c) =>
    fill("M27 42c0 -16 10 -25 23 -25s23 9 23 25Z", c) +
    fill("M16 42c0 5 15 8 34 8s34 -3 34 -8c-4 -3 -12 -4 -22 -4h-24c-10 0 -18 1 -22 4Z", c),
  beanie: (c) =>
    fill("M26 43c0 -18 12 -25 24 -25s24 7 24 25c-8 -5 -16 -7 -24 -7s-16 2 -24 7Z", c) +
    fill("M24 40c8 6 44 6 52 0v6c-8 6 -44 6 -52 0Z", c),
  headphones: () =>
    `<path d="M24 52c-1 -22 53 -22 52 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    `<rect x="18" y="47" width="9" height="16" rx="4" fill="${INK}" ${STROKE}/>` +
    `<rect x="73" y="47" width="9" height="16" rx="4" fill="${INK}" ${STROKE}/>`,
  headband: (c) =>
    fill("M27 41c13 -5 33 -5 46 0v6c-13 -5 -33 -5 -46 0Z", c),
  flower: () => "", // handled separately so it can sit atop any hair
};
const HATS_NEED_SHORT = ["cap", "bucket", "beanie"];

// A little 5-petal flower tucked to the side of the hair.
const flowerAt = (x, y, petal, centre) =>
  `<g transform="translate(${x} ${y})">` +
  [0, 72, 144, 216, 288]
    .map(
      (deg) =>
        `<ellipse cx="0" cy="-4.2" rx="2.6" ry="4" fill="${petal}" ${STROKE} transform="rotate(${deg})"/>`
    )
    .join("") +
  `<circle cx="0" cy="0" r="2.4" fill="${centre}" ${STROKE}/></g>`;

/* ── gender-presentation feature pools ──
 * Each avatar is generated for a presentation ("female" | "male" | "neutral")
 * so pickers can filter by the user's gender. Neutral avatars appear in every
 * filtered view. Pools only steer hair/accessory odds — skin tones, faces,
 * glasses and hats stay shared across all of them.
 */
const HAIR_POOLS = {
  // Female avatars use clearly feminine silhouettes only — flowing/tied hair.
  // The androgynous rounded shapes (afro/curly/cloud/locs) read as male even
  // with earrings, and top-knot shapes (bun/topknot) read as a turban, so both
  // are kept out of the female pool. `long` is listed twice for a soft bias.
  female: ["long", "long", "bob", "bob", "ponytail", "pigtails"],
  male: ["short", "buzz", "spiky", "sidepart", "afro", "curly", "locs", "bald"],
  neutral: ["short", "buzz", "curly", "afro", "cloud", "locs", "topknot", "bob"],
};
// What a fitted hat (cap/bucket/beanie) falls back to over big hair.
const FITTED_HAT_HAIR = {
  female: ["long", "bob"],
  male: ["short", "buzz", "bald"],
  neutral: ["short", "buzz", "bob"],
};
// Hairstyles that read clearly feminine on their own.
const FEMININE_HAIR = ["long", "bob", "bun", "ponytail", "pigtails", "hijab"];

/* ── assemble one avatar from a seed ── */
function buildAvatar(seed, presentation = "neutral") {
  const rng = mulberry32(seed);
  const tags = [presentation];

  const skin = pick(rng, SKINS);
  const grayHair = chance(rng, 0.16);
  const hairColor = grayHair ? pick(rng, HAIR_GRAY) : pick(rng, HAIR_DARK);

  let style = pick(rng, HAIR_POOLS[presentation]);
  // Accessories stay occasional so bare faces remain the norm. Female avatars
  // only ever wear soft feminine accents (headband/flower) — the hat-shaped
  // covers (cap/bucket/beanie/headphones) hide the hair and read as a turban on
  // a rounded head, so they're kept to male/neutral avatars only.
  const HAT_POOL =
    presentation === "female"
      ? ["headband", "flower", "flower"]
      : ["cap", "bucket", "beanie", "headphones", "headband", "flower"];
  let hat = chance(rng, presentation === "male" ? 0.2 : 0.25)
    ? pick(rng, HAT_POOL)
    : "none";
  let earring = "none";
  if (presentation === "female" && chance(rng, 0.45)) earring = pick(rng, ["stud", "hoop"]);
  else if (presentation === "neutral" && chance(rng, 0.2)) earring = "stud";
  // Clean & friendly: most men are clean-shaven; when they do have facial hair
  // it leans to light stubble rather than a heavy beard.
  let beard =
    presentation === "male" && chance(rng, 0.35)
      ? pick(rng, ["stubble", "stubble", "beard", "mustache"])
      : "none";

  // Constraints so combinations stay coherent.
  if (style === "hijab") {
    hat = "none";
    earring = "none";
  }
  if (HATS_NEED_SHORT.includes(hat) && HAIR_BIG_TOP.includes(style)) {
    // A brimmed/fitted hat can't sit over big volume hair — shorten it.
    style = pick(rng, FITTED_HAT_HAIR[presentation]);
  }
  // Flower / headband / headphones can layer over anything.

  // Gender-clarity guarantees. Some hairstyles (afro/curly/cloud/locs/topknot,
  // or a fitted-hat fallback) read androgynous on their own, so make sure each
  // avatar carries a presentation cue:
  //   • female → any non-feminine hairstyle always wears an earring
  //   • male   → androgynous hair always carries facial hair; never an earring
  // This keeps every avatar clearly the gender it was generated for.
  const ANDROGYNOUS_HAIR = ["afro", "curly", "cloud", "locs", "topknot"];
  // A fitted hat (cap/bucket/beanie) hides most of the hair, so the hairstyle
  // can no longer carry the feminine cue — force an earring in that case too.
  const hidesHair = HATS_NEED_SHORT.includes(hat);
  if (
    presentation === "female" &&
    earring === "none" &&
    (!FEMININE_HAIR.includes(style) || hidesHair)
  ) {
    earring = pick(rng, ["stud", "hoop"]);
  }
  if (presentation === "male") {
    earring = "none";
    if (ANDROGYNOUS_HAIR.includes(style) && beard === "none") {
      // Keep the light-stubble bias so androgynous hair still reads male
      // without looking heavily bearded.
      beard = pick(rng, ["stubble", "stubble", "beard"]);
    }
  }

  const fabric = pick(rng, FABRIC);
  const hair = HAIR[style](style === "hijab" ? fabric : hairColor);

  // Gendered expression pools. Female → soft, pretty (gentle eyes + a smile);
  // the startled "wide" / flat "neutral" combos read awkward, not beautiful.
  // Male → confident and friendly (clear eyes, a smile/smirk, defined brows);
  // the droopy "sleepy" / blank "neutral" / surprised "o" combos read tired.
  const eyes =
    presentation === "female"
      ? pick(rng, ["happy", "ovals", "dots", "happy", "ovals"])
      : presentation === "male"
      ? pick(rng, ["dots", "ovals", "happy", "dots"])
      : pick(rng, Object.keys(EYES));
  const brow =
    presentation === "male"
      ? pick(rng, ["none", "flat", "raised", "flat"])
      : pick(rng, ["none", "none", "flat", "raised"]);
  const nose = pick(rng, Object.keys(NOSES));
  const mouth =
    presentation === "female"
      ? pick(rng, ["smile", "soft", "smile"])
      : presentation === "male"
      ? pick(rng, ["smile", "soft", "smile", "soft"])
      : pick(rng, Object.keys(MOUTHS));
  const glasses = pick(rng, ["none", "none", "none", "none", "none", "none", "round", "square", "sun"]);
  const showBlush = chance(
    rng,
    presentation === "female" ? 0.55 : presentation === "male" ? 0 : 0.2
  );
  const showFreckles = chance(rng, 0.18);

  // Tags power the optional search box.
  tags.push(style, eyes, mouth);
  if (glasses !== "none") tags.push("glasses", glasses === "sun" ? "sunglasses" : glasses);
  if (hat !== "none") tags.push(hat, "hat");
  if (beard !== "none") tags.push(beard, "beard");
  if (earring !== "none") tags.push("earrings");
  if (grayHair) tags.push("gray");
  if (style === "hijab") tags.push("wrap", "scarf");

  // Layer order matters: back hair → head → ears → front hair → face → extras.
  const head = fill(blob(50, 51, 24, 26.5, 12, 0.04, mulberry32(seed + 7)), skin);
  const ears = style === "hijab"
    ? ""
    : `<circle cx="26" cy="55" r="4.5" fill="${skin}" ${STROKE}/><circle cx="74" cy="55" r="4.5" fill="${skin}" ${STROKE}/>`;

  const blushEls = showBlush
    ? `<ellipse cx="36" cy="58" rx="4" ry="2.6" fill="${BLUSH}" opacity="0.55"/><ellipse cx="64" cy="58" rx="4" ry="2.6" fill="${BLUSH}" opacity="0.55"/>`
    : "";
  const freckleEls = showFreckles
    ? `<g fill="${INK}" opacity="0.5"><circle cx="42" cy="56" r="0.8"/><circle cx="45" cy="58" r="0.8"/><circle cx="55" cy="58" r="0.8"/><circle cx="58" cy="56" r="0.8"/></g>`
    : "";

  const hatEls =
    hat === "flower"
      ? ""
      : HATS[hat](grayHair ? "#4A463D" : pick(rng, ["#2E2A24", "#4A463D", "#6B6459"]));
  const extraFlowerChance =
    presentation === "female" ? 0.18 : presentation === "neutral" ? 0.08 : 0.03;
  const flowerEls =
    hat === "flower" ||
    // Only tuck an extra flower onto an otherwise bare head — never stack it on
    // top of a headband/hat, which looks cluttered.
    (hat === "none" && chance(rng, extraFlowerChance) && style !== "hijab")
      ? flowerAt(30, 30, pick(rng, FLOWER), "#E9C15E")
      : "";
  if (flowerEls) tags.push("flower");

  // A pair of eyelashes at the outer corners — a soft, pretty feminine cue.
  const lashEls =
    presentation === "female"
      ? `<path d="M${EYE_L - 4} ${EYE_Y - 3}l-2.4 -2" fill="none" ${STROKE}/>` +
        `<path d="M${EYE_L - 4.5} ${EYE_Y - 1}l-2.6 -0.6" fill="none" ${STROKE}/>` +
        `<path d="M${EYE_R + 4} ${EYE_Y - 3}l2.4 -2" fill="none" ${STROKE}/>` +
        `<path d="M${EYE_R + 4.5} ${EYE_Y - 1}l2.6 -0.6" fill="none" ${STROKE}/>`
      : "";

  const inner =
    hair.back +
    head +
    ears +
    EARRINGS[earring]() +
    hair.front +
    BROWS[brow]() +
    EYES[eyes]() +
    lashEls +
    NOSES[nose]() +
    BEARDS[beard](hairColor) +
    MOUTHS[mouth]() +
    blushEls +
    freckleEls +
    GLASSES[glasses]() +
    hatEls +
    flowerEls;

  // Features are drawn on a 100×100 grid but only ink the middle ~60% of it,
  // which made avatars float small and off-centre inside circular frames. The
  // tighter viewBox crops the canvas to the head (centre ≈ 50,48) so faces
  // fill the frame consistently; explicit width/height give the SVG a real
  // intrinsic size so object-fit sizing behaves the same in every browser.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="10 8 80 80" fill="none">${inner}</svg>`;

  return {
    id: `doodle-${presentation}-${seed}`,
    gender: presentation,
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    tags: Array.from(new Set(tags)),
  };
}

/* ── the published avatar set ──
 * Exactly 10 female + 10 male avatars (20 total). Seeds are spread apart so
 * consecutive avatars look clearly different, and every one carries a clear
 * gender cue (see the clarity guarantees in buildAvatar).
 */
const FEMALE_AVATARS = Array.from({ length: 10 }, (_, i) => buildAvatar(i * 1013 + 101, "female"));
const MALE_AVATARS = Array.from({ length: 10 }, (_, i) => buildAvatar(i * 2027 + 419, "male"));

// Interleave the pools so the unfiltered grid reads as a mixed crowd.
const interleaved = [];
const maxLen = Math.max(FEMALE_AVATARS.length, MALE_AVATARS.length);
for (let i = 0; i < maxLen; i++) {
  if (FEMALE_AVATARS[i]) interleaved.push(FEMALE_AVATARS[i]);
  if (MALE_AVATARS[i]) interleaved.push(MALE_AVATARS[i]);
}
export const DOODLE_AVATARS = interleaved;

/**
 * Subset of the avatar set for a gender label ("Male"/"Female", any casing).
 * Neutral avatars are always included; unknown/empty labels return everything.
 */
export const avatarsForGender = (genderLabel = "") => {
  const key = String(genderLabel).trim().toLowerCase();
  if (key === "male") return DOODLE_AVATARS.filter((a) => a.gender !== "female");
  if (key === "female") return DOODLE_AVATARS.filter((a) => a.gender !== "male");
  return DOODLE_AVATARS;
};

/** Stable avatar URL from a specific presentation pool — used for seed data.
 *  Anything other than "female"/"male" (e.g. an unknown gender) draws from the
 *  full mixed set. */
export const getGenderAvatar = (presentation, index = 0) => {
  const list =
    presentation === "female" ? FEMALE_AVATARS
    : presentation === "male" ? MALE_AVATARS
    : DOODLE_AVATARS;
  return list[index % list.length].url;
};

export const getDoodleAvatarById = (id) =>
  DOODLE_AVATARS.find((a) => a.id === id) || null;

/**
 * Upgrade a doodle data-URI saved before the tighter avatar framing (the old
 * `viewBox="0 0 100 100"` emit) to the current framing, so stored profile
 * images stay pixel-identical to freshly generated ones. Non-doodle images
 * (uploads, http URLs) pass through untouched.
 */
const OLD_SVG_ATTRS = encodeURIComponent('viewBox="0 0 100 100"');
const NEW_SVG_ATTRS = encodeURIComponent('width="100" height="100" viewBox="10 8 80 80"');
export const upgradeDoodleAvatarUrl = (url) =>
  typeof url === "string" && url.startsWith("data:image/svg+xml,")
    ? url.replace(OLD_SVG_ATTRS, NEW_SVG_ATTRS)
    : url;
