# Exercise 3.4 — Build an Entry Operations Console (60-Minute Practice)

Exercises are your guided practice for the lecture material. They are not submitted, but graded assignments and tests assume you’ve already done them. Complete each exercise promptly—ideally between the lecture it belongs to and the next class—so the concepts stay fresh and you’re ready for the assessed work.

Estimated total time: **60 minutes** (including reading this document).

## Why you’re doing this (and why it matters later)

In lecture, you expanded the app with logging and additional HTTP methods (`PUT`, `PATCH`, `DELETE`) plus browser form flows. This exercise uses the same concepts, but in a different shape: instead of a per-entry edit page flow, you will build a small **operations console** page for patching and deleting entries by ID.

This exercise makes you practice:

- route design for both API and browser form flows,
- middleware selection (`express.json`, `express.urlencoded`) based on request type,
- logging at route/controller boundaries,
- status code correctness (`200`, `204`, `404`), and
- handling browser constraints (forms use `GET`/`POST`) while still supporting REST methods.

## Starting Instructions

1. Clone the course repository: `git clone https://github.com/umass-cs-326/journal-app.git`
2. Open the `journal-app` folder in VS Code.
3. Switch to branch `3.4-logging-and-http-method-expansion`:
   - VS Code: open the Command Palette (`Cmd/Ctrl+Shift+P`) -> "Git: Checkout to..." -> pick the branch name. [^1]
   - Command line: `git checkout 3.4-logging-and-http-method-expansion`

## Exercise Instructions

Build an "Entry Operations Console" that lets a user patch or delete an entry by ID from one page.

### Part A (10-15 min): Add/confirm shared logging

1. Ensure the app uses one shared logging service instance (singleton/factory pattern is fine).
2. Add consistent log messages for:
   - `PATCH /api/entries/:id`
   - `DELETE /api/entries/:id`
   - `GET /entries/ops`
   - `POST /entries/ops/patch`
   - `POST /entries/ops/delete`
3. Keep log text short and consistent (example prefix: `[OPS]`).

### Part B (20-25 min): Add API operations with strict responses

1. Implement/confirm `PATCH /api/entries/:id`:
   - reads `id` from `req.params` and `content` from `req.body`,
   - updates the entry partially,
   - returns `200` with JSON when found,
   - returns `404` when ID does not exist.
2. Implement/confirm `DELETE /api/entries/:id`:
   - deletes by ID,
   - returns `204` when deleted,
   - returns `404` when ID does not exist.

## Part C (15-20 min): Add browser operations console page

1. Create `static/ops-form.html` with:
   - a heading (`Entry Operations Console`),
   - one form for patching content (`id`, `content`),
   - one form for deleting by `id`,
   - a simple note that forms use `POST`.
2. Add `GET /entries/ops` to serve that file.
3. Add form handlers:
   - `POST /entries/ops/patch` reads form fields and applies patch behavior,
   - `POST /entries/ops/delete` reads `id` and applies delete behavior.
4. After each POST, redirect to a meaningful page (for example `/entries/:id` after patch, `/entries` after delete).

### Part D (5-10 min): Add request script checkpoints

Update `test/journal.http` with an ordered mini-checklist:

1. Baseline: home and entries list
2. Create entry
3. API patch success
4. API patch not-found
5. API delete success
6. API delete not-found
7. Console page load (`GET /entries/ops`)
8. Form patch and form delete checks (`POST` + urlencoded body)

Target behavior:

- API routes use correct status codes and body shapes.
- Form routes work in a browser using `POST` and redirects.
- Logs clearly show each operation path.
- `test/journal.http` runs as a short, deterministic verification flow.

## Saving Your Work

Keep your work isolated to this branch and make it recoverable:

1. Stage changes (choose one):
   - VS Code: Source Control -> review and stage edited files. [^1]
   - Terminal: `git add src/app.ts src/controller/JournalController.ts src/service/LoggingService.ts src/server.ts static/ops-form.html test/journal.http` (include only files you changed).
2. Commit with a clear message, e.g., `git commit -m "Add entry operations console with patch/delete flows"`.

Why this matters: staging helps verify scope; commits create recovery checkpoints.

## Verifying Your Work

1. Start the server (`npm run dev` or project start script).
2. Run the requests in `test/journal.http` top-to-bottom.
3. Confirm:
   - `PATCH` returns `200` on success and `404` for missing IDs,
   - `DELETE` returns `204` on success and `404` for missing IDs,
   - `/entries/ops` renders,
   - form submissions patch/delete as expected,
   - logs are visible and consistently formatted.
4. If something fails, check:
   - middleware ordering (`json` vs `urlencoded`),
   - route path mismatches,
   - controller/service method wiring,
   - `name` attributes in `ops-form.html`.

## Solution Walkthrough

To view the solution for any exercise, switch to its companion solution branch and open the matching `.solution.md` file in `exercises/`:

- VS Code: Command Palette -> "Git: Checkout to..." -> pick the `exe-<exercise-number>-solution` branch.
- Command line: `git checkout exe-<exercise-number>-solution`

Once on the solution branch, open `exercises/exe-<exercise-number>.solution.md` to read the step-by-step explanation.

---

[^1]: For more information on using Git in VS Code, see [Version Control in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview).
