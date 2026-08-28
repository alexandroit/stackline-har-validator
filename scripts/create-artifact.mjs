import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  access,
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const destination = path.join(root, 'release-candidate')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(arguments_, cwd = root) {
  return execFileSync(npm, arguments_, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  })
}

function command(command_, arguments_) {
  return execFileSync(command_, arguments_, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()
}

function digest(algorithm, buffer, encoding = 'hex') {
  return createHash(algorithm).update(buffer).digest(encoding)
}

async function pack(directory, cwd = root) {
  const output = run([
    'pack', '--silent', '--json', '--ignore-scripts',
    '--pack-destination', directory
  ], cwd).trim()
  const jsonStart = output.lastIndexOf('\n[')
  const result = JSON.parse(jsonStart === -1 ? output : output.slice(jsonStart + 1))
  assert.equal(result.length, 1)
  const archive = path.join(directory, result[0].filename)
  return { details: result[0], archive, bytes: await readFile(archive) }
}

try {
  await access(destination)
  throw new Error(`release candidate already exists: ${destination}`)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

execFileSync(npm, ['run', 'verify'], {
  cwd: root,
  env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
  stdio: 'inherit'
})
assert.equal(command('git', ['status', '--porcelain', '--untracked-files=normal']), '',
  'release source must be committed and the worktree must be clean')
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const expectedTag = `stackline-v${packageJson.version}`
const tagsAtHead = command('git', ['tag', '--points-at', 'HEAD']).split('\n')
assert(tagsAtHead.includes(expectedTag),
  `${expectedTag} must point at the frozen source commit`)

// Build every release asset beside the final location, then atomically rename
// the complete directory. A failed preparation cannot leave a partial final
// candidate, and an existing final directory is never replaced.
let staging = await mkdtemp(path.join(root, '.release-candidate-staging-'))

try {
  // Git creates non-executable files through the checkout umask, and npm pack
  // preserves those read bits. Copy only committed source into a normalized
  // staging tree so a restrictive builder umask cannot ship mode 0600 files.
  const sourceStaging = await mkdtemp(path.join(staging, '.source-'))
  const trackedFiles = command('git', ['ls-files', '-z']).split('\0').filter(Boolean)
  for (const file of trackedFiles) {
    const target = path.join(sourceStaging, file)
    await mkdir(path.dirname(target), { recursive: true })
    await copyFile(path.join(root, file), target)
    await chmod(target, 0o644)
  }

  const first = await pack(staging, sourceStaging)
  assert(first.details.files.every(({ mode }) => mode === 0o644),
    'every shipped regular file must have mode 0644')
  await rm(sourceStaging, { force: true, recursive: true })
  const sha1 = digest('sha1', first.bytes)
  const sha256 = digest('sha256', first.bytes)
  const sha512 = digest('sha512', first.bytes)
  assert.equal(first.details.shasum, sha1)
  assert.equal(first.details.integrity,
    `sha512-${digest('sha512', first.bytes, 'base64')}`)
  assert.equal(first.details.entryCount, first.details.files.length)

  const manifest = {
    schema: 'stackline-release-artifact-v1',
    package: `${first.details.name}@${first.details.version}`,
    filename: first.details.filename,
    sha1,
    sha256,
    sha512,
    integrity: first.details.integrity,
    packedSize: first.details.size,
    unpackedSize: first.details.unpackedSize,
    entryCount: first.details.entryCount,
    modePolicy: 'all shipped regular files are 0644',
    sourceCommit: command('git', ['rev-parse', 'HEAD']),
    builder: {
      node: process.version,
      npm: command(npm, ['--version']),
      platform: `${process.platform}-${process.arch}`,
      environment: 'local-stackline-release-gate'
    },
    files: first.details.files.map(({ path: file, size, mode }) => ({ file, size, mode }))
  }
  await writeFile(path.join(staging, 'artifact-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n')
  await writeFile(path.join(staging, 'inventory.json'),
    JSON.stringify({ package: manifest.package, files: manifest.files }, null, 2) + '\n')
  await writeFile(path.join(staging, 'SHA1SUMS'),
    `${sha1}  ${first.details.filename}\n`)
  await writeFile(path.join(staging, 'SHA256SUMS'),
    `${sha256}  ${first.details.filename}\n`)
  await writeFile(path.join(staging, 'SHA512SUMS'),
    `${sha512}  ${first.details.filename}\n`)

  const licenses = {
    package: { name: '@stackline/har-validator', license: 'MIT', file: 'LICENSE' },
    productionDependencies: [
      { name: 'ajv', version: '6.15.0', license: 'MIT', file: 'licenses/ajv-6.15.0-MIT.txt' },
      { name: 'fast-deep-equal', version: '3.1.3', license: 'MIT', file: 'licenses/fast-deep-equal-3.1.3-MIT.txt' },
      { name: 'fast-json-stable-stringify', version: '2.1.0', license: 'MIT', file: 'licenses/fast-json-stable-stringify-2.1.0-MIT.txt' },
      { name: 'har-schema', version: '2.0.0', license: 'ISC', file: 'licenses/har-schema-2.0.0-ISC.txt' },
      { name: 'json-schema-traverse', version: '0.4.1', license: 'MIT', file: 'licenses/json-schema-traverse-0.4.1-MIT.txt' },
      { name: 'punycode', version: '2.3.1', license: 'MIT', file: 'licenses/punycode-2.3.1-MIT.txt' },
      { name: 'uri-js', version: '4.4.1', license: 'BSD-2-Clause', file: 'licenses/uri-js-4.4.1-BSD-2-Clause.txt' }
    ],
    notices: ['NOTICE', 'THIRD_PARTY_LICENSES.md']
  }
  await writeFile(path.join(staging, 'licenses.json'),
    JSON.stringify(licenses, null, 2) + '\n')
  await copyFile(path.join(root, 'CHANGELOG.md'),
    path.join(staging, 'RELEASE_NOTES.md'))

  // npm's omit traversal can misclassify a production edge when the source
  // development graph also reaches that package. Generate the SBOM from an
  // isolated production install of the exact frozen tarball instead.
  const sbomConsumer = await mkdtemp(path.join(staging, '.sbom-consumer-'))
  await writeFile(path.join(sbomConsumer, 'package.json'), JSON.stringify({
    name: 'stackline-har-validator-sbom-consumer',
    private: true,
    version: '1.0.0'
  }, null, 2) + '\n')
  run([
    'install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund',
    first.archive
  ], sbomConsumer)
  const sbom = run([
    'sbom', '--omit=dev', '--sbom-format', 'cyclonedx'
  ], sbomConsumer)
  const parsedSbom = JSON.parse(sbom)
  const components = [
    parsedSbom.metadata && parsedSbom.metadata.component,
    ...(parsedSbom.components || [])
  ].filter(Boolean)
  const rootComponent = components.find(({ name, version }) =>
    name === '@stackline/har-validator' && version === '1.0.0')
  const ajvComponent = components.find(({ name, version }) =>
    name === 'ajv' && version === '6.15.0')
  const schemaComponent = components.find(({ name, version }) =>
    name === 'har-schema' && version === '2.0.0')
  const transitiveComponents = [
    ['fast-deep-equal', '3.1.3'],
    ['fast-json-stable-stringify', '2.1.0'],
    ['json-schema-traverse', '0.4.1'],
    ['punycode', '2.3.1'],
    ['uri-js', '4.4.1']
  ].map(([name, version]) => components.find((component) =>
    component.name === name && component.version === version))
  assert(rootComponent, 'SBOM must contain @stackline/har-validator@1.0.0')
  assert(ajvComponent, 'SBOM must contain ajv@6.15.0')
  assert(schemaComponent, 'SBOM must contain har-schema@2.0.0')
  assert(transitiveComponents.every(Boolean), 'SBOM must contain every transitive production component')
  const rootEdge = (parsedSbom.dependencies || []).find(({ ref }) =>
    ref === rootComponent['bom-ref'])
  assert(rootEdge && rootEdge.dependsOn.includes(ajvComponent['bom-ref']),
    'SBOM must link @stackline/har-validator to ajv')
  assert(rootEdge && rootEdge.dependsOn.includes(schemaComponent['bom-ref']),
    'SBOM must link @stackline/har-validator to har-schema')
  const ajvEdge = (parsedSbom.dependencies || []).find(({ ref }) =>
    ref === ajvComponent['bom-ref'])
  for (const component of transitiveComponents.filter(({ name }) => name !== 'punycode')) {
    assert(ajvEdge && ajvEdge.dependsOn.includes(component['bom-ref']),
      `SBOM must link ajv to ${component.name}`)
  }
  const uriComponent = transitiveComponents.find(({ name }) => name === 'uri-js')
  const punycodeComponent = transitiveComponents.find(({ name }) => name === 'punycode')
  const uriEdge = (parsedSbom.dependencies || []).find(({ ref }) =>
    ref === uriComponent['bom-ref'])
  assert(uriEdge && uriEdge.dependsOn.includes(punycodeComponent['bom-ref']),
    'SBOM must link uri-js to punycode')
  await writeFile(path.join(staging, 'sbom.cdx.json'), sbom)
  await rm(sbomConsumer, { force: true, recursive: true })

  await rename(staging, destination)
  staging = null
  console.log(`Prepared immutable ${first.details.filename} (${sha256}).`)
} finally {
  if (staging) await rm(staging, { force: true, recursive: true })
}
