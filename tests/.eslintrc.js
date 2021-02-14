module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'cypress', 'prettier', 'chai-friendly'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:cypress/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:chai-friendly/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        semi: false,
        useTabs: false,
      },
    ],
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': [
      'warn',
      {
        ignoreProperties: true,
        ignoreParameters: true,
      },
    ],
    '@typescript-eslint/interface-name-prefix': ['off'],
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2,
  },
}
