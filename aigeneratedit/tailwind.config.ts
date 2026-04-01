import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "var(--font-clash)", "'Space Grotesk'", "sans-serif"],
        body:    ["var(--font-inter)", "'Inter'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn:  "10px",
        pill: "999px",
      },
      boxShadow: {
        card:       "0 2px 20px rgba(0,0,0,0.06)",
        "card-lg":  "0 8px 40px rgba(0,0,0,0.10)",
        "soul":     "0 0 28px rgba(200,241,53,0.32)",
      },
      keyframes: {
        scanLine: {
          "0%":   { transform: "translateX(-100%)", opacity: "0" },
          "8%":   { opacity: "1" },
          "92%":  { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        livePulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200,241,53,0.7)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(200,241,53,0)" },
        },
        marqueeLeft: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "scan":      "scanLine 2.5s ease-in-out infinite",
        "pulse-dot": "livePulse 2s ease-in-out infinite",
        "marquee":   "marqueeLeft 36s linear infinite",
        "fade-up":   "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in":  "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
