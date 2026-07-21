"use client";

import React from "react";

/* Horizontal bar chart — counts for named categories. Thin bars (14px) grow
 * from a shared hairline baseline with a 4px rounded data-end; every row
 * carries its label and value in text tokens (values in a fixed right column
 * so they can never be clipped by a short bar), so no tooltip is needed and
 * color is never the only identity channel. */

const AdminBarChart = ({ data, ariaLabel = "Bar chart" }) => {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div role="img" aria-label={`${ariaLabel}: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`}>
      <div className="space-y-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3 text-[12.5px]">
            <span className="w-24 shrink-0 truncate text-right font-semibold text-[var(--text-body)] sm:w-28">
              {d.label}
            </span>
            {/* shared baseline: hairline the bars grow from */}
            <div className="min-w-0 flex-1 border-l border-[var(--border-strong)] py-0.5 pl-px">
              <div
                className="h-[14px] rounded-r-[4px] transition-[width] duration-300"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  minWidth: d.value > 0 ? 3 : 0,
                  background: d.color,
                }}
              />
            </div>
            <span className="w-7 shrink-0 text-right font-bold tabular-nums text-[var(--text-heading)]">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBarChart;
