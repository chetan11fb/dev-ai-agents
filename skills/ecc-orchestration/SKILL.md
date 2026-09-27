---
name: ecc-orchestration
description: ECC-inspired orchestration pattern for DEV-AI: plan, implement, test, review, security, database, E2E and PR handoffs.
---

# ECC-Inspired DEV-AI Orchestration

Use specialized agents rather than one generic prompt.

ADO Story
-> Spec/SDD
-> Planner
-> Architect/Code Explorer
-> .NET Backend + Database
-> Angular
-> TDD/Test Engineer
-> E2E/Playwright
-> Accessibility
-> Security
-> Code/PR Review
-> Evidence
-> PR

## Dynamic routing
Design/architecture -> planner + architect
Implementation -> TDD + domain implementation
Database/migration -> database reviewer + implementation + tests
Test/coverage -> TDD + E2E
Security/auth/secrets -> security + relevant implementation reviewer
Build failure -> build-error-resolver
PR review -> code-reviewer + security + database/TypeScript reviewers as applicable

## Handoff contract
Every agent returns Context, Work performed, Files/symbols, Evidence, Remaining risks and Next agent.

Never claim execution without tool evidence. Require human confirmation before destructive DB changes, production deployments, secret rotation or PR merge.

Adapted from affaan-m/ECC orchestration patterns. Source: https://github.com/affaan-m/ECC
