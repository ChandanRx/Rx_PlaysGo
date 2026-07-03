import React from "react";

const base =
  "w-full rounded-sm border-0 bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13.5px] text-[var(--text-heading)] outline-none transition " +
  "placeholder:text-[var(--text-faint)] " +
  "focus:bg-[var(--bg-card)] focus:shadow-[0_0_0_2px_var(--brand)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export const Input = ({ className = "", ...props }) => (
  <input className={`${base} ${className}`} {...props} />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea className={`${base} min-h-[96px] resize-y ${className}`} {...props} />
);

export const Select = ({ className = "", children, ...props }) => (
  <select className={`${base} ${className}`} {...props}>
    {children}
  </select>
);
