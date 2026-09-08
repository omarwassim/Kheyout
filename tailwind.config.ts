import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2B2420",
        clay: {
          DEFAULT: "#C9714E",
          dark: "#A85A3C",
          light: "#F5E4D8",
        },
        teal: {
          DEFAULT: "#3FA79A",
          dark: "#2E8378",
          light: "#E7F3F1",
        },
        mustard: {
          DEFAULT: "#E0A83E",
          light: "#FBEDD2",
        },
        cream: "#FBF5EC",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-quicksand)", "sans-serif"],
      },
      maxWidth: {
        "7xl": "80rem",
      },
      boxShadow: {
        soft: "0 20px 45px -25px rgba(43, 36, 32, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;