/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
      "bubble-gum": "#ff7798",
      "dark-bubble": "#300707"
    },
    extend: {
      fontFamily:{
        modak: ['Modak', 'system-ui'],
        Roboto: ["Roboto", "sans-serif"],
        Righteous: ["Righteous", "sans-serif"]
      }
    },
  },
  plugins: [],
}