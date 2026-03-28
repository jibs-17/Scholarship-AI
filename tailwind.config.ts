import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          navy: "#1A476B",
          "navy-dark": "#143A5A",
          mist: "#78A2C0",
          gold: "#C4A165",
          "gold-deep": "#A8844F",
          play: {
            sky: "#7DD3FC",
            lilac: "#C4B5FD",
            peach: "#FBCFE8",
            mint: "#6EE7B7",
          },
        },
      },
      backgroundImage: {
        "page-gradient":
          "radial-gradient(ellipse 90% 60% at 15% -5%, rgba(125, 211, 252, 0.35), transparent 50%), radial-gradient(ellipse 70% 50% at 85% 5%, rgba(196, 181, 253, 0.3), transparent 45%), radial-gradient(ellipse 80% 45% at 50% 100%, rgba(251, 207, 232, 0.35), transparent 55%), linear-gradient(180deg, #fef9ff 0%, #f0f9ff 35%, #fffbeb 70%, #f0fdf4 100%)",
        "btn-fun":
          "linear-gradient(135deg, #38bdf8 0%, #818cf8 45%, #f472b6 100%)",
      },
      boxShadow: {
        "brand-soft":
          "0 12px 40px -12px rgba(26, 71, 107, 0.12), 0 4px 20px -4px rgba(56, 189, 248, 0.15)",
        "gold-glow": "0 8px 28px -6px rgba(196, 161, 101, 0.45)",
        playful: "0 8px 32px -8px rgba(129, 140, 248, 0.35)",
      },
      animation: {
        wiggle: "wiggle 2.5s ease-in-out infinite",
        "card-in": "card-in 0.45s ease-out both",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "card-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
