import validators = require('./lib/promise.js')

export default validators
export const afterRequest: typeof validators.afterRequest
export const beforeRequest: typeof validators.beforeRequest
export const browser: typeof validators.browser
export const cache: typeof validators.cache
export const content: typeof validators.content
export const cookie: typeof validators.cookie
export const creator: typeof validators.creator
export const entry: typeof validators.entry
export const har: typeof validators.har
export const header: typeof validators.header
export const log: typeof validators.log
export const page: typeof validators.page
export const pageTimings: typeof validators.pageTimings
export const postData: typeof validators.postData
export const query: typeof validators.query
export const request: typeof validators.request
export const response: typeof validators.response
export const timings: typeof validators.timings
export type ValidationError = import('./index.js').ValidationError
export type PromiseValidator = import('./index.js').PromiseValidator
