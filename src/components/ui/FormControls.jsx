import React from "react";

const base =
  "w-full rounded-[12px] border border-[#E8EDF5] bg-[#F8FAFC] px-3.5 py-2.5 text-[13.5px] text-[#0F1623] outline-none transition " +
  "placeholder:text-[#9CA3AF] " +
  "focus:border-[#FF7A00] focus:bg-white focus:ring-2 focus:ring-[#FF7A00]/10 " +
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
