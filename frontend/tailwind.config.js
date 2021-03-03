const production = !process.env.ROLLUP_WATCH;
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    fontFamily: {
      main: ['Roboto', 'sans-serif'],
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg:
        '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl:
        '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
    screens: {
      xs: '300px',
      ...defaultTheme.screens,
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      lightdark: '#2E2E2E',
      dark: '#1E1E1E',
      darker: '#111111',
      black: colors.black,
      white: colors.white,
      pinkCard: 'rgb(245 193 191)',
      gray: { ...colors.trueGray, ...{ signIn: '#C4C4C4' } },
      blue: colors.blue,
      cyan: colors.cyan,
      lightBlue: colors.lightBlue,
      green: colors.green,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      shade: 'rgba(0, 121, 191, 0.3)',
      shadeDark: 'rgba(0, 0, 0, 0.3)',
      coolGreen: {
        light: '#a6d6d1',
        lessLight: 'rgb(47, 158, 158, .5)',
        default: '#2F9E9E',
        dark: '#2d9a9a',
        darkest: '#2b9090',
      },
      barBg: '#c7d2fe',
    },
    fill: {
      gray: '#555555',
    },
  },
  darkMode: 'class',
  plugins: [require('@tailwindcss/ui')],
  purge: {
    content: ['./src/**/*.svelte', './public/index.html'],
    enabled: production,
  },
};
