"use client";

import React from "react";

const PlaysGoLogo = ({ variant = "dark", iconOnly = false, className = "" }) => {
  const isDark = variant !== "light";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon mark */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
        style={{ background: "linear-gradient(135deg,var(--brand),var(--secondary))" }}
      >
        <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="32"
            y="34"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="inherit"
            fontSize="34"
            fontWeight="900"
            letterSpacing="-2"
            fill="white"
          >
            P<tspan opacity="0.75">G</tspan>
          </text>
        </svg>
      </div>

      {!iconOnly && (
        <div className="leading-none">
          <p className="text-[20px] font-black tracking-tight" style={{ color: isDark ? "var(--text-heading)" : "#FFFFFF" }}>
            Plays<span style={{ color: "var(--brand)" }}>Go</span>
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: isDark ? "var(--text-muted)" : "rgba(255,255,255,.75)" }}>
            FIND · PLAY · CONNECT
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaysGoLogo;
