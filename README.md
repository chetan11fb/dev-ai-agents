# DEV-AI Agents

GitHub-native AI engineering components for .NET, Angular, full-stack development, QA, accessibility, security, architecture, testing, performance and domain onboarding.

## Canonical source
This repository is the source of truth for DEV-AI. The website consumes `registry/marketplace.json`; installers download component source from this repository.

## Install
No npm package is advertised until a real package is published and verified.

PowerShell: `irm https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main/scripts/install-agent.ps1 | iex`

Bash: `curl -fsSL https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main/scripts/install-agent.sh | bash`

Installers create missing target directories and never silently overwrite an existing component.

## Principles
- Evidence before assumptions.
- Minimal, reversible changes.
- No secrets in source control.
- Real validation; no fake installed/verified states.
- Preserve existing working architecture.
