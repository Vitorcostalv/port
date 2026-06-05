import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: {
          950: "#070b12",
          900: "#0b1019",
          850: "#101827",
          800: "#142034",
        },
        acid: {
          400: "#31f58f",
          500: "#18d879",
        },
        steel: {
          100: "#e8eef8",
          300: "#aebbd0",
          500: "#66758d",
        },
      },
      boxShadow: {
        line: "0 0 0 1px rgba(148, 163, 184, 0.16)",
        glow: "0 24px 80px rgba(49, 245, 143, 0.12)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(148,163,184,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ".light &");
    }),
  ],
};

export default config;
