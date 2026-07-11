"use client";

import React from "react";
import { m } from "framer-motion";
import Data from "../../shared/data";
import { hoverScale, staggerContainer, staggerItem } from "../../shared/motionPresets";

const GameList = ({ activeCategory, onSelectCategory }) => {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-brand)]">
            Categories V1
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-zinc-950)] md:text-2xl">
            Browse the three core Plays Go categories
          </h3>
        </div>
        <p className="hidden text-sm text-[var(--text-zinc-600)] md:block">
          Players, local help, and nearby items for sale.
        </p>
      </div>

      <m.div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {Data.CategoryData.map((item) => {
          const isActive = activeCategory === item.name;

          return (
            <m.button
              key={item.name}
              type="button"
              className={`rounded-2xl border bg-[var(--bg-card)]/86 p-4 text-left shadow-sm transition-all duration-300 ${
                isActive
                  ? "border-[var(--hero-brand)] bg-[var(--hero-brand-soft)] shadow-[0_12px_30px_rgba(48,3,16,0.18)]"
                  : "border-[var(--hero-brand)]/20 hover:border-[var(--hero-brand)]/45 hover:bg-[var(--bg-card)]/96 hover:shadow-[0_12px_30px_rgba(48,3,16,0.12)]"
              }`}
              variants={staggerItem}
              whileHover={hoverScale}
              onClick={() => onSelectCategory(item.name)}
            >
              <div className="text-3xl">{item.icon}</div>
              <h4 className="mt-3 text-sm font-semibold text-[var(--text-zinc-950)] md:text-base">
                {item.name}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-zinc-600)] md:text-sm">
                {item.description}
              </p>
            </m.button>
          );
        })}
      </m.div>
    </section>
  );
};

export default GameList;
