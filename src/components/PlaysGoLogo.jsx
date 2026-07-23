"use client";

import React from "react";

const PlaysGoLogo = ({ variant = "dark", iconOnly = false, className = "" }) => {
  const isDark = variant !== "light";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon mark */}
      <img
        src="/LOGO.png"
        alt="PlaysGo"
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />

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
