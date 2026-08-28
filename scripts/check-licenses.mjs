import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'))
const license = await readFile(path.join(root, 'LICENSE'), 'utf8')
const notices = await readFile(path.join(root, 'THIRD_PARTY_LICENSES.md'), 'utf8')
assert.deepEqual(packageJson.dependencies, { ajv: '6.15.0', 'har-schema': '2.0.0' })
assert.match(license, /Ahmad Nassri/)

const expected = [
  ['ajv', '6.15.0', 'MIT', 'LICENSE', 'ajv-6.15.0-MIT.txt'],
  ['fast-deep-equal', '3.1.3', 'MIT', 'LICENSE', 'fast-deep-equal-3.1.3-MIT.txt'],
  ['fast-json-stable-stringify', '2.1.0', 'MIT', 'LICENSE', 'fast-json-stable-stringify-2.1.0-MIT.txt'],
  ['har-schema', '2.0.0', 'ISC', 'LICENSE', 'har-schema-2.0.0-ISC.txt'],
  ['json-schema-traverse', '0.4.1', 'MIT', 'LICENSE', 'json-schema-traverse-0.4.1-MIT.txt'],
  ['punycode', '2.3.1', 'MIT', 'LICENSE-MIT.txt', 'punycode-2.3.1-MIT.txt'],
  ['uri-js', '4.4.1', 'BSD-2-Clause', 'LICENSE', 'uri-js-4.4.1-BSD-2-Clause.txt']
]

for (const [name, version, licenseId, sourceFile, shippedFile] of expected) {
  const metadata = JSON.parse(await readFile(path.join(root, 'node_modules', name, 'package.json'), 'utf8'))
  assert.equal(metadata.version, version, `${name} version`)
  assert.equal(metadata.license, licenseId, `${name} license`)
  const sourceText = await readFile(path.join(root, 'node_modules', name, sourceFile), 'utf8')
  const shippedText = await readFile(path.join(root, 'licenses', shippedFile), 'utf8')
  assert.equal(shippedText, sourceText, `${name} full license text`)
  assert.match(notices, new RegExp(`${name.replaceAll('-', '\\-')}[^\\n]*${version}`), `${name} inventory row`)
}

const production = Object.entries(lock.packages)
  .filter(([location, metadata]) => location && !metadata.dev)
  .map(([location]) => location)
assert.deepEqual(production.sort(), expected.map(([name]) => `node_modules/${name}`).sort())
console.log('Production and bundled license inventory passed for all seven dependency components.')
