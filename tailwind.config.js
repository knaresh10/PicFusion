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
        montserrat : ['Montserrat', 'sans-serif'],
        poppins : ['Poppins', 'sans-serif']
      },
      colors : {
        'primary' : '#0745d3',
        'secondary' : '#fe6236',
        'tertiary' : '#fab775',
        'bg-primary' : '#fffbff',
        'stroke-color' : '#d1d5e4',
        'text-color' : '#0f1417',
        'special' : '#0023d6'
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

