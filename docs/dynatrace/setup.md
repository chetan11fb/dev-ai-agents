# Dynatrace Expert — VS Code + GitHub Copilot Setup

## Architecture

```text
VS Code → GitHub Copilot Chat → Dynatrace Expert → Dynatrace MCP → Dynatrace/Grail
```

## 1. Prerequisites

- VS Code with GitHub Copilot Chat/MCP support.
- Access to a Dynatrace environment.
- Dynatrace MCP access.
- A Dynatrace Platform token or confidential OAuth client.

Dynatrace's remote MCP endpoint is:

`https://<environment-id>.apps.dynatrace.com/platform-reserved/mcp-gateway/v0.1/servers/dynatrace-mcp/mcp`

Official documentation: https://docs.dynatrace.com/docs/dynatrace-intelligence/dynatrace-mcp

## 2. Dynatrace permissions

For MCP access, the user and token need:

- `mcp-gateway:servers:invoke`
- `mcp-gateway:servers:read`

Add only the data permissions required by your use case. Common examples:

- `storage:buckets:read`
- `storage:logs:read`
- `storage:spans:read`
- `storage:metrics:read`
- `storage:events:read`
- `storage:entities:read`
- `storage:security.events:read`
- `storage:user.events:read`
- `storage:smartscape:read`
- `davis:analyzers:read`
- `davis:analyzers:execute`
- `davis-copilot:nl2dql:execute`
- `davis-copilot:dql2nl:execute`
- `davis-copilot:conversations:execute`
- `davis-copilot:document-search:execute`

## 3. Create the Platform token

Use Dynatrace account token management to create a Platform token. Keep the token private.

Official token documentation: https://docs.dynatrace.com/docs/manage/identity-access-management/access-tokens-and-oauth-clients/platform-tokens

## 4. Configure VS Code MCP

In the consuming application create:

```text
.vscode/mcp.json
```

Use:

```json
{
  "servers": {
    "dynatrace-mcp": {
      "type": "http",
      "url": "https://<your-environment-id>.apps.dynatrace.com/platform-reserved/mcp-gateway/v0.1/servers/dynatrace-mcp/mcp",
      "headers": {
        "Authorization": "Bearer ${env:COPILOT_MCP_DT_API_TOKEN}"
      }
    }
  }
}
```

Set `COPILOT_MCP_DT_API_TOKEN` in the environment available to VS Code. Never commit the real token.

### OAuth alternative

Dynatrace also supports a confidential OAuth client. With OAuth, VS Code can refresh the access token automatically. Configure the client with the required Dynatrace MCP scopes.

## 5. Start and verify MCP

1. Open the project in VS Code.
2. Open `.vscode/mcp.json`.
3. Start `dynatrace-mcp`.
4. Open GitHub Copilot Chat.
5. Open the Chat context/tool picker.
6. Select **Tools**.
7. Confirm **dynatrace-mcp (All tools)**.
8. Test:

```text
Show me the last 10 logs.
```

If logs are unavailable, verify `storage:logs:read`.

## 6. Install Dynatrace Expert

From the DEV-AI repository:

```bash
npx dev-ai-agents --agent dynatrace-expert
```

This installs:

```text
.github/agents/dynatrace-expert.agent.md
```

The agent covers incident RCA, deployment impact, production errors, performance regressions, release validation, security/vulnerability analysis and DQL.

## 7. Recommended project structure

```text
project/
├── .github/
│   └── agents/
│       └── dynatrace-expert.agent.md
├── .vscode/
│   └── mcp.json
└── docs/
    └── dynatrace/
        ├── setup.md
        ├── copilot-prompts.md
        └── troubleshooting.md
```

## 8. Security

- Never commit Dynatrace tokens or OAuth client secrets.
- Prefer environment variables or OAuth authentication.
- Grant least-privilege permissions.
- Do not paste production secrets into Copilot prompts.
- Dynatrace MCP access is limited by user/token permissions.
