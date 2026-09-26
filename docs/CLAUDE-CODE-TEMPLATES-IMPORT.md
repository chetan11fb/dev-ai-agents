# Selected Claude Code Templates Development Pack

## Purpose

This directory documents a small, focused selection of development files copied from:

https://github.com/davila7/claude-code-templates

The selected content covers:

- VS Code / agent workflow guidance
- Full-stack development
- .NET / C#
- Angular
- Code review, debugging and refactoring
- Playwright and accessibility testing
- Web-development skills

## Repository integration

The selected agents and skills are integrated into DEV-AI's **native** structure:

- Agents → `agents/*.agent.md`
- Development skills → `skills/development/*/SKILL.md`
- Utility skills → `skills/utilities/*/SKILL.md`
- Web-development skills → `skills/web-development/*/SKILL.md`

The temporary `upstream/claude-code-templates/` copy is intentionally not retained. This keeps the repository clean and makes the imported agents discoverable alongside the existing DEV-AI agents.

## Naming and compatibility

Existing DEV-AI agents are not overwritten. Imported agents use a `claude-` filename prefix and the `.agent.md` extension so they are easy to identify and discover in VS Code.

The upstream agent content itself is preserved rather than rewritten into DEV-AI-specific behavior.

## Selected source categories

- `agents/development-team/`
- `agents/development-tools/`
- `agents/programming-languages/`
- `skills/development/`
- `skills/utilities/`
- `skills/web-development/`

## Attribution

Source project:

https://github.com/davila7/claude-code-templates

Respect the source project's license and any individual component attribution/license requirements.
