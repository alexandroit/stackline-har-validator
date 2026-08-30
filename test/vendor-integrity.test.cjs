'use strict'

const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const test = require('node:test')
const packageJson = require('../package.json')
const schemas = require('../lib/schemas')

test('the production package has no external dependency edges', () => {
  assert.deepEqual(packageJson.dependencies, {})
  assert.deepEqual(packageJson.optionalDependencies, undefined)
})

test('the vendored HAR 1.2 schema set is exact and complete', () => {
  assert.equal(Object.keys(schemas).length, 18)
  const digest = createHash('sha256')
    .update(JSON.stringify(schemas))
    .digest('hex')
  assert.equal(digest, 'dc42ed63839894a267a2adc3225ddc33b931a8130f360ae966ad5a2cf52813c0')
})

test('the bundled Ajv runtime preserves the required constructor API', () => {
  const Ajv = require('../lib/vendor/ajv')
  const instance = new Ajv({ allErrors: true })
  assert.equal(typeof instance.addMetaSchema, 'function')
  assert.equal(typeof instance.addSchema, 'function')
  assert.equal(typeof instance.getSchema, 'function')
})
