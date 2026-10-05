---
name: token-efficient-development
description: "Core workflow for minimizing unnecessary context while implementing .NET + Angular changes. Load when a task needs focused repository inspection, progressive context, targeted validation, or efficient agent execution."
---

# Token-Efficient Development

## Core rule
Use the minimum repository context required for correctness.

## Inspection algorithm
1. Classify the task.
2. Find the smallest relevant entry point.
3. Read direct dependencies only when referenced.
4. Reuse an existing nearby pattern.
5. Implement the smallest safe change.
6. Validate narrowly.
7. Review the diff.
8. Stop.

## Context budget rules
- Never analyze the entire repository unless explicitly required.
- Never load unrelated frontend/backend modules.
- Never inspect generated/vendor/build folders.
- Never reread unchanged files without a reason.
- Prefer targeted searches and small file sections.
- Do not repeat repository architecture in every response.

## Safety
- No guessing.
- No unrelated refactoring.
- No secret values in output or files.
- Preserve existing contracts unless the request changes them.
