# DEV-AI Agents

<p align="center">
  <img src="https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main/assets/ai-agent-orchestration.svg" width="100%" alt="Animated AI agent orchestration lab showing engineering agents coordinating through an orchestrator"/>
</p>

<p align="center">
  <b>Production-oriented AI agents, skills, plugins and MCP configurations for VS Code + GitHub Copilot.</b>
</p>

<p align="center">
  <code>SPECIFY</code> → <code>REASON</code> → <code>BUILD</code> → <code>REVIEW</code> → <code>TEST</code> → <code>SHIP</code>
</p>

## 🤖 What is DEV-AI Agents?

A production-focused engineering agent ecosystem for turning development work into **repeatable, agent-assisted workflows**.

### Agent ecosystem

- **Agents** — 30+ engineering agents plus ECC-inspired enterprise specialists covering .NET, Angular, full-stack, QA, accessibility, security, architecture, debugging, API, database, performance, refactoring, testing, domain analysis and legacy .NET.
- **Skills** — 16 reusable engineering guidance packs that can be composed into agent workflows.
- **Plugins** — selected integrations and workflows aligned with GitHub's awesome-copilot plugin ecosystem.
- **MCP** — curated developer-tool MCP JSON definitions adapted from the devtools collection in claude-code-templates.
- **Prompts** — 8 reusable task prompts for ADO-to-full-stack, ECC-inspired orchestration, .NET/Web API, Angular UI, QA and accessibility workflows.
- **Settings** — reusable runtime/VS Code setup presets.
- **ECC-inspired layer** — planning, architecture, TDD, database, E2E, security, build repair and PR-review patterns adapted for enterprise .NET + Angular + ADO.
- **Registry** — `registry/marketplace.json` is the machine-readable catalog used by DEV-CLI and the npm/npx installer.

## 🧠 Agentic engineering flow

```text
Story / Requirement
       ↓
   Specification
       ↓
 Agent Planning
       ↓
   Implementation
       ↓
 Review + Security
       ↓
 QA + Accessibility
       ↓
 Evidence + PR
```

The repository is designed around **specialized agents working as a coordinated engineering system**, rather than treating every task as a single generic coding prompt.

## 🧩 Repository architecture

| Layer | Purpose |
|---|---|
| Agents | Specialized engineering personas and workflows |
| Skills | Reusable domain and implementation knowledge |
| Plugins | Integrations and developer workflows |
| MCP | Tool connectivity and developer automation |
| Registry | Machine-readable discovery and installation metadata |

## 📦 Install with npm / npx

DEV-AI Agents is designed as a zero-setup CLI, following the installation model of Claude Code Templates: users can install a selected component without cloning this repository.

### Recommended one-command install

For a developer who wants the primary engineering agent, there is no separate SDD subcommand:

```bash
npx dev-ai-agents
```

This installs the single primary **Dev-AI SDD** agent plus the project-local SDD templates needed to run it.

After installation:

```text
VS Code Chat → Agents → Dev-AI SDD
@Dev-AI SDD initialize
@Dev-AI SDD run story #126433
```

The CLI also supports the full component catalog for developers who want additional specialized agents, skills, prompts, MCP templates or settings.

### Individual installation

Every registry component can be installed **individually**. You do not need to install the complete DEV-AI stack.

The CLI resolves the component from `registry/marketplace.json`, downloads the exact source file from this repository, and writes it to that component's declared `target`.

#### Agent

```bash
npx dev-ai-agents --agent dev-ai-fullstack-engineer
```

Other examples:

```bash
npx dev-ai-agents --agent dev-ai-dotnet
npx dev-ai-agents --agent dev-ai-qa
npx dev-ai-agents --agent dev-ai-accessibility
npx dev-ai-agents --agent dev-ai-ado
```

Default target examples:

```text
.github/agents/dev-ai-fullstack-engineer.agent.md
.github/agents/dev-ai-dotnet.agent.md
.github/agents/dev-ai-qa.agent.md
```

#### ⭐ Primary Dev-AI SDD agent

The SDD capability is **not a separate CLI/package**. It is the primary global engineering agent installed by the normal Dev-AI command:

```bash
npx dev-ai-agents
```

