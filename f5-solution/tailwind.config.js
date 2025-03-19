/* @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    backgroundColor: (theme) => ({
      ...theme("colors"),
      ["primary"]: "#1877F2",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      ["primary"]: "#1877F2",
    }),
  },
  plugins: [],
};
