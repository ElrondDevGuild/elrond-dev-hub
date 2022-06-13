/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4952FC",
          dark: "#27AE7D",
        },
        secondary: {
          DEFAULT: "#F6F7F9",
          dark: "#0C0E2D",
        },
      },
    },
  },
  plugins: [],
};
