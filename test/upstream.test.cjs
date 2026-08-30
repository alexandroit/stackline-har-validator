'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')
const schemas = require('../lib/schemas')
const validHar = require('./fixtures/har/valid.json')
const invalidHar = require('./fixtures/har/invalid.json')
const validRequest = require('./fixtures/request/valid.json')
const invalidRequest = require('./fixtures/request/invalid.json')
const validResponse = require('./fixtures/response/valid.json')
const invalidResponse = require('./fixtures/response/invalid.json')
const HARError = require('../lib/error.js')
const promise = require('../lib/promise.js')
const sync = require('../lib/async.js')

const names = Object.keys(schemas).filter((name) => name !== 'default')

test('upstream exports every schema validator', () => {
  assert.deepEqual(Object.keys(promise), names)
  assert.deepEqual(Object.keys(sync), names)
  for (const name of names) {
    assert.equal(typeof promise[name], 'function')
    assert.equal(typeof sync[name], 'function')
    assert.equal(typeof promise[name]().catch(() => {}), 'object')
  }
})

test('upstream HAR success and failure behavior', async () => {
  assert.equal(await promise.har(validHar), validHar)
  assert.equal(sync.har(validHar), true)
  assert.equal(sync.har({}), false)

  await assert.rejects(promise.har({}), (error) => {
    assert.ok(error instanceof HARError)
    assert.equal(error.name, 'HARError')
    assert.equal(error.message, 'validation failed')
    assert.ok(error.errors.some((entry) => entry.dataPath === '' && entry.keyword === 'required'))
    return true
  })

  await assert.rejects(promise.har(invalidHar.version), (error) => {
    assert.ok(error.errors.some((entry) => entry.dataPath === '.log.version'))
    return true
  })
  await assert.rejects(promise.har(invalidHar.creator), (error) => {
    assert.ok(error.errors.some((entry) => entry.dataPath === '.log.creator.version'))
    return true
  })
  await assert.rejects(promise.har(invalidHar.date), (error) => {
    assert.ok(error.errors.some((entry) => entry.dataPath === '.log.pages[0].startedDateTime'))
    return true
  })
})

test('upstream request and response fixtures', async () => {
  assert.equal(await promise.request(validRequest), validRequest)
  assert.equal(await promise.response(validResponse), validResponse)
  for (const value of [undefined, {}, []]) {
    await assert.rejects(promise.request(value), HARError)
    await assert.rejects(promise.response(value), HARError)
  }
  for (const value of Object.values(invalidRequest)) await assert.rejects(promise.request(value), HARError)
  for (const value of Object.values(invalidResponse)) await assert.rejects(promise.response(value), HARError)
})

test('upstream nullable cache entries', async () => {
  const before = { beforeRequest: null }
  const after = { afterRequest: null }
  assert.equal(await promise.cache(before), before)
  assert.equal(await promise.cache(after), after)
})

test('upstream callback shape', () => {
  let called = false
  const marker = {}
  const returned = sync.har(validHar, (error, valid) => {
    called = true
    assert.equal(error, null)
    assert.equal(valid, true)
    return marker
  })
  assert.equal(called, true)
  assert.equal(returned, marker)

  called = false
  sync.har({}, (error, valid) => {
    called = true
    assert.ok(error instanceof HARError)
    assert.equal(valid, false)
  })
  assert.equal(called, true)
})
