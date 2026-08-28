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
