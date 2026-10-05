---
name: token-efficient-dotnet
description: "Focused .NET/C# workflow for ASP.NET Core, Web API, EF Core, services, DTOs and backend changes."
---

# Token-Efficient .NET

Inspect only the affected dependency chain:

solution/project -> endpoint/class -> direct service -> DTO/model/data access if needed.

Reuse nearby patterns. Do not scan unrelated projects. Make the smallest compatible change. Run the affected build/tests first. Never expose secrets.
