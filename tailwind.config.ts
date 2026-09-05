import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        night: "#090b0a",
        stone: {
          DEFAULT: "#151812",
          deep: "#10130f",
        },
        parchment: {
          DEFAULT: "#ddd1b7",
          dim: "#a99e88",
        },
        moss: "#72805d",
        brass: {
          DEFAULT: "#b18a48",
          hi: "#d1ad67",
        },
        oxblood: "#672f2c",
      },
      borderColor: {
        DEFAULT: "rgba(221,209,183,.14)",
        rule: "rgba(221,209,183,.14)",
        faint: "rgba(221,209,183,.07)",
      },
      maxWidth: {
        measure: "62ch",
      },
      letterSpacing: {
        seal: "0.34em",
      },
      transitionTimingFunction: {
        instrument: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
