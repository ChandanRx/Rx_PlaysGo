const STORAGE_KEY = "playsgo_app_category";
export const CATEGORY_CHANGE_EVENT = "playsgo-category-change";

export const APP_CATEGORIES = ["Players", "Local Help", "For Sale"];

// The only categories exposed to end users right now. Keep APP_CATEGORIES as the
// full list of everything that exists; flip this back to APP_CATEGORIES (or add
// entries) to bring Helper/Sale back everywhere — no other code changes needed.
export const ACTIVE_APP_CATEGORIES = ["Players"];

export const CATEGORY_LABELS = {
  Players: "Sports",
  "Local Help": "Helper",
  "For Sale": "Sale",
};

export const isCategoryActive = (category) =>
  ACTIVE_APP_CATEGORIES.includes(category);

// Human-readable list of the active modes, e.g. "Sports" or "Sports, Helper,
// or Sale" — lets copy stay in sync with ACTIVE_APP_CATEGORIES automatically.
export const getActiveCategoryLabels = () =>
  ACTIVE_APP_CATEGORIES.map((category) => CATEGORY_LABELS[category] || category);

export const formatActiveCategoryList = (conjunction = "or") => {
  const labels = getActiveCategoryLabels();
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} ${conjunction} ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, ${conjunction} ${labels[labels.length - 1]}`;
};

export const getCategoryThemeValue = (category) => {
  if (category === "Players") return "players";
  if (category === "Local Help") return "local-help";
  if (category === "For Sale") return "for-sale";
  return "";
};

export const getCategoryLabel = (category) =>
  CATEGORY_LABELS[category] || category;

export const getStoredAppCategory = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(STORAGE_KEY) || "";
};

export const applyCategoryTheme = (category) => {
  if (typeof document === "undefined") {
    return;
  }

  const themeValue = getCategoryThemeValue(category);

  if (themeValue) {
    document.documentElement.dataset.categoryTheme = themeValue;
    document.body.dataset.categoryTheme = themeValue;
    return;
  }

  delete document.documentElement.dataset.categoryTheme;
  delete document.body.dataset.categoryTheme;
};

export const setStoredAppCategory = (category) => {
  if (typeof window === "undefined") {
    return;
  }

  if (category && APP_CATEGORIES.includes(category)) {
    window.localStorage.setItem(STORAGE_KEY, category);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  applyCategoryTheme(category);
  window.dispatchEvent(new CustomEvent(CATEGORY_CHANGE_EVENT, { detail: category }));
};
