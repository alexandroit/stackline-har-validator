# Changelog

## [1.0.2] - 2026-09-28

- Organize package documentation, preserve API and migration examples, and add Stackline community links.
- Improve package discovery keywords with precise domain terms and `stackline`.
- Pin GitHub Actions release tooling and require an explicit missing-version response before publication.


## 1.0.1 - 2026-08-30

- Remove every external production dependency while preserving the complete
  `har-validator@5.1.5` contract.
- Bundle the actively maintained Ajv 6.15 compatibility runtime and vendor the
  exact 18-file HAR 1.2 schema set with complete MIT, ISC, and BSD notices.
- Remove the deprecated upstream package from the development install and keep
  its independently captured 144-case golden compatibility corpus.
- Require warning-free packed installs, a valid empty production tree, zero
  audit findings, schema fingerprints, Node 6-24, browser, ESM, TypeScript,
  differential, license, CI, and CodeQL gates.

## 1.0.0 - 2026-08-28

- Continue the complete `har-validator@5.1.5` Promise and deep callback API.
- Pin the patched Ajv 6 line and exact HAR 1.2 schema artifact.
- Isolate `HARError` from the shared `Error.prototype`.
- Add ESM, browser bundles, TypeScript 3.9 declarations, export maps, modern
  tests, immutable artifacts, SBOM, CI, and CodeQL.
