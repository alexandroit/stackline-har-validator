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

## 2026-08-30 dependency-hardening verification

- Clean `npm ci`: 173 signed development packages, no deprecation warning,
  and zero vulnerabilities. The packed consumer installs without warnings and
  has no runtime, optional, or peer subtree.
- The exact 18-schema ordered digest is
  `dc42ed63839894a267a2adc3225ddc33b931a8130f360ae966ad5a2cf52813c0`.
  The self-contained Ajv runtime digest is
  `4f8fe916ab12ba4eeccee11200c648410bbed3cc64d0f1bdf4dc1a2dd36fc2a4`.
- Licensed upstream, immutable 144-case golden, Promise/boolean/callback,
  malformed, stress, browser CJS/ESM, constructor identity, TypeScript
  3.9/current, and Node 6.17.1 through 24 gates pass. Coverage remains 98.14%
  lines, 98.21% branches, and 100% functions.
- `publint` and Are The Types Wrong pass every export. `npm ls`, full audit,
  production audit, license inventory, deterministic rebuild, packed direct
  and alias installs, and 173 registry signatures pass.
- Main CI `33302675845`, tag CI `33302773832`, and CodeQL
  `33302675813`: PASS.
- Accepted artifact SHA-256:
  `b2959f4ae5c5e9505313c3fd390a0e0ff07fa868cea0ea54ff33732c419c2103`.
  Verdaccio, official npm, and immutable GitHub release tarballs are
  byte-identical.
- Production catalog and documentation report `1.0.1` and zero external
  production dependencies. Nginx validation passes; package metadata, page,
  dependency review, and changelog routes return 200 with files at `0644`
  under directories at `0755`.
