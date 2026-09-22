# MCP Servers — DEV-AI Agents

This repository uses the VS Code MCP configuration pattern from Microsoft's
[skills repository](https://github.com/microsoft/skills), with Azure DevOps added
for day-to-day ADO work.

## Configuration

The shared VS Code configuration is:

- `.vscode/mcp.json`

Do not put PATs, API keys, or other secrets in this file. Use VS Code input
prompts, environment variables, or the authentication flow provided by the
individual MCP server.

## Servers

| Server | Purpose | Transport / runtime | Typical use |
|---|---|---|---|
| `ado-remote-mcp` | Azure DevOps projects, work items, repos, pipelines, wiki, tests and search | Hosted HTTP | ADO stories, work items, repo/pipeline context |
| `github` | GitHub repository and Copilot capabilities | Hosted HTTP | GitHub context and operations |
| `microsoft-docs` | Microsoft Learn documentation | Hosted HTTP | Current .NET/Azure/Microsoft API documentation |
| `context7` | Up-to-date library documentation | stdio / npx | SDK/API examples |
| `deepwiki` | Repository knowledge and Q&A | Hosted HTTP | Understand unfamiliar repositories |
| `chrome-devtools` | Chrome inspection/debugging | stdio / npx | Browser debugging |
| `playwright` | Browser automation and testing | stdio / npx | E2E/UI tests |
| `eslint` | ESLint integration | stdio / npx | JS/TS linting |
| `terraform` | Terraform tooling | stdio / Docker | Infrastructure as code |
| `markitdown` | Document-to-Markdown conversion | stdio / uvx | Convert docs for agent analysis |
| `sequentialthinking` | Structured reasoning tool | stdio / npx | Complex multi-step tasks |
| `memory` | Persistent MCP memory | stdio / npx | Project/session memory |
| `huggingface` | Hugging Face models and resources | Hosted HTTP | Model/AI asset discovery |
| `aspire` | .NET Aspire MCP | stdio | Aspire app/service orchestration |
| `svelte` | Svelte documentation/tools | Hosted HTTP | Svelte development |

## Azure DevOps: remote vs local

The configuration uses Microsoft's **hosted Azure DevOps MCP Server**:

`https://mcp.dev.azure.com/{organization}`

This is the preferred setup when the VS Code environment supports Microsoft Entra
authentication. It requires no local Node.js MCP server installation.

For a local stdio setup, Microsoft documents:

```json
{
  "servers": {
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "YOUR_ORG"]
    }
  }
}
```

Use the local setup when a client cannot use the remote Entra authentication flow,
or when a local stdio server is specifically required.

## Recommended .NET workflow

For .NET/Azure work:

1. Use `microsoft-docs` first for current Microsoft API guidance.
2. Use `context7` for library-specific examples.
3. Use `ado-remote-mcp` for ADO story/work-item/repository context.
4. Use `github` for GitHub repository context.
5. Use `playwright` for browser/E2E verification.
6. Use the repository's skills and custom agents for domain-specific workflows.

## Security

- Never commit PATs, bearer tokens, Azure secrets, or API keys.
- Keep credential values outside source control.
- Review MCP tool permissions before enabling write-capable servers.
- Enable only the servers required for the current project when working in a
  restricted enterprise environment.

## Microsoft skills

Microsoft's current installation command is:

```bash
npx skills add microsoft/skills
```

This installs the Agent Skills selected by the installer into the agent-specific
location. Prefer selective installation rather than copying all skills into every
project.

Source: https://github.com/microsoft/skills
Azure DevOps MCP: https://github.com/microsoft/azure-devops-mcp
