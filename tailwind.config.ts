import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./features/**/*.{ts,tsx,mdx}",
    "./providers/**/*.{ts,tsx,mdx}",
    "./hooks/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "4rem"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      screens: {
        "3xl": "1920px"
      }
    }
  }
} satisfies Config;

export default config;
