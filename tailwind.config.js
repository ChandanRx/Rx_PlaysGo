/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["line-clamp-none"],
  theme: {
    extend: {
      fontFamily: {
        /* Plus Jakarta Sans as the primary sans font */
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        /* Design-system tokens — easy to reference throughout */
        brand: {
          DEFAULT: "#FF7A00",
          hover:   "#F26A00",
          soft:    "#FFF3E8",
          border:  "#FFE0C2",
        },
        surface: {
          bg:     "#F0F4FF",   /* cool blue-gray page background */
          card:   "#FFFFFF",
          input:  "#F8FAFC",
          border: "#E8EDF5",
        },
        ink: {
          DEFAULT: "#0F1623",  /* near-black headings */
          muted:   "#6B7280",
          faint:   "#9CA3AF",
        },
      },
      borderRadius: {
        "pill": "999px",
        "card": "18px",
        "card-lg": "24px",
      },
      boxShadow: {
        card:    "0 2px 12px rgba(15,23,42,0.07)",
        "card-hover": "0 8px 32px rgba(15,23,42,0.12)",
        brand:   "0 4px 14px rgba(255,122,0,0.35)",
        "brand-hover": "0 6px 20px rgba(255,122,0,0.45)",
        sidebar: "0 8px 32px rgba(15,23,42,0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
