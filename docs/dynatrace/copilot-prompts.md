# Dynatrace Expert — GitHub Copilot Prompt Cookbook

Use these prompts in VS Code → GitHub Copilot Chat after the Dynatrace MCP server is connected.

## Verify connectivity

```text
Use the Dynatrace Expert agent and Dynatrace MCP tools.
Verify the MCP connection and show the last 10 application logs.
Do not modify code.
```

## Production incident RCA

```text
Investigate the current production incident using Dynatrace.
Start with active Davis problems, then correlate traces, span exceptions, logs, metrics and RUM errors where applicable.
Identify root-cause evidence, affected service, trace IDs, exact exception messages, affected users and business impact.
Show the DQL queries used.
Do not change code until I explicitly ask.
```

## .NET / ASP.NET Core API failures

```text
Investigate failures for our ASP.NET Core/.NET Web API.
Find failed requests, expand span.events for exceptions, correlate logs by trace ID, and identify the endpoint/service with the highest impact.
Return root-cause evidence, endpoint, exception type/message, trace IDs, error rate, recommended fix and DQL.
Do not invent telemetry that is not present.
```

## Deployment validation

```text
Validate the latest deployment with Dynatrace.
Compare an appropriate before/after window for error rate, P50/P95/P99 latency, throughput and active problems.
Correlate regressions with the deployment and show evidence plus DQL.
Do not claim success when telemetry is insufficient.
```

## Performance regression

```text
Find services whose latency has materially regressed recently.
Analyze golden signals, compare against a baseline, identify resource saturation and correlate with recent deployments.
Use entityName(dt.entity.service) for service names.
Return evidence and DQL.
```

## Security / vulnerabilities

```text
Investigate current Dynatrace security vulnerabilities.
Use the latest available scan/state rather than summing historical findings.
Deduplicate current vulnerability state, identify affected entities and severity, and explain the actionable findings.
Show the DQL and required permissions if a query cannot run.
```

## DQL generation

```text
Write a Dynatrace DQL query to find the top 10 services by P95 request latency over the last 2 hours.
Use the correct Dynatrace fields and entityName(dt.entity.service).
Explain the query briefly and do not execute it unless I ask.
```

## Trace-to-log correlation

```text
For the highest-impact failed request, identify the trace ID and correlate the trace with application logs.
Show service, endpoint, exception, timestamp and relevant log messages.
Explain the causal chain using only observed evidence.
```

## Telemetry-to-code remediation

```text
Use Dynatrace telemetry to identify the production defect first.
Then inspect the corresponding repository code.
Before editing, show telemetry evidence, suspected code location, root-cause reasoning and proposed change.
After editing, run relevant tests and summarize Dynatrace evidence and test evidence separately.
```

## Full observability review

```text
Perform a Dynatrace observability review for this service.
Check active problems, errors, traces, latency, throughput, dependencies, logs and security findings where permissions allow.
Return Current State, Findings, Evidence, Impact, DQL, Recommended Actions and Missing Telemetry/Permissions.
```

## Operating rule

If Dynatrace data or permissions are insufficient, explicitly state what is missing. Never fabricate telemetry, DQL results, trace IDs, incidents or security findings.
