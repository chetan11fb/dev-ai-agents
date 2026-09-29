# Dynatrace Expert — Troubleshooting

## MCP server does not start

Check:

1. Dynatrace environment ID in the URL.
2. JSON syntax in `.vscode/mcp.json`.
3. `COPILOT_MCP_DT_API_TOKEN` is available to VS Code.
4. The token is valid and permitted for MCP.
5. The user/token has `mcp-gateway:servers:invoke` and `mcp-gateway:servers:read`.
6. The user can access the Dynatrace environment.

## MCP connects but a tool returns permission errors

MCP gateway permissions alone are not enough.

- Logs → `storage:logs:read`
- Spans → `storage:spans:read`
- Metrics → `storage:metrics:read`
- Events → `storage:events:read`
- Security → `storage:security.events:read`
- Entities → `storage:entities:read`

Grant only what the use case requires.

## Copilot cannot find Dynatrace Expert

Confirm:

```text
.github/agents/dynatrace-expert.agent.md
```

Then reload VS Code/Copilot if the agent picker has not refreshed.

## Token problems

Never put a real token in agent files, `.vscode/mcp.json`, README, prompts, documentation or commits.

Use an environment variable or OAuth.

## DQL issues

Ask the agent to:

1. Discover available fields before guessing field names.
2. Use `entityName(dt.entity.service)` for human-readable service names.
3. Expand `span.events` for failed-request exception analysis.
4. Use current/latest security state instead of historical aggregation.
5. Show the exact DQL used.

## Basic verification

Run:

```text
Show me the last 10 logs.
```

If that fails, troubleshoot MCP connectivity and `storage:logs:read` before changing the agent.

Official docs: https://docs.dynatrace.com/docs/dynatrace-intelligence/dynatrace-mcp
