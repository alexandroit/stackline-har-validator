import { build } from 'esbuild'
import { mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = fileURLToPath(new URL('../dist/', import.meta.url))
await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })

const shared = {
  absWorkingDir: root,
  bundle: true,
  legalComments: 'eof',
  logLevel: 'warning',
  mainFields: ['module', 'main'],
  platform: 'browser',
  sourcemap: false,
  target: ['es2018']
}

await build({ ...shared, entryPoints: ['lib/promise.js'], format: 'cjs', outfile: `${output}/har-validator.browser.cjs` })
await build({ ...shared, entryPoints: ['index.mjs'], format: 'esm', outfile: `${output}/har-validator.browser.mjs` })

console.log('Built two self-contained root browser bundles; package browser imports retain a shared module graph.')
