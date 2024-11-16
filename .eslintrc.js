module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier', 'eslint:recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
    indent: ['error', 2],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    camelcase: ['error', { properties: 'always' }],
    'require-await': 'error',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['appConfig', './config'],
          ['controllers', './src/controllers'],
          ['services', './src/services'],
          ['policies', './src/policies'],
          ['models', './src/models'],
          ['utils', './src/utilities'],
          ['templates', './src/templates'],
          ['publisher', './src/publisher'],
        ],
      },
    },
  },
};
