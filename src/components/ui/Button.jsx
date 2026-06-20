import React from "react";

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#89f336]/70 disabled:pointer-events-none disabled:opacity-60";

const variantClasses = {
  primary:
    "bg-[#89f336] text-zinc-950 shadow-md hover:bg-yellow-300",
  secondary:
    "border border-[#89f336]/40 bg-white/80 text-zinc-900 shadow-sm hover:border-yellow-300 hover:bg-yellow-100",
  ghost:
    "border border-transparent bg-transparent text-zinc-700 hover:border-[#89f336]/40 hover:bg-white/70",
  danger:
    "border border-yellow-400 bg-yellow-100 text-zinc-950 hover:bg-yellow-200",
};

const sizeClasses = {
  sm: "px-3 py-2",
  md: "px-4 py-2",
  lg: "px-5 py-3",
  icon: "h-10 w-10 p-0",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
