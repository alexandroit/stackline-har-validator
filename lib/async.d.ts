import HARError = require('./error')

export type ValidationCallback<R = unknown> = (error: HARError | null, valid: boolean) => R
export interface AsyncValidator {
  (data?: unknown): boolean
  <R>(data: unknown, callback: ValidationCallback<R>): R
}
export const afterRequest: AsyncValidator
export const beforeRequest: AsyncValidator
export const browser: AsyncValidator
export const cache: AsyncValidator
export const content: AsyncValidator
export const cookie: AsyncValidator
export const creator: AsyncValidator
export const entry: AsyncValidator
export const har: AsyncValidator
export const header: AsyncValidator
export const log: AsyncValidator
export const page: AsyncValidator
export const pageTimings: AsyncValidator
export const postData: AsyncValidator
export const query: AsyncValidator
export const request: AsyncValidator
export const response: AsyncValidator
export const timings: AsyncValidator
