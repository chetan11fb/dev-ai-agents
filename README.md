# DEV-AI Agents

Production-oriented AI agents, skills, plugins and MCP configurations for VS Code + GitHub Copilot.

## Repository
This repository is the canonical **source** repository. VS Code installation targets are separate from source paths.

### Components
- **Agents**: 16+ production engineering agents for .NET, Angular, full-stack, QA, accessibility, security, architecture, debugging, API, database, performance, refactoring, testing, domain analysis and legacy .NET.
- **Skills**: reusable engineering guidance.
- **Plugins**: selected integrations and workflows aligned with GitHub's awesome-copilot plugin ecosystem.
- **MCP**: curated developer-tool MCP JSON definitions adapted from the devtools collection in claude-code-templates.
- **Registry**: `registry/marketplace.json` is the machine-readable catalog used by DEV-CLI.

## Upstream references
- GitHub awesome-copilot instructions: https://github.com/github/awesome-copilot/tree/main/instructions
- GitHub awesome-copilot plugins: https://github.com/github/awesome-copilot/tree/main/plugins
- Claude Code Templates devtools MCPs: https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/mcps/devtools

## Source URL rule
A component's GitHub **source** URL must use its real repository path, for example:
`https://github.com/chetan11fb/dev-ai-agents/blob/main/agents/dev-ai-fullstack-engineer.agent.md`

Do not convert the source path into `.github/agents`. The `.github/agents` path is an installation target for a consuming VS Code repository.

## Installation target
For agents, the default consuming-project target is:
`.github/agents/<agent-file>.agent.md`

DEV-CLI must read `registry/marketplace.json` and use:
- `path` for source/GitHub links
- `target` for installation

## Safety
Upstream content is used as engineering reference. Do not copy secrets or repository-specific credentials. MCP configuration files containing environment-variable placeholders must keep those placeholders; users provide their own credentials locally.
