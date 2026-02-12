# Lecture 3.5 Concepts: Results, Errors, Validation, and Template-Driven Rendering

## Overview

In this lecture we shift the journal app from implicit error behavior to explicit, typed outcomes, and then use that stronger contract to improve validation, controller decisions, and user-facing responses. We also move HTML generation out of controllers and into EJS templates with a shared layout, which gives us cleaner separation of concerns and makes UI evolution faster. The final steps align tests and dependencies with these architectural changes so the whole system remains coherent.

## Big Picture

A web request starts at the route boundary, then flows into the controller, service, and repository before a response is produced. In this iteration, each layer has a clearer job: routes validate raw request shape, services enforce business constraints, repositories return typed data outcomes, and controllers map outcomes to HTTP responses and rendered views. On the frontend side, server-rendered EJS templates and shared layout structure provide consistent presentation, while CSS updates improve readability and navigation behavior. Together, these changes make backend correctness and frontend usability reinforce each other.

## Concepts List

- `Result<T, E>` and explicit success/failure returns
- Discriminated unions for domain modeling
- Domain-specific error taxonomy (`JournalError`)
- Layered validation (defense in depth)
- Route-boundary input validation
- Service-level business rule enforcement
- Repository-level failure signaling without exceptions
- Controller error-to-HTTP mapping
- Type guards and safe narrowing in TypeScript
- Structured logging with timestamps
- Server-side rendering with EJS
- Layout reuse and shared navigation shell
- Controller/view separation via `res.render(...)`
- Form workflow semantics (redirect vs API-style response)
- HTTP regression tests with `.http` scenario files
- Dependency and type package alignment

## `Result<T, E>` and explicit success/failure returns

`Result<T, E>` models outcomes as data (`Ok` or `Err`) instead of relying on exceptions for expected failures, which makes control flow easier to reason about and test. This pattern lets every caller handle success and failure explicitly, and it clarifies which errors are part of normal business behavior. Why: We choose explicit result values over thrown exceptions here because invalid user input and not-found cases are routine outcomes, not exceptional crashes. Used in Step 1, Step 3, Step 4, Step 6.

References:

- https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- https://fsharpforfunandprofit.com/posts/recipe-part2/

## Discriminated unions for domain modeling

A discriminated union is a union type with a stable tag field (`name`) that enables precise branching on known variants. In this lecture, the `JournalError` union gives us strongly typed error variants that are easy to inspect and map consistently. Why: We choose discriminated unions because they encode valid error states directly in the type system, reducing ambiguity and missed cases. Used in Step 2, Step 6.

References:

- https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
- https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html

## Domain-specific error taxonomy (`JournalError`)

A domain error taxonomy defines the set of meaningful failures for the application domain, such as `EntryNotFound`, `InvalidContent`, and `ValidationError`. This gives every layer shared language for failure semantics and enables consistent HTTP mapping and messaging. Why: We choose named domain errors over generic `Error` messages so handling can be deterministic and tied to product behavior. Used in Step 2, Step 3, Step 4, Step 6, Step 12.

Required Reading:

- https://martinfowler.com/articles/replaceThrowWithNotification.html

References:

- https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design

## Layered validation (defense in depth)

Layered validation means we intentionally validate at multiple boundaries rather than trusting one layer to catch everything. Routes guard request shape, services guard business rules, repositories guard persistence constraints, and controllers enforce response semantics. Why: We choose layered validation because each layer sees different context, and overlapping checks reduce the chance of invalid state propagation. Used in Step 3, Step 4, Step 5, Step 6.

References:

- https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

## Route-boundary input validation

Route-boundary validation checks raw transport data before deeper business logic runs, including presence/type checks and normalization. Here, the POST route trims content, rejects empty values, logs a warning, and returns `400` immediately. Why: We choose early boundary rejection to fail fast, reduce downstream complexity, and provide immediate client feedback. Used in Step 5.

References:

- https://expressjs.com/en/guide/routing.html
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400

## Service-level business rule enforcement

Service-level validation enforces domain rules that should remain true regardless of who calls the service. In this lecture, content normalization and max-length limits are enforced in `createEntry` and returned as typed errors. Why: We choose service-level enforcement so business rules are centralized and reusable across routes, controllers, and tests. Used in Step 4.

Required Reading:

- https://martinfowler.com/eaaCatalog/serviceLayer.html
- https://en.wikipedia.org/wiki/Business_rule

## Repository-level failure signaling without exceptions

