/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
            dark: "#9194DD",
          },
        },
      },
      borderWidth: {
        0.5: "0.5px",
      },
      height: {
        0.5: "0.5px",
      },
    },
  },
  variants: {
    scrollbar: ["dark"],
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar"), require("@tailwindcss/line-clamp")],
};
