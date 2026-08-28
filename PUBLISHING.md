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
