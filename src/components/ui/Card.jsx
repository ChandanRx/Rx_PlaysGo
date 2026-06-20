import React, { forwardRef } from "react";

const variantClasses = {
  panel:
    "rounded-2xl border border-[#89f336]/25 bg-white/85 text-zinc-950 shadow-[0_18px_60px_rgba(137,243,54,0.18)] backdrop-blur",
  item:
    "overflow-hidden rounded-md border border-[#89f336]/25 bg-white/90 text-zinc-950 shadow-[0_18px_50px_rgba(137,243,54,0.16)] backdrop-blur transition-all duration-300 hover:border-[#89f336]",
  modal:
    "border border-[#89f336]/25 bg-white/95 text-zinc-950 shadow-[0_18px_60px_rgba(137,243,54,0.2)] backdrop-blur",
};

const Card = forwardRef(
  ({ as: Component = "div", children, className = "", variant = "panel", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

export default Card;
