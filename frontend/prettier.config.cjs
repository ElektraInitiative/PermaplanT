/* eslint-env node */
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.ts',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/', '^[./]', '\\.css$'],
};
