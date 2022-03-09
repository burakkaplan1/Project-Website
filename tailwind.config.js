// tailwind.config.js
const tailwindcss = require("tailwindcss");
const plugin = require("tailwindcss/plugin");
const lineClamp = require("@tailwindcss/line-clamp");
const forms = require("@tailwindcss/forms");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        mclaren: ["McLaren", "sans"],
        courier: ["Courier", "sans-serif"],
      },
      lineClamp: {
        10: "10",
        12: "12",
      },
      display: ["group-hover"],
    },
  },
  variants: {
    lineClamp: ["responsive", "hover"],
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
  ],
};
