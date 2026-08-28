import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('../', import.meta.url))

for (const file of ['har-validator.browser.cjs', 'har-validator.browser.mjs']) {
  const source = await readFile(`${root}/dist/${file}`, 'utf8')
  assert.ok(source.length > 100)
  assert.doesNotMatch(source, /require\(["'](?:node:)?(?:fs|path|crypto|http|https)["']\)/)
}

const standaloneCjs = require(`${root}/dist/har-validator.browser.cjs`)
const standaloneEsm = await import(pathToFileURL(`${root}/dist/har-validator.browser.mjs`))
const creator = { name: 'browser-standalone', version: '1' }
assert.equal(await standaloneCjs.creator(creator), creator)
assert.equal(await standaloneEsm.creator(creator), creator)

const cjsConsumer = await build({
  absWorkingDir: root,
  bundle: true,
  conditions: ['browser'],
  format: 'cjs',
  logLevel: 'silent',
  platform: 'browser',
  stdin: {
    contents: `
      const validate = require('@stackline/har-validator')
      const sync = require('@stackline/har-validator/lib/async')
      const HARError = require('@stackline/har-validator/lib/error')
      module.exports = { validate, sync, HARError }
    `,
    resolveDir: root,
    sourcefile: 'browser-consumer.cjs'
  },
  write: false
})
const cjsModule = { exports: {} }
new Function('module', 'exports', cjsConsumer.outputFiles[0].text)(cjsModule, cjsModule.exports)
const cjsError = await cjsModule.exports.validate.har({}).catch((error) => error)
assert.ok(cjsError instanceof cjsModule.exports.HARError)
let cjsCallbackError
cjsModule.exports.sync.har({}, (error) => { cjsCallbackError = error })
assert.ok(cjsCallbackError instanceof cjsModule.exports.HARError)

const esmConsumer = await build({
  absWorkingDir: root,
  bundle: true,
  conditions: ['browser'],
  format: 'esm',
  logLevel: 'silent',
  platform: 'browser',
  stdin: {
    contents: `
      import validate from '@stackline/har-validator'
      import sync from '@stackline/har-validator/lib/async'
      import HARError from '@stackline/har-validator/lib/error'
      export { validate, sync, HARError }
    `,
    resolveDir: root,
    sourcefile: 'browser-consumer.mjs'
  },
  write: false
})
const dataUrl = `data:text/javascript;base64,${Buffer.from(esmConsumer.outputFiles[0].text).toString('base64')}`
const esmModule = await import(dataUrl)
const esmError = await esmModule.validate.har({}).catch((error) => error)
assert.ok(esmError instanceof esmModule.HARError)
let esmCallbackError
esmModule.sync.har({}, (error) => { esmCallbackError = error })
assert.ok(esmCallbackError instanceof esmModule.HARError)

console.log('Standalone browser builds and shared CJS/ESM package graphs passed constructor-identity checks.')
