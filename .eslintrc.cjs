// .eslintrc.cjs  (or .js)
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // ⬅️  enables eslint-plugin-prettier + turns off conflicting rules
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json', // required for rules that need type-info
  },

  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'prettier', // explicit so VS Code shows “prettier/prettier” in Problems panel
  ],

  rules: {
    /* ✨ Formatting handled by Prettier — this merely forwards problems to ESLint */
    'prettier/prettier': [
      'warn',
      { endOfLine: 'lf' },          // keep CRLF warnings away on Windows
    ],

    /* React / Hooks */
    'react/react-in-jsx-scope': 'off', // React 17+ / Next.js
    'react/prop-types': 'off',

    /* Hooks sanity checks */
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    /* TypeScript */
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',

    /* General */
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },

  settings: {
    react: { version: 'detect' },
  },

  ignorePatterns: [
    '.commitlintrc.js',
    'vitest.config.ts',
    'vitest.setup.ts',
    'dist/',
    'build/',
    'node_modules/',
  ],
};
