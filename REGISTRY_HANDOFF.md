# Registry handoff: @stackline/har-validator 1.0.0

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
