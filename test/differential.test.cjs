'use strict'

const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const test = require('node:test')
const currentPromise = require('../lib/promise.js')
const currentSync = require('../lib/async.js')
const validHar = require('./fixtures/har/valid.json')
const validRequest = require('./fixtures/request/valid.json')
const validResponse = require('./fixtures/response/valid.json')
const ajv612Golden = require('./fixtures/ajv-6.12.3-golden.json')

const names = Object.keys(currentPromise)
const specific = {
  afterRequest: { lastAccess: '2026-08-28T00:00:00Z', eTag: '', hitCount: 0 },
  beforeRequest: { lastAccess: '2026-08-28T00:00:00Z', eTag: '', hitCount: 0 },
  browser: { name: 'browser', version: '1' },
  creator: validHar.log.creator,
  har: validHar,
  log: validHar.log,
  page: validHar.log.pages[0],
  pageTimings: validHar.log.pages[0].pageTimings,
  postData: { mimeType: 'text/plain', text: 'value' },
  query: { name: 'q', value: 'value' },
  entry: validHar.log.entries[0],
  request: validRequest,
  response: validResponse,
  cache: validHar.log.entries[0].cache,
  content: validResponse.content,
  cookie: validRequest.cookies[0],
  header: validRequest.headers[0],
  timings: validHar.log.entries[0].timings
}

async function outcome (validator, value) {
  try {
    const result = await validator(value)
    return { ok: true, result }
  } catch (error) {
    return {
      ok: false,
      error: {
        name: error.name,
        message: error.message,
        errors: error.errors
      }
    }
  }
}

test('Promise results match the immutable 5.1.5 golden corpus', async () => {
  assert.deepEqual(Object.keys(specific).sort(), names.slice().sort(), 'every validator has a valid non-falsy vector')
  const currentOutcomes = []
  for (const name of names) {
    const values = [undefined, null, false, 0, '', {}, [], specific[name]]
    for (const value of values) {
      const current = await outcome(currentPromise[name], value)
      currentOutcomes.push(current)
      if (current.ok && value) assert.equal(current.result, value)
    }
  }
  const currentHash = createHash('sha256').update(JSON.stringify(currentOutcomes)).digest('hex')
  assert.equal(currentOutcomes.length, ajv612Golden.outcomeCount)
  assert.equal(currentHash, ajv612Golden.canonicalOutcomeSha256, 'all 144 vectors match isolated Ajv 6.12.3 golden outcomes')
})

test('boolean and callback results match the golden Promise contract', async () => {
  for (const name of names) {
    for (const value of [undefined, {}, [], specific[name]]) {
      const promised = await outcome(currentPromise[name], value)
      assert.equal(currentSync[name](value), promised.ok, `${name} boolean`)

      let currentCallback
      const currentReturn = currentSync[name](value, (error, valid) => {
        currentCallback = { valid, error: error && { name: error.name, message: error.message, errors: error.errors } }
        return 'current-return'
      })
      assert.equal(currentReturn, 'current-return')
      assert.equal(currentCallback.valid, promised.ok, `${name} callback validity`)
      assert.deepEqual(currentCallback.error, promised.ok ? null : promised.error, `${name} callback error`)
    }
  }
})
