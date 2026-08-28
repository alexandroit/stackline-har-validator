import type { ValidationError } from '../index'

declare class HARError extends Error {
  name: 'HARError'
  message: 'validation failed'
  errors: ValidationError[]
  constructor(errors: ValidationError[])
}
export = HARError
