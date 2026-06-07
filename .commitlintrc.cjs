const base = require('@precisa-saude/commitlint-config');

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'scope-enum': [2, 'always', ['calculadoras', 'docs', 'ci', 'deps', 'lint', 'config']],
  },
};
