import validators, { creator, type ValidationError } from '../../index.mjs'
import sync from '../../esm/async.mjs'
import HARError from '../../esm/error.mjs'

const input = { name: 'typed', version: '1' }
const value: typeof input = await creator(input)
const valid: boolean = sync.creator(input)
const errors: ValidationError[] = new HARError([]).errors
void validators
void value
void valid
void errors
