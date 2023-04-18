/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'storybook/no-uninstalled-addons': [
      'error',
      { packageJsonLocation: path.resolve(__dirname, 'package.json') },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_+$' }],
  },
  ignorePatterns: ['!.storybook'],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
