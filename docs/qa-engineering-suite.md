# DEV-AI QA Engineering

A deliberately small QA toolkit. Existing agents were consolidated instead of adding parallel agents with overlapping responsibilities.

## Canonical agents

| Agent ID | Responsibility | Can edit? |
|---|---|---|
| `dev-ai-qa` | QA lead: requirements, risk-based plan, safe execution coordination and final evidence report | No |
| `dev-ai-test-engineer` | Design and author automated tests using the repository's existing test framework | Test files only, when explicitly requested |
| `dev-ai-ecc-e2e-runner` | Real browser E2E execution, diagnosis and repeat-run flakiness checks | E2E test files only, when explicitly requested |
| `dev-ai-ecc-pr-test-analyzer` | Read-only PR diff, behavior mapping and regression-test gap analysis | No |
| `dev-ai-accessibility` | WCAG 2.2 AA-oriented accessibility QA | No |

## Install

Install only the agent required for the task:

```bash
npx dev-ai-agents --agent dev-ai-qa
npx dev-ai-agents --agent dev-ai-test-engineer
npx dev-ai-agents --agent dev-ai-ecc-e2e-runner
npx dev-ai-agents --agent dev-ai-ecc-pr-test-analyzer
npx dev-ai-agents --agent dev-ai-accessibility
```

Shared method:

```bash
npx dev-ai-agents --skill qa-engineering
```

Source files live under `agents/qa/`; the CLI installs them to flat `.github/agents/` filenames to preserve the current installer contract.

## Suggested usage

```text
@dev-ai-qa inspect-only: map the changed feature to acceptance criteria and existing tests. Do not run commands or edit files.
@dev-ai-qa execute-tests: run the smallest relevant existing tests in this isolated local test environment; report exact commands and evidence.
@dev-ai-test-engineer author-tests: add deterministic tests for this behavior using the existing framework, then run them.
@dev-ai-ecc-e2e-runner execute: explore and test this critical journey using the configured browser/Playwright tool; do not assume browser access.
@dev-ai-ecc-pr-test-analyzer analyze: review this PR diff read-only and map changed behavior to test evidence.
@dev-ai-accessibility audit: review this route/component for WCAG 2.2 AA barriers and distinguish static from runtime evidence.
```

## Verification contract

PASS requires an executed check and a meaningful assertion. Use FAIL, BLOCKED, NOT_RUN or INCONCLUSIVE for other states. A generated test, successful build, HTTP 200, page load or static review is not a runtime PASS. Suspected intermittent failures should be repeated at least three times with retries disabled where practical.

## Safety

No production data mutation, destructive migrations, database resets, live external side effects, secrets, deploys, commits, pushes or merges. Existing project tooling wins; no silent dependency installation, runner replacement or MCP setup.

## Research references

Workflow patterns were studied and adapted—not copied—from:
- [Releaseworthy/agentic-qa](https://github.com/Releaseworthy/agentic-qa): acceptance criteria, test planning, exploratory/manual, API/UI, regression and release-gate flow.
- [xsignon-secure/E2E](https://github.com/xsignon-secure/E2E): trace-based failure diagnosis, repeat-run flakiness checks and verified fixes.
- [GitHub Awesome Copilot](https://github.com/github/awesome-copilot): repository-aware agent/skill conventions.
- [srbarrios/agentic-test-explorer](https://github.com/srbarrios/agentic-test-explorer): PR-driven targeted test missions and evidence artifacts.

These are methodology references, not dependencies or claims that the upstream systems were executed against DEV-AI.
