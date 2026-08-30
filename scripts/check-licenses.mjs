import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'))
const license = await readFile(path.join(root, 'LICENSE'), 'utf8')
const notices = await readFile(path.join(root, 'THIRD_PARTY_LICENSES.md'), 'utf8')
assert.deepEqual(packageJson.dependencies, {})
assert.equal(packageJson.devDependencies.ajv, '6.15.0')
assert.match(license, /Ahmad Nassri/)

const expected = [
  ['ajv', '6.15.0', 'MIT', 'LICENSE', 'ajv-6.15.0-MIT.txt'],
  ['fast-deep-equal', '3.1.3', 'MIT', 'LICENSE', 'fast-deep-equal-3.1.3-MIT.txt'],
  ['fast-json-stable-stringify', '2.1.0', 'MIT', 'LICENSE', 'fast-json-stable-stringify-2.1.0-MIT.txt'],
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

const schemaLicense = await readFile(path.join(root, 'licenses', 'har-schema-2.0.0-ISC.txt'))
assert.equal(createHash('sha256').update(schemaLicense).digest('hex'),
  'bddeaacd7d465f81ce1317d5bae2c69006f192c5a91fddbf8662bf37f07c1ded')
assert.match(notices, /har-schema[^\n]*2\.0\.0/)
const bundledAjv = await readFile(path.join(root, 'lib', 'vendor', 'ajv.js'))
assert.equal(createHash('sha256').update(bundledAjv).digest('hex'),
  '4f8fe916ab12ba4eeccee11200c648410bbed3cc64d0f1bdf4dc1a2dd36fc2a4')

const production = Object.entries(lock.packages)
  .filter(([location, metadata]) => location && !metadata.dev)
  .map(([location]) => location)
assert.deepEqual(production, [])
console.log('Zero-edge production graph and all seven bundled license components passed.')
