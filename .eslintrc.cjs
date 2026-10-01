module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // Playwright specific overrides or custom rules can go here
    '@typescript-eslint/no-explicit-any': 'off',
  },
  env: {
    node: true,
  },
};
