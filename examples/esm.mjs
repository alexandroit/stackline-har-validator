import { creator } from '@stackline/har-validator'

const value = await creator({ name: 'example', version: '1.0.0' })
console.log(value.name)
