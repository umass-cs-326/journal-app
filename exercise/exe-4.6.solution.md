# Exercise 4.6 Solution — Async Clone Route

This solution adds a new async route that flows through repository → service → controller → route wrapper, modeled on existing async routes but with slightly different behavior.

## What was added

- Repository: a `addClone` method that reuses `add` but keeps the intent explicit.
- Service: a `cloneEntry` method that awaits `getById`, builds cloned content, validates, and awaits `addClone`.
- Controller: a `cloneEntryFromForm` method that maps `JournalError` to HTTP status codes and redirects on success.
- Route: `POST /entries/:id/clone` wired through `asyncHandler`.
- HTTP checks: `test/4.6.async.http`.

## Key code changes

### Repository

File: `src/repository/JournalRespository.ts`

- Added `addClone(content: string)` to `IJournalRepository`.
- Implemented `addClone` by delegating to `add`.

### Service

File: `src/service/JournalService.ts`

- Added `cloneEntry(id: string)` to `IJournalService`.
- Implementation:
  - `await repository.getById(id)`.
  - Build content: `CLONE: ${existing.value.content}`.
  - Validate content length and non-empty.
  - `await repository.addClone(normalized)`.

### Controller

File: `src/controller/JournalController.ts`

- Added `cloneEntryFromForm(res, id)` to `IJournalController`.
- Maps `JournalError` via `mapErrorStatus`.
- Redirects to the new entry on success.

### Route

File: `src/app.ts`

- Added:
  - `POST /entries/:id/clone`
  - Wrapped in `asyncHandler`.

## Verification

Use the request sequence in `test/4.6.async.http`:

1. Create a base entry.
2. Clone it.
3. Fetch the cloned entry.
4. Clone a missing id (expect 404).

Optional: to trigger a `400`, create an entry with length ≥ 4994 so the cloned content exceeds 5000 characters.
