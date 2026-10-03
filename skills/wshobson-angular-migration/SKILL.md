---
name: wshobson-angular-migration
description: Incremental AngularJS-to-Angular modernization patterns for legacy enterprise applications, including hybrid migration and compatibility.
---

# Angular Migration

Use when modernizing legacy AngularJS/Angular applications.

Preferred strategy for large enterprise apps:
- inventory modules, routes, services and dependencies;
- add characterization/e2e coverage first;
- migrate feature-by-feature or vertical slice;
- use hybrid interoperability only where needed;
- convert controllers/directives to Angular components;
- migrate services and dependency injection incrementally;
- migrate routing in controlled slices;
- keep API contracts stable;
- remove legacy code only after replacement is verified.

For Angular 2+ projects, inspect the current Angular version and repository conventions before applying migration patterns. Keep UI, API and business-logic changes separable.