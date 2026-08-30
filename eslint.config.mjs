import js from '@eslint/js'

const globals = {
  Buffer: 'readonly',
  Function: 'readonly',
  URL: 'readonly',
  console: 'readonly',
  exports: 'writable',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
  setTimeout: 'readonly'
}

export default [
  { ignores: ['coverage/**', 'dist/**', 'lib/vendor/ajv.js', 'node_modules/**', 'release-candidate/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: { ecmaVersion: 2020, sourceType: 'commonjs', globals },
    rules: { 'no-unused-vars': ['error', { caughtErrors: 'none' }] }
  },
  {
    files: ['**/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals },
    rules: { 'no-unused-vars': ['error', { caughtErrors: 'none' }] }
  }
]
