/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}", "./index.html"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    colors: {
      white: "#fff",
      black: "#000",
      current: "currentColor",
      transparent: "transparent",
      // in the abscence of a designer-provided color palette
      // all colors are named via cherangi: https://www.npmjs.com/package/cherangi
      grisaille: "#556073",
      "center-stage": "#FF5",
    },
    fontFamily: {
      nunito: "Nunito,sans-serif",
    },
    extends: {},
  },
  plugins: [],
};
