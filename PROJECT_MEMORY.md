# Project memory: @stackline/har-validator

## 2026-08-28 — GO / BUILDING

- Selected at queue rank 1 without a user pin.
- Dated decision: UPSTREAM_AUDIT.md and decision.json.
- Baseline: `har-validator@5.1.5`, exact tarball SHA-256
  `ee08af4aec68e79d2804bf6de4a5972a2ebb0c76a996b0f562a10f8d72ab7e0b`.
- Reason: explicit unsupported status, verified active direct use, stable
  bounded surface, unresolved ownership gap, and no healthy drop-in.
- Red gates: any unexplained differential result, schema drift, runtime,
  browser, type, packed-consumer, audit, license, or artifact failure.

## 2026-08-28 — PUBLISHED

- Transitioned `CODEX_READY -> RESEARCHING -> BUILDING -> PUBLISHED` without a
  user pin. The new author cluster remains distinct from the historical fixed
  thlorenz roster.
- The accepted 36-file artifact was built from tagged commit
  `956e2c79662ed53a58a2d3f21b15911e80c8b08e`; SHA-256
  `3a4a86be69afa59ed57ebbfa05804fed9f293c3d3802565886fd7d451c5f52ed`.
  An earlier candidate was rejected before either registry because it did not
  preserve browser constructor identity and did not contain complete
  transitive license texts.
- The exact accepted bytes passed Verdaccio first, then were published once to
  official npm by `alex360qc` at `2026-08-28T08:40:14.429Z`. Public metadata,
  tarball bytes, scoped installation, and historical-key npm alias installation
  all passed; no version was republished during public propagation.
- Public source: https://github.com/alexandroit/stackline-har-validator. Main
  CI, tag CI, and CodeQL passed for the frozen release source. The nine-asset
  GitHub release reports `immutable: true`, and its downloaded tarball is
  byte-identical to the registry artifact.
- Production documentation:
  https://alexandro.net/docs/vanilla/har-validator/. Documentation commit
  `49a761e1388791eb8e8d595a4812da54b13077a2` passed CI and CodeQL. Production
  contains the exact 34-file catalog and 25-file package manifests; the
  aggregate sitemap contains all 12 routes. Nginx, origin, ordinary public DNS,
  and the Cloudflare edge all passed route and content-type checks.
- Pre-deploy production state is recoverable at
  `/var/backups/stackline-docs/20260828T085718Z-har-validator`.
- Canonical Drive records: decision `1ej8lvrn2YHyjqDXtb0XwMDwCKDVNGS53`,
  project memory `1bXhs5QHtj2XbmQd-HFgxc7tmPK0xbVhL`, and release verification
  `1vFvL6OVHbU9ButVa81Wxho-zL7uzM_Vy`.
- Adoption debt at publication: one qualified PR and one different-repository
  qualified issue. Public contact remains subject to a fresh live deduplication
  search immediately before each write.

## 2026-08-28 — adoption minimum covered

- Opened dependency-only migration PR
  https://github.com/httptoolkit/httpsnippet/pull/28 after a fresh zero-result
  live contact/competition search. It preserves the historical key and deep
  callback import through the exact npm alias; 1,667 tests and the deep
  callback/stress smoke pass. The PR discloses replacement maintainership.
- Opened issue https://github.com/Kong/insomnia-mockbin/issues/236 in a
  different repository after its own fresh live deduplication search. It asks
  maintainers to choose aliasing, migration to their existing Ajv 8 path, or
  intentional retention; the focused route smoke passes 4/4. It offers neutral
  alternatives, discloses maintainership, and makes no vulnerability claim.
- Different-repository check: PASS. Remaining adoption debt:
  `COVERAGE_COMPLETE`. Do not follow up unsolicited; monitor and answer only a
  concrete evidence-backed maintainer question.
- Canonical Drive adoption record: `1tU-50m6Pw8XxkNaNWfS4V81JPVRlAQ5u`.
