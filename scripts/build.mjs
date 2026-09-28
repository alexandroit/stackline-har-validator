import { build } from 'esbuild'
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { patchUriSource } from './patch-uri-source.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = fileURLToPath(new URL('../dist/', import.meta.url))
const vendor = fileURLToPath(new URL('../lib/vendor/', import.meta.url))
await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })
await mkdir(vendor, { recursive: true })

let patchedUriModules = 0
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
  target: ['node6'],
  plugins: [{
    name: 'linear-uri-legacy-port',
    setup (builder) {
      builder.onResolve({ filter: /^stackline:legacy-uri-port$/ }, () => ({
        path: fileURLToPath(new URL('../lib/legacy-uri-port.js', import.meta.url))
      }))
      builder.onLoad({ filter: /[/\\]uri-js[/\\]dist[/\\]es5[/\\]uri\.all\.js$/ }, async (args) => {
        patchedUriModules++
        return { contents: patchUriSource(await readFile(args.path, 'utf8')), loader: 'js' }
      })
    }
  }]
})
if (patchedUriModules !== 1) throw new Error('Expected exactly one uri-js source module to patch.')
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
