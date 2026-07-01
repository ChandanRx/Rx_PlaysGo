const STORAGE_KEY = "playsgo_app_category";
export const CATEGORY_CHANGE_EVENT = "playsgo-category-change";

export const APP_CATEGORIES = ["Players", "Local Help", "For Sale"];

export const CATEGORY_LABELS = {
  Players: "Sports",
  "Local Help": "Helper",
  "For Sale": "Sale",
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
