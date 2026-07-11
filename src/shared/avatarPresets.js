// Pre-built avatar set for sign-up. Each avatar is a self-contained SVG data URI,
// so it renders anywhere an <img src> is used — no network assets or files needed.

const toDataUri = (inner) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${inner}</svg>`
  )}`;

// A friendly abstract portrait: a head + shoulders silhouette on a gradient.
const buildAvatar = (id, from, to, accent) => ({
  id,
  url: toDataUri(
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs>` +
      `<rect width="100" height="100" fill="url(#${id})"/>` +
      `<circle cx="50" cy="40" r="16" fill="${accent}"/>` +
      `<path d="M20 84c0-16 13-26 30-26s30 10 30 26z" fill="${accent}"/>`
  ),
});

export const AVATAR_PRESETS = [
  buildAvatar("coral", "#FF9A8B", "#FF6A88", "#FFFFFF"),
  buildAvatar("ocean", "#4FACFE", "#00F2FE", "#FFFFFF"),
  buildAvatar("grape", "#A18CD1", "#FBC2EB", "#FFFFFF"),
  buildAvatar("mint", "#43E97B", "#38F9D7", "#FFFFFF"),
  buildAvatar("sunset", "#FA709A", "#FEE140", "#FFFFFF"),
  buildAvatar("dusk", "#30CFD0", "#330867", "#FFFFFF"),
  buildAvatar("ember", "#F6D365", "#FDA085", "#FFFFFF"),
  buildAvatar("forest", "#0BA360", "#3CBA92", "#FFFFFF"),
];
