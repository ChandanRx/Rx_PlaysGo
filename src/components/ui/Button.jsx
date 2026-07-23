import React from "react";

/* Base — tight letter spacing, asymmetric corners (tr/bl xl, tl/br md) */
const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-tight " +
  "rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md " +
  "transition-[background-color,background-image,color,border-color,box-shadow,transform,filter] duration-200 outline-none select-none " +
  "focus-visible:ring-2 focus-visible:ring-[rgba(var(--btn-grad-shadow),0.45)] " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";

/* ── Global filled button — the coral→yellow gradient, driven entirely by
   the --btn-* tokens in globals.css. Change those tokens to recolor every
   filled button at once. ── */
const FILLED =
  "bg-[linear-gradient(var(--btn-grad-angle),var(--btn-grad-from),var(--btn-grad-to))] " +
  "text-[var(--btn-grad-fg)] font-bold " +
  "shadow-[0_4px_14px_rgba(var(--btn-grad-shadow),0.35)] " +
  "hover:brightness-[1.04] hover:shadow-[0_6px_20px_rgba(var(--btn-grad-shadow),0.45)]";

const variantClasses = {
  /* ── Filled action buttons — all share the one global gradient ── */
  primary: FILLED,
  yellow:  FILLED,
  lime:    FILLED,   // legacy alias
  dark:    FILLED,

  /* ── Ghost outlined — accent on hover ── */
  secondary:
    "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-body)] " +
    "hover:border-[var(--btn-accent)] hover:text-[var(--btn-accent)] hover:bg-[var(--btn-accent-soft)]",

  /* ── Transparent text — accent wash on hover ── */
  ghost:
    "bg-transparent text-[var(--text-muted)] " +
    "hover:bg-[var(--btn-accent-soft)] hover:text-[var(--text-heading)]",

  /* ── Danger — kept semantic red on purpose ── */
  danger:
    "border border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)] " +
    "hover:bg-[var(--danger-border)]",

  /* ── Light tinted — accent tint ── */
  light:
    "bg-[var(--btn-accent-soft)] text-[var(--btn-accent)] border border-[var(--btn-accent-soft)] " +
    "hover:brightness-95",

  /* ── Outlined — fills with the gradient on hover ── */
  outline:
    "border-2 border-[var(--btn-accent)] bg-transparent text-[var(--btn-accent)] " +
    "hover:bg-[linear-gradient(var(--btn-grad-angle),var(--btn-grad-from),var(--btn-grad-to))] " +
    "hover:border-transparent hover:text-[var(--btn-grad-fg)]",

  /* ── Success — kept semantic green on purpose ── */
  success:
    "bg-[#22C55E] text-white hover:bg-[#16A34A]",

  /* ── White surface — accent border/text on hover ── */
  white:
    "bg-[var(--bg-card)] text-[var(--text-body)] border border-[var(--border-subtle)] shadow-sm " +
    "hover:border-[var(--btn-accent)] hover:text-[var(--btn-accent)]",
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
