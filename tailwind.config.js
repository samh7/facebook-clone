/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte}"],
  theme: {
    screens: {
      sm: "540px",
      sm2: "658px",
      sm3: "876px",
      md: "978px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        light_greyish: "#cccccc",
      },
      width:{
        rem40: "40rem"
      }
    },
  },
  plugins: [],
};
