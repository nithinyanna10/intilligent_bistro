/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bistro: {
          // README — Production Polish palette
          bg: "#08080A",
          card: "#16161A",
          elevated: "#1B1B20",
          border: "rgba(255,255,255,0.08)",
          borderHi: "rgba(255,255,255,0.14)",
          edge: "rgba(255,255,255,0.04)",
          text1: "#EDEDF0",
          text2: "#9A9AA3",
          text3: "#5C5C65",
          accent: "#FF6A1A",
          accentHi: "#FF7A2E",
          ai: "#A39CFF",
          success: "#3DD68C",
          danger: "#E5484D",

          // Back-compat aliases so unedited components don't immediately break.
          // Removed once every screen is on the new tokens.
          text: "#EDEDF0",
          textMuted: "#9A9AA3",
          textSubtle: "#5C5C65",
          accentSoft: "#FF7A2E",
          successFg: "#3DD68C",
          warning: "#F59E0B",
        },
      },
      fontFamily: {
        display: ["System"],
      },
    },
  },
  plugins: [],
};
