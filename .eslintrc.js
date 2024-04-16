module.exports = {
  extends: [
    '@mate-academy/eslint-config-react-typescript',
    'plugin:cypress/recommended',
  ],
  rules: {
    'react/display-name': 0,
    'prettier/prettier': 0,
  },
};
