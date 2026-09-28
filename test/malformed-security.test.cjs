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

test('legacy URI empty-port fallback preserves bounded upstream results', () => {
  const hasEmptyPort = require('../lib/legacy-uri-port')
  // Independent, bounded oracle from uri-js 4.4.1; do not use for long input.
  const upstream = /\/\/(?:.|\n)*:(?:\/|\?|#|$)/
  let comparisons = 0
  function compare (value, remaining) {
    assert.equal(hasEmptyPort(value), upstream.test(value), JSON.stringify(value))
    comparisons++
    if (remaining) {
      for (const character of ['/', ':', '?', '#', 'a', '\n', '\r', '\u2028', '\u2029']) {
        compare(value + character, remaining - 1)
      }
    }
  }
  compare('', 5)
  assert.equal(comparisons, 66430)
  for (const value of ['//host:', '//host:/path', '//host:?query', '//host:#fragment', '//host:80', '//\r//host:/', '//host:\n', '//\n:/']) {
    assert.equal(hasEmptyPort(value), upstream.test(value), JSON.stringify(value))
  }
})

test('legacy URI fallback handles adversarial input in a bounded process', () => {
  const { spawnSync } = require('node:child_process')
  const script = `
    const assert = require('node:assert/strict');
    const hasEmptyPort = require(${JSON.stringify(require.resolve('../lib/legacy-uri-port'))});
    assert.equal(hasEmptyPort('/'.repeat(1000000)), false);
    assert.equal(hasEmptyPort('/'.repeat(1000000) + ':?'), true);
    assert.equal(hasEmptyPort('/'.repeat(1000000) + '\\r:'), false);
  `
  const child = spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', timeout: 5000 })
  assert.ifError(child.error)
  assert.equal(child.status, 0, child.stderr)
})

test('vendoring patches the exact upstream fallback and rejects source drift', async () => {
  const { readFileSync } = require('node:fs')
  const { patchUriSource } = await import('../scripts/patch-uri-source.mjs')
  const source = readFileSync(require.resolve('uri-js'), 'utf8')
  const patched = patchUriSource(source)
  assert.ok(patched.includes('hasLegacyEmptyPort(uriString)'))
  assert.throws(() => patchUriSource('changed upstream'), /fallback changed/)
  assert.throws(() => patchUriSource(source + source), /fallback changed/)
  // Standard Node engines use the other URI parsing branch. The fix preserves
  // the old fallback for engines with nonstandard unmatched-group semantics.
  assert.equal(''.match(/(){0}/)[1], undefined)
  for (const path of ['../lib/vendor/ajv.js', '../dist/har-validator.browser.cjs', '../dist/har-validator.browser.mjs']) {
    const bundle = readFileSync(require.resolve(path), 'utf8')
    assert.ok(bundle.includes('hasLegacyEmptyPort'), path)
    assert.ok(!bundle.includes(String.raw`uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/)`), path)
  }
})

test('patched uri-js preserves the forced legacy parsing branch', async () => {
  const { readFileSync } = require('node:fs')
  const { runInNewContext } = require('node:vm')
  const { patchUriSource } = await import('../scripts/patch-uri-source.mjs')
  const original = readFileSync(require.resolve('uri-js'), 'utf8')
  function loadLegacy (source) {
    const exports = {}
    const context = { exports, module: { exports }, require: () => require('../lib/legacy-uri-port') }
    const marker = 'var NO_MATCH_IS_UNDEFINED = "".match(/(){0}/)[1] === undefined;'
    assert.ok(source.includes(marker))
    runInNewContext(source.replace(marker, 'var NO_MATCH_IS_UNDEFINED = false;'), context, { timeout: 1000 })
    return context.module.exports
  }
  const before = loadLegacy(original)
  const after = loadLegacy(patchUriSource(original))
  for (const input of ['', '/', '//', '//host:', '//host:80', '//host:/path', '//host:?query', '//host:#fragment', '//user@host:', '//[::1]:', 'https://host:/path', '//\n:/', '//\r//host:/']) {
    assert.equal(JSON.stringify(after.parse(input)), JSON.stringify(before.parse(input)), JSON.stringify(input))
  }
})
