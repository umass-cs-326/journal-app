# Exercise 3.5 — Extend Result-Driven Flows with Search and Validation Summaries (60-Minute Practice)

Exercises are your guided practice for the lecture material. They are not submitted, but graded assignments and tests assume you have already done them. Complete each exercise promptly, ideally between this lecture and the next class, so the concepts stay fresh.

Estimated total time: **60 minutes** (including reading this document).

## Why you are doing this (and why it matters later)

Lecture 3.5 established the core architecture: `Result<T, E>` return values, `JournalError` mapping, layered validation, and EJS rendering. This exercise does not repeat those baseline steps. Instead, we extend that architecture by adding a search/filter flow and a validation-summary view path so we can apply the same patterns to a new feature.

This exercise makes us practice:

- extending existing `Result` and `JournalError` flows to a new endpoint,
- adding new validation rules without breaking existing behavior,
- reusing EJS layout/template patterns for a richer read workflow,
- verifying success and failure paths through deterministic HTTP checks,
- making controller status mapping explicit for newly introduced cases.

References:

- https://expressjs.com/en/guide/routing.html#route-parameters
- https://expressjs.com/en/api.html#req.query
- https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

## Starting Instructions

1. Clone the course repository: `git clone https://github.com/umass-cs-326/journal-app.git`
2. Open the `journal-app` folder in VS Code.
3. Switch to branch `3.5-results-errors-validation`:
   - VS Code: Command Palette (`Cmd/Ctrl+Shift+P`) -> `Git: Checkout to...` -> select the branch. [^1]
   - Command line: `git checkout 3.5-results-errors-validation`

## Exercise Instructions

Build a new entries search experience that uses query validation + typed error mapping and renders through EJS.

### Part A (10-15 min): Add typed query validation contracts

1. Add support for `GET /entries/search?q=term&limit=n` in `src/app.ts` and route it to the controller.
2. Validate query input at route boundary:
   - `q` must be present after trim,
   - `limit` must be numeric when provided.
3. Return `400` for malformed query inputs before calling controller logic.

### Part B (15-20 min): Extend service/repository with Result-based search

1. Add a service method for searching entries by substring (case-insensitive).
2. Return `Err(ValidationError(...))` when `q` is empty or `limit` is outside your allowed range (for example `1-50`).
3. Add a repository method that returns matching entries as `Result<IJournalEntry[], JournalError>` without throwing for expected outcomes.

### Part C (15-20 min): Render search and empty states with EJS

1. Add a new template `views/entries/search.ejs` to display:
   - query term,
   - result count,
   - list of matched entries linking to `/entries/:id`.
2. Add an empty-results branch in the template with user-friendly guidance.
3. In controller, render `entries/search` on success and map typed errors to `400/500` on failure.

### Part D (10-15 min): Add HTTP checkpoints for the new flow

1. Create or extend a test file with search checks (for example `test/3.5.search.http`).
2. Add requests for:
   - search success,
   - missing `q` (`400`),
   - invalid `limit` (`400`),
   - zero results (valid request, empty result view).
3. Keep request order deterministic and easy to rerun.

Target behavior:

- Search requests follow the same `Result` + `JournalError` pattern as the rest of the app.
- Validation failures are rejected with clear `400` responses.
- Success and empty-result paths render cleanly through EJS templates.

## Saving Your Work

1. Stage only files you changed:
   - VS Code: Source Control -> review and stage edited files. [^1]
   - Terminal: `git add src/app.ts src/controller/JournalController.ts src/service/JournalService.ts src/repository/JournalRespository.ts views/entries/search.ejs test/3.5.search.http` (include only files you actually changed).
2. Commit with a clear message:
   - `git commit -m "Add Result-based entry search flow with query validation"`

Why this matters: staging verifies scope, and commits create a clean checkpoint before later features.

## Verifying Your Work

1. Start the server (`npm run dev` or project start script).
2. Run your search HTTP test sequence top-to-bottom.
3. Confirm: valid search renders results, invalid query values return `400`, and empty-result requests render an intentional view state.
4. If something fails, check route query parsing, service validation logic, controller error mapping, and template wiring.

## Solution Walkthrough

To view the solution for this exercise, switch to its companion solution branch and open the matching `.solution.md` file in `exercises/`:

- VS Code: Command Palette -> `Git: Checkout to...` -> select `exe-3.5-solution`.
- Command line: `git checkout exe-3.5-solution`

Then open `/Users/richards/Git/journal-app/exercises/exe-3.5.solution.md`.

---

[^1]: For more on Git in VS Code, see https://code.visualstudio.com/docs/sourcecontrol/overview.
