'use strict'

var assert = require('assert')
var validate = require('..')
var deepPromise = require('../lib/promise')
var deepAsync = require('../lib/async')
var HARError = require('../lib/error')

assert.strictEqual(validate, deepPromise)
assert.deepStrictEqual(Object.keys(validate), [
  'afterRequest', 'beforeRequest', 'browser', 'cache', 'content', 'cookie',
  'creator', 'entry', 'har', 'header', 'log', 'page', 'pageTimings',
  'postData', 'query', 'request', 'response', 'timings'
])
assert.strictEqual(deepAsync.creator({ name: 'runtime', version: '1' }), true)
var error = new HARError([])
assert.strictEqual(error instanceof Error, true)
assert.strictEqual(new Error() instanceof HARError, false)

var input = { name: 'runtime', version: '1' }
validate.creator(input).then(function (value) {
  assert.strictEqual(value, input)
  console.log('Runtime compatibility passed on Node ' + process.versions.node + '.')
}, function (error_) {
  setTimeout(function () { throw error_ }, 0)
})
