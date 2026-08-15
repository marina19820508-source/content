import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#24211f",
        cream: "#fff8ed",
        orange: { 50: "#fff5e8", 100: "#ffe6c2", 400: "#ff9a3d", 500: "#f47b20", 600: "#d95f0b" },
      },
      boxShadow: { soft: "0 14px 38px rgba(98, 61, 27, 0.10)" },
    },
  },
  plugins: [],
} satisfies Config;
