# Publishing

Releases are built once from a clean, tagged source commit with
`npm run artifact:prepare`. The exact resulting tarball is verified in
Verdaccio before it is published once to npm. The npm version is never reused.
Checksums, inventory, dependency licenses, CycloneDX SBOM, and the exact
tarball are attached to an immutable GitHub release.
