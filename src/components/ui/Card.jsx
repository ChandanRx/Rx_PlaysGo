import React, { forwardRef } from "react";

const base = "relative overflow-hidden border transition-[transform,box-shadow,border-color] duration-200";

const variants = {
  panel: "bg-[var(--bg-card)] border-[var(--border-subtle)] rounded-2xl shadow-[0_2px_12px_rgba(28,32,18,0.06)] hover:shadow-[0_8px_28px_rgba(28,32,18,0.10)]",
  item:  "bg-[var(--bg-card)] border-[var(--border-subtle)] rounded-2xl shadow-[0_2px_10px_rgba(28,32,18,0.05)] hover:border-[var(--brand-border)] hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(28,32,18,0.09)] cursor-pointer transform-gpu will-change-transform",
  modal: "bg-[var(--bg-card)] border-[var(--border-subtle)] rounded-2xl shadow-[0_20px_60px_rgba(28,32,18,0.14)]",
  dark:  "bg-[var(--text-heading)] text-[var(--selected-fg)] border-[var(--border-subtle)] rounded-2xl shadow-xl",
  yellow:"bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] text-[var(--on-brand)] border-transparent rounded-2xl shadow-[0_8px_24px_rgba(var(--brand-rgb),0.32)]",
  light: "bg-[var(--brand-soft)] border-[var(--brand-border)] rounded-2xl text-[var(--text-body)]",
  outline:"bg-[var(--bg-card)] border-2 border-[var(--brand)] rounded-2xl text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--on-brand)]",
  glass: "bg-[var(--bg-card)]/85 backdrop-blur-xl border-[var(--border-subtle)]/30 rounded-2xl shadow-[0_8px_32px_rgba(28,32,18,0.07)]",
};

const Card = forwardRef(
  ({ as: Tag = "div", children, className = "", variant = "panel", hover = true, padding = true, ...props }, ref) => (
    <Tag
      ref={ref}
      className={`${base} ${variants[variant] ?? variants.panel} ${padding ? "p-6" : ""} ${hover ? "hover:scale-[1.005] transform-gpu will-change-transform" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
);
Card.displayName = "Card";
export default Card;
