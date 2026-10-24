# DEV-AI Parallel Worktree Engineering Prompt

Use this prompt with Dev-AI SDD / Dev-AI Swarm Orchestrator for a non-trivial feature or bug that may benefit from multiple coding agents.

## Inputs

- Requirement / ADO story: [ID, URL, or approved text]
- Acceptance criteria: [verified criteria]
- Approved spec/plan/tasks revision: [paths and revisions]
- Repository and base ref: [repo, branch, commit SHA]
- Runtime capabilities: [verified host capabilities; do not assume Orca is installed]
- Constraints: [security, change scope, tool/provider policy]

## Mission

Plan and, only when the current runtime demonstrably supports it, coordinate safe parallel engineering. Prefer the smallest coherent verified change over the largest swarm.

## Required process

1. **Inspect before dispatch.** Read the current working-tree status, base ref/SHA, SDD approvals, relevant code/tests, available agents/tools and existing worktree support. Preserve all existing developer changes.
2. **Classify runtime capability.** Return one of ISOLATED_PARALLEL, PARALLEL_READ_ONLY, SHARED_WORKSPACE or SEQUENTIAL_ONLY with evidence. Do not claim workers were launched unless actually launched.
3. **Build the task DAG.** Link tasks to requirements/ACs, assign one verified specialist per task, name file ownership, base SHA, dependencies, risks and actual verification needed.
4. **Apply the contract barrier.** Resolve API/DTO/event/schema/generated-client decisions before parallel consumers begin. Mark downstream tasks stale when a contract revision changes.
5. **Choose the right parallel pattern.**
   - Independent tasks: one isolated worktree/branch per editing worker.
   - Competing candidates: at most 2–3 workers from the same base SHA with the same acceptance matrix.
   - Shared workspace or missing isolation: parallelize read-only analysis only; serialize edits.
6. **Dispatch minimal context.** Give each worker only relevant requirements, verified paths/symbols, contract revision, allowed scope, dependencies, stop conditions and verification requirements.
7. **Track explicit outcomes.** Each worker must return DONE, BLOCKED, FAILED or NEEDS_DECISION, plus actual changed paths, commands/tests run, evidence, risks and remaining work. Missing completion evidence is not success.
8. **Review actual diffs.** Compare each result to its recorded base SHA. Check scope, correctness, compatibility, security, tests, accidental files and conflicts. Do not trust summaries without inspecting code/output.
9. **Select and integrate deliberately.** Choose a candidate using evidence and trade-offs. Merge/port only selected work in dependency order. Do not combine incompatible candidates blindly.
10. **Verify the combined result.** Run focused checks and the relevant integrated build/test/regression suite. Map each acceptance criterion to code, test, evidence and PASS/PARTIAL/FAIL/NOT VERIFIED.
11. **Converge and report honestly.** Any post-test code edit invalidates affected evidence. Mark unrun checks NOT RUN, unresolved criteria NOT COMPLETE, and stop for human approval before push, PR merge, deployment, destructive cleanup or scope expansion.

## Required output

### Runtime capability
Mode, evidence and limitations.

### Task DAG
Task ID | requirement/AC | owner | worktree/branch | base SHA | dependencies | files owned | verification.

### Dispatch plan
Why each task is safe to parallelize; identify serialized contract, migration and generated-file work.

### Results
Task status, changed paths, actual commands/results, evidence and risks.

### Integration decision
Selected candidate(s), rejected candidate(s), conflict handling and reason.

### Acceptance traceability
AC ID -> implementation -> test -> actual evidence -> status.

### Final status
DONE only when integration and required verification are evidenced. Otherwise NOT COMPLETE with exact blocker and next action.

## Hard constraints

- Never invent agents, worktrees, tool support, test results or repository paths.
- Never reset, clean, stash over, discard or overwrite unrelated developer changes.
- Never run multiple editing agents against the same mutable checkout without verified isolation.
- Never bypass Dev-AI SDD's spec/plan/tasks approval gates.
- Never expose secrets or send source code to an unapproved provider.
- Never merge/deploy or delete unmerged work without explicit approval.
