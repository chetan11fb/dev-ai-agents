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

### Install a specific agent

```bash
npx dev-ai-agents --agent dev-ai-fullstack-engineer
npx dev-ai-agents --agent dev-ai-dotnet
npx dev-ai-agents --agent dev-ai-qa
```

### Install a skill

```bash
npx dev-ai-agents --skill dotnet-development
npx dev-ai-agents --skill angular-development
npx dev-ai-agents --skill accessibility
```

### Install MCP configuration

```bash
npx dev-ai-agents --mcp github-official
npx dev-ai-agents --mcp context7
npx dev-ai-agents --mcp chrome-devtools
```

### Install a plugin

```bash
npx dev-ai-agents --plugin ai-team-orchestration
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

The CLI reads `registry/marketplace.json`, downloads the selected component from its real GitHub source path, and installs it into the declared `target`. The registry remains the single source of truth for the web installer and CLI.

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
