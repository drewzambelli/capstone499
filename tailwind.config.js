/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        modak: ['Modak', 'system-ui'],
        Roboto: ["Roboto", "sans-serif"]
      }
    },
  },
  plugins: [],
}