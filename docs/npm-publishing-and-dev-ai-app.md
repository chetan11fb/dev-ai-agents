# npm publishing and DEV-AI app integration

## Individual agent installation

The public package is a single CLI that installs one selected Markdown agent into the current VS Code workspace. Run these commands from the consuming project's root:

```bash
npx --yes dev-ai-agents --list
npx --yes dev-ai-agents --agent dev-ai-angular
npx --yes dev-ai-agents --agent dev-ai-code-explorer
npx --yes dev-ai-agents --agent ai-change-impact-analyzer
```

Each agent is installed to `.github/agents/<agent-file>.agent.md`. The installer protects existing files by default; use `--force` only when intentionally replacing an installed agent. To install more than one agent, repeat `--agent <id>` in the same command.

## DEV-AI app: source command metadata from the registry

Use `registry/marketplace.json` as the single source of truth. For each agent card:

- Use `id` as the stable identifier and the exact value passed after `--agent`.
- Show `installCommand` as the primary copyable command.
- Show `npmExecCommand` as the alternative npm-exec command.
- Use `path` for the source file and `target` for the destination in the user's workspace.
- Do not construct an agent ID from its display name, and do not invent a command when a registry entry is missing.
- On app load/build, validate that every `type: "agent"` entry has both commands and that its source and target are present.

This model lets all current agents be installed individually without publishing and maintaining 70 separate npm packages. It also keeps agent install buttons and CLI commands consistent.

## Validate before publishing

Node.js 18+ is required. Run from the repository root:

```bash
npm run validate:registry
npm pack --dry-run
```

The validation checks unique component IDs, local source paths, complete registry coverage for `agents/*.agent.md`, VS Code agent targets, and exact install commands.

## Publish with npm Trusted Publishing (recommended)

A maintainer must configure this once on npm; a repository workflow cannot configure the npm account for you.

1. On npmjs.com, open the `dev-ai-agents` package settings and configure **Trusted Publisher** for GitHub Actions.
2. Set the GitHub owner to `chetan11fb`, repository to `dev-ai-agents`, and workflow filename to `publish-dev-ai-agents.yml`. Do not set an environment unless the workflow is also configured to use that exact environment.
3. Confirm `package.json` version and the release tag match. For version `0.5.3`, create/publish a GitHub Release with tag `dev-ai-agents-v0.5.3`.
4. The workflow validates the registry, runs `npm pack --dry-run`, and publishes the package with provenance.

After the release workflow succeeds, verify the public package page and test from a clean project:

```bash
npm view dev-ai-agents version
npx --yes dev-ai-agents@latest --list
npx --yes dev-ai-agents@latest --agent dev-ai-angular
```

## Manual publish alternative

If you prefer local publishing, use an npm account that has publish access to `dev-ai-agents`:

```bash
npm login
npm run validate:registry
npm pack --dry-run
npm publish --access public
```

Do not paste npm access tokens into chat, commit them, or put them in source files. If npm reports that version `0.5.3` already exists, increment `package.json` to a new unused version and use the matching release tag.

## Important distinction

`npx dev-ai-agents --agent <id>` installs an individual agent from the common CLI package. It does not create a separate npm package for every agent. Separate commands like `npx @chetan11fb/dev-ai-angular` would require a separate package, release/versioning, and publishing configuration for each agent and are intentionally not the default model.
