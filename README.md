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

- **Agents** — 16+ engineering agents covering .NET, Angular, full-stack, QA, accessibility, security, architecture, debugging, API, database, performance, refactoring, testing, domain analysis and legacy .NET.
- **Skills** — reusable engineering guidance that can be composed into agent workflows.
- **Plugins** — selected integrations and workflows aligned with GitHub's awesome-copilot plugin ecosystem.
- **MCP** — curated developer-tool MCP JSON definitions adapted from the devtools collection in claude-code-templates.
- **Prompts** — reusable task prompts for ADO-to-full-stack, .NET/Web API, Angular UI, QA and accessibility workflows.
- **Settings** — reusable runtime/VS Code setup presets.
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

### Interactive help

```bash
npx dev-ai-agents
```

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

#### Skill

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

> **Publishing note:** the repository now contains the npm package/CLI implementation. After publishing `dev-ai-agents` to npm, the commands above work directly through `npx`.

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


## 🧰 Selected VS Code + Full-Stack Development Reference Pack

A small, focused set of **verbatim upstream files** from [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) has been added under `upstream/claude-code-templates/`.

These files are intentionally kept separate from DEV-AI native agents. The imported source content is not rewritten or converted.

### Imported development skills

- `agent-development` — agent structure and authoring guidance
- `agent-md-refactor` — AGENTS/CLAUDE/COPILOT instruction organization
- `create-plan` — implementation planning
- `dispatching-parallel-agents` — parallel independent task execution
- `subagent-driven-development` — subagent implementation/review workflow
- `writing-skills` — reusable skill authoring
- `playwright-skill` — browser/UI automation reference
- `react-state-management` — React state management reference
- `shadcn` — shadcn UI reference

### Imported full-stack development agents

- Backend Architect
- Backend Developer
- Code Architect
- Code Explorer
- Frontend Developer
- Fullstack Developer
- Code Reviewer
- Debugger
- Refactoring Specialist
- Playwright Tester
- Accessibility Tester
- C# Developer
- .NET Core Expert
- Angular Architect

### VS Code / Copilot compatibility

The imported files are preserved as **upstream reference content**. DEV-AI's native VS Code/GitHub Copilot agents remain under `agents/`, and the native installer/registry remains unchanged.

For portable agent skills, the source project documents the Agent Skills format as usable across GitHub Copilot and other compatible agent tools. citeturn0search7

Source attribution and original licensing should be respected for each upstream component. The upstream project itself documents that components retain their original license and attribution. citeturn0search5
