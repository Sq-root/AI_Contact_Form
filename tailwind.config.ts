import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apl: {
          ink:     "var(--apl-ink)",
          yellow:  "var(--apl-yellow)",
          red:     "var(--apl-red)",
          surface: "var(--apl-surface)",
          line:    "var(--apl-line)",
          muted:   "var(--apl-muted)",
          body:    "var(--apl-body)",
        },
      },
      fontFamily: {
        sans:  ["var(--font-inter)",  "sans-serif"],
        anton: ["var(--font-anton)",  "sans-serif"],
        mono:  ["var(--font-mono)",   "monospace"],
      },
      keyframes: {
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        aplPulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
        aplSpin: {
          to: { transform: "rotate(360deg)" },
        },
        heroPan: {
          "0%, 100%": { transform: "scale(1.12) translate(0,0)" },
          "50%":      { transform: "scale(1.18) translate(-2%,-1%)" },
        },
        aplFloat: {
          "0%, 100%": { transform: "translate(0,0) rotate(0deg)" },
          "50%":      { transform: "translate(-12px,-18px) rotate(180deg)" },
        },
        lineUp: {
          from: { transform: "translateY(110%)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        fadeUp: {
          from: { transform: "translateY(16px)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        stepIn: {
          from: { transform: "translateX(20px)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        aplPop: {
          from: { transform: "scale(0.6)", opacity: "0" },
          to:   { transform: "scale(1)",   opacity: "1" },
        },
      },
      animation: {
        "ticker":     "ticker 22s linear infinite",
        "ticker-fast":"ticker 18s linear infinite",
        "apl-pulse":  "aplPulse 1.4s ease-in-out infinite",
        "apl-spin":   "aplSpin 14s linear infinite",
        "hero-pan":   "heroPan 18s ease-in-out infinite",
        "apl-float":  "aplFloat 5s ease-in-out infinite",
        "line-up-1":  "lineUp 0.8s 0.2s  cubic-bezier(0.2,0.8,0.2,1) both",
        "line-up-2":  "lineUp 0.8s 0.35s cubic-bezier(0.2,0.8,0.2,1) both",
        "line-up-3":  "lineUp 0.8s 0.5s  cubic-bezier(0.2,0.8,0.2,1) both",
        "line-up-4":  "lineUp 0.8s 0.65s cubic-bezier(0.2,0.8,0.2,1) both",
        "fade-up":    "fadeUp 0.9s 1s both",
        "step-in":    "stepIn 0.5s cubic-bezier(0.2,0.8,0.2,1)",
        "apl-pop":    "aplPop 0.6s cubic-bezier(0.2,1.4,0.4,1)",
      },
    },
  },
  plugins: [],
};

export default config;
