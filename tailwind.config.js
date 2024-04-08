/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js,css}",
    "./views/**/*.ejs"
  ],
  theme: {
    extend: {
      fontFamily : {
        esthetique : ['esthetique', 'sans-serif'],
        raleway : ['Raleway', 'sans-serif'],
        montserrat : ['Montserrat', 'sans-serif']
      },
      colors : {
        'primary' : '#0745d3',
        'secondary' : '#fa712a',
        'tertiary' : '#fab775',
        'bg-primary' : '#fefdfe',
        'stroke-color' : '#3dad3cf',
        'text-color' : '#181b41',
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