This installs:
- `.github/agents/dev-ai-sdd.agent.md`
- `.specify/memory/constitution.md`
- `specs/_template/spec.md`
- `specs/_template/plan.md`
- `specs/_template/tasks.md`
- `specs/_template/sdd-state.md`
- `specs/_template/decisions.md`

Then open VS Code Chat → **Agents** → **Dev-AI SDD** and run:

```text
@Dev-AI SDD initialize
@Dev-AI SDD run story #126433
```

The workflow pauses for human review at Specification, Plan and Tasks, then continues through Analyze → Implement → Validate → Converge → Final Review.

**Important:** SDD does **not** require a new ADO MCP. If the consuming VS Code workspace already has Azure DevOps MCP configured in `.vscode/mcp.json`, Dev-AI SDD uses that existing MCP connection to read and analyze the story. The installer does not overwrite or duplicate MCP configuration.

For a repository with no ADO MCP, SDD can still work from local requirement text or another available integration; it never invents missing story data.


### Skill

```bash
npx dev-ai-agents --skill dotnet-development
npx dev-ai-agents --skill angular-development
npx dev-ai-agents --skill accessibility
```

Default target:

```text
.github/skills/<skill>/SKILL.md
```

#### Prompt

Reusable prompts can also be installed independently:

```bash
npx dev-ai-agents --prompt ado-story-to-fullstack
npx dev-ai-agents --prompt backend-dotnet-webapi
npx dev-ai-agents --prompt angular-ui-fullstack
npx dev-ai-agents --prompt qa-review-gate
```

Default target:

```text
docs/prompts/<prompt>.md
```

#### MCP

```bash
npx dev-ai-agents --mcp github
npx dev-ai-agents --mcp azure-devops
npx dev-ai-agents --mcp playwright
npx dev-ai-agents --mcp figma
```

Default target:

```text
.vscode/mcp/<mcp>.json
```

#### Plugin

```bash
npx dev-ai-agents --plugin ai-team-orchestration
```

Plugins may contain multiple files and are installed as a directory.

#### Setting

```bash
npx dev-ai-agents --setting vscode-fullstack
npx dev-ai-agents --setting runtime-bootstrap
```

#### Install multiple selected components

You can combine component types in one command:

```bash
npx dev-ai-agents \
  --agent dev-ai-fullstack-engineer \
  --skill dotnet-development \
  --mcp azure-devops \
  --prompt ado-story-to-fullstack
```

#### Preview the complete catalog

```bash
npx dev-ai-agents --list
```

The list shows each component's **ID and installation target**, so you can choose only what your project needs.

### Backward compatibility

Older scripts using:

```bash
npx dev-ai-agents sdd
```

continue to work, but the recommended command is simply:

```bash
npx dev-ai-agents
```

### Browse the catalog

```bash
npx dev-ai-agents --list
```

### Install everything

```bash
npx dev-ai-agents --all
```

Use `--force` to intentionally overwrite an existing component:

```bash
npx dev-ai-agents --agent dev-ai-fullstack-engineer --force
```

The CLI reads `registry/marketplace.json`, downloads the selected component from its real GitHub source path, and installs it into the declared `target`. The registry remains the single source of truth for the installer.

Supported individual component types are **agent, skill, prompt, MCP, plugin and setting**. This means a developer can install only the capability they need—for example, just the .NET agent, just the ADO MCP, or just the ADO-to-full-stack prompt—without pulling the rest of the ecosystem.

> **Publishing note:** the public package is **dev-ai-agents**. After the first npm publication, developers can install the primary agent with `npx dev-ai-agents` or add it to a project with `npm install --save-dev dev-ai-agents`.


## ⚡ ECC-Inspired Enterprise Engineering Layer

DEV-AI now includes a native adaptation layer inspired by the engineering patterns in **affaan-m/ECC**. The goal is not to turn DEV-AI into ECC or copy unrelated language-specific assets; it is to bring the useful **plan → build → test → security → database → review → PR** discipline into the existing .NET + Angular + ADO ecosystem.

<p align="center">
  <img src="https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main/assets/ecc-engineering-loop.svg" width="100%" alt="Animated DEV-AI ECC-inspired engineering loop"/>
