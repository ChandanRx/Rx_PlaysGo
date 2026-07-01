"use client";

import React from "react";
import { motion } from "framer-motion";
import Data from "../../shared/data";

const GameList = ({ activeCategory, onSelectCategory }) => {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f1838]">
            Categories V1
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950 md:text-2xl">
            Browse the three core Plays Go categories
          </h3>
        </div>
        <p className="hidden text-sm text-zinc-600 md:block">
          Players, local help, and nearby items for sale.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Data.CategoryData.map((item, index) => {
          const isActive = activeCategory === item.name;

          return (
            <motion.button
              key={item.name}
              type="button"
              className={`rounded-md border bg-[#fff7f9]/86 p-4 text-left shadow-sm transition-all duration-300 ${
                isActive
                  ? "border-[#8f1838] bg-[#f7e5eb] shadow-[0_12px_30px_rgba(48,3,16,0.18)]"
                  : "border-[#8f1838]/20 hover:border-[#8f1838]/45 hover:bg-[#fff7f9]/96 hover:shadow-[0_12px_30px_rgba(48,3,16,0.12)]"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectCategory(item.name)}
            >
              <div className="text-3xl">{item.icon}</div>
              <h4 className="mt-3 text-sm font-semibold text-zinc-950 md:text-base">
                {item.name}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 md:text-sm">
                {item.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default GameList;
