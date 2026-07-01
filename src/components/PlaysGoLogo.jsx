"use client";

import React from "react";

const PlaysGoLogo = ({ variant = "dark", iconOnly = false, className = "" }) => {
  const isDark = variant !== "light";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon mark */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-[12px] shadow-sm"
        style={{ background: "linear-gradient(135deg,#FF7A00,#FF9F43)" }}
      >
        <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 6C22 6 14 14 14 24C14 39 32 58 32 58C32 58 50 39 50 24C50 14 42 6 32 6Z" fill="white" />
          <circle cx="32" cy="22" r="5" fill="#FF7A00" />
          <path d="M24 36C26 31 30 29 32 29C34 29 38 31 40 36" stroke="#FF7A00" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="leading-none">
          <p className="text-[20px] font-black tracking-tight" style={{ color: isDark ? "#0F1623" : "#FFFFFF" }}>
            Plays<span style={{ color: "#FF7A00" }}>Go</span>
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: isDark ? "#9CA3AF" : "#FFD8B5" }}>
            FIND · PLAY · CONNECT
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaysGoLogo;
