import React from "react";
import { m } from "framer-motion";

export const AccessCard = ({ children, title, subtitleLine1, subtitleLine2, code, stats }) => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-5 sm:p-8"
      style={{
        "--accent": "var(--brand)",
        "--ink": "var(--text-heading)",
        "--paper": "var(--bg-page)",
        backgroundColor: "var(--paper)",
      }}
    >
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1120px]"
      >
        {/* Decorative Outline Background */}
        <div
          className="absolute inset-0 max-lg:hidden -z-10"
          style={{ margin: "-16px", transform: "rotate(-0.35deg)" }}
        >
          <div
            className="w-full h-full relative"
            style={{
              padding: "1.5px",
              background: "var(--accent)",
              clipPath:
                "polygon(0 0, calc(100% - 78px) 0, 100% 78px, 100% 100%, 42px 100%, 0 calc(100% - 42px))",
            }}
          >
            <div
              className="w-full h-full"
              style={{
                background: "var(--paper)",
                clipPath:
                  "polygon(0 0, calc(100% - 77px) 0, 100% 77px, 100% 100%, 41px 100%, 0 calc(100% - 41px))",
              }}
            />
            {/* Hairlines & Crosshairs */}
            <div className="absolute -top-6 left-12 w-[1px] h-4 bg-[var(--accent)]" />
            <div className="absolute top-12 -right-6 w-4 h-[1px] bg-[var(--accent)]" />
            
            {/* Bottom ruler */}
            <div className="absolute -bottom-8 right-12 flex items-end gap-1.5 h-4 opacity-80">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-0.5 mr-2">
                Valid for local play
              </span>
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-[1px] bg-[var(--accent)] ${i % 4 === 0 ? 'h-3' : 'h-1.5'}`} />
              ))}
            </div>
            
            {/* Crosshairs */}
            <div className="absolute -top-3 -left-3 flex items-center justify-center">
              <div className="w-3 h-[1px] bg-[var(--accent)] absolute" />
              <div className="w-[1px] h-3 bg-[var(--accent)] absolute" />
            </div>
            <div className="absolute -bottom-3 -right-3 flex items-center justify-center">
              <div className="w-3 h-[1px] bg-[var(--accent)] absolute" />
              <div className="w-[1px] h-3 bg-[var(--accent)] absolute" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div
          className="relative flex flex-col lg:grid w-full overflow-hidden"
          style={{
            gridTemplateColumns: "1.3fr 1fr",
            clipPath: "polygon(0 0, calc(100% - 64px) 0, 100% 64px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
          }}
        >
          {/* Mobile cut fixes for CSS via inline style when < 1024px */}
          <style>{`
            @media (max-width: 1023px) {
              .mobile-clip {
                clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 20px 100%, 0 calc(100% - 20px)) !important;
              }
            }
          `}</style>
          <div className="mobile-clip absolute inset-0 -z-10 pointer-events-none" style={{ clipPath: 'inherit' }} />

          {/* LEFT COLUMN */}
          <div
            className="flex flex-col justify-between bg-[var(--ink)] text-[var(--paper)] p-8 md:p-12 lg:p-16"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
            }}
          >
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <svg className="h-6 w-auto text-[var(--paper)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2zm0 3.8L18.5 19H5.5L12 5.8z" />
                </svg>
                <span className="text-[18px] font-black tracking-tight uppercase">PlaysGo</span>
              </div>

              {/* Metadata strip */}
              <div className="flex border border-[var(--paper)]/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] mb-16 max-w-fit">
                <div className="px-3 py-1.5 border-r border-[var(--paper)]/20">Player Access</div>
                <div className="px-3 py-1.5 border-r border-[var(--paper)]/20 max-sm:hidden">Local Network</div>
                <div className="px-3 py-1.5 border-r border-[var(--paper)]/20">2026</div>
                <div className="px-3 py-1.5 text-[var(--accent)]">{code}</div>
              </div>

              {/* Oversized Headline */}
              <h1 className="font-black uppercase leading-[0.82] tracking-[-0.04em]">
                <div style={{ fontSize: "clamp(50px, 10cqi, 120px)" }}>{subtitleLine1}</div>
                <div className="text-[var(--accent)] ml-[0.5em]" style={{ fontSize: "clamp(50px, 10cqi, 120px)" }}>{subtitleLine2}</div>
              </h1>
            </div>

            {/* Stats Row */}
            {stats && (
              <div className="mt-20 pt-6 border-t border-[var(--paper)]/20 flex gap-8 sm:gap-12">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-[28px] sm:text-[36px] font-black leading-none">{value}</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] opacity-60">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div
            className="bg-[var(--paper)] text-[var(--ink)] flex flex-col p-8 md:p-12 lg:p-16 lg:pr-20"
            style={{
              clipPath: "polygon(0 0, calc(100% - 64px) 0, 100% 64px, 100% 100%, 0 100%, 0 0)",
            }}
          >
            <div className="mobile-clip-right absolute inset-0 -z-10 pointer-events-none" />
            <style>{`
              @media (max-width: 1023px) {
                .mobile-clip-right {
                  clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%, 0 0) !important;
                }
              }
            `}</style>
            
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-[3px] border-[var(--ink)] pb-4 mb-10 gap-3">
              <h2 className="text-[24px] font-black uppercase">{title}</h2>
            </div>

            {/* Form Content */}
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
};
