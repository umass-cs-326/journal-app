# Exercise 4.6 — Make the Journal App Asynchronous-Safe (45–60 Minute Practice)

Exercises are your guided practice for the lecture material. They are not submitted, but graded assignments and tests assume you have already done them. Complete each exercise promptly, ideally between this lecture and the next class, so the concepts stay fresh.

Estimated total time: **45–60 minutes** (including reading this document).

## Why you are doing this (and why it matters later)

Lecture 4.6 introduces the asynchronous execution model: time enters the system, functions can return Promises, and error handling changes. Our app is about to use real I/O (database, filesystem, network), which means your repository/service/controller boundaries must be async-safe. This exercise upgrades the existing synchronous flow to an asynchronous one while preserving our `Result<T, E>` architecture and error mapping.

This exercise makes us practice:

- converting repository/service/controller methods to return Promises,
- using `async`/`await` to keep control flow readable,
- handling errors via async-safe route wrappers (`asyncHandler`),
- understanding where `await` belongs across layers,
- verifying success and failure paths without blocking the event loop.

References:

- https://expressjs.com/en/guide/using-middleware.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

## Starting Instructions

1. Clone the course repository: `git clone https://github.com/umass-cs-326/journal-app.git`
2. Open the `journal-app` folder in VS Code.
3. Switch to branch `4.6-asynchonous-model` (as shown in the slides):
   - VS Code: Command Palette (`Cmd/Ctrl+Shift+P`) -> `Git: Checkout to...` -> select the branch. [^1]
   - Command line: `git checkout 4.6-asynchonous-model`

## Exercise Instructions

You will add one new route that touches the repository/service/controller stack and implement it in the asynchronous execution model while preserving `Result<T, E>` semantics. Model your changes on an existing route, but make the behavior slightly different.

### Part A (10–15 min): Add a new async route that uses the full stack

Implement a new route that follows the same patterns as an existing async route, but with slightly different behavior.

Suggested route (use this unless your instructor says otherwise):

- `POST /entries/:id/clone`

Expected behavior:

- Finds the existing entry by `id`.
- Creates a new entry with content: `"CLONE: " + original content`.
- Redirects to the newly created entry on success.
- Returns `404` if the original entry does not exist.
- Returns `400` for invalid content (if your validation rejects it).

### Part B (15–20 min): Implement async repository + service support

1. Add a repository method that creates a new entry from a provided content string and returns a `Promise<Result<IJournalEntry, JournalError>>`.
2. Add a service method `cloneEntry(id: string)` that:
   - awaits the repository `getById` call,
   - builds the cloned content,
   - awaits the repository add call,
   - returns `Result` with correct error types.
3. Keep all calls async and ensure you always return `Result` instead of throwing.

### Part C (10–15 min): Add controller + route wiring with `async/await`

1. Add a controller method that awaits the service call and maps `JournalError` to HTTP status codes (model it on existing controllers).
2. Add the route in `src/app.ts` using the async handler wrapper.
3. Verify the new controller method returns the same kinds of responses as the rest of the app.

### Part D (10–15 min): Add HTTP checkpoints for async behavior

1. Create or extend an HTTP test file (for example `test/4.6.async.http`).
2. Add requests that hit both success and failure paths for your new route:
   - clone success,
   - clone for a missing id (`404`),
   - clone failure due to invalid content (`400`), if applicable.
3. Verify that responses are correct and the server stays responsive while awaiting.

Target behavior:

- Your new route uses async repository/service/controller methods and is awaited end-to-end.
- Controllers preserve `Result<T, E>` semantics while operating asynchronously.
- Async errors are captured by the route wrapper, not leaked as unhandled rejections.
- The app remains responsive (no blocking) when routes await I/O.

## Saving Your Work

1. Stage only files you changed:
   - VS Code: Source Control -> review and stage edited files. [^1]
   - Terminal: `git add src/app.ts src/controller/JournalController.ts src/service/JournalService.ts src/repository/JournalRespository.ts test/4.6.async.http` (include only files you actually changed).
2. Commit with a clear message:
   - `git commit -m "Convert journal flow to async-safe repository/service/controller"`

Why this matters: staging verifies scope, and commits create a clean checkpoint before later features.

## Verifying Your Work

1. Start the server (`npm run dev` or project start script).
2. Run your async HTTP test sequence top-to-bottom.
3. Confirm: clone success redirects correctly, error statuses are correct, and failure paths do not crash the server.
4. If something fails, check for missing `await`, missing `async`, or routes that are not wrapped by the async handler.

## Solution Walkthrough

To view the solution for this exercise, switch to its companion solution branch and open the matching `.solution.md` file in `exercises/`:

- VS Code: Command Palette -> `Git: Checkout to...` -> select `exe-4.6-solution`.
- Command line: `git checkout exe-4.6-solution`

Then open `/Users/richards/Git/journal-app/exercises/exe-4.6.solution.md`.

---

[^1]: For more on Git in VS Code, see https://code.visualstudio.com/docs/sourcecontrol/overview.
