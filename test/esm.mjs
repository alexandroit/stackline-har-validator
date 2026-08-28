import assert from 'node:assert/strict'
import validators, { creator, request } from '../index.mjs'
import asyncValidators from '../esm/async.mjs'
import HARError, { HARError as NamedHARError } from '../esm/error.mjs'

assert.equal(creator, validators.creator)
assert.equal(request, validators.request)
const value = { name: 'esm', version: '1.0.0' }
assert.equal(await creator(value), value)
assert.equal(asyncValidators.creator(value), true)
assert.equal(HARError, NamedHARError)
assert.ok(new HARError([]) instanceof Error)
console.log('ESM root and deep facades passed.')
