import base from '@precisa-saude/eslint-config/base';

export default [
  ...base,
  {
    // Test files are excluded from the package tsconfig (to keep
    // `tsc --noEmit` tight), so disable type-aware parsing for them or
    // ESLint errors trying to locate a project.
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    languageOptions: {
      parserOptions: { project: false },
    },
  },
  {
    // Large definition arrays — keep the medical-data tables readable.
    files: [
      'packages/calculadoras-clinicas/src/indices/registry.ts',
      'packages/calculadoras-clinicas/src/indices/references.ts',
      'packages/calculadoras-clinicas/src/indices/recommendations.ts',
      'packages/calculadoras-clinicas/src/indices/details.ts',
      'packages/calculadoras-clinicas/src/indices/advanced-details.ts',
    ],
    rules: {
      'perfectionist/sort-objects': 'off',
      'max-lines': 'off',
    },
  },
];
