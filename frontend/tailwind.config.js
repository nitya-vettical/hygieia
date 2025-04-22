/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0891b2",
        secondary: "#e2e8f0"
      }
    },
  },
  plugins: [],
}
