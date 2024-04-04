module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['simple-import-sort'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'simple-import-sort/imports': 'error',
  },
}
