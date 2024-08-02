/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class", // only generate classes
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        "::-webkit-scrollbar": {
          width: "6px",
          height: "4px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#9c9fa2",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#babcbd",
          "border-radius": "100vh",
        },
        "::-webkit-scrollbar-track": {
          "border-radius": "100vh",
        },
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
}

