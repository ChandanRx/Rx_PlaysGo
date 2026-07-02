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
        /* Design-system tokens — matches the coral + lavender palette */
        brand: {
          DEFAULT: "#FF3C1F",   /* vivid coral-red */
          hover:   "#E82E12",
          soft:    "#FFF0ED",
          border:  "#FFC9BF",
        },
        secondary: {
          DEFAULT: "#C4A8FF",   /* soft lavender */
          soft:    "#F0EBFF",
          border:  "#D8CAFF",
        },
        accent: {
          DEFAULT: "#FF6B2B",   /* warm orange for tiles / highlights */
        },
        surface: {
          bg:     "#F9F7F4",    /* warm off-white page background */
          card:   "#FFFFFF",
          input:  "#FFFFFF",
          border: "#E8E3DC",
          hover:  "#EDE9E3",
        },
        ink: {
          DEFAULT: "#111111",   /* near-black headings */
          body:    "#3D3835",
          muted:   "#7A736A",
          faint:   "#B0A89E",
        },
      },
      borderRadius: {
        "pill":    "999px",
        "card":    "18px",
        "card-lg": "24px",
      },
      boxShadow: {
        card:          "0 2px 12px rgba(30,20,10,0.06)",
        "card-hover":  "0 8px 32px rgba(30,20,10,0.10)",
        brand:         "0 4px 14px rgba(255,60,31,0.32)",
        "brand-hover": "0 6px 20px rgba(255,60,31,0.42)",
        sidebar:       "0 8px 32px rgba(30,20,10,0.07)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        /* Coral → Lavender diagonal — use as bg-[image:var(--...)] or via className */
        "brand-gradient":  "linear-gradient(135deg, #FF3C1F 0%, #C4A8FF 100%)",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
