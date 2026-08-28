export interface ValidationError {
  keyword: string
  dataPath: string
  schemaPath: string
  params: Record<string, unknown>
  message?: string
  schema?: unknown
  parentSchema?: unknown
  data?: unknown
}

export type PromiseValidator = <T>(data?: T) => Promise<T>

export const afterRequest: PromiseValidator
export const beforeRequest: PromiseValidator
export const browser: PromiseValidator
export const cache: PromiseValidator
export const content: PromiseValidator
export const cookie: PromiseValidator
export const creator: PromiseValidator
export const entry: PromiseValidator
export const har: PromiseValidator
export const header: PromiseValidator
export const log: PromiseValidator
export const page: PromiseValidator
export const pageTimings: PromiseValidator
export const postData: PromiseValidator
export const query: PromiseValidator
export const request: PromiseValidator
export const response: PromiseValidator
export const timings: PromiseValidator
