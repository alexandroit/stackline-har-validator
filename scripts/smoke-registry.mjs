import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const root = new URL('../', import.meta.url)
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const registry = process.env.STACKLINE_TEST_REGISTRY || 'http://127.0.0.1:4873/'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-har-registry-'))

function run(command, arguments_, stdio = ['ignore', 'pipe', 'pipe']) {
  return execFileSync(command, arguments_, {
    cwd: temporary,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio
  })
}

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    name: 'har-validator-registry-consumer',
    private: true,
    dependencies: {
      '@stackline/har-validator': packageJson.version,
      'har-validator': `npm:@stackline/har-validator@${packageJson.version}`
    }
  }, null, 2) + '\n')
  run(npm, ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--registry', registry])
  const script = `
const assert = require('assert')
const scoped = require('@stackline/har-validator')
const legacy = require('har-validator')
const legacyAsync = require('har-validator/lib/async')
const value = { name: 'registry', version: '1' }
assert.deepStrictEqual(Object.keys(scoped), Object.keys(legacy))
assert.strictEqual(legacyAsync.creator(value), true)
Promise.all([scoped.creator(value), legacy.creator(value)]).then(function (values) {
  assert.strictEqual(values[0], value)
  assert.strictEqual(values[1], value)
  console.log('Registry scoped and npm-alias consumers passed.')
})
`
  run(process.execPath, ['-e', script], 'inherit')
  const tree = JSON.parse(run(npm, ['ls', '--omit=dev', '--all', '--json']))
  assert.equal(tree.problems, undefined)
} finally {
  await rm(temporary, { force: true, recursive: true })
}
