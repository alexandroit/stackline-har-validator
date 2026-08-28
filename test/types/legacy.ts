import validate = require('../../index')
import sync = require('../../lib/async')
import HARError = require('../../lib/error')

const creator = { name: 'typed', version: '1' }
const promise: Promise<typeof creator> = validate.creator(creator)
const valid: boolean = sync.creator(creator)
const returned: string = sync.creator(creator, (error, result) => {
  if (error) {
    const typed: HARError = error
    console.log(typed.errors)
  }
  return String(result)
})
void promise
void valid
void returned
