# ADO -> ECC-Inspired Full-Stack Workflow

Use the Azure DevOps user story as source of truth and apply the ECC-inspired specialist pipeline.

## Workflow
1. ADO agent reads story and acceptance criteria.
2. Planner creates phases and maps every acceptance criterion.
3. Code Explorer discovers existing .NET/Angular/domain patterns.
4. Architect validates API/data/event boundaries.
5. TDD agent defines unit/integration tests first.
6. Backend agent implements .NET 8/C#/ASP.NET Core/EF Core.
7. Database reviewer validates schema, query and migration impact.
8. Angular agent implements UI and API integration.
9. E2E agent validates critical journeys with Playwright.
10. Accessibility agent validates keyboard/WCAG/screen-reader requirements.
11. Security reviewer audits trust boundaries and sensitive changes.
12. Code reviewer performs evidence-based review.
13. PR workflow records tests/review/evidence and creates the PR.

## Acceptance traceability
For every ADO criterion output:
AC# -> implementation -> test -> evidence -> status

Never mark an acceptance criterion complete without evidence.

This bridge combines DEV-AI's existing ADO specialization with ECC-inspired planning/testing/review patterns.
