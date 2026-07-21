import React from "react";

/* Base — tight letter spacing, asymmetric corners (tr/bl xl, tl/br md) */
const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-tight " +
  "rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-200 outline-none select-none " +
  "focus-visible:ring-2 focus-visible:ring-[rgba(var(--brand-rgb),0.4)] " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";

const variantClasses = {
  /* ── Dark pill — EdTech "Dashboard" active nav style ── */
  primary:
    "bg-[var(--btn-solid-bg)] text-[var(--btn-solid-fg)] shadow-sm " +
    "hover:bg-[var(--btn-solid-hover)] hover:shadow-md",

  /* ── Brand CTA ── */
  yellow:
    "bg-[var(--brand)] text-[var(--on-brand)] shadow-[0_4px_14px_rgba(var(--brand-rgb),0.32)] " +
    "hover:bg-[var(--brand-hover)] hover:shadow-[0_6px_20px_rgba(var(--brand-rgb),0.42)]",

  /* ── Ghost outlined ── */
  secondary:
    "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-body)] " +
    "hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)]",

  /* ── Transparent text ── */
  ghost:
    "bg-transparent text-[var(--text-muted)] " +
    "hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]",

  /* ── Danger ── */
  danger:
    "border border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)] " +
    "hover:bg-[var(--danger-border)]",

  /* ── Dark (same as primary) ── */
  dark:
    "bg-[var(--btn-solid-bg)] text-[var(--btn-solid-fg)] shadow-sm hover:bg-[var(--btn-solid-hover)]",

  /* ── Light tinted ── */
  light:
    "bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand-border)] " +
    "hover:bg-[var(--brand-border)]",

  /* ── Outlined yellow ── */
  outline:
    "border-2 border-[var(--brand)] bg-transparent text-[var(--brand)] " +
    "hover:bg-[var(--brand)] hover:text-[var(--on-brand)]",

  /* ── Success ── */
  success:
    "bg-[#22C55E] text-white hover:bg-[#16A34A]",

  /* ── White surface ── */
  white:
    "bg-[var(--bg-card)] text-[var(--text-body)] border border-[var(--border-subtle)] shadow-sm " +
    "hover:border-[var(--brand)] hover:text-[var(--brand)]",

  /* Alias kept for legacy usage */
  lime:
    "bg-[var(--brand)] text-[var(--on-brand)] shadow-[0_4px_14px_rgba(var(--brand-rgb),0.32)] " +
    "hover:bg-[var(--brand-hover)]",
};

const sizeClasses = {
  sm:     "h-8  px-4    text-[12px]",
  md:     "h-9  px-5    text-[13px]",
  lg:     "h-11 px-6    text-[14px]",
  xl:     "h-12 px-8    text-[15px]",
  icon:   "h-9  w-9  p-0",
  iconLg: "h-11 w-11 p-0",
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
