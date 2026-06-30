"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  applyCategoryTheme,
  getStoredAppCategory,
} from "../shared/appPreferences";

const CategoryThemeSync = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/createpost") {
      const stored = getStoredAppCategory();
      if (stored) {
        applyCategoryTheme(stored);
      }
      return;
    }

    const storedCategory = getStoredAppCategory();
    applyCategoryTheme(storedCategory);
  }, [pathname]);

  useEffect(() => {
    const handleCategoryChange = () => {
      applyCategoryTheme(getStoredAppCategory());
    };

    window.addEventListener("playsgo-category-change", handleCategoryChange);
    return () =>
      window.removeEventListener("playsgo-category-change", handleCategoryChange);
  }, []);

  return null;
};

export default CategoryThemeSync;
