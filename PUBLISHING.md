# Publishing

Releases are built once from a clean, tagged source commit with
`npm run artifact:prepare`. The exact resulting tarball is verified in
Verdaccio before it is published once to npm. The npm version is never reused.
Checksums, inventory, dependency licenses, CycloneDX SBOM, and the exact
tarball are attached to an immutable GitHub release.

## 1.0.0 release evidence

The accepted artifact has SHA-256
`3a4a86be69afa59ed57ebbfa05804fed9f293c3d3802565886fd7d451c5f52ed` and
comes from tagged source commit
`956e2c79662ed53a58a2d3f21b15911e80c8b08e`. Verdaccio and official npm
returned these exact bytes, and both registry consumer modes passed. Official
npm records publication at `2026-08-28T08:40:14.429Z`. GitHub reports the
nine-asset `stackline-v1.0.0` release as immutable, and its downloaded tarball
is also byte-identical. See `REGISTRY_HANDOFF.md` for the complete handoff.

## 1.0.1 release evidence

The accepted artifact has SHA-256
`b2959f4ae5c5e9505313c3fd390a0e0ff07fa868cea0ea54ff33732c419c2103`
and comes from tagged source commit
`26c5cac92154d28f66a793c0a3f20d0feeb97907`. Verdaccio and official npm
returned these exact bytes, and both scoped and historical-key consumers pass.
Official npm records publication at `2026-08-30T08:56:39.244Z`. GitHub
reports the nine-asset `stackline-v1.0.1` release as immutable. The package
has an empty external production graph; all bundled third-party code remains
represented in the license inventory and CycloneDX SBOM.
