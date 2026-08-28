'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')
const validate = require('../lib/promise')
const HARError = require('../lib/error')

test('malformed and adversarial values fail without mutation', async () => {
  const values = [
    Object.create(null),
    { method: 'GET', url: 'not a uri', headers: 'x', queryString: null, cookies: {}, headersSize: 0, bodySize: 0 },
    { method: '__proto__', url: 'https://example.test/', httpVersion: 'HTTP/1.1', headers: [{ name: '__proto__' }], queryString: [], cookies: [], headersSize: 0, bodySize: 0 },
    { method: 'GET', url: `https://example.test/${'a'.repeat(100000)}`, httpVersion: 'HTTP/1.1', headers: [], queryString: [], cookies: [], headersSize: 0, bodySize: 0 }
  ]

  for (const value of values) {
    const before = JSON.stringify(value)
    try {
      await validate.request(value)
    } catch (error) {
      assert.ok(error instanceof HARError)
      assert.ok(Array.isArray(error.errors))
    }
    assert.equal(JSON.stringify(value), before)
  }
  assert.equal(Object.prototype.polluted, undefined)
})

test('allErrors reports independent malformed fields', async () => {
  await assert.rejects(validate.request({ method: 1, url: 'x', headers: {}, queryString: {}, cookies: {}, headersSize: 'x', bodySize: 'x' }), (error) => {
    assert.ok(error.errors.length >= 7)
    assert.ok(error.errors.every((entry) => typeof entry.keyword === 'string'))
    return true
  })
})
