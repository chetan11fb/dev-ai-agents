# DEV-AI Change Impact Analysis Skill

## Purpose
Reusable evidence-driven methodology for analyzing the blast radius of changes in enterprise applications, especially .NET/C#, microservices, APIs, messaging, databases and Saga workflows.

## Core model
Requirement / changed symbol
-> callers
-> project/service boundaries
-> API/message contracts
-> data persistence
-> Saga/workflow state
-> consumers
-> UI
-> tests
-> configuration
-> deployment
-> rollback

## Required analysis dimensions
1. Repository structure and framework/runtime.
2. Compile-time dependencies.
3. Runtime service dependencies.
4. API and DTO contracts.
5. Events/messages and consumers.
6. Saga states, transitions and compensation.
7. EF Core/database schema and migrations.
8. Configuration and infrastructure.
9. Frontend consumers.
10. Unit/integration/contract/E2E tests.
11. Deployment ordering.
12. Rollback/recovery.
13. Risk and confidence.

## .NET focus
Look for controllers/endpoints, handlers, services, interfaces, DI, middleware, EF Core, repositories, options, background workers, shared libraries and package dependencies.

## Microservice focus
Map service-to-service calls and event flows. Identify synchronous chains, asynchronous fan-out, shared contracts and shared database coupling.

## Saga focus
Detect orchestration and choreography. Trace trigger, state, command/event, consumer, side effect, retry, timeout, correlation, persistence and compensation. Analyze both forward and failure paths.

## Evidence discipline
Every finding should be one of:
- VERIFIED — directly observed in repository/code/config/test evidence.
- INFERRED — strongly supported by observed relationships.
- ASSUMED — required because repository evidence is missing.
- UNKNOWN — cannot be established without runtime/system-owner information.

Never convert UNKNOWN into VERIFIED.

## Risk
Use LOW/MEDIUM/HIGH/CRITICAL with a transparent 0-100 engineering risk indicator. Consider contract changes, database changes, message fan-out, Saga changes, dependency depth, shared libraries, configuration, test gaps and deployment constraints.

## Deliverable
Summary -> Impact Graph -> Impacted Components -> .NET -> Microservices -> Saga -> API -> Database -> Messaging -> Frontend -> Tests -> Deployment -> Rollback -> Risks -> Recommended Boundary -> Validation -> Evidence/Assumptions.
