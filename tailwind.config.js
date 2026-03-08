const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./dist/**/*.html",
    "./scripts/build.ts",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ["Helvetica Neue", 'Arial', 'Hiragino Sans', 'Meiryo', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}
