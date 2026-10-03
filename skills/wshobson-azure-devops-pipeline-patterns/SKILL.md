---
name: wshobson-azure-devops-pipeline-patterns
description: CI/CD patterns for .NET and Angular applications using Azure DevOps, environment gates, validation and safe deployment strategies.
---

# Azure DevOps Pipeline Patterns

Use for enterprise .NET/Angular CI/CD design and review.

Stages:
1. restore/install
2. build
3. unit/integration tests
4. security/static analysis
5. package immutable artifact
6. deploy DEV/TST/PERF
7. smoke and health validation
8. approval/check gates
9. production promotion
10. post-deploy verification and rollback

Prefer immutable artifacts, environment-scoped configuration, Key Vault/secret stores, service connections, approval gates, automated health checks and backward-compatible database migrations.

Never put credentials, PATs or connection strings in agent/skill files.