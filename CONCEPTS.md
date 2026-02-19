# Lecture 5.7 Concepts: Testing as Contract Verification

## Overview

In this lecture we treat tests as executable contracts. We add Jest and Supertest to the project, define service-level tests for domain behavior, and define HTTP integration tests for route/controller behavior. Together these tests verify what the system promises to callers, rather than how it is internally implemented.

## Big Picture

Every layer in this architecture publishes a contract:

- Service contract: given inputs, return `Result<T, JournalError>` consistently.
- Controller/HTTP contract: map domain outcomes to clear HTTP semantics (status, body, redirect, render target).
- Composition contract: wire dependencies so runtime and tests exercise the same behavior.

By testing at those boundaries, we can refactor internals without changing observable behavior.

## Concepts List

- Tests as executable contracts
- Jest as a deterministic test runner
- Supertest for HTTP boundary verification
- Service-layer unit tests with repository substitution
- Mapping `JournalError` to HTTP status semantics
- Dependency injection and composition roots for testability
- Async test patterns with `await` and Promise-returning boundaries
- Regression safety for iterative refactoring

## Tests as executable contracts

A test can be read as a promise about system behavior. If the promise fails, the contract was broken.

Why: This gives us a precise way to protect behavior while still allowing refactors.

Required Reading:

- https://martinfowler.com/bliki/ContractTest.html

## Jest as a deterministic test runner

Jest gives us fast, repeatable tests with clear failure output and rich matchers. It is ideal for teaching incremental behavior changes.

Why: We choose Jest because students can focus on behavior assertions with minimal setup overhead.

Required Reading:

- https://jestjs.io/docs/getting-started

## Supertest for HTTP boundary verification

Supertest drives an Express app without opening a network port. It allows us to assert status codes, redirects, headers, and body payloads as a caller would observe them.

Why: We choose Supertest because it validates the real HTTP contract end-to-end.

Required Reading:

- https://github.com/ladjs/supertest

## Service-layer unit tests with repository substitution

Service tests replace the repository with a controlled fake so we can verify validation and delegation independently from storage implementation details.

Why: We choose substitution so each test isolates a single boundary and failure mode.

Required Reading:

- https://martinfowler.com/articles/mocksArentStubs.html

## Mapping JournalError to HTTP status semantics

Controllers translate typed domain failures (for example `EntryNotFound`) into stable status codes and response shapes.

Why: We choose explicit mapping because client behavior depends on these semantics.

Required Reading:

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

## Dependency injection and composition roots for testability

A composition root centralizes dependency wiring. Tests can reuse the same wiring and inject test doubles where needed.

Why: We choose a composition root to avoid duplicating setup logic and drifting runtime/test behavior.

References:

- https://martinfowler.com/articles/injection.html

## Async test patterns with await and Promise-returning boundaries

When production code is async, tests should await those boundaries to avoid false positives and race conditions.

Why: We choose `await`-first tests to ensure assertions run after behavior completes.

References:

- https://jestjs.io/docs/asynchronous

## Regression safety for iterative refactoring

Once tests capture stable behavior, we can safely restructure internals while continuously verifying that public behavior remains unchanged.

Why: We choose this workflow so each lecture can extend the system without breaking earlier promises.

References:

- https://martinfowler.com/articles/practical-test-pyramid.html

## Conclusion

Testing in this lecture is not about coverage percentages. It is about contract clarity: which promises this system makes, where those promises live, and how we verify them continuously as the architecture evolves.