</p>

### Added native agents

- ECC Planner
- ECC Architect
- ECC Code Reviewer
- ECC Database Reviewer
- ECC TDD Guide
- ECC E2E Runner
- ECC Security Reviewer
- ECC Build Error Resolver
- ECC TypeScript Reviewer
- ECC Refactor Cleaner
- ECC Performance Optimizer
- ECC Silent Failure Hunter
- ECC PR Test Analyzer
- ECC Spec Miner
- ECC Documentation Updater

### Added reusable skills

- ECC Orchestration
- ECC TDD Workflow
- ECC Database Review
- ECC Security Review

### Added workflow prompts

- ADO → ECC-Inspired Full-Stack Workflow
- ECC-Inspired PR Review Gate

### Enterprise flow

```text
ADO Story
   ↓
Spec / SDD
   ↓
Planner → Architect → Code Explorer
   ↓
.NET / EF Core + Database
   ↓
Angular / TypeScript
   ↓
TDD → Integration → Playwright E2E
   ↓
Accessibility → Security
   ↓
Code Review → PR Evidence → Pull Request
```

This layer is deliberately **native to DEV-AI**. Existing ADO, .NET, Angular, accessibility, MCP and DevOps agents remain the enterprise specialization layer, while ECC contributes reusable engineering workflow patterns.

### Individual installation

```bash
npx dev-ai-agents --agent dev-ai-ecc-code-reviewer
npx dev-ai-agents --agent dev-ai-ecc-database-reviewer
npx dev-ai-agents --agent dev-ai-ecc-tdd-guide
npx dev-ai-agents --skill ecc-orchestration
npx dev-ai-agents --skill ecc-database-review
npx dev-ai-agents --prompt ado-ecc-fullstack-workflow
npx dev-ai-agents --prompt ecc-pr-review-gate
```

### Source and attribution

Selected patterns are adapted from **affaan-m/ECC**, MIT licensed. The imported/adapted files identify ECC as their source. Unrelated ECC language-specific agents are intentionally not copied into DEV-AI.

## 🔗 Upstream references

- GitHub awesome-copilot instructions: https://github.com/github/awesome-copilot/tree/main/instructions
- GitHub awesome-copilot plugins: https://github.com/github/awesome-copilot/tree/main/plugins
- Claude Code Templates: https://github.com/davila7/claude-code-templates
- Claude Code Templates uses the same zero-setup `npx` model for installing individual agents, commands, skills, hooks and MCPs.

## 📦 Source URL rule

A component's GitHub **source** URL must use its real repository path, for example:

`https://github.com/chetan11fb/dev-ai-agents/blob/main/agents/dev-ai-fullstack-engineer.agent.md`

Do not convert the source path into `.github/agents`. The `.github/agents` path is an installation target for a consuming VS Code repository.

## 🚀 Installation target

For agents, the default consuming-project target is:

`.github/agents/<agent-file>.agent.md`

DEV-CLI must read `registry/marketplace.json` and use:

- `path` for source/GitHub links
- `target` for installation

## 🔐 Safety

Upstream content is used as engineering reference. Do not copy secrets or repository-specific credentials. MCP configuration files containing environment-variable placeholders must keep those placeholders; users provide their own credentials locally.

## 🧰 Real-time Windows Runtime Bootstrap

