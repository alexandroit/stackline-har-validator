# Registry handoff

Observation date: 2026-08-28.

The one accepted artifact is
`release-candidate/stackline-har-validator-1.0.0.tgz`, built from source commit
`956e2c79662ed53a58a2d3f21b15911e80c8b08e` and tag
`stackline-v1.0.0`.

- SHA-1: `6f06a6a5c316b4c37736675fb720a36a4a6c138e`
- SHA-256: `3a4a86be69afa59ed57ebbfa05804fed9f293c3d3802565886fd7d451c5f52ed`
- SHA-512: `a324fdacc547b5e82a5907a324aa894e81002e4da1895fdf823d9795ba9bbafdb19f316cce2493415d2d7298debd15ca557d0d5b693eef638c0144d5fd6be427`
- npm integrity: `sha512-oyT9rMVHtegqWQejJKqJToEALk2hiV/fgj2Xlbqbuv2xnzFsziSTQV0tcpjevRXKVX0NW2k+72OMAUTV/WvkJw==`
- Inventory: 36 files, 98,528 packed bytes, 620,701 unpacked bytes; every
  shipped regular file is mode `0644`.

The exact bytes were published once to the configured Verdaccio registry,
fetched back byte-identically, and exercised as both a direct scoped install
and an npm alias under the historical key. The same bytes were then published
once to official npm by the authenticated `alex360qc` account. Official npm
records publication at `2026-08-28T08:40:14.429Z`; its public tarball is
byte-identical and both clean scoped and alias consumers pass.

The public source repository is
https://github.com/alexandroit/stackline-har-validator and contains only the
`main` branch. Main CI, tag CI, and CodeQL passed for the tagged source. The
immutable release at
https://github.com/alexandroit/stackline-har-validator/releases/tag/stackline-v1.0.0
contains nine uploaded assets; GitHub reports `immutable: true`, and the
downloaded release tarball is byte-identical to the registry artifact.

No version may be republished. Any future change requires a new version, a new
tag, and a new immutable artifact.

## 1.0.1 dependency hardening — 2026-08-30

The accepted artifact is
`release-candidate/stackline-har-validator-1.0.1.tgz`, built from source
commit `26c5cac92154d28f66a793c0a3f20d0feeb97907` and tag
`stackline-v1.0.1`.

- SHA-1: `dba7b58e4abf2ead41d061207aee12f1cb6a4585`
- SHA-256:
  `b2959f4ae5c5e9505313c3fd390a0e0ff07fa868cea0ea54ff33732c419c2103`
- SHA-512:
  `36e5ee5689abe6fd2a1e0516d2d9e4e88148ad97acc8ef351991829bef6ce848090ab1b82964f55228fe4738b60f7808b4a03b460f5d0f089f40395d4e9c3902`
- npm integrity:
  `sha512-NuXuVomr5v0qHgUW0tnk6IFIrZesyO81GZGCm+9s6EgJCrG4KWT1Uij+Rzi2D3gItKA7Rg9dDwifQDldTpw5Ag==`
- Inventory: 58 files, 144,919 packed bytes, 950,222 unpacked bytes;
  every shipped regular file is mode `0644`.

The package now has zero runtime, optional, and peer dependencies. Ajv 6.15,
its five runtime components, and the exact 18-file HAR schema set are bundled
with complete license texts, fingerprints, and explicit CycloneDX edges.
Warning-free scoped and historical-key alias installs, `npm ls`, and full and
production audits pass.

The Verdaccio and official npm tarballs were downloaded and byte-compared with
the release candidate. Official npm records publication at
`2026-08-30T08:56:39.244Z` and reports the recorded integrity, 58 files,
950,222 unpacked bytes, an empty dependency map, and a registry signature.

Main CI run `33302675845`, tag CI run `33302773832`, and CodeQL run
`33302675813` passed. The nine-asset GitHub release is immutable:
https://github.com/alexandroit/stackline-har-validator/releases/tag/stackline-v1.0.1

The dynamic EN/PT/FR catalog and production documentation expose version
`1.0.1`, zero external production dependencies, bundled-component
provenance, migration guidance, security boundaries, licenses, and the release
changelog at https://alexandro.net/docs/vanilla/har-validator/.
