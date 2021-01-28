
const production = !process.env.ROLLUP_WATCH;

module.exports = {
  theme: {
    fontFamily: {
      'main': ['Roboto', 'sans-serif']
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      coolGreen: {
        'default': '#2F9E9E'
      }
    }
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
  purge: {
    content: [
      "./src/**/*.svelte",
      "./public/index.html"
    ],
    enabled: production
      },
};
