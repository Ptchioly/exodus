
const production = !process.env.ROLLUP_WATCH;

module.exports = {
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
