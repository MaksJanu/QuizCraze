/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nav: {
          primary: '#4f46e5',    // główny kolor
          secondary: '#D9EAFD',
          third: "#F8FAFC",  // dodatkowy
          accent: '#BFBBA9',    // akcent
          dark: '#BCCCDC',      // ciemny
          light: '#9AA6B2'      // jasny
        },

        auth: {
          primary: '#F8FAFC',    // główny kolor
          secondary: '#D9EAFD',  // dodatkowy
          accent: '#BFBBA9',    // akcent
          dark: '#BCCCDC',      // ciemny
          light: '#9AA6B2'      // jasny
        },

        quiz: {
          primary: '#F8FAFC',    // główny kolor
          secondary: '#D9EAFD',  // dodatkowy
          accent: '#BFBBA9',    // akcent
          dark: '#BCCCDC',      // ciemny
          light: '#9AA6B2'      // jasny
        },

        background: "#F8FAFC",
        foreground: "#BCCCDC",
      },
    },
  },
  plugins: [daisyui],

};
