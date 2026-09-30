# Token-Efficient Fullstack Agent

This is the **runtime-ready Copilot version** of the Token-Efficient Fullstack agent.

## Install in a .NET + Angular application

Copy these files from this repository into the **root of the application you are actually coding**:

```text
.github/
├── agents/
│   └── token-efficient-fullstack.agent.md
└── skills/
    ├── token-efficient-development/
    │   └── SKILL.md
    ├── token-efficient-dotnet/
    │   └── SKILL.md
    ├── token-efficient-angular/
    │   └── SKILL.md
    └── token-efficient-fullstack/
        └── SKILL.md
```

Optional but recommended for project-wide rules:

```text
.github/copilot-instructions.md
.github/instructions/
```

Keep the global instructions file small. Put task-specific workflows in skills.

## VS Code: how to use it

1. Open the **actual .NET + Angular application** in VS Code.
2. Make sure the files are under `.github/agents`.
3. Open GitHub Copilot Chat.
4. Select **Agent** from the session/agent controls.
5. Open the **agent dropdown**.
6. Select **Token-Efficient Fullstack**.
7. Enter your normal implementation prompt.

Example:

> Implement provider exclusion payload support. Trace the existing .NET API and Angular flow progressively, reuse existing patterns, change only required files, and run targeted validation.

### Do NOT type this

`@/token-efficient-fullstack`

That is not the normal VS Code custom-agent invocation syntax.

The reliable VS Code workflow is **Agent dropdown -> Token-Efficient Fullstack -> prompt**.

VS Code discovers workspace custom agents from `.github/agents`.

## GitHub Copilot CLI

For Copilot CLI, custom agents can be invoked with the `/agent` mechanism, using the agent name/profile.

Example:

```text
/agent token-efficient-fullstack
Implement provider exclusion payload support...
```

## Why this saves context

The agent does not blindly analyze the entire repository. It:

- classifies the task
- finds the smallest relevant entry point
- follows dependencies progressively
- avoids unrelated modules/generated files
- validates the affected area first
- reviews only the resulting diff

Token reduction is not guaranteed for every task. Complex features legitimately require more context.

## Important

This agent is a workflow optimization, not a model/token billing control. Actual token consumption depends on the model, tools, repository size, task complexity, and files that must genuinely be inspected.
