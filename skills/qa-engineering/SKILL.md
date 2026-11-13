---
name: qa-engineering
description: Evidence-led QA planning and execution for .NET, Angular, microservices, APIs, browser journeys and pull requests.
---

# DEV-AI QA Engineering Skill

Use this skill with the DEV-AI QA agents. The repository and its existing test setup are authoritative.

## 1. Start with evidence
- Read repository instructions, solution/project manifests, package manifests, CI workflows and existing tests.
- Detect .NET target frameworks, Angular version, package manager, test runners, browser automation and available MCP tools.
- Map acceptance criteria to real code paths. Record unknowns instead of guessing.

## 2. Choose the right test layer
| Layer | Best use | Typical existing tools |
|---|---|---|
| Unit | Domain rules, pure logic, validators | xUnit, NUnit, MSTest, Jasmine/Jest/Vitest |
| Integration | DI, persistence, middleware, messaging | WebApplicationFactory, Testcontainers, existing fixtures |
| API/contract | HTTP behavior, OpenAPI, event schemas | Existing API tests, contract tooling |
| Browser E2E | Critical user journeys and visible UI | Playwright / configured browser MCP |
| Exploratory manual | Unknown behavior, usability, edge cases | Available VS Code browser/Playwright MCP |

Do not duplicate all checks at every layer. Prefer fast deterministic tests for logic and a small number of high-value end-to-end journeys.

## 3. Test design
For each important behavior consider:
- Happy path, invalid input, missing/empty/null values and boundaries.
- Authentication, authorization, tenant isolation and data ownership.
- Loading, empty, error, timeout, retry and cancellation states.
- Duplicate submission, concurrency and idempotency.
- Persistence and async side effects where relevant.
- Backward compatibility for public API/event contracts.
- Keyboard accessibility and responsive layouts for user-facing flows.

Use meaningful assertions on outcomes, not merely that methods were called or pages loaded.

## 4. Browser reliability
- Explore the real page before writing E2E tests.
- Prefer roles, labels and stable test IDs over brittle CSS/XPath.
- Wait for observable conditions; avoid fixed sleeps.
- Keep test data isolated and deterministic.
- Capture screenshots/traces only when available and useful.
- Diagnose selector, timing, environment and app failures separately.

## 5. Microservices reliability
Test duplicate delivery, retry exhaustion, dead-letter handling, message ordering assumptions, outbox/inbox consistency, consumer restart, timeouts and Saga compensation only when those patterns exist in the codebase. Never invent queues, topics or service boundaries.

## 6. Safe execution
- Default to inspection-only until execution is requested.
- Confirm target environment and data isolation before tests that mutate data.
- Never run destructive tests or migrations against production/shared environments.
- Do not add dependencies or replace test runners without approval.
- Never expose credentials or real customer data.

## 7. Evidence and verdicts
Use PASS, FAIL, BLOCKED, NOT_RUN and INCONCLUSIVE. PASS requires actual execution and a meaningful assertion. Record exact command, environment, exit code and evidence. A generated test, static code review or successful build is not a passed runtime test.

## 8. Report
Provide risk-ranked findings, requirement-to-test traceability, executed and skipped checks, reproducible defect steps, evidence and residual risk.
