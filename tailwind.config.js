/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4952FC",
          dark: "#27AE7D",
        },
        secondary: {
          DEFAULT: "#F4F5FF",
          dark: {
            DEFAULT: "#0C0E2D",
            lighter: "#12143F",
          },
        },
        scrollbar: "#FFFFFF",
        "scrollbar-thumb": "#DCE3F1",
        "scrollbar-dark": "#12143F",
        "scrollbar-dark-thumb": "#4A4F9F",
        theme: {
          border: {
            DEFAULT: "#DCE3F1",
            dark: "#4A4F9F",
          },
          title: {
            DEFAULT: "#1B1E56",
            dark: "#D3D6FF",
          },
          text: {
            DEFAULT: "#6B7280",
            dark: "#d8dafd",
            backup_dark: "#9194DD",
          },
        },
      },
      borderWidth: {
        0.5: "0.5px",
      },
    },
  },
  variants: {
    scrollbar: ["dark"],
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
};
