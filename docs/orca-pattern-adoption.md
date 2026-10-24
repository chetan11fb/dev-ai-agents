# Orca Pattern Adoption for DEV-AI

## Decision

Enhance the existing `Dev-AI Swarm Orchestrator`; do not add a second orchestrator or make Orca a required dependency. The repository already has a feature-scoped SDD workflow, a registered swarm orchestrator, multi-story traceability, task DAGs, worker contracts, file ownership, and integration gates. A new parallel orchestrator would duplicate those responsibilities.

## Upstream reviewed

- Orca repository/README: https://github.com/stablyai/orca
- Orca orchestration guide: https://github.com/stablyai/orca/blob/main/skill-guides/orchestration.md

Orca is a developer workspace/runtime for running coding agents in isolated worktrees and tracking work. Its orchestration guide describes durable Runs, Tasks, Dispatches, task dependencies, structured worker completion, decision gates, and cautious recovery. Those are runtime capabilities; a Copilot `.agent.md` file cannot create them by instruction alone.

## Adopted patterns

1. **Runtime capability check.** Distinguish a manual agent handoff from a real background worker or orchestrator.
2. **Task/attempt/owner identity.** Track which attempt is authoritative so late results do not overwrite a retry.
3. **Evidence-backed completion.** Verify reported file changes and test outcomes against actual diffs and tool output.
4. **Safe uncertainty.** A timeout or missing message is not proof a worker exited or failed; don't spawn a competing editor on the same files.
5. **Dependency-aware integration.** Wait for required tasks to settle; integrate only current outputs and rerun combined checks.
6. **Optional runtime adapter.** If the user explicitly chooses Orca, check the installed runtime and read the version-matched guide from that binary before invoking commands.

## Deliberately not adopted

- No copied Orca source code or large chunks of its documentation.
- No mandatory Orca install, credentials, experimental settings, or runtime dependency.
- No invented CLI command grammar or automatic command fallback.
- No claim that Copilot handoffs equal autonomous parallel workers.
- No automatic stop, release, retry, merge, or deployment based only on timeouts or missing messages.
- No second state file competing with SDD's existing feature state/tasks.

## Boundaries and verification

The new prompt-contract test checks that the instructions retain these safety rules. It does **not** prove Orca is installed, that the VS Code host can launch workers, or that real multi-story implementation works. Runtime scenarios RT-35–RT-39 remain NOT RUN until executed in a supported environment. Keep that distinction in release notes and PR claims.

## Recommended use

For the normal VS Code/Copilot workflow, use the existing Dev-AI SDD Feature Mode and Swarm Orchestrator. If only manual handoffs are supported, run tasks in dependency order and collect real results. Use actual isolated worktrees and supervised dispatch only when the installed host/runtime confirms those capabilities.
