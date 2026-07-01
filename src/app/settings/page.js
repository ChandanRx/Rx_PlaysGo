"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Data from "../../shared/data";
import {
  getCategoryLabel, getCategoryThemeValue,
  getStoredAppCategory, setStoredAppCategory,
} from "../../shared/appPreferences";

const CATEGORY_ICONS = { Players: "⚽", "Local Help": "🤝", "For Sale": "🛍️" };
const CATEGORY_BG    = { Players: "from-yellow-50 to-amber-50", "Local Help": "from-blue-50 to-sky-50", "For Sale": "from-purple-50 to-violet-50" };

const SettingsPage = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => { setActiveCategory(getStoredAppCategory()); }, []);

  const chooseCategory = (cat) => {
    setStoredAppCategory(cat);
    setActiveCategory(cat);
    router.push("/");
  };

  return (
    <div className="space-y-5">

      {/* header card */}
      <Card className="p-5 md:p-6" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9CA3AF]">Settings</p>
        <h1 className="mt-1.5 text-[22px] font-black text-[#0F1623]">Choose your app mode</h1>
        <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-[#6B7280]">
          PlaysGo shows one category at a time — Sports, Helper, or Sale. Your feed, posts, and theme match your selection.
        </p>
        {activeCategory && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F0F4FF] px-3 py-1 text-[12px] font-semibold text-[#0F1623]">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Current: {getCategoryLabel(activeCategory)} mode
          </span>
        )}
      </Card>

      {/* mode cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Data.CategoryData.map((item) => {
          const active = activeCategory === item.name;
          return (
            <div
              key={item.name}
              className={`category-theme--${getCategoryThemeValue(item.name)} relative overflow-hidden rounded-[20px] border-2 bg-gradient-to-br p-5 transition-all duration-200 ${CATEGORY_BG[item.name] || "from-gray-50 to-slate-50"} ${
                active
                  ? "border-[#0F1623] shadow-[0_4px_20px_rgba(15,23,42,0.15)]"
                  : "border-[#E8EDF5] hover:border-[#FF7A00] hover:shadow-[0_4px_16px_rgba(255,122,0,0.12)]"
              }`}
            >
              {active && (
                <span className="absolute right-3 top-3 rounded-full bg-[#0F1623] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Active
                </span>
              )}
              <div className="text-4xl mb-3">{CATEGORY_ICONS[item.name] || "📌"}</div>
              <h2 className="text-[17px] font-black text-[#0F1623]">{getCategoryLabel(item.name)}</h2>
              <p className="mt-0.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">{item.name}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#374151]">{item.description}</p>
              <button
                type="button"
                onClick={() => chooseCategory(item.name)}
                className={`mt-4 w-full rounded-full py-2.5 text-[13px] font-bold transition-all ${
                  active
                    ? "bg-[#0F1623] text-white"
                    : "bg-[#FF7A00] text-white shadow-[0_4px_12px_rgba(255,122,0,0.3)] hover:bg-[#F26A00]"
                }`}
              >
                {active ? "✓ Currently active" : `Use ${getCategoryLabel(item.name)}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsPage;
