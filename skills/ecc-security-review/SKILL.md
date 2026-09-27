---
name: ecc-security-review
description: ECC-inspired security checklist adapted for ASP.NET Core, Angular and enterprise APIs.
---

# Security Review

Run for auth, authorization, APIs, user input, file upload, database, secrets and external integrations.

## Checklist
- secrets absent from source/history/logs
- input validated at trust boundaries
- authorization enforced server-side
- tenant isolation verified
- parameterized database access
- XSS/CSRF/SSRF protections appropriate
- secure cookie/token handling
- CORS restricted
- security headers configured
- rate limiting considered
- dependency vulnerabilities checked
- sensitive errors hidden from clients
- audit logs avoid credentials and unnecessary PII

Critical findings block delivery. High findings require explicit disposition before merge. Cite exact evidence; do not invent vulnerabilities.
