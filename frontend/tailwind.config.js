
const production = !process.env.ROLLUP_WATCH;

module.exports = {
  theme: {
    fontFamily: {
      'main': ['Roboto', 'sans-serif']
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
