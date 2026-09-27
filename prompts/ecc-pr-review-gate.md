# ECC-Inspired PR Review Gate

Review a PR using only evidence available from the repository and PR.

## Gate sequence
1. Scope and acceptance criteria
2. Build/CI status
3. Correctness and regression risk
4. Security
5. Database/migration impact
6. .NET/Angular quality
7. Unit/integration/E2E coverage
8. Accessibility impact
9. Maintainability/performance
10. Final findings

## Finding format
Severity
File and line
Concrete failure scenario
Evidence
Recommended remediation
Verification test

Do not manufacture findings. A clean review is a valid result.

Inspired by affaan-m/ECC review patterns and adapted for DEV-AI. Source: https://github.com/affaan-m/ECC
