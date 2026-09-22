# DEV-AI Agents

GitHub-native AI engineering components for .NET, Angular, full-stack development, QA, accessibility, security, architecture, testing, performance and domain onboarding.

## Canonical source

This repository is the source of truth for DEV-AI. The website consumes `registry/marketplace.json`; installers and the npm CLI resolve component source from this repository.

## Components

- 16 specialized GitHub Copilot-style agents
- 8 reusable skills
- Registry-driven installation
- PowerShell and Bash installers
- npm-ready `dev-ai` CLI

## GitHub-native installation

PowerShell:
`irm https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main/scripts/install-agent.ps1 | iex`

Bash:
`curl -fsSL https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main/scripts/install-agent.sh | bash`

These installers create missing target directories and refuse silent overwrite.

## npm CLI

The repository now contains the package and CLI implementation:

`npm pack --dry-run`

After the package is actually published to npm, users can install/use it with:

`npx dev-ai-agents@latest list`

`npx dev-ai-agents@latest install --agent dev-ai-fullstack-engineer`

`npm install -g dev-ai-agents@latest`

`dev-ai install --agent dev-ai-dotnet`

**Publication status:** the package is prepared in this repository, but it is not claimed as npm-published until a real npm publication and clean-machine installation test are completed.

## Agent design

Agent files follow GitHub's custom-agent conventions: YAML frontmatter plus a structured system prompt covering role, responsibilities, methodology, constraints, quality gates and output expectations. The prompts are intentionally specialized rather than one-line role descriptions.

The design also takes architectural inspiration from Claude Code Templates' component/CLI model: a central registry, installable components, reusable skills and a CLI distribution layer. DEV-AI implementations are original and are not copied from that project.

## Engineering principles

- Evidence before assumptions.
- Minimal, reversible changes.
- No secrets in source control.
- Real validation; no fake installed/verified states.
- Preserve existing working architecture.
- Accessibility, security, testing and observability are first-class concerns.
