# Changelog

## Unreleased — Orca-inspired supervised orchestration
- Add runtime capability checks so manual Copilot handoffs are not misrepresented as autonomous workers.
- Track task attempts, ownership, evidence-backed completion, safe uncertainty/recovery, and integration barriers in the existing Swarm Orchestrator.
- Keep Orca optional; require the installed runtime and version-matched guide before using its orchestration commands.
- Add automated prompt-contract checks and explicit runtime QA cases; real Orca/VS Code execution remains unverified until run in a supported environment.

## 0.1.0 — Foundation
- Added specialized engineering agents.
- Added reusable skills.
- Added machine-readable registry.
- Added GitHub-native PowerShell/Bash installation.
- Added integration extension points.
- No unverified npm package dependency.
