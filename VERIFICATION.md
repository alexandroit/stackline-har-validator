# Verification

The release gate covers all upstream-style assertions, differential results
against the immutable 5.1.5 baseline, all 18 schemas, falsy and malformed
values, callback timing and return values, prototype isolation, large values,
browser bundles, CJS and ESM, TypeScript 3.9 and current, Node 6.17.1 through
current, packed consumers, npm alias consumers, publint, Are the Types Wrong,
production and full audits, signatures, licenses, hashes, inventory, and SBOM.

The exact historical `ajv@6.12.3` dependency was installed in an isolated
temporary tree with `har-schema@2.0.0`. A broad 4,824-case characterization
across all 18 schemas produced zero result or error-array mismatches against
the patched 6.15.0 line. A deterministic 144-case subset is preserved as a
committed SHA-256 golden gate in `test/fixtures/ajv-6.12.3-golden.json`.

Browser validation bundles root, callback, and error imports together through
the package's actual `browser` export conditions in both CommonJS and ESM. It
asserts that invalid Promise and callback errors share the deep-entry
`HARError` constructor. The packed-consumer gate repeats this against an
installed tarball. Standalone root-only bundles are checked separately.

Publication evidence is appended after the immutable release is verified.

## 2026-08-28 release verification

- Full local release gate: PASS. This includes the 144 Promise and 72 boolean
  plus 72 callback differential cases, the exact 144-case Ajv 6.12.3 golden
  fixture, malformed/security/stress cases, browser constructor identity, ESM,
  TypeScript 3.9/current, and Node 6.17.1 through current.
- Coverage: 98.14% statements/lines, 98.21% branches, and 100% functions.
- `publint`: all good. Are the Types Wrong: all ten entry points green.
  Production and full audits: zero known vulnerabilities. Exact seven-component
  license inventory: PASS.
- Packed scoped, packed historical-key alias, Verdaccio scoped/alias, and
  official npm scoped/alias consumers: PASS.
- Accepted artifact SHA-256:
  `3a4a86be69afa59ed57ebbfa05804fed9f293c3d3802565886fd7d451c5f52ed`.
  Verdaccio, official npm, and GitHub release downloads are byte-identical.
- GitHub source/tag CI runs `33156340527` and `33156340503`, plus CodeQL run
  `33156340438`: PASS. The release contains nine exact assets and reports
  `immutable: true`.
- Documentation source commit
  `49a761e1388791eb8e8d595a4812da54b13077a2`, CI run `33157320513`, and
  CodeQL run `33157319890`: PASS. All 19 sampled package/catalog/robots/sitemap
  routes returned 200 with expected MIME types through ordinary public DNS and
  Cloudflare address `172.64.80.1`; no email-protection markup was injected.
