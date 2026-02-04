# Exercise 2 — Add a Journal Entry Search Form by ID

Exercises are your guided practice for the lecture material. They are not submitted, but graded assignments and tests assume you’ve already done them. Complete each exercise promptly—ideally between the lecture it belongs to and the next class—so the concepts stay fresh and you’re ready for the assessed work.

## Why you’re doing this (and why it matters later)

In this branch, you already practiced creating and retrieving journal entries. The next step is wiring a user-driven lookup flow end-to-end: the browser renders a form, the server accepts form input, and the server responds with the matching journal entry page.

This exercise makes you practice:

- creating a new static HTML form page,
- adding a route that serves that form,
- adding a route that handles submitted form data,
- connecting form input to existing entry-retrieval behavior, and
- improving navigation by linking from an entry page back to search.

Later assignments assume you can design small request/response workflows that span HTML, routes, and controller logic.

## Starting Instructions

1. Clone the course repository: `git clone https://github.com/umass-cs-326/journal-app.git`
2. Open the `journal-app` folder in VS Code.
3. Switch to branch `2.2-posting-and-retrieving-journal-entries`:
   - VS Code: open the Command Palette (`Cmd/Ctrl+Shift+P`) → “Git: Checkout to...” → pick the branch name. [^1]
   - Command line: `git checkout 2.2-posting-and-retrieving-journal-entries`

## Exercise Instructions

Extend the application so users can search for a journal entry by ID using a form.

1. Create a new static page `static/search-form.html` with:
   - a heading for searching entries,
   - an HTML `<form>` that submits an entry ID,
   - a text input named `id`, and
   - a submit button.
2. Add a new `GET` route in `src/app.ts` (for example, `/entries/search`) that serves `search-form.html`.
3. Add a new route in `src/app.ts` to handle form submission (for example, `POST /entries/search`):
   - parse form data with `express.urlencoded(...)`,
   - read `req.body.id`, and
   - respond by showing the entry for that ID (for example, by redirecting to `/entries/:id` or by calling existing controller logic).
4. Update the generated entry page in `src/controller/JournalController.ts` so that when an entry is displayed, the HTML includes a link back to the search form.

Target behavior:

- Visiting the search-form URL displays the form.
- Submitting a valid ID displays the matching journal entry.
- The displayed journal entry includes a “Back to Search” (or similar) link.

## Saving Your Work

Keep your work isolated to this branch and make it recoverable:

1. Stage changes (choose one):
   - VS Code: open Source Control, review the file list, and click “+” to stage each file (`src/app.ts`, `src/controller/JournalController.ts`, `static/search-form.html`, and any others). [^1]
   - Terminal: `git add src/app.ts src/controller/JournalController.ts static/search-form.html` (add any additional modified files).
2. Commit with a clear message, e.g., `git commit -m "Add entry search form and routes"`.

Why this matters: staging helps you confirm exactly what you changed; committing creates a checkpoint you can return to if needed.

## Verifying Your Work

1. Start the server (e.g., `npm run dev` or your project’s start script).
2. Create one or more entries so IDs exist to search.
3. Visit your search route (for example, `http://localhost:3000/entries/search`) and confirm the form renders.
4. Submit an existing ID and confirm the matching entry appears.
5. Confirm the entry page includes a link back to the search form.
6. If something goes wrong, check:
   - Route paths and HTTP methods in `src/app.ts`.
   - Form field names in `search-form.html` (especially `name="id"`).
   - How the controller builds the response HTML in `JournalController.ts`.

## Solution Walkthrough

To view the solution for any exercise, switch to its companion solution branch and open the matching `.solution.md` file in `exercises/`:

- VS Code: Command Palette → “Git: Checkout to...” → pick the `exe-<exercise-number>-solution` branch.
- Command line: `git checkout exe-<exercise-number>-solution`

Once on the solution branch, open `exercises/exe-<exercise-number>.solution.md` to read the step-by-step explanation.

---

[^1]: For more information on using Git in VS Code, see [Version Control in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview).
