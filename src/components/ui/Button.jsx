import React from "react";

/* Base — matches reference: tight letter spacing, rounded-full pill */
const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-tight " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-200 outline-none select-none " +
  "focus-visible:ring-2 focus-visible:ring-[#FF3C1F]/40 " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";

const variantClasses = {
  /* ── Dark pill — EdTech "Dashboard" active nav style ── */
  primary:
    "rounded-full bg-[var(--text-heading)] text-[var(--selected-fg)] shadow-sm " +
    "hover:bg-[var(--text-heading)]/90 hover:shadow-md",

  /* ── Coral brand CTA ── */
  yellow:
    "rounded-full bg-[var(--brand)] text-white shadow-[0_4px_14px_rgba(255,60,31,0.32)] " +
    "hover:bg-[var(--brand-hover)] hover:shadow-[0_6px_20px_rgba(255,60,31,0.42)]",

  /* ── Ghost outlined ── */
  secondary:
    "rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-body)] " +
    "hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)]",

  /* ── Transparent text ── */
  ghost:
    "rounded-full bg-transparent text-[var(--text-muted)] " +
    "hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]",

  /* ── Danger ── */
  danger:
    "rounded-full border border-red-200 bg-red-50 text-red-600 " +
    "hover:bg-red-100",

  /* ── Dark (same as primary) ── */
  dark:
    "rounded-full bg-[var(--text-heading)] text-[var(--selected-fg)] shadow-sm hover:bg-[var(--text-heading)]/90",

  /* ── Light tinted ── */
  light:
    "rounded-full bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand-border)] " +
    "hover:bg-[var(--brand-border)]",

  /* ── Outlined yellow ── */
  outline:
    "rounded-full border-2 border-[var(--brand)] bg-transparent text-[var(--brand)] " +
    "hover:bg-[var(--brand)] hover:text-white",

  /* ── Success ── */
  success:
    "rounded-full bg-[#22C55E] text-white hover:bg-[#16A34A]",

  /* ── White surface ── */
  white:
    "rounded-full bg-[var(--bg-card)] text-[var(--text-body)] border border-[var(--border-subtle)] shadow-sm " +
    "hover:border-[var(--brand)] hover:text-[var(--brand)]",

  /* Alias kept for legacy usage */
  lime:
    "rounded-full bg-[var(--brand)] text-white shadow-[0_4px_14px_rgba(255,60,31,0.32)] " +
    "hover:bg-[var(--brand-hover)]",
};

const sizeClasses = {
  sm:     "h-8  px-4    text-[12px]",
  md:     "h-9  px-5    text-[13px]",
  lg:     "h-11 px-6    text-[14px]",
  xl:     "h-12 px-8    text-[15px]",
  icon:   "h-9  w-9  p-0 rounded-full",
  iconLg: "h-11 w-11 p-0 rounded-full",
};

const Button = ({
  children,
  className = "",
  variant   = "primary",
  size      = "md",
  type      = "button",
  ...props
}) => (
  <button
    type={type}
    className={`${baseClasses} ${variantClasses[variant] ?? variantClasses.primary} ${sizeClasses[size] ?? sizeClasses.md} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
