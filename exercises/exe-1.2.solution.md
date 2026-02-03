# Solution Walkthrough — Add a `/features` Route Serving Static HTML

This guide explains exactly what was added to implement the exercise on branch `exe-1.2-solution`. Follow along to understand each change and why it’s needed.

## 1) Add a new route in `src/app.ts`

- **What we changed:** We registered a new GET route for `/features`.
- **How it works:** The handler responds by sending a static HTML file named `features.html` from the `static/` directory.
- **Key code (conceptual):**
  ```ts
  this.app.get("/features", (_req, res) => {
    res.sendFile("features.html", { root: "static" });
  });
  ```
- **Why this matters:** This mirrors how the home route serves `journal.html`, reinforcing the pattern of mapping a URL path to a concrete file on disk. It also shows that you can serve targeted files alongside the broader `express.static` middleware.

## 2) Create the static page at `static/features.html`

- **What we added:** A new HTML document titled “Planned Features.”
- **Content highlights:**
  - Standard HTML5 structure with charset and viewport meta tags.
  - Links to the shared stylesheet `/styles.css` to keep styling consistent.
  - A short lead paragraph introducing the feature list.
  - An ordered list of 10 planned journal-app features (auth, CRUD entries, rich text, tags, search, reminders, offline/autosave, export, themes, sharing).
- **Inline styling:** A small block of scoped CSS improves readability (max width, spacing, typography) without altering global styles.
- **Why this matters:** Demonstrates serving real content from the `static/` directory and keeping presentation concerns in HTML/CSS instead of server logic.

## 3) How to run and verify

1. Start the server (e.g., `npm run dev` or your project’s start script).
2. Visit `http://localhost:3000/features` in the browser.
3. You should see the “Planned Features” page with the numbered list.
4. If you edit `features.html`, refresh the browser to view updates; the route always serves the file from disk.

## 4) Files touched in this solution

- `src/app.ts` — new `/features` route sending `features.html`.
- `static/features.html` — new static page with the feature list and light formatting.

## 5) Why this pattern is useful later

- Reinforces the browser–server–file flow: request → route match → file response.
- Separates static assets from application logic, making it easy to expand with more pages.
- Sets up a repeatable approach for future routes (e.g., `/about`, `/help`) without duplicating server code.
