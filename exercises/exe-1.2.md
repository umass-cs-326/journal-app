# Exercise 1 — Add a /features Route Serving Static HTML

Exercises are your guided practice for the lecture material. They are not submitted, but graded assignments and tests assume you’ve already done them. Complete each exercise promptly—ideally between the lecture it belongs to and the next class—so the concepts stay fresh and you’re ready for the assessed work.

## Why you’re doing this (and why it matters later)

We treat a web application as a system end-to-end: the browser issues an HTTP request, the server matches it to a route, and the server generates a response—often by reading and returning a file from disk. This exercise makes you practice the full chain:

- defining a new route on the server,
- serving a static HTML file from the `static/` directory, and
- confirming the browser renders what you expect at a specific URL.

Later assignments assume you’re comfortable wiring routes to responses, distinguishing static assets from server logic, and diagnosing what happens when a route isn’t found. Doing this now builds that muscle before the graded work.

## Starting Instructions

1. Clone the course repository: `git clone https://github.com/umass-cs-326/journal-app.git`
2. Open the `journal-app` folder in VS Code.
3. Switch to branch `1.2-elevating-the-design-of-a-journal-application`:
   - VS Code: open the Command Palette (`Cmd/Ctrl+Shift+P`) → “Git: Checkout to...” → pick the branch name. [^1]
   - Command line: `git checkout 1.2-elevating-the-design-of-a-journal-application`

## Exercise Instructions

Extend the application to include a new route such that visiting `http://localhost:3000/features` renders a list of 10 features the journal app will support (you can make these up).

- Update `src/app.ts` with a new matching route and handler.
- Create a new `static/features.html` file containing the HTML for the list of features.

## Saving Your Work

Keep your work isolated to this branch and make it recoverable:

1. Stage changes (choose one):
   - VS Code: open Source Control, review the file list, and click “+” to stage each file (`src/app.ts`, `static/features.html`, and any others). [^1]
   - Terminal: `git add src/app.ts static/features.html` (add any additional modified files).
2. Commit with a clear message, e.g., `git commit -m "Add /features route and static page"`.

Why this matters: staging lets you confirm exactly what will be recorded; committing creates a checkpoint you can roll back to if needed.

## Verifying Your Work

1. Start the server (e.g., `npm run dev` or your project’s start script).
2. Visit `http://localhost:3000/features` in the browser.
3. Confirm you see the list of features you created.
4. If you edit `features.html`, refresh the browser to view updates; the route should always serve the file from disk.
5. If something goes wrong, check:
   - The server console for error messages.
   - That the route in `app.ts` matches `/features`.
   - That `features.html` is in the `static/` directory.

## Solution Walkthrough

To view the solution for any exercise, switch to its companion solution branch and open the matching `.solution.md` file in `exercises/`:

- VS Code: Command Palette → “Git: Checkout to...” → pick the `exe-<exercise-number>-solution` branch.
- Command line: `git checkout exe-<exercise-number>-solution`

Once on the solution branch, open `exercises/exe-<exercise-number>.solution.md` to read the step-by-step explanation.

---

[^1]: For more information on using Git in VS Code, see [Version Control in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview).
