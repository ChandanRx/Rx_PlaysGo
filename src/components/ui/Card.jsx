import React, { forwardRef } from "react";

const base = "relative overflow-hidden border transition-[transform,box-shadow,border-color] duration-200";

const variants = {
  panel: "bg-[var(--bg-card)] border-[var(--border-subtle)] rounded-[18px] shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_8px_28px_rgba(15,23,42,0.11)]",
  item:  "bg-[var(--bg-card)] border-[var(--border-subtle)] rounded-[18px] shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:border-[var(--brand-border)] hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(15,23,42,0.10)] cursor-pointer",
  modal: "bg-[var(--bg-card)] border-[var(--border-subtle)] rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.16)]",
  dark:  "bg-[var(--text-heading)] text-[var(--bg-card)] border-[var(--border-subtle)] rounded-[18px] shadow-xl",
  yellow:"bg-gradient-to-br from-[var(--brand)] to-[#FF9F43] text-white border-transparent rounded-[18px] shadow-[0_8px_24px_rgba(255,122,0,0.35)]",
  light: "bg-[var(--brand-soft)] border-[var(--brand-border)] rounded-[18px] text-[var(--text-body)]",
  outline:"bg-[var(--bg-card)] border-2 border-[var(--brand)] rounded-[18px] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white",
  glass: "bg-[var(--bg-card)]/85 backdrop-blur-xl border-[var(--border-subtle)]/30 rounded-[18px] shadow-[0_8px_32px_rgba(15,23,42,0.08)]",
};

const Card = forwardRef(
  ({ as: Tag = "div", children, className = "", variant = "panel", hover = true, padding = true, ...props }, ref) => (
    <Tag
      ref={ref}
      className={`${base} ${variants[variant] ?? variants.panel} ${padding ? "p-6" : ""} ${hover ? "hover:scale-[1.005]" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
);
Card.displayName = "Card";
export default Card;
