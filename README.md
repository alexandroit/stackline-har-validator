# @stackline/har-validator

A compatibility-first maintained replacement for `har-validator@5.1.5`. It
validates HAR 1.2 objects with the same Promise root and synchronous/callback
deep API, while adding ESM, browser bundles, first-party TypeScript types, and
a pinned patched Ajv 6 dependency.

This project is independent of and is not endorsed by the original maintainer.
The upstream MIT license and attribution are preserved.

## Install

```sh
npm install @stackline/har-validator
```

For a migration without source changes, retain the historical key with an npm
alias:

```sh
npm install har-validator@npm:@stackline/har-validator@1.0.0
```

## Promise API

```js
const validate = require('@stackline/har-validator')

await validate.har(archive)
await validate.request(request)
```

Each validator resolves to the exact input reference. Invalid input rejects
with a `HARError` containing Ajv 6-compatible `errors` records.

Browser bundlers may import the normal root and deep entries; they intentionally
remain one shared module graph so errors retain identity with
`lib/error`. A prebundled root-only entry is available as
`@stackline/har-validator/browser`.

## ESM

```js
import validate, { har, request } from '@stackline/har-validator'

await har(archive)
await validate.request(request)
```

## Historical callback and boolean API

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

See [COMPATIBILITY_CONTRACT.md](COMPATIBILITY_CONTRACT.md) for exact behavior,
[MIGRATION.md](MIGRATION.md) for migration choices, and
[SECURITY.md](SECURITY.md) for supported versions and reporting.
