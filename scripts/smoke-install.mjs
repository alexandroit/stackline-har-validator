import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { build } from 'esbuild'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-har-validator-smoke-'))
const consumer = path.join(temporary, 'consumer')

function run(command, arguments_, cwd = root, stdio = ['ignore', 'pipe', 'pipe']) {
  return execFileSync(command, arguments_, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio
  })
}

try {
  await mkdir(consumer)
  const output = run(npm, ['pack', '--silent', '--json', '--ignore-scripts', '--pack-destination', temporary]).trim()
  const start = output.lastIndexOf('\n[')
  const packed = JSON.parse(start === -1 ? output : output.slice(start + 1))
  assert.equal(packed.length, 1)
  const archive = packed[0].filename

  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
    name: 'har-validator-packed-consumer',
    private: true,
    type: 'module',
    dependencies: {
      '@stackline/har-validator': `file:../${archive}`,
      'har-validator': `file:../${archive}`
    }
  }, null, 2) + '\n')
  run(npm, ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund'], consumer)

  await writeFile(path.join(consumer, 'commonjs.cjs'), `
const assert = require('node:assert/strict')
const scoped = require('@stackline/har-validator')
const legacy = require('har-validator')
const scopedAsync = require('@stackline/har-validator/lib/async')
const legacyAsync = require('har-validator/lib/async')
const HARError = require('@stackline/har-validator/lib/error.js')
const input = { name: 'consumer', version: '1' }
assert.deepEqual(Object.keys(scoped), Object.keys(legacy))
assert.equal(scopedAsync.creator(input), true)
assert.equal(legacyAsync.creator(input), true)
assert.ok(new HARError([]) instanceof Error)
Promise.all([scoped.creator(input), legacy.creator(input)]).then(values => {
  assert.equal(values[0], input)
  assert.equal(values[1], input)
  console.log('packed scoped and legacy-key CommonJS passed')
})
`)
  await writeFile(path.join(consumer, 'module.mjs'), `
import assert from 'node:assert/strict'
import validators, { creator } from '@stackline/har-validator'
import sync from '@stackline/har-validator/lib/async'
import HARError from '@stackline/har-validator/lib/error'
const input = { name: 'consumer', version: '1' }
assert.equal(creator, validators.creator)
assert.equal(await creator(input), input)
assert.equal(sync.creator(input), true)
assert.ok(new HARError([]) instanceof Error)
console.log('packed ESM and deep facades passed')
`)
  run(process.execPath, ['commonjs.cjs'], consumer, 'inherit')
  run(process.execPath, ['module.mjs'], consumer, 'inherit')

  const browserCjs = await build({
    absWorkingDir: consumer,
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
      resolveDir: consumer,
      sourcefile: 'packed-browser-consumer.cjs'
    },
    write: false
  })
  const cjsModule = { exports: {} }
  new Function('module', 'exports', browserCjs.outputFiles[0].text)(cjsModule, cjsModule.exports)
  const cjsError = await cjsModule.exports.validate.har({}).catch((error) => error)
  assert.ok(cjsError instanceof cjsModule.exports.HARError)
  let cjsCallbackError
  cjsModule.exports.sync.har({}, (error) => { cjsCallbackError = error })
  assert.ok(cjsCallbackError instanceof cjsModule.exports.HARError)

  const browserEsm = await build({
    absWorkingDir: consumer,
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
      resolveDir: consumer,
      sourcefile: 'packed-browser-consumer.mjs'
    },
    write: false
  })
  const browserUrl = `data:text/javascript;base64,${Buffer.from(browserEsm.outputFiles[0].text).toString('base64')}`
  const esmBrowserModule = await import(browserUrl)
  const esmBrowserError = await esmBrowserModule.validate.har({}).catch((error) => error)
  assert.ok(esmBrowserError instanceof esmBrowserModule.HARError)
  let esmCallbackError
  esmBrowserModule.sync.har({}, (error) => { esmCallbackError = error })
  assert.ok(esmCallbackError instanceof esmBrowserModule.HARError)
  console.log('Packed browser CJS/ESM resolver and shared HARError identity passed.')

  const installed = JSON.parse(await readFile(path.join(consumer, 'node_modules', '@stackline', 'har-validator', 'package.json'), 'utf8'))
  assert.deepEqual(installed.dependencies, { ajv: '6.15.0', 'har-schema': '2.0.0' })
  const tree = JSON.parse(run(npm, ['ls', '--omit=dev', '--all', '--json'], consumer))
  assert.equal(tree.problems, undefined)
  console.log('Packed scoped, legacy-key, ESM, deep-entry, and production-tree consumers passed.')
} finally {
  await rm(temporary, { force: true, recursive: true })
}
