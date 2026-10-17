/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
        },
        dark: {
          900: "#090a0f",
          800: "#12141c",
          700: "#1c202e",
          600: "#2b3044",
        }
      }
    },
  },
  plugins: [],
};
