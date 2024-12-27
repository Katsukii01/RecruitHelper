/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        sky: "#87CEEB", // Niebieskie niebo
        mint: "#B5EAD7", // Miętowy odcień
        breeze: "#F0FFFF", // Świeży błękit
        deepSea: "#1E3A8A", // Głęboka woda
        navy: "#0D223A", // Granatowy
        night: "#061526", // Nocny morski
        snow: "#FFFFFF", // Śnieżnobiały
      },
      boxShadow: {
        card: "0px 35px 120px -15px #87CEEB", // Lekki, niebieski cień
        customDefault: "0 15px 30px rgba(0, 0, 0, 0.5), 0 5px 10px rgba(0, 0, 0, 0.2)",
        customHover: "0 25px 50px rgba(0, 0, 0, 0.7), 0 10px 20px rgba(0, 0, 0, 0.3)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/cool-breeze-bg.png')", // Delikatny, uspokajający wzór
      },
    },
  },
  plugins: [],
};
