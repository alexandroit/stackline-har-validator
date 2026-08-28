# Upstream Audit and Intake Decision

Observation date: 2026-08-28 (primary-source checks completed between 08:06Z
and 08:15Z).

## Identity and immutable source

- npm package: `har-validator@5.1.5`
- canonical repository: https://github.com/ahmadnassri/node-har-validator
- publication: 2020-07-30T04:42:33.615Z
- npm artifact SHA-1: `1f0803b9f8cb20c0fa13822df1ecddb36bde1efd`
- npm artifact SHA-256:
  `ee08af4aec68e79d2804bf6de4a5972a2ebb0c76a996b0f562a10f8d72ab7e0b`
- npm integrity:
  `sha512-nmT2T0lljbxdQZfspsno9hgrG3Uir6Ks5afism62poxqBM6sDnMEuPmzTq8XN0OEwqKLLdh1jQI3qyE66Nzb3w==`
- artifact inventory: 6 files
- license: MIT, Copyright (c) 2018 Ahmad Nassri
- current npm write maintainer: `ahmadnassri`

The npm release is explicitly deprecated with “this library is no longer
supported.” The repository is not archived, but current product code and the
published validator have not received a release since 2020; recent changes are
dependency-automation maintenance. npm metadata, the immutable tarball, current
write access, repository history, issues, pull requests, advisory records,
alternatives, dependencies, and current downstream source were inspected. The
proposed scoped package, Verdaccio package, public Stackline repository, and
production documentation route did not exist when checked.

Primary records:

- https://registry.npmjs.org/har-validator/5.1.5
- https://registry.npmjs.org/har-validator/-/har-validator-5.1.5.tgz
- https://api.npmjs.org/downloads/point/2026-08-21:2026-08-27/har-validator
- https://github.com/ahmadnassri/node-har-validator/tree/v5.1.5
- https://github.com/ahmadnassri/node-har-validator/issues/196
- https://github.com/ahmadnassri/node-har-validator/issues/205

## Published compatibility surface

The CommonJS root exports 18 named Promise validators, in this order:
`afterRequest`, `beforeRequest`, `browser`, `cache`, `content`, `cookie`,
`creator`, `entry`, `har`, `header`, `log`, `page`, `pageTimings`, `postData`,
`query`, `request`, `response`, and `timings`. A valid value resolves to the
same input reference; invalid data rejects with `HARError`, whose `errors`
property contains Ajv's complete error array. Falsy input is normalized to an
empty object.

The reachable historical deep entry `lib/async` exports the same validators.
Without a callback each returns a boolean; with a callback it calls
`callback(errorOrNull, valid)` synchronously and returns the callback's return
value. `lib/promise` is the root implementation, and `lib/error` exposes the
`HARError` constructor. The validator compiles the complete HAR 1.2 draft-06
schemas supplied by `har-schema@2.0.0` with Ajv's `allErrors` option. Although
there is no browser field, the pure-JavaScript API is browser-bundleable and
that real bundler contract will be characterized rather than assumed.

## Maintenance and successor assessment

The package is feature-complete, but feature-completeness does not supply a
maintained release owner. Issue 196 explicitly distinguishes the stable
surface from ongoing dependency and security maintenance. In issue 205, a
current user offered to adopt the project; no transfer or supported release
followed. The maintainer also correctly warned that a fork without a concrete
need would impose migration churn, so the Stackline decision requires current
direct use, exact compatibility tests, and a bounded maintenance advantage.

A clean install currently resolves Ajv 6 and `har-schema@2.0.0`. The
replacement must not claim a known production vulnerability where current npm
advisory data does not establish one. Ajv 6 remains the compatibility line and
received a current 6.x release in 2026. `har-schema` is static schema data; its
complete draft-06 meanings are part of the compatibility contract and are not
silently rewritten.

No healthy maintained drop-in was found. `har-validator-maintained@5.1.4` is a
near-copy with negligible current reach and no continuing release activity.
`@luminati-io/har-validator` is an organization-specific older API line, and
`@har-sdk/validator` has a different API. Migrating callers to Ajv or another
HAR toolkit remains a neutral alternative but requires caller-owned schema and
error-contract work.

## Reach and verified direct use

Official npm recorded **11,738,824 downloads** for the complete UTC week
2026-08-21 through 2026-08-27, observed 2026-08-28. This is a mutable reach
signal, not proof of direct use.

Current source inspection independently proves direct runtime use in
`Kong/insomnia-mockbin`, an active, non-archived repository pushed on
2026-08-26. Its manifest directly declares `har-validator@^5.1.5`, and
`lib/routes/bins/create.js` and `lib/routes/bins/update.js` call the Promise
`response()` validator on request bodies. Its Node 22 runtime is inside the proposed
support range. A previously recorded `winglang/wing` lead is stale: the current
manifest no longer declares this package and is not direct-use evidence.

Primary downstream records:

- https://github.com/Kong/insomnia-mockbin/blob/master/package.json
- https://github.com/Kong/insomnia-mockbin/blob/master/lib/routes/bins/create.js
- https://github.com/Kong/insomnia-mockbin/blob/master/lib/routes/bins/update.js

## Decision

**GO.** Build `@stackline/har-validator@1.0.0` as a compatibility-first
maintained continuation of the exact `har-validator@5.1.5` artifact.

The decision rests on explicit unsupported status, verified current direct
runtime use, a stable and testable surface, a concrete release-ownership gap,
and the absence of a healthy drop-in successor. It does not rest on publication
age, download volume, a lockfile, or GitHub dependency metadata.

The release boundary is deliberately narrow:

1. preserve root Promise behavior, property order, input identity, falsy-input
   normalization, complete Ajv error arrays, and the three historical deep
   entries;
2. preserve `lib/async` boolean, synchronous callback, callback-return, and
   error behavior exactly;
3. preserve the HAR 1.2 draft-06 schema meanings by using exact, audited
   production dependency versions on the compatible Ajv 6 line;
4. correct only the `HARError` prototype chain so it remains an Error without
   making unrelated error objects inherit HAR-specific fields;
5. add real ESM facades, TypeScript 3.9-compatible declarations, conditional
   exports, and a tested browser bundle without changing CommonJS;
6. preserve the upstream Node.js 6 runtime floor for CommonJS and test Node
   6.17.1 through current Node; ESM remains available where the runtime supports
   it; and
7. preserve the MIT and ISC license obligations and state explicitly that
   Stackline is not affiliated with or endorsed by the upstream maintainers.

Any differential mismatch outside the intentional Error prototype correction,
schema drift, browser-bundle failure, supported-runtime failure, type failure,
production advisory, license failure, or clean packed-consumer failure is a red
gate and blocks publication.
