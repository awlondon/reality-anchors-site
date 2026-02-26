import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#0B0F17",
        steel: "#1A2A40",
        indigoCalm: "#5B6EE1",
      },
    },
  },
  plugins: [],
};

export default config;
