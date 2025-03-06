/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "tailwindcss/nesting": {},
    autoprefixer: {},
    "@tailwindcss/postcss7-compat": {},
  },
};
export default config;
