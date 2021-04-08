module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  rules: {
    'no-empty-source': null,
    'no-descending-specificity': null,
    indentation: 2,
    'color-hex-case': 'lower',
    'selector-pseudo-element-colon-notation': 'single',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'else',
          'each',
          'include',
          'mixin',
          'return',
          'extend',
        ],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'import', 'local'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        ignoreAtRules: ['else', 'each', 'import'],
        ignore: ['after-comment', 'first-nested'],
      },
    ],
  },
};
