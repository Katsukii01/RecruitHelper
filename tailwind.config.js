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
      height: {
        'screen-10': '10vh',
        'screen-20': '20vh',
        'screen-30': '30vh',
        'screen-40': '40vh',
        'screen-50': '50vh',
        'screen-55': '55vh',
        'screen-60': '60vh',
        'screen-80': '80vh',
        'screen-90': '90vh',
        'screen-70': '70vh',
      },
      boxShadow: {
        card: "0px 35px 120px -15px #87CEEB", // Lekki, niebieski cień
        customDefault: "0 20px 40px rgba(0, 0, 0, 0.6), 0 10px 30px rgba(0, 0, 0, 0.3)",
        customBlue: "0 50px 50px rgba(0, 120, 255, 1), 0 20px 50px rgba(0, 120, 255, 1)",
        inset: "inset 0 -1px 3px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
