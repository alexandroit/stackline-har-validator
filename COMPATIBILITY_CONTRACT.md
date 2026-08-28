# Compatibility contract

## Baseline

The baseline is the immutable `har-validator@5.1.5` npm artifact. The CommonJS
root remains `lib/promise.js`, with exactly 18 enumerable validator properties
in the upstream order. `lib/promise`, `lib/async`, and `lib/error`, with or
without `.js`, remain supported deep entries.

## Preserved behavior

- Promise validators normalize falsy input to `{}`, compile the HAR draft-06
  schema lazily with `allErrors: true`, resolve to the exact validated object,
  and reject invalid data with `HARError`.
- Boolean validators in `lib/async` return synchronously.
- Callback validators invoke the callback synchronously as `(error, valid)`
  and return the callback's own return value.
- `HARError` keeps its name, message, errors array, and stack behavior.
- Ajv 6 error records, HAR 1.2 schema semantics, nullable cache entries,
  extension properties, URI formats, and date-time patterns are preserved.
- CommonJS remains compatible with Node.js 6.17.1 and later.
- The published package graph remains bundleable for browsers with one shared
  `HARError` identity across root and deep entries. Root-only self-contained
  ESM and CommonJS bundles are also supplied and tested.

## Intentional correction

Upstream assigned `HARError.prototype = Error.prototype`, which modified the
shared Error prototype and caused unrelated `Error` objects to satisfy
`instanceof HARError`. This package gives `HARError` its own prototype derived
from `Error.prototype`. A `HARError` still satisfies both `instanceof
HARError` and `instanceof Error`; ordinary errors no longer satisfy
`instanceof HARError`.

## Additive surfaces

The package adds named and default ESM exports, conditional exports,
TypeScript 3.9-compatible declarations, explicit browser bundles, scoped
installation metadata, and immutable release evidence. These additions do not
change the CommonJS call behavior.

## Boundaries

Ajv remains on the 6.x line to preserve validation and error semantics. The
package does not promise Ajv 8 error shapes, automatic HAR repair, streaming
JSON parsing, or semantic validation beyond the upstream HAR 1.2 schemas.
Development tooling requires a current Node release but is not part of the
production install.
