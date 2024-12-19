/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors : {
          // primary : "#00acb4",
          // secondary : "#058187"
          primary: '#2563eb', // Custom blue color
         dark: '#1f2937',   // Dark gray
        }
      },
    },
    plugins: [],
  }
  