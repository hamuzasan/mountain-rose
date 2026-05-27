import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        warmIvory: "#FAF7F1",
        bone: "#F7F1E8",
        sand: "#D8C3A5",
        espresso: "#2B1A12",
        darkLeather: "#3A2418",
        saddle: "#8B5A35",
        cognac: "#A66A3F",
        deepRose: "#7A2E3A",
        mutedRose: "#A35D6A",
        dustyRose: "#C89AA2",
        antiqueGold: "#B08D57",
        brass: "#9C7A43",
        charcoal: "#1F1B16",
        softBlack: "#2A2520",
        mutedBrown: "#5B4636",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
      },
      borderRadius: {
        soft: "0.375rem",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(43, 26, 18, 0.08)",
      },
    },
  },
};

export default config;
