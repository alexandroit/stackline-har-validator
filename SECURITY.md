# Security policy

Security fixes are provided for the latest `@stackline/har-validator` release.
Use the private GitHub security advisory form at
https://github.com/alexandroit/stackline-har-validator/security/advisories/new
for suspected vulnerabilities. Do not include exploit details in a public
issue.

Reports should include the affected version, runtime, smallest reproducer, and
impact. Maintainers will acknowledge a report within five business days. No
unsupported security claim is made about `har-validator@5.1.5`.

The current package has no external production dependency edges. Ajv 6.15 and
the exact HAR 1.2 schemas are bundled with fingerprint and compatibility gates;
their code is still reviewed as third-party code and rebuilt when a relevant
security update is published.
