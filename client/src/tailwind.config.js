/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          slate: {
            950: '#020617', // Deep space background
          },
          cyan: {
            500: '#06b6d4', // Neon glow color
          }
        },
      },
    },
    plugins: [],
  }