import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
await rm(new URL('../dist/', import.meta.url), { force: true, recursive: true })
console.log(`Cleaned generated browser bundles under ${root}.`)
