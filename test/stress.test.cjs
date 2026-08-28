'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')
const validate = require('../lib/promise')

test('repeated and large valid requests remain deterministic', async () => {
  const request = {
    method: 'GET',
    url: 'https://example.test/resource',
    httpVersion: 'HTTP/1.1',
    headers: Array.from({ length: 2000 }, (_, index) => ({ name: `x-${index}`, value: 'v'.repeat(50) })),
    queryString: [],
    cookies: [],
    headersSize: -1,
    bodySize: 0
  }
  for (let index = 0; index < 100; index += 1) {
    assert.equal(await validate.request(request), request)
  }
})
