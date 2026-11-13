---
name: qa-engineering
description: Evidence-first QA method for .NET backend, ASP.NET Core APIs, Angular full-stack, microservices, browser E2E and PR regression.
---

# DEV-AI QA Engineering

Use this shared method with the five QA agents. Repository evidence and configured tools are authoritative. Keep QA separate from implementation: existing `dev-ai-dotnet`, `dev-ai-dotnet-microservices`, `dev-ai-angular` and `dev-ai-fullstack-engineer` remain engineering agents, not additional QA agents.

## Choose one QA owner
- `dev-ai-qa`: coordinates acceptance criteria, architecture/data-flow tracing, risk matrix and execution report. Read-only with respect to files.
- `dev-ai-test-engineer`: authors and executes tests only when explicitly requested.
- `dev-ai-ecc-e2e-runner`: real browser journeys using configured Playwright/browser tooling; reports BLOCKED if unavailable.
- `dev-ai-ecc-pr-test-analyzer`: read-only PR diff and regression-test gap analysis.
- `dev-ai-accessibility`: accessibility-specific review.
Do not invoke overlapping agents for identical checks. Implementation agents may be used for fixes only when the user separately requests implementation.

## Discover before testing
Read repo instructions, solution/project files, target frameworks, global.json, package manifests, test config, fixtures, CI and existing tests. Detect actual .NET/Angular versions and runners. Do not assume xUnit, EF Core, SQL Server, Azure Service Bus, Playwright, Karma, Jest or a particular service topology.

## .NET backend test matrix
Choose applicable rows only after proving the relevant component exists:
- API pipeline: routing, model binding, validation, status/error contract, ProblemDetails, serialization and OpenAPI compatibility.
- Identity: authentication, authorization policies/claims, tenant/resource ownership and forbidden access.
- Domain/application: invariants, validation, state transitions, boundary values and exception mapping.
- Persistence: EF Core mappings, relational behavior, query filters, uniqueness, transactions, concurrency, pagination and migration risk.
- Resilience: timeout, cancellation, retry classification, idempotency and duplicate side effects.
- Messaging: producer/consumer contract, duplicate delivery, outbox/inbox atomicity, ordering, retry exhaustion, DLQ and Saga compensation only where implemented.
- Operations: health/readiness, structured logs, correlation/trace propagation and safe failure behavior.

## Angular-to-.NET full-stack test matrix
Trace the same acceptance criterion across the real boundary:
1. Route/guard → component/form → state/service/interceptor.
2. HTTP method/path/headers/body → server DTO/model binding/validation.
3. Authentication/authorization/tenant context → application/domain handler.
4. EF Core/repository/transaction → observable persistence or event side effect.
5. Response DTO/ProblemDetails → client mapping → loading/success/error UI state.

Check client/server DTO drift (case, nullability, enums, dates, decimals), duplicate submits, cancellation/navigation races, stale responses, auth refresh, CORS, server-side validation and error mapping. Do not call a one-sided unit test an end-to-end test.

## Test layer selection
- Unit for pure logic and domain rules.
- Integration for real DI, middleware, auth, HTTP pipeline, database and transaction boundaries using existing isolated fixtures.
- API/contract for request/response/event compatibility.
- Angular component/service for UI behavior and HTTP interactions.
- E2E for a small set of critical real user journeys.
- Manual exploratory/security/performance checks only with appropriate access, tools and explicit authorization.
Prefer the narrowest layer that proves the requirement. Avoid repeating identical assertions across layers.

## Reliability and anti-false-positive rules
- Use existing frameworks, fixtures and test data patterns; no silent package installation or runner replacement.
- Mock external systems, not the behavior under test. A mocked DB/broker is not proof of relational DB/broker integration.
- Prefer semantic browser locators and observable waits; avoid fixed sleeps.
- Diagnose application, test-code, environment, dependency, configuration and data failures separately.
- Re-run suspected flaky failures at least three times with retries disabled when practical; report every attempt.
- Never weaken assertions, delete failing tests or increase retries solely to get green.
- A generated test is NOT_RUN until executed. A build, HTTP 200, page load or static review is not PASS.

## Safe execution
Confirm local/isolated test environment and data isolation before tests that write. Stop if production/shared environment risk is unclear. Never reset shared databases, replay production messages, trigger real payment/email/SMS, expose secrets or use real customer data.

## Verdicts
Use PASS, FAIL, BLOCKED, NOT_RUN or INCONCLUSIVE. PASS requires actual execution and a meaningful assertion. Record exact command, working directory, environment, exit code, output and evidence/artifact. Mark unexecuted layers explicitly.

## Reporting
Scope and acceptance criteria; architecture/data-flow map; risk-ranked scenario matrix; existing/missing tests; exact commands and outcomes; reproducible defects with severity/confidence/expected-vs-actual; BLOCKED/NOT_RUN checks; residual risk and next action. Never invent coverage, screenshots, CI state or topology.
