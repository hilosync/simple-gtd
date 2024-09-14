import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        background: {
          50: "#E8E8E8",
          100: "#CFCFCF",
          200: "#A1A1A1",
          300: "#707070",
          400: "#424242",
          500: "#121212",
          600: "#0F0F0F",
          700: "#0A0A0A",
          800: "#080808",
          900: "#030303",
          950: "#030303",
        },
        darkPurple: {
          50: "#EFD6FA",
          100: "#E2B1F6",
          200: "#C25EED",
          300: "#A218DC",
          400: "#68108E",
          500: "#2E073F",
          600: "#250632",
          700: "#1B0425",
          800: "#110317",
          900: "#0A020E",
          950: "#030105",
        },
        grape: {
          50: "#F3E5FB",
          100: "#E7CAF6",
          200: "#CF96EE",
          300: "#B761E5",
          400: "#9D28DC",
          500: "#7A1CAC",
          600: "#601688",
          700: "#4A1169",
          800: "#320B46",
          900: "#190623",
          950: "#0C0312",
        },
        mediumOrchid: {
          50: "#F7EDFC",
          100: "#EFDCF9",
          200: "#DDB5F3",
          300: "#CD92ED",
          400: "#BD6FE7",
          500: "#AD49E1",
          600: "#9222CE",
          700: "#6C1999",
          800: "#471165",
          900: "#250935",
          950: "#13041A",
        },
        paleLavender: {
          50: "#FDFBFE",
          100: "#FBF6FE",
          200: "#F7EDFC",
          300: "#F3E5FB",
          400: "#EFDCF9",
          500: "#EBD3F8",
          600: "#C784EB",
          700: "#A335DF",
          800: "#70199E",
          900: "#380D4F",
          950: "#1C0628",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
