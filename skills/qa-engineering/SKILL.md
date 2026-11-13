---
name: qa-engineering
description: Evidence-first QA method for .NET, Angular, APIs, browser E2E and pull-request regression.
---

# DEV-AI QA Engineering

Use this shared method with the five DEV-AI QA agents. Repository evidence and configured tools are authoritative.

## Select one owner
- `dev-ai-qa`: coordinates the QA pass and risk-based test plan.
- `dev-ai-test-engineer`: authors test code only when explicitly requested.
- `dev-ai-ecc-e2e-runner`: executes real browser journeys with available Playwright tooling.
- `dev-ai-ecc-pr-test-analyzer`: read-only PR regression analysis.
- `dev-ai-accessibility`: accessibility-specific audit.
Do not run overlapping agents for the same checks. Use the narrowest specialist that owns the task.

## Discover before acting
Read repository instructions, project/solution files, package manifests, test configuration, existing tests and CI. Detect actual .NET/Angular versions and runners. Do not assume xUnit, Playwright, Karma, Jest, a browser MCP or any service architecture exists.

## Test design
Map acceptance criteria to observable behavior. Select the smallest effective test layer:
- Unit for domain rules and pure logic.
- Integration for real DI, middleware, persistence and transactions.
- API/contract for serialization, validation, authorization and compatibility.
- Browser E2E for a small set of critical user journeys.
- Manual exploratory checks for unknown behavior.
Avoid repeating identical assertions at every layer. Assert business outcomes, not only method calls, HTTP 200 or page loads.

## Reliability and anti-false-positive rules
- Use existing test runners and fixtures; do not install packages or replace frameworks without approval.
- Prefer semantic locators and observable waits; avoid fixed sleeps.
- Mock external boundaries, not the behavior under test. Flag over-mocking that makes a test pass without exercising the real contract.
- Diagnose application, test-code, environment, data and dependency failures separately.
- Re-run suspected flaky failures at least three times with retries disabled when practical; show each result.
- Never weaken assertions, delete failing tests or increase retries solely to get green.
- A generated test is NOT_RUN until it is actually executed.

## Safe execution
Confirm the target is a local or isolated test environment and that data is disposable/isolated before mutating tests. Stop if production/shared environment risk is unclear. Never reset databases, replay production messages, trigger real payments/emails/SMS, expose credentials or use real customer data.

## Verdicts
Use PASS, FAIL, BLOCKED, NOT_RUN or INCONCLUSIVE. PASS requires actual execution and a meaningful assertion. Record exact command, environment, exit code, evidence and skipped checks. Static analysis, build success and CI badges are not runtime proof.

## .NET and Angular coverage hints
For .NET, inspect the real target framework, xUnit/NUnit/MSTest setup, WebApplicationFactory fixtures, EF Core persistence, auth, cancellation, concurrency, broker handlers, idempotency, outbox/inbox and Saga compensation only where implemented.
For Angular, inspect the actual version and configured runner; cover component states, forms, routes/guards, interceptors, RxJS/signals, async loading/error states, keyboard and responsive behavior.

## Reporting
State scope, requirement traceability, risk-ranked scenarios, exact execution evidence, reproducible defects, BLOCKED/NOT_RUN items and residual risk. Never invent coverage percentages, screenshots, CI status or a PASS verdict.
