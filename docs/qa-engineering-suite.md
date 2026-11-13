# DEV-AI QA Engineering Suite

A VS Code + GitHub Copilot QA agent family for .NET / ASP.NET Core microservices and Angular full-stack repositories.

## Agent catalogue

| Agent | Best use |
|---|---|
| `dev-ai-qa-orchestrator` | Coordinate a full QA pass and produce the final evidence-backed report |
| `dev-ai-qa-manual-browser` | Explore a running site like a manual tester using available browser/Playwright MCP tools |
| `dev-ai-qa-dotnet-microservices` | Test .NET APIs, services, persistence, messaging, outbox/inbox and Saga failure paths |
| `dev-ai-qa-angular` | Test Angular components, routes, forms, RxJS/signals, accessibility and responsive UI |
| `dev-ai-qa-fullstack` | Trace a business journey across browser, API, services, database and async events |
| `dev-ai-qa-api-contract` | Validate REST/OpenAPI/event contracts, negative cases, security and compatibility |
| `dev-ai-qa-pr-regression` | Read-only PR/diff impact, test selection, coverage gaps and merge-risk report |
| `dev-ai-qa-defect-investigator` | Reproduce, classify and isolate defects; recommend regression tests |

## Install

Install any specialist individually:

```bash
npx dev-ai-agents --agent dev-ai-qa-orchestrator
npx dev-ai-agents --agent dev-ai-qa-manual-browser
npx dev-ai-agents --agent dev-ai-qa-dotnet-microservices
npx dev-ai-agents --agent dev-ai-qa-angular
npx dev-ai-agents --agent dev-ai-qa-fullstack
npx dev-ai-agents --agent dev-ai-qa-api-contract
npx dev-ai-agents --agent dev-ai-qa-pr-regression
npx dev-ai-agents --agent dev-ai-qa-defect-investigator
```

Install the full suite with one command:

```bash
npx dev-ai-agents --agent dev-ai-qa-orchestrator --agent dev-ai-qa-manual-browser --agent dev-ai-qa-dotnet-microservices --agent dev-ai-qa-angular --agent dev-ai-qa-fullstack --agent dev-ai-qa-api-contract --agent dev-ai-qa-pr-regression --agent dev-ai-qa-defect-investigator
```

The CLI installs the files into `.github/agents/` (flat filenames, consistent with the existing installer and registry validator). Source files remain organized in `agents/qa/` in this repository. The reusable skill installs separately:

```bash
npx dev-ai-agents --skill qa-engineering
```

## Example prompts in VS Code Chat

```text
@dev-ai-qa-orchestrator inspect-only review this workspace and create a risk-based QA plan. Do not edit files or run commands.
@dev-ai-qa-orchestrator execute-tests validate the changed feature using existing test tools only.
@dev-ai-qa-manual-browser explore http://localhost:4200; test login, search and order flow using safe test data.
@dev-ai-qa-dotnet-microservices test the order API and its message consumer, including duplicate delivery and retry exhaustion.
@dev-ai-qa-angular test the changed customer form, validation, route guard and loading/error states.
@dev-ai-qa-fullstack trace checkout from Angular through API to persistence and order event.
@dev-ai-qa-api-contract compare the changed endpoint and OpenAPI contract for breaking changes.
@dev-ai-qa-pr-regression review the current branch diff against main and report test gaps. Read-only.
@dev-ai-qa-defect-investigator investigate this failing test and identify whether it is app, environment or test flakiness.
```

Use the agent names as shown in VS Code's Agents picker if the display label differs.

## Modes and safety

The orchestrator defaults to `inspect-only`. Use `execute-tests` to run existing checks, and `author-tests` only when you explicitly want test files created/updated. PR regression analysis is read-only. QA agents must not change application source, merge/push, deploy, alter production data, run destructive migrations or call real payment/email/SMS systems.

The agents use the repository's existing test runner and browser tools. They do not silently install Playwright, replace Karma/Jasmine, add packages, configure MCP servers or assume that a browser is available. If a capability is missing, they report BLOCKED and explain what is required.

## Verdict integrity

Every check is PASS, FAIL, BLOCKED, NOT_RUN or INCONCLUSIVE. PASS requires an actual execution and a meaningful assertion. Source inspection, generated tests, successful build, or a page load alone is not proof that a business scenario passed.

## Design references

This suite adapts workflow ideas—not copied implementation—from:
- [Releaseworthy/agentic-qa](https://github.com/Releaseworthy/agentic-qa): test planning, manual scenarios, API/UI automation, bug verification, regression and release gates.
- [Microsoft Frontier GHCP RVAS](https://github.com/microsoft/frontier-ghcp-rvas): Copilot QA challenge structure and Playwright MCP exploratory testing.
- [GitHub Awesome Copilot](https://github.com/github/awesome-copilot): reusable browser-testing and QA skill patterns.
- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code): Playwright E2E and flaky-test practices.

The suite is purpose-built for DEV-AI's VS Code agent format and .NET + Angular use cases; it is not a claim that those upstream projects are drop-in compatible.
