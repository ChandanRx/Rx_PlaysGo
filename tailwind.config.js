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
        /* Design-system tokens — sage + charcoal + chartreuse palette.
           Values resolve through the CSS variables in globals.css so
           they follow dark mode and category re-tints automatically. */
        brand: {
          DEFAULT: "var(--brand)",        /* charcoal olive */
          hover:   "var(--brand-hover)",
          soft:    "var(--brand-soft)",
          border:  "var(--brand-border)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",    /* olive lime */
          soft:    "var(--secondary-soft)",
          border:  "var(--secondary-border)",
        },
        accent: {
          DEFAULT: "var(--accent)",       /* chartreuse for tiles / highlights */
        },
        surface: {
          bg:     "var(--bg-page)",       /* soft sage page background */
          card:   "var(--bg-card)",
          input:  "var(--bg-input)",
          border: "var(--border-subtle)",
          hover:  "var(--bg-hover)",
        },
        ink: {
          DEFAULT: "var(--text-heading)", /* charcoal olive headings */
          body:    "var(--text-body)",
          muted:   "var(--text-muted)",
          faint:   "var(--text-faint)",
        },
      },
      borderRadius: {
        "pill":    "999px",
        "card":    "20px",
        "card-lg": "28px",
      },
      boxShadow: {
        card:          "0 2px 12px rgba(28,32,18,0.06)",
        "card-hover":  "0 8px 32px rgba(28,32,18,0.10)",
        brand:         "0 4px 14px rgba(var(--brand-rgb),0.32)",
        "brand-hover": "0 6px 20px rgba(var(--brand-rgb),0.42)",
        sidebar:       "0 8px 32px rgba(28,32,18,0.07)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        /* Indigo → Teal diagonal — use as bg-[image:var(--...)] or via className */
        "brand-gradient":  "linear-gradient(135deg, var(--brand) 0%, var(--secondary) 100%)",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
