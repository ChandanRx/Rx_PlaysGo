import React from "react";

export const fieldBaseClass =
  "w-full rounded-xl border-0 bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13.5px] text-[var(--text-heading)] outline-none transition " +
  "placeholder:text-[var(--text-faint)] " +
  "focus:bg-[var(--bg-card)] focus:shadow-[0_0_0_2px_var(--brand)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export const Input = ({ className = "", ...props }) => (
  <input className={`${fieldBaseClass} ${className}`} {...props} />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea className={`${fieldBaseClass} min-h-[96px] resize-y ${className}`} {...props} />
);
