# Adoption targets

Observation date: 2026-08-28.

Public contact always requires a fresh live GitHub deduplication search.

## Qualified pull-request candidate

- `httptoolkit/httpsnippet`: active Node 22 project; directly declares
  `har-validator` and calls `lib/async` in runtime source. A dependency-only npm
  alias preserves source. Its clean baseline passes 1,667 tests. Contributing
  policy permits focused changes.

## Qualified issue candidate

- `Kong/insomnia-mockbin`: active Node 22 service; directly calls root Promise
  response validation in two routes. Its policy asks maintainers before
  significant work and its suite lacks focused route validation coverage, so a
  decision issue is safer than an unsolicited PR. Neutral alternatives include
  the alias or migrating the routes to its existing Ajv 8 infrastructure.

## Rejected or backup

- `cyrus-and/chrome-har-capturer`: active direct test-only use; backup PR, lower
  runtime value.
- `readmeio/metrics-sdks`: integration harness needs external credentials and
  services; validation is not reliable enough for a focused PR.
- `Netflix/pollyjs`: deep test use but materially less current default-branch
  activity and a legacy multi-package harness.
- `winglang/wing`: stale lead; current source no longer declares the package.
