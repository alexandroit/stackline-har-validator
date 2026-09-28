# @stackline/har-validator

> Compatibility-first HAR 1.2 validator with maintained packaging, browser builds, and first-party types

[![npm version](https://img.shields.io/npm/v/@stackline/har-validator.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/har-validator)
[![license](https://img.shields.io/npm/l/@stackline/har-validator.svg?style=flat-square)](https://github.com/alexandroit/stackline-har-validator/blob/main/LICENSE)
[![GitHub repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-har-validator)

**[Documentation](https://alexandro.net/docs/vanilla/har-validator/)** |
**[npm](https://www.npmjs.com/package/@stackline/har-validator)** |
**[Issues](https://github.com/alexandroit/stackline-har-validator/issues)** |
**[Repository](https://github.com/alexandroit/stackline-har-validator)**

**Package version:** `1.0.2`

## Why this package?

A compatibility-first maintained replacement for `har-validator@5.1.5`. It
validates HAR 1.2 objects with the same Promise root and synchronous/callback
deep API, while adding ESM, browser bundles, first-party TypeScript types, and
a self-contained, compatibility-pinned Ajv 6 runtime.

This project is independent of and is not endorsed by the original maintainer.
The upstream MIT license and attribution are preserved.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/har-validator@1.0.2` |
| Node.js runtime | `>=6` |
| CommonJS / primary entry | `./lib/promise.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./index.d.ts` |

## Installation

<a id="install"></a>

### Install

```sh
npm install @stackline/har-validator
```

For a migration without source changes, retain the historical key with an npm
alias:

```sh
npm install har-validator@npm:@stackline/har-validator
```

## Usage

<a id="promise-api"></a>

### Promise API

```js
const validate = require('@stackline/har-validator')

await validate.har(archive)
await validate.request(request)
```

Each validator resolves to the exact input reference. Invalid input rejects
with a `HARError` containing Ajv 6-compatible `errors` records.

The published package has no runtime, optional, or peer dependencies. The
audited Ajv 6.15 runtime and the exact HAR 1.2 schemas are shipped inside the
package with their complete license texts, so consumer installation does not
depend on abandoned registry packages.

Browser bundlers may import the normal root and deep entries; they intentionally
remain one shared module graph so errors retain identity with
`lib/error`. A prebundled root-only entry is available as
`@stackline/har-validator/browser`.

<a id="esm"></a>

### ESM

```js
import validate, { har, request } from '@stackline/har-validator'

await har(archive)
await validate.request(request)
```

## Security

Review inputs and the package-specific compatibility limits before processing untrusted data. Report suspected vulnerabilities as described in the [security policy](https://github.com/alexandroit/stackline-har-validator/blob/main/SECURITY.md).

## API Surface

<a id="historical-callback-and-boolean-api"></a>

### Historical callback and boolean API

```js
const validate = require('@stackline/har-validator/lib/async')

const valid = validate.request(request)
validate.request(request, (error, valid) => {
  if (error) console.error(error.errors)
})
```

All 18 upstream validators are preserved: `afterRequest`, `beforeRequest`,
`browser`, `cache`, `content`, `cookie`, `creator`, `entry`, `har`, `header`,
`log`, `page`, `pageTimings`, `postData`, `query`, `request`, `response`, and
`timings`.

See [COMPATIBILITY_CONTRACT.md](https://github.com/alexandroit/stackline-har-validator/blob/main/COMPATIBILITY_CONTRACT.md) for exact behavior,
[MIGRATION.md](https://github.com/alexandroit/stackline-har-validator/blob/main/MIGRATION.md) for migration choices, and
[SECURITY.md](https://github.com/alexandroit/stackline-har-validator/blob/main/SECURITY.md) for supported versions and reporting. The complete
dependency decision and evidence are in
[DEPENDENCY_REVIEW.md](https://github.com/alexandroit/stackline-har-validator/blob/main/DEPENDENCY_REVIEW.md).

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-har-validator.git
cd stackline-har-validator
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-har-validator/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## Community and Support

Report reproducible package issues in the [issue tracker](https://github.com/alexandroit/stackline-har-validator/issues). Use the [security policy](https://github.com/alexandroit/stackline-har-validator/blob/main/SECURITY.md) for vulnerability reports.

- [Stackline / Alexandro.Net](https://alexandro.net/)
- [GitHub](https://github.com/alexandroit)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)
- [Reddit community: r/Stackline](https://www.reddit.com/r/Stackline/)

## License

MIT. See [the license](https://github.com/alexandroit/stackline-har-validator/blob/main/LICENSE) for the complete terms.

Original authorship and third-party attribution are preserved in [NOTICE](https://github.com/alexandroit/stackline-har-validator/blob/main/NOTICE).
