import React from "react";

const controlClasses =
  "w-full rounded-lg border border-[#89f336]/30 bg-white/85 p-3 text-zinc-950 outline-none transition placeholder-zinc-500 focus:border-[#89f336] focus:ring-2 focus:ring-[#89f336]/30";

export const Input = ({ className = "", ...props }) => (
  <input className={`${controlClasses} ${className}`} {...props} />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea className={`${controlClasses} min-h-[100px] ${className}`} {...props} />
);

export const Select = ({ className = "", children, ...props }) => (
  <select className={`${controlClasses} ${className}`} {...props}>
    {children}
  </select>
);
