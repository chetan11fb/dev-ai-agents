# DEV-AI Agents — Setup Guide

This folder contains step-by-step setup notes for the MCP servers and Agent Skills used by this repository.

## 1. Prerequisites

Install VS Code, Git, Node.js 20+ (npm/npx), and Docker Desktop when a Docker-based MCP is required.

Verify:

```powershell
node --version
npm --version
git --version
```

Reload VS Code after changing `.vscode/mcp.json`.

## 2. Azure DevOps MCP

The repository uses Microsoft's hosted MCP:

```json
"ado-remote-mcp": {
  "type": "http",
  "url": "https://mcp.dev.azure.com/${input:ado_org}"
}
```

Steps:
1. Open the repo in VS Code.
2. Start `ado-remote-mcp`.
3. Enter your Azure DevOps organization when prompted.
4. Complete Microsoft/Entra authentication.
5. Verify access to the required project, repository and work items.
6. Test read-only operations first.

Local stdio alternative:

```json
"ado": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@azure-devops/mcp", "YOUR_ORG"]
}
```

Never commit an ADO PAT. Official: https://github.com/microsoft/azure-devops-mcp

## 3. GitHub MCP

Steps:
1. Start the GitHub MCP from `.vscode/mcp.json`.
2. Complete GitHub authentication if prompted.
3. Verify repository access.
4. Test read-only repository/issues/PR operations.
5. Enable write operations only when needed.

Never commit GitHub tokens.

Official: https://github.com/github/github-mcp-server

## 4. Figma MCP

Figma MCP is used for design-to-code and UI context.

Steps:
1. Sign in to Figma and confirm access to the target design.
2. Configure the official Figma MCP according to its current documentation.
3. Authenticate the MCP.
4. Test by inspecting a specific file/page/frame.
5. Use the retrieved design context for implementation.
6. Validate the implementation against the Figma design.

Do not commit Figma tokens. Keep authentication outside source control.

Official guide: https://github.com/figma/mcp-server-guide

## 5. Microsoft Docs MCP

Configured as:

```json
"microsoft-docs": {
  "type": "http",
  "url": "https://learn.microsoft.com/api/mcp"
}
```

Use it for current .NET, ASP.NET Core, Azure, Functions, Service Bus, Identity and Microsoft SDK documentation.

## 6. Context7 MCP

Use Context7 for current library-specific documentation. Start it from `.vscode/mcp.json` and ask the agent to resolve the exact library/version before generating API code.

## 7. Playwright MCP

Use for Angular/browser/E2E validation:
1. Start Playwright MCP.
2. Open the target test environment.
3. Authenticate only with approved test credentials.
4. Execute the user flow.
5. Check UI behavior, console errors and failures.
6. Keep credentials out of prompts/repository files.

## 8. Chrome DevTools MCP

Use for browser debugging: console, network, DOM/runtime and performance investigation. Combine with Playwright when reproducing UI issues.

## 9. Microsoft Agent Skills

Install:

```powershell
npx skills add microsoft/skills
```

All skills:

```powershell
npx skills add microsoft/skills --all
```

Prefer selective installation when possible.

Official: https://github.com/microsoft/skills

## 10. Recommended story workflow

1. ADO MCP — read story and acceptance criteria.
2. Repository knowledge — understand domain and existing code flow.
3. Microsoft Docs / Context7 — verify APIs and libraries.
4. Figma MCP — inspect UI design when applicable.
5. Backend agent — implement .NET changes.
6. Angular agent — implement UI changes.
7. Playwright — validate the user flow.
8. Accessibility checks — keyboard/screen-reader validation.
9. GitHub MCP — inspect PR/repository context.
10. Review agent — code/security/test review.
11. PR — create/update only after validation.

## 11. Troubleshooting

**MCP missing in VS Code**
- Validate `.vscode/mcp.json`.
- Reload VS Code.
- Check MCP/server output.
- Verify Node.js for stdio servers.
- Verify Docker for Docker servers.
- Re-authenticate hosted servers.

**Authentication failure**
- Confirm account/resource permissions.
- Re-authenticate.
- Check enterprise proxy/firewall restrictions.
- Never put credentials into source control.

**Outdated API information**
- Use Microsoft Docs MCP or Context7 and specify the required library/version.

**Unrelated agent changes**
- Ask the agent to inspect first.
- Restrict changes to the requested story.
- Preserve existing working flows.
- Avoid unrelated refactoring.
- Run targeted tests.

## 12. Security

Never commit PATs, OAuth tokens, API keys, secret-bearing connection strings, production credentials or private certificates.

Use VS Code authentication, environment variables, secret managers or secure input prompts.

Review MCP permissions before enabling write-capable tools.
