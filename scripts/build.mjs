import { build } from 'esbuild'
import { copyFile, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = fileURLToPath(new URL('../dist/', import.meta.url))
const vendor = fileURLToPath(new URL('../lib/vendor/', import.meta.url))
await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })
await mkdir(vendor, { recursive: true })

await build({
  absWorkingDir: root,
  bundle: true,
  entryPoints: ['node_modules/ajv/lib/ajv.js'],
  format: 'cjs',
  legalComments: 'eof',
  logLevel: 'warning',
  outfile: `${vendor}/ajv.js`,
  platform: 'node',
  sourcemap: false,
  target: ['node6']
})
await copyFile(
  fileURLToPath(new URL('../node_modules/ajv/lib/refs/json-schema-draft-06.json', import.meta.url)),
  `${vendor}/json-schema-draft-06.json`
)

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

console.log('Built the self-contained Ajv runtime and two root browser bundles.')
