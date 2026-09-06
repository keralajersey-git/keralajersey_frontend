/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        built: ['BuiltTitlingSB', 'sans-serif'],
        dancing: ['DancingScript', 'cursive'],
      },
    },
  },
  plugins: [],
}

