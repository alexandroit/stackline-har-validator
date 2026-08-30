# Migration

## Source-preserving npm alias

The lowest-risk migration retains the historical dependency key:

```json
{
  "dependencies": {
    "har-validator": "npm:@stackline/har-validator@^1.0.1"
  }
}
```

Existing `require('har-validator')` and
`require('har-validator/lib/async')` calls then remain unchanged.

## Scoped imports

Callers may instead install `@stackline/har-validator` and update imports. The
root Promise API and the `lib/async` and `lib/error` deep entries are preserved.
ESM consumers may use the default namespace or named validators.

## Compatibility notes

The validation schemas and Ajv 6 error shapes are unchanged. Version 1.0.1
changes only ownership of the runtime graph: the exact schema set and Ajv
compatibility runtime ship inside the package, leaving no external production
dependency edges. Review code that relied on the upstream bug where an ordinary
`Error` passed `instanceof HARError`.

Ajv or a different HAR toolkit is also a reasonable neutral alternative when
the caller wants to own schema loading, error normalization, and migration
testing rather than preserve this API.
