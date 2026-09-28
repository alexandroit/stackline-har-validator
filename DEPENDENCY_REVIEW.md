# Production dependency review

Observed: 2026-08-30

## Result

`@stackline/har-validator@1.0.1` has no runtime, optional, or peer
dependencies. A clean consumer install produces a valid empty production
subtree and zero npm audit findings.

## Ajv decision

HAR Validator depends on Ajv 6 error paths, coercion boundaries, draft-06
loading, and validation order. Ajv 8 is not a drop-in behavioral replacement.
Ajv 6.15.0 is the current 6.x maintenance release, published on 2026-04-23 from
the active, unarchived `ajv-validator/ajv` repository. The exact runtime is
therefore bundled at build time and tested against the immutable 5.1.5 golden
corpus. Ajv and its five internal components remain fully represented in the
license inventory and release SBOM.

Primary evidence:

- https://www.npmjs.com/package/ajv/v/6.15.0
- https://github.com/ajv-validator/ajv

## HAR schema decision

`har-schema@2.0.0` is static data with no dependencies, but its package has
not released since 2017. The exact 18 JSON schemas are incorporated under
`lib/schemas/` with the original ISC license. A deterministic SHA-256 gate
protects the complete ordered schema set:
`dc42ed63839894a267a2adc3225ddc33b931a8130f360ae966ad5a2cf52813c0`.

Primary evidence:

- https://www.npmjs.com/package/har-schema/v/2.0.0
- https://github.com/ahmadnassri/har-schema

## Release gates

- warning-free clean development and packed-consumer installs;
- empty and valid production dependency tree;
- zero full and production npm audit findings;
- exact schema and bundled-runtime fingerprints;
- upstream, differential, malformed, stress, browser, ESM, TypeScript, and
  Node 6-24 tests;
- complete bundled-component license inventory and CycloneDX SBOM;
- registry artifact identity, CI, and CodeQL.

## uri-js legacy port fallback (2026-09-28)

CodeQL alerts 3 and 4 identify a quadratic regex in uri-js 4.4.1 included by
Ajv 6.15.0. Repeated slashes with no colon reproduce its quadratic failure in
isolation. This is a legacy branch selected only when unmatched regex groups
are not `undefined`; supported Node engines use the other branch. The public
HAR validator also compiles fixed internal schemas, rather than accepting
caller-provided schema identifiers. A denial-of-service through current public
HAR validation has therefore not been demonstrated.

The build now replaces that exact upstream source expression with the linear,
ES5-compatible predicate in `lib/legacy-uri-port.js`, before regenerating the
vendored Ajv and both browser bundles. It preserves LF, CR, Unicode line-separator,
empty-port and authority behavior and fails if the upstream patch site changes.
Bounded differential cases and a million-character child-process regression
cover the replacement. Licenses, schemas, external API and Node >=6 contract
remain unchanged; no alert or scanning rule is suppressed.
