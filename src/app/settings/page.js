"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/ui/Card";
import Data from "../../shared/data";
import { Check, Moon, Sun } from "lucide-react";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "../../shared/lucideIcons";
import {
  getCategoryLabel, getCategoryThemeValue,
  getStoredAppCategory, setStoredAppCategory,
} from "../../shared/appPreferences";

const STORAGE_KEY = "quibly_theme";
const CATEGORY_BG = { Players: "from-yellow-50 to-amber-50", "Local Help": "from-blue-50 to-sky-50", "For Sale": "from-purple-50 to-violet-50" };

const SettingsPage = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("");
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActiveCategory(getStoredAppCategory());
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const resolved = saved === "dark" ? "dark" : saved === "light" ? "light" :
      (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(resolved);
    setMounted(true);
  }, []);

  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    document.body.dataset.theme = t;
    window.localStorage.setItem(STORAGE_KEY, t);
    setTheme(t);
  };

  const chooseCategory = (cat) => {
    setStoredAppCategory(cat);
    setActiveCategory(cat);
    router.push("/");
  };

  return (
    <div className="space-y-5">

      {/* ── Appearance — mobile only (desktop has ThemeToggle in left sidebar) ── */}
      <Card className="p-5 md:p-6 lg:hidden" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Appearance</p>
        <h2 className="mt-1.5 text-[18px] font-black text-[var(--text-heading)]">Theme</h2>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">Choose how PlaysGo looks on your device.</p>

        {mounted && (
          <div className="mt-4 grid grid-cols-2 gap-3">

            {/* Light */}
            <button
              type="button"
              onClick={() => applyTheme("light")}
              className={`relative flex flex-col items-center gap-2.5 rounded-sm border-2 px-4 py-5 transition-all duration-200 ${
                theme === "light"
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-[0_4px_16px_rgba(255,60,31,0.15)]"
                  : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--brand)]"
              }`}
            >
              {theme === "light" && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)]">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              )}
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${
                theme === "light" ? "bg-[var(--brand)] text-white" : "bg-[var(--bg-hover)] text-[var(--text-muted)]"
              }`}>
                <Sun className="h-6 w-6" strokeWidth={2} />
              </div>
              <span className={`text-[13px] font-bold ${theme === "light" ? "text-[var(--brand)]" : "text-[var(--text-body)]"}`}>
                Light
              </span>
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() => applyTheme("dark")}
              className={`relative flex flex-col items-center gap-2.5 rounded-sm border-2 px-4 py-5 transition-all duration-200 ${
                theme === "dark"
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-[0_4px_16px_rgba(255,60,31,0.15)]"
                  : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--brand)]"
              }`}
            >
              {theme === "dark" && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)]">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              )}
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${
                theme === "dark" ? "bg-[var(--brand)] text-white" : "bg-[var(--bg-hover)] text-[var(--text-muted)]"
              }`}>
                <Moon className="h-6 w-6" strokeWidth={2} />
              </div>
              <span className={`text-[13px] font-bold ${theme === "dark" ? "text-[var(--brand)]" : "text-[var(--text-body)]"}`}>
                Dark
              </span>
            </button>

          </div>
        )}
      </Card>

      {/* header card */}
      <Card className="p-5 md:p-6" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">Settings</p>
        <h1 className="mt-1.5 text-[22px] font-black text-[var(--text-heading)]">Choose your app mode</h1>
        <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-[var(--text-muted)]">
          PlaysGo shows one category at a time — Sports, Helper, or Sale. Your feed, posts, and theme match your selection.
        </p>
        {activeCategory && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-[12px] font-semibold text-[var(--text-heading)]">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Current: {getCategoryLabel(activeCategory)} mode
          </span>
        )}
      </Card>

      {/* mode cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Data.CategoryData.map((item) => {
          const active = activeCategory === item.name;
          const Icon = CATEGORY_ICONS[item.name] || DEFAULT_CATEGORY_ICON;

          return (
            <div
              key={item.name}
              className={`category-theme--${getCategoryThemeValue(item.name)} relative overflow-hidden rounded-sm border-2 bg-gradient-to-br p-5 transition-all duration-200 ${CATEGORY_BG[item.name] || "from-gray-50 to-slate-50"} ${
                active
                  ? "border-[var(--text-heading)] shadow-[0_4px_20px_rgba(30,20,10,0.14)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--brand)] hover:shadow-[0_4px_16px_rgba(255,60,31,0.12)]"
              }`}
            >
              {active && (
                <span className="absolute right-3 top-3 rounded-full bg-[var(--text-heading)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--selected-fg)]">
                  Active
                </span>
              )}
              <Icon className="mb-3 h-9 w-9 text-[var(--brand)]" strokeWidth={2} />
              <h2 className="text-[17px] font-black text-[var(--text-heading)]">{getCategoryLabel(item.name)}</h2>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">{item.name}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-body)]">{item.description}</p>
              <button
                type="button"
                onClick={() => chooseCategory(item.name)}
                className={`mt-4 w-full rounded-full py-2.5 text-[13px] font-bold transition-all ${
                  active
                    ? "bg-[var(--text-heading)] text-[var(--selected-fg)]"
                    : "bg-[var(--brand)] text-white shadow-[0_4px_12px_rgba(255,60,31,0.28)] hover:bg-[var(--brand-hover)]"
                }`}
              >
                {active ? (
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <Check className="h-4 w-4" strokeWidth={2.25} />
                    Currently active
                  </span>
                ) : `Use ${getCategoryLabel(item.name)}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsPage;
