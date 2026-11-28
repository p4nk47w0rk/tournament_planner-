/** @type {import('lint-staged').Configuration} */
const config = {
  "*.{ts,tsx,js,jsx}": ["prettier --write", "eslint --fix"],
  "*.{json,css,scss,md}": ["prettier --write"],
};

export default config;
