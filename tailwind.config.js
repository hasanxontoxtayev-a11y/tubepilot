/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f7f8',
          100: '#efeff1',
          200: '#dcdce1',
          300: '#bebec7',
          400: '#9998a6',
          500: '#7a788b',
          600: '#626072',
          700: '#4f4d5c',
          800: '#43414d',
          900: '#18181b',
          950: '#09090b',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
