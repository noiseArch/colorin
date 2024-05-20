import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "toxic-slime": {
          "50": "rgb(239 254 241)",
          "100": "rgb(217 255 224)",
          "200": "rgb(182 252 195)",
          "300": "rgb(124 249 149)",
          "400": "rgb(76 237 108)",
          "500": "rgb(19 212 58)",
          "600": "rgb(9 176 43)",
          "700": "rgb(11 138 38)",
          "800": "rgb(15 108 35)",
          "900": "rgb(14 89 31)",
          "950": "rgb(1 50 13)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
