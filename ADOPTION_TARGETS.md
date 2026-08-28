# Adoption targets

Observation date: 2026-08-28.

Public contact always requires a fresh live GitHub deduplication search.

## Pull request opened

- https://github.com/httptoolkit/httpsnippet/pull/28 — `httptoolkit/httpsnippet`:
  active Node 22 project; directly declares
  `har-validator` and calls `lib/async` in runtime source. A dependency-only npm
  alias preserves source. Its clean baseline passes 1,667 tests. Contributing
  policy permits focused changes. The exact two-file alias migration, target
  suite, package gate, and deep callback/stress smoke pass. Maintainer
  disclosure is present. Status observed open at `2026-08-28T09:04:19Z`.

## Different-repository issue opened

- https://github.com/Kong/insomnia-mockbin/issues/236 —
  `Kong/insomnia-mockbin`: active Node 22 service; directly calls root Promise
  response validation in two routes. Its policy asks maintainers before
  significant work and its suite lacks focused route validation coverage, so a
  decision issue is safer than an unsolicited PR. Neutral alternatives include
  the alias, migrating the routes to its existing Ajv 8 infrastructure, or
  intentional retention. Focused accepted/rejected route checks passed 4/4;
  maintainership and non-affiliation are disclosed, with no vulnerability
  claim. Status observed open at `2026-08-28T09:08:12Z`.

The pull request targets `httptoolkit/httpsnippet`, so the different-repository
check passes. This package's one-PR/one-issue adoption minimum is covered;
future activity is monitor-only unless a maintainer asks a concrete question.

## Rejected or backup

- `cyrus-and/chrome-har-capturer`: active direct test-only use; backup PR, lower
  runtime value.
- `readmeio/metrics-sdks`: integration harness needs external credentials and
  services; validation is not reliable enough for a focused PR.
- `Netflix/pollyjs`: deep test use but materially less current default-branch
  activity and a legacy multi-package harness.
- `winglang/wing`: stale lead; current source no longer declares the package.
