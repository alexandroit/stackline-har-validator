'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')
const root = require('..')
const promise = require('../lib/promise')
const sync = require('../lib/async')
const HARError = require('../lib/error')

const names = [
  'afterRequest', 'beforeRequest', 'browser', 'cache', 'content', 'cookie',
  'creator', 'entry', 'har', 'header', 'log', 'page', 'pageTimings',
  'postData', 'query', 'request', 'response', 'timings'
]

test('root and deep CommonJS contract', () => {
  assert.equal(root, promise)
  assert.deepEqual(Object.keys(root), names)
  assert.equal(require('../lib/promise.js'), promise)
  assert.equal(require('../lib/async.js'), sync)
  assert.equal(require('../lib/error.js'), HARError)
})

test('HARError has an isolated Error prototype', () => {
  const errors = [{ keyword: 'required' }]
  const error = new HARError(errors)
  assert.ok(error instanceof HARError)
  assert.ok(error instanceof Error)
  assert.equal(new Error() instanceof HARError, false)
  assert.equal(error.constructor, Error)
  assert.deepEqual(Object.keys(HARError.prototype), [])
  assert.equal(error.errors, errors)
  assert.equal(error.stack, 'HARError: validation failed')
})

test('callback invocation is synchronous and returns callback value', () => {
  let phase = 'before'
  const marker = {}
  const result = sync.creator({ name: 'x', version: '1' }, (error, valid) => {
    assert.equal(phase, 'before')
    assert.equal(error, null)
    assert.equal(valid, true)
    return marker
  })
  phase = 'after'
  assert.equal(result, marker)
})
