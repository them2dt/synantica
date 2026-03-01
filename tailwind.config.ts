import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors');

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-instrument-serif)', '"Instrument Serif"', 'serif'],
      },
      colors: {
        background: colors.slate[50],
        foreground: colors.neutral[950],
        card: {
          DEFAULT: colors.white,
          foreground: colors.neutral[950],
        },
        popover: {
          DEFAULT: colors.white,
          foreground: colors.neutral[950],
        },
        primary: {
          DEFAULT: colors.black,
          foreground: colors.white,
        },
        secondary: {
          DEFAULT: colors.slate[50],
          foreground: colors.slate[600],
        },
        muted: {
          DEFAULT: colors.slate[50],
          foreground: colors.slate[500],
        },
        accent: {
          DEFAULT: colors.slate[100],
          foreground: colors.black,
        },
        success: colors.emerald[600],
        processing: {
          DEFAULT: colors.amber[500],
          foreground: colors.amber[950],
        },
        error: {
          DEFAULT: colors.red[50],
          foreground: colors.red[600],
        },
        destructive: {
          DEFAULT: colors.red[600],
          foreground: colors.white,
        },
        border: colors.slate[200],
        input: colors.slate[200],
        ring: colors.black,
        chart: {
          "1": colors.slate[900],
          "2": colors.slate[700],
          "3": colors.slate[500],
          "4": colors.slate[300],
          "5": colors.slate[100],
        },
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
