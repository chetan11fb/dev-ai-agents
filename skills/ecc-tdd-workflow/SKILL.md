---
name: ecc-tdd-workflow
description: ECC-inspired test-first workflow for .NET, Angular, APIs, database and Playwright.
---

# TDD Workflow

Red: translate acceptance criteria into a failing test.
Green: implement the minimum behavior.
Refactor: improve structure only after tests are green.

## Test matrix
Unit -> xUnit/NUnit/MSTest and Jasmine/Jest
Integration -> WebApplicationFactory/TestServer, API/database/contract tests
E2E -> Playwright
Accessibility -> automated checks plus NVDA/JAWS evidence where required

## Evidence
Record exact command, scope, pass/fail and artifact location. Coverage numbers must come from actual reports.

## Anti-patterns
Do not test implementation details, share mutable test state, assert only happy paths, use fixed browser sleeps or skip tests without a reason.