If a VS Code terminal reports that **Node.js/npm are not installed**, DEV-AI includes a real-time Windows bootstrap:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\bootstrap-node.ps1
```

The script:
- detects whether Node.js and npm are available;
- installs Node.js LTS through `winget` when missing;
- refreshes PATH in the current PowerShell session;
- verifies `node -v`, `npm -v`, `where.exe node` and `where.exe npm`;
- clearly asks for a new VS Code terminal when PATH refresh cannot be applied.

It never reports success without runtime verification.


## 🧬 Full-Stack Engineering Reference Pack

I also maintain a clearly separated **upstream reference pack** from [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps). The upstream project currently describes 100+ open-source AI agents, agent skills and RAG applications, including agent skills, advanced coding/architecture examples, MCP agents and generative UI projects. citeturn0search0

### Imported upstream engineering assets

| Area | Imported reference |
|---|---|
| Git history / RCA | Commit Archaeologist |
| Dependency analysis | Dependency Doctor |
| PR/change hygiene | Scope Creep Detector |
| Multi-agent orchestration | Advisor Orchestrator Worker |
| Architecture | AI System Architect |
| Coding | Multimodal Coding Agent Team |
| GitHub MCP | GitHub MCP Agent |
| Browser MCP | Browser MCP Agent |
| MCP routing | Multi-MCP Agent Router |

The imported source files are kept under `upstream/awesome-llm-apps/` and reusable skills under `skills/`. They are intentionally separated from DEV-AI's native agents so upstream code can be tracked without confusing it with Chetan's original implementation.

**Important:** these are upstream Apache-2.0 assets. Their original attribution/license metadata is preserved. The imported projects may use Python/other runtimes and are reference implementations; they do not automatically become VS Code/Copilot agents.

### DEV-AI adaptation layer

For actual enterprise full-stack work, use the native DEV-AI agents for:
- Azure DevOps / ADO user stories and acceptance criteria
- .NET / C# / ASP.NET Core Web API
- Angular / TypeScript UI
- backend and microservices
- QA / tester / Playwright
- accessibility / NVDA / WCAG
- GitHub / PR / code review
- MCP configuration
- runtime/bootstrap and CI/CD
- domain/codebase discovery

The goal is **upstream capability + DEV-AI enterprise specialization**, not a blind replacement of the existing architecture.


## 🧰 Selected VS Code + Full-Stack Development Pack

A focused set of development assets from [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) is integrated directly into DEV-AI's native structure.

### Agents

The imported agents are available directly under `agents/` as VS Code-compatible `.agent.md` files, using the original upstream content:

- `claude-backend-architect.agent.md`
- `claude-backend-developer.agent.md`
- `claude-code-architect.agent.md`
- `claude-code-explorer.agent.md`
- `claude-frontend-developer.agent.md`
- `claude-fullstack-developer.agent.md`
- `claude-accessibility-tester.agent.md`
- `claude-code-reviewer.agent.md`
- `claude-debugger.agent.md`
- `claude-playwright-tester.agent.md`
- `claude-refactoring-specialist.agent.md`
- `claude-csharp-expert.agent.md`
- `claude-csharp-developer.agent.md`
- `claude-dotnet-core-expert.agent.md`
- `claude-angular-architect.agent.md`

### Skills

The selected reusable skills are integrated directly under `skills/`:

- `skills/development/agent-development/`
- `skills/development/agent-md-refactor/`
- `skills/development/create-plan/`
- `skills/development/dispatching-parallel-agents/`
- `skills/development/subagent-driven-development/`
- `skills/development/writing-skills/`
- `skills/utilities/playwright-skill/`
- `skills/web-development/react-state-management/`
- `skills/web-development/shadcn/`

The imported assets are kept separate by filename where needed to avoid overwriting DEV-AI's existing agents, while sharing the same native `agents/` and `skills/` architecture. The temporary `upstream/claude-code-templates/` copy has been removed. Original upstream content and attribution should be respected.



## 🔭 Dynatrace Expert + MCP

DEV-AI includes the **Dynatrace Expert** agent from GitHub's awesome-copilot ecosystem, integrated into the native `agents/` structure.

### Agent

```bash
npx dev-ai-agents --agent dynatrace-expert
```

Installs to:

```text
.github/agents/dynatrace-expert.agent.md
```

It covers incident RCA, deployment impact, production error triage, performance regression, release validation, security/vulnerability analysis and DQL.

### VS Code MCP

Use the included template:

```text
mcp/dynatrace-vscode.json
```

For a consuming project, configure `.vscode/mcp.json` with the Dynatrace remote MCP endpoint and an environment-backed `COPILOT_MCP_DT_API_TOKEN`. Never commit the real token.

### Documentation

- [Dynatrace setup](docs/dynatrace/setup.md)
- [Copilot prompt cookbook](docs/dynatrace/copilot-prompts.md)
- [Troubleshooting](docs/dynatrace/troubleshooting.md)

Official Dynatrace MCP documentation: https://docs.dynatrace.com/docs/dynatrace-intelligence/dynatrace-mcp
