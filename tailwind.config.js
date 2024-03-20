/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js,css}",
    "./views/**/*.ejs"
  ],
  theme: {
    extend: {
      colors : {
        'primary' : '#E60023',
        'dark' : '#111111',
        'light' : '#EFEFEF',
        'lightHover' : '#d7d7d7',
        'muted' : '#717171'
      }
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
    require('@tailwindcss/forms'),
  ],
}

