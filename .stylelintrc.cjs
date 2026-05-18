module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': null,
    'media-feature-range-notation': 'prefix',
    'order/order': ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['src/preview/**/*.css'],
      rules: {
        'custom-property-pattern': null,
        'no-descending-specificity': null,
      },
    },
  ],
};