Repository methods now return `Result` values so not-found and validation-adjacent issues are represented as normal outcomes. This removes throw-based flow for expected misses and keeps data access behavior aligned with the rest of the typed error model. Why: We choose returned error values because repository misses are part of routine CRUD behavior and should be handled predictably. Used in Step 3.

Required Reading:

- https://martinfowler.com/eaaCatalog/repository.html

References:

- https://www.typescriptlang.org/docs/handbook/2/functions.html

## Controller error-to-HTTP mapping

Controller mapping translates domain outcomes into HTTP status codes and response shapes. In this lecture, `EntryNotFound` maps to `404`, validation issues map to `400`, and unknown/internal issues map to `500`. Why: We choose centralized mapping in the controller so transport concerns stay out of domain logic and remain consistent across endpoints. Used in Step 6, Step 11, Step 12.

References:

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- https://expressjs.com/en/guide/error-handling.html

## Type guards and safe narrowing in TypeScript

A type guard is a runtime check that narrows a broad type into a specific known type branch. The `isJournalError` helper prevents unsafe property access and allows controller logic to branch with confidence. Why: We choose explicit guards because external and unioned values can be unknown at runtime, and narrowing preserves safety. Used in Step 6, Step 11, Step 12.

References:

- https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html

## Structured logging with timestamps

Structured logging adds consistent machine-readable context to log lines, including timestamp and log level. By stamping logs with ISO timestamps, we can sequence events and debug request flows more reliably. Why: We choose timestamped formatting so runtime behavior can be analyzed over time, not just as isolated messages. Used in Step 7.

Required Reading:

- https://12factor.net/logs

References:

- https://nodejs.org/api/console.html

## Server-side rendering with EJS

Server-side rendering with EJS lets the server render HTML templates using runtime data before sending responses. This removes brittle string-built HTML in controllers and supports conditional rendering and loops in templates. Why: We choose EJS here because it integrates directly with Express and is straightforward for introducing templating concepts. Used in Step 8, Step 9, Step 10, Step 11, Step 15.

References:

- https://ejs.co/
- https://expressjs.com/en/guide/using-template-engines.html

## Layout reuse and shared navigation shell

A shared layout wraps page-specific content in common structure (head, nav, stylesheet links), avoiding duplication. Using `express-ejs-layouts` plus `views/layouts/base` keeps cross-page updates centralized. Why: We choose a base layout so navigation and styling are consistent and easier to change in one place. Used in Step 8, Step 9, Step 10.

References:

- https://expressjs.com/en/starter/static-files.html

## Controller/view separation via `res.render(...)`

`res.render(...)` shifts presentation details into view files and keeps controllers focused on orchestration and decision logic. This improves readability, testability, and long-term maintainability compared to inline HTML concatenation. Why: We choose render-based responses because separation of concerns reduces coupling between HTTP flow and markup details. Used in Step 11, Step 15.

References:

- https://expressjs.com/en/api.html#res.render

## Form workflow semantics (redirect vs API-style response)

Form endpoints and API endpoints often need different response behavior even when they trigger similar business actions. This lecture introduces a form-specific delete path that redirects after success while preserving API semantics elsewhere. Why: We choose separate handlers so user-facing browser flows can use redirect-based UX patterns without distorting API contracts. Used in Step 12.

Required Reading:

- https://en.wikipedia.org/wiki/Post/Redirect/Get

References:

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections

## HTTP regression tests with `.http` scenario files

HTTP scenario files capture repeatable request sequences to verify behavior after architecture changes. The lecture adds tests that confirm template output routes still work and validation failures return the expected status. Why: We choose focused HTTP scenarios because they validate end-to-end behavior at the protocol boundary where user impact is visible. Used in Step 14.

References:

- https://www.rfc-editor.org/rfc/rfc9110
- https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html

## Dependency and type package alignment

When runtime libraries are added, matching type packages are often needed for TypeScript correctness and editor support. The final step adds `@types/express-ejs-layouts` to align compile-time typing with runtime template middleware usage. Why: We choose explicit type dependency alignment to prevent drift between runtime behavior and static analysis. Used in Step 8, Step 16.

References:

- https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html

## Conclusion

These concepts matter because they convert a working app into a more teachable and maintainable system: typed results clarify control flow, typed errors clarify failure intent, layered validation protects system boundaries, and controller mapping makes HTTP outcomes explicit. By combining these backend practices with template-based rendering, shared layout reuse, and targeted HTTP checks, we improve both developer ergonomics and user experience while keeping behavior easier to reason about across the full request/response lifecycle.
