module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:flowtype/recommended',
  ],
  ignorePatterns: ['flow-typed/**'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'flowtype'],
  rules: {
    'no-underscore-dangle': ['off'],
    'react/jsx-filename-extension': ['off'],
  },
};
