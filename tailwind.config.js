/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,tsx,jsx}", "./components/**/*.{js,ts,tsx,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: "#F6757A",
        secondary: "#F9BD72",
        darkBg: "#191724",
        lightBg: "#F7F3EE",
        cardBg: "rgba(255,255,255,0.05)",
      },
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
      },
    },
  },
  darkMode: "media",
  plugins: [],
};
