import type { Config } from "tailwindcss"; // TypeScript type for Tailwind configuration

export default {
  darkMode: ["class"], // Enable class-based dark mode (add 'dark' class to toggle)
  content: [ // Tell Tailwind where to look for classes to purge unused CSS
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Scan pages directory for all file types
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scan components directory
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Scan app directory (Next.js 13+ app router)
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Scan src directory if it exists
  ],
  theme: {
    extend: { // Extend default Tailwind theme instead of overriding
      fontFamily: { // Custom font families using CSS variables
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'], // Primary sans-serif font
        heading: ['var(--font-clash-display)', 'system-ui', 'sans-serif'], // Custom heading font
      },
      colors: { // Custom color palette using CSS variables for theming
        background: "hsl(var(--background))", // Main background color
        foreground: "hsl(var(--foreground))", // Main text color
        card: { // Card component colors
          DEFAULT: "hsl(var(--card))", // Card background
          foreground: "hsl(var(--card-foreground))", // Card text color
        },
        popover: { // Popover/dropdown colors
          DEFAULT: "hsl(var(--popover))", // Popover background
          foreground: "hsl(var(--popover-foreground))", // Popover text color
        },
        primary: { // Primary brand colors
          DEFAULT: "hsl(var(--primary))", // Primary background
          foreground: "hsl(var(--primary-foreground))", // Primary text color
        },
        secondary: { // Secondary brand colors
          DEFAULT: "hsl(var(--secondary))", // Secondary background
          foreground: "hsl(var(--secondary-foreground))", // Secondary text color
        },
        muted: { // Muted/subtle colors
          DEFAULT: "hsl(var(--muted))", // Muted background
          foreground: "hsl(var(--muted-foreground))", // Muted text color
        },
        accent: { // Accent/highlight colors
          DEFAULT: "hsl(var(--accent))", // Accent background
          foreground: "hsl(var(--accent-foreground))", // Accent text color
        },
        destructive: { // Error/danger colors
          DEFAULT: "hsl(var(--destructive))", // Destructive background
          foreground: "hsl(var(--destructive-foreground))", // Destructive text color
        },
        border: "hsl(var(--border))", // Border color for elements
        input: "hsl(var(--input))", // Input field border color
        ring: "hsl(var(--ring))", // Focus ring color for accessibility
        chart: { // Chart/data visualization colors
          "1": "hsl(var(--chart-1))", // Chart color 1
          "2": "hsl(var(--chart-2))", // Chart color 2
          "3": "hsl(var(--chart-3))", // Chart color 3
          "4": "hsl(var(--chart-4))", // Chart color 4
          "5": "hsl(var(--chart-5))", // Chart color 5
        },
      },
      borderRadius: { // Custom border radius values using CSS variables
        lg: "var(--radius)", // Large border radius
        md: "calc(var(--radius) - 2px)", // Medium border radius (2px smaller)
        sm: "calc(var(--radius) - 4px)", // Small border radius (4px smaller)
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Add animation utilities plugin
} satisfies Config; // TypeScript type assertion for configuration validation
