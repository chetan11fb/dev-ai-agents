# DEV-AI QA Engineering

A deliberately small QA toolkit: five QA agents, one shared skill. Existing .NET, Angular and full-stack implementation agents remain separate; this suite verifies their work rather than duplicating them.

## QA agents

| Agent ID | Use it for | File-writing |
|---|---|---|
| `dev-ai-qa` | First pass: requirements, .NET/backend + full-stack risk matrix, test execution/report | No |
| `dev-ai-test-engineer` | Create and run deterministic regression tests | Test files only, on explicit request |
| `dev-ai-ecc-e2e-runner` | Real browser journey across Angular → API → visible result | E2E test files only, on explicit request |
| `dev-ai-ecc-pr-test-analyzer` | Read-only PR regression and test-gap analysis | No |
| `dev-ai-accessibility` | WCAG-oriented UI audit | No |

## Short usage

1. Open the actual solution/repository in VS Code.
2. Install agents after PR #22 is merged:
   ```bash
   npx dev-ai-agents --agent dev-ai-qa --agent dev-ai-test-engineer --agent dev-ai-ecc-e2e-runner --agent dev-ai-ecc-pr-test-analyzer --agent dev-ai-accessibility
   npx dev-ai-agents --skill qa-engineering
   ```
3. Start Copilot Chat with `@dev-ai-qa` and run `inspect-only` first.
4. Review the risk matrix. If test code is needed, explicitly ask `@dev-ai-test-engineer author-tests`.
5. Use E2E agent only when a real browser runner and isolated app environment exist.
6. Re-run the checks and review actual evidence before treating a release gate as passed.

## Copy/paste prompts

### First QA pass — .NET backend + Angular full-stack
```text
@dev-ai-qa inspect-only: inspect this feature against its acceptance criteria. Trace Angular route/component/form/state/service/interceptor -> HTTP request/DTO -> ASP.NET Core endpoint/auth/validation -> application/domain -> EF Core/database and any implemented event/consumer -> response/UI state. Detect actual versions and test runners. Build a risk-ranked requirement-to-test matrix. Do not edit files or run commands. Separate verified facts, static risks and unknowns.
```

### Execute existing tests safely
```text
@dev-ai-qa execute-tests: this is an isolated local test environment with disposable test data. Discover commands from the solution, package scripts and CI. Run focused backend/API and Angular tests first, then relevant integration tests. Record exact commands, working directories, exit codes and evidence. Do not modify files or access production.
```

### Create regression tests
```text
@dev-ai-test-engineer author-tests: create deterministic tests for [specific acceptance criterion]. Use the repository's existing test frameworks and fixtures. Cover relevant success, validation, authorization, persistence/transaction and failure paths. For full-stack behavior, exercise both sides only if a safe existing test host/fixture is configured. Run the tests and report exact evidence; do not modify application source or install packages.
```

### Browser full-stack journey
```text
@dev-ai-ecc-e2e-runner execute: verify [user journey] in the authorized isolated environment. Trace UI action -> API request/response -> visible business result; verify persisted effect only if safely observable. Use configured browser tooling only. If unavailable, report BLOCKED instead of simulating a run.
```

### PR review
```text
@dev-ai-ecc-pr-test-analyzer analyze: inspect PR [number/branch] read-only. Map backend/API/EF Core/messaging and Angular changes to existing tests, identify contract drift and regression gaps, and report actual CI status only if available.
```

## Expected report
- Project/runtime inventory and actual .NET/Angular/test-runner versions
- Requirement and end-to-end data-flow map
- Risk-ranked test matrix: scenario, layer, expected behavior, command/tool, state and evidence
- Actual executed commands, exit codes and results
- Reproducible defects with severity, confidence, expected vs actual
- BLOCKED/NOT_RUN checks and why
- Residual risk and next action

Verdicts: PASS, FAIL, BLOCKED, NOT_RUN, INCONCLUSIVE. A generated test, successful build, HTTP 200, page load or static review is not a runtime PASS.

## Existing engineering agents (not QA agents)

Use these only when implementation/review beyond QA is separately required:
- `dev-ai-dotnet` — general modern .NET engineering
- `dev-ai-dotnet-microservices` — service boundaries, messaging, retries, idempotency, outbox/Saga
- `dev-ai-angular` — Angular/TypeScript engineering
- `dev-ai-fullstack-engineer` — Angular → API → domain → persistence/integrations

## References
- [Microsoft .NET testing](https://learn.microsoft.com/en-us/dotnet/core/testing/)
- [ASP.NET Core integration testing](https://learn.microsoft.com/en-us/aspnet/core/test/integration-testing)
- [Angular testing](https://angular.dev/guide/testing)

Upstream workflow inspiration: [Releaseworthy/agentic-qa](https://github.com/Releaseworthy/agentic-qa), [GitHub Awesome Copilot](https://github.com/github/awesome-copilot), [ECC](https://github.com/affaan-m/ECC). These are methodology references, not dependencies or claims that upstream agents were run against your application.
