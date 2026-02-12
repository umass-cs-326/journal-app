# Changes: 3.4-logging-and-http-method-expansion -> 3.5-results-errors-validation (Run 2026-02-12)

## Git Comparison
- Base branch: `3.4-logging-and-http-method-expansion`
- Target branch: `3.5-results-errors-validation`
- Latest target hash: `66bcd512cfdce07eedc4ce4b041056676c3f9ab1`
- Comparison range: `3.4-logging-and-http-method-expansion..3.5-results-errors-validation`

## Commits Introduced on Target
- `e682bc8` feat(result): add Result, Ok, and Err primitives
- `156fb56` feat(errors): add typed JournalError domain model
- `8cf7a77` refactor(repository): return Result from journal repository methods
- `9757b7f` feat(service): add Result-based service contracts and validation
- `cb970e8` feat(routes): validate form content at POST /entries/new boundary
- `55a65c3` refactor(controller): map Result errors with safe type narrowing
- `595bfea` refactor(logging): prepend timestamp to log output
- `90768ee` chore(deps): add ejs and express-ejs-layouts
- `d9f61ad` feat(app): configure ejs view engine and shared layouts
- `f6ef323` feat(views): add base layout and entry templates
- `28969c5` refactor(controller): render EJS templates for entry routes
- `e9e04b5` feat(controller): separate form delete redirects from api delete semantics
- `16e334a` feat(styles): modernize journal ui styling and controls
- `e3d2bd2` test(http): add lecture 3.5 validation and template route checks
- `0b95f38` refactor(ui): render home and new entry via ejs templates
- `66bcd51` fix: update dependencies

## Chapter Summary
In this run, we move from exception-style control flow to a typed `Result<T, E>` model, then add a typed `JournalError` union so every layer can communicate failures explicitly. We apply validation in multiple layers (route, service, repository, and controller mapping), then shift UI rendering from inline HTML to EJS templates with a shared base layout and refreshed CSS. We finish by adding HTTP checks aligned to the new behavior and stabilizing dependencies for TypeScript + EJS layout typings.

## Git Overview and Helpful Commands
A git hash is the unique identifier for a snapshot commit. We can use hashes to inspect exactly what changed at each step.

- Show history in compact form:
  - `git log --oneline`
- Show one commit in detail:
  - `git show <hash>`
- Compare two revisions or branches:
  - `git diff <from>..<to>`
- Move working tree to a commit for inspection:
  - `git checkout <hash>`

## Step-by-Step Timeline Walkthrough

### Step 1. Establish Typed Success/Failure Primitives
- Branch: `3.5-results-errors-validation`
- Commit: `e682bc88ecbe0bbdc621e6ee17cef74eea94aeda`
- Quick jump: `git checkout e682bc88ecbe0bbdc621e6ee17cef74eea94aeda`

We introduce a reusable result contract so services and repositories can return structured outcomes without throwing.

Before (`src/lib/result.ts`, new file):
```ts
// /dev/null
```

After (`src/lib/result.ts:1-14`):
```ts
export interface Ok<T> {
  ok: true;
  value: T;
}

export interface Err<E> {
  ok: false;
  value: E;
}

export type Result<T, E> = Ok<T> | Err<E>;
export const Ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const Err = <E>(value: E): Err<E> => ({ ok: false, value });
```

### Step 2. Model Domain Errors as Types
- Branch: `3.5-results-errors-validation`
- Commit: `156fb5688c5f784e38e80e7d5e77c3001a2f4312`
- Quick jump: `git checkout 156fb5688c5f784e38e80e7d5e77c3001a2f4312`

We add a discriminated union for journal errors so status mapping can become explicit and consistent.

Before (`src/service/errors.ts`, new file):
```ts
// /dev/null
```

After (`src/service/errors.ts:1-20`):
```ts
export type JournalError =
  | { name: "EntryNotFound"; message: string }
  | { name: "InvalidContent"; message: string }
  | { name: "ValidationError"; message: string }
  | { name: "UnexpectedDependencyError"; message: string };

export const EntryNotFound = (message: string): JournalError => ({
  name: "EntryNotFound",
  message,
});
```

### Step 3. Refactor Repository to Return `Result`
- Branch: `3.5-results-errors-validation`
- Commit: `8cf7a773e3c5645a070e4bda26e1b323c3df2db8`
- Quick jump: `git checkout 8cf7a773e3c5645a070e4bda26e1b323c3df2db8`

We replace throw/boolean patterns with typed `Ok(...)` and `Err(...)` values at the data boundary.

Before (`src/repository/JournalRespository.ts:8-15`):
```ts
export interface IJournalRepository {
  add(content: string): IJournalEntry;
  getById(id: string): IJournalEntry;
  getAll(): IJournalEntry[];
  replaceById(id: string, content: string): IJournalEntry;
  patchById(id: string, content: string): IJournalEntry;
  deleteById(id: string): boolean;
}
```

After (`src/repository/JournalRespository.ts:10-17`):
```ts
export interface IJournalRepository {
  add(content: string): Result<IJournalEntry, JournalError>;
  getById(id: string): Result<IJournalEntry, JournalError>;
  getAll(): Result<IJournalEntry[], JournalError>;
  replaceById(id: string, content: string): Result<IJournalEntry, JournalError>;
  patchById(id: string, content: string): Result<IJournalEntry, JournalError>;
  deleteById(id: string): Result<null, JournalError>;
}
```

### Step 4. Add Service-Level Validation + Result Contracts
- Branch: `3.5-results-errors-validation`
- Commit: `9757b7f6860821020b60f7cb131102c77f67acc6`
- Quick jump: `git checkout 9757b7f6860821020b60f7cb131102c77f67acc6`

We make the service responsible for core business checks and return typed failures before repository calls.

Before (`src/service/JournalService.ts:20-24`):
```ts
createEntry(content: string): IJournalEntry {
  return this.repository.add(content);
}
```

After (`src/service/JournalService.ts:21-34`):
```ts
createEntry(content: string): Result<IJournalEntry, JournalError> {
  const normalized = content.trim();

  if (!normalized) {
    return Err(InvalidContent("Entry content is required."));
  }

  if (normalized.length > 5000) {
    return Err(ValidationError("Entry content must be 5000 characters or fewer."));
  }

  return this.repository.add(normalized);
}
```

### Step 5. Validate Form Content at Route Boundary
- Branch: `3.5-results-errors-validation`
- Commit: `cb970e8a3bc76cf7deb91446a8b80e966916b7b4`
- Quick jump: `git checkout cb970e8a3bc76cf7deb91446a8b80e966916b7b4`

We reject malformed form payloads early with a clear `400` response and warning log.

Before (`src/app.ts:41-44`):
```ts
this.app.post("/entries/new", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
  const content = req.body.content;
  controller.newEntryFromForm(res, content);
});
```

After (`src/app.ts:39-52`):
```ts
this.app.post("/entries/new", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
  const raw = req.body.content;
  const content = typeof raw === "string" ? raw.trim() : "";

  if (!content) {
    this.logger.warn("POST /entries/new rejected: content missing or empty");
    res.status(400).send("Entry content is required.");
    return;
  }

  controller.newEntryFromForm(res, content);
});
```

### Step 6. Map Result Errors in Controller with Type Narrowing
- Branch: `3.5-results-errors-validation`
- Commit: `55a65c38f57e34577270d11077b046661940291c`
- Quick jump: `git checkout 55a65c38f57e34577270d11077b046661940291c`

We centralize controller-level translation from domain errors to HTTP responses.

Before (`src/controller/JournalController.ts:34-38`):
```ts
newEntryFromForm(res: Response, content: string): void {
  this.logger.info("Creating entry from form");
  this.service.createEntry(content);
  res.redirect("/");
}
```

After (`src/controller/JournalController.ts:54-78`):
```ts
newEntryFromForm(res: Response, content: string): void {
  this.logger.info("Creating entry from form");

  const result = this.service.createEntry(content);
  if (!result.ok && this.isJournalError(result.value)) {
    const error = result.value;
    if (error.name === "InvalidContent" || error.name === "ValidationError") {
      this.logger.warn(`Create entry rejected: ${error.message}`);
      res.status(400).send(error.message);
      return;
    }

    this.logger.error(`Create entry failed: ${error.message}`);
    res.status(500).send("Unable to create entry.");
    return;
  }

  if (!result.ok) {
    res.status(500).send("Unable to create entry.");
    return;
  }

  res.redirect(`/entries/${result.value.id}`);
}
```

### Step 7. Add Timestamped Logging Format
- Branch: `3.5-results-errors-validation`
- Commit: `595bfeac14be3ce2e96673c1b479377536eea540`
- Quick jump: `git checkout 595bfeac14be3ce2e96673c1b479377536eea540`

We improve operational context by stamping every log entry with ISO timestamp and level.

Before (`src/service/LoggingService.ts:9-15`):
```ts
info(message: string): void {
  console.log(`[INFO] ${message}`);
}
```

After (`src/service/LoggingService.ts:7-16`):
```ts
private stamp(level: string, message: string): string {
  return `${new Date().toISOString()} [${level}] ${message}`;
}

info(message: string): void {
  console.log(this.stamp("INFO", message));
}
```

### Step 8. Add Template Dependencies
- Branch: `3.5-results-errors-validation`
- Commit: `90768eeb1037ba19496cbd0496f8245caf7ce856`
- Quick jump: `git checkout 90768eeb1037ba19496cbd0496f8245caf7ce856`

We install template runtime and layout middleware needed for server-side rendering.

Before (`package.json:20-24`):
```json
"dependencies": {
  "express": "^5.2.1",
  "ts-node": "^10.9.2"
}
```

After (`package.json:20-26`):
```json
"dependencies": {
  "ejs": "^4.0.1",
  "express": "^5.2.1",
  "express-ejs-layouts": "^2.5.1",
  "ts-node": "^10.9.2"
}
```

### Step 9. Configure EJS and Shared Layouts in App Bootstrap
- Branch: `3.5-results-errors-validation`
- Commit: `d9f61ad030effedd8aecda8ef64e7995d5ee6769`
- Quick jump: `git checkout d9f61ad030effedd8aecda8ef64e7995d5ee6769`

We wire template rendering once in app startup so all routes can render view files consistently.

Before (`src/app.ts:25-27`):
```ts
registerMiddleware(): void {
  this.app.use(express.static("static"));
}
```

After (`src/app.ts:22-33`):
```ts
registerMiddleware(): void {
  this.app.use(express.static("static"));
  this.app.use(Layouts);
}

registerTemplating(): void {
  this.app.set("view engine", "ejs");
  this.app.set("views", path.join(process.cwd(), "views"));
  this.app.set("layout", "layouts/base");
}
```

### Step 10. Introduce View Templates and Base Layout
- Branch: `3.5-results-errors-validation`
- Commit: `f6ef3236455ff4c76b347d0f5d41db019334c686`
- Quick jump: `git checkout f6ef3236455ff4c76b347d0f5d41db019334c686`

We create reusable templates for home, entry flows, and not-found states under one layout.

Before (`views/layouts/base.ejs`, new file):
```html
<!-- /dev/null -->
```

After (`views/layouts/base.ejs:1-17`):
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Journal App</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <nav class="main-nav">
      <a href="/">Home</a>
      <a href="/entries">Entries</a>
      <a href="/entries/new">New Entry</a>
    </nav>
    <main><%- body %></main>
  </body>
</html>
```

### Step 11. Replace Inline HTML Responses with `res.render(...)`
- Branch: `3.5-results-errors-validation`
- Commit: `28969c565304624eada496ebc6af141010e82d33`
- Quick jump: `git checkout 28969c565304624eada496ebc6af141010e82d33`

We move controller output to templates, which reduces string-concatenation HTML and improves maintainability.

Before (`src/controller/JournalController.ts:84-91`):
```ts
const entries = result.value;
let html = "<h1>All Journal Entries</h1><ul>";
for (const entry of entries) {
  html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
}
html += "</ul>";
res.send(html);
```

After (`src/controller/JournalController.ts:80-91`):
```ts
if (!result.ok) {
  if (this.isJournalError(result.value)) {
    res.status(500).render("entries/not-found", { message: result.value.message });
  } else {
    res.status(500).render("entries/not-found", { message: "Unable to list entries" });
  }
  return;
}

res.render("entries/index", { entries: result.value });
```

### Step 12. Split Form Delete Flow from API Delete Semantics
- Branch: `3.5-results-errors-validation`
- Commit: `e9e04b50916b31fc6f92c5beb8b7a044ad9644ee`
- Quick jump: `git checkout e9e04b50916b31fc6f92c5beb8b7a044ad9644ee`

We preserve API-style delete behavior while giving form flow a redirect-friendly handler.

Before (`src/app.ts:81`):
```ts
this.controller.deleteEntry(res, id);
```

After (`src/app.ts:81`):
```ts
this.controller.deleteEntryFromForm(res, id);
```

Before (`src/controller/JournalController.ts`, method absent):
```ts
// no deleteEntryFromForm method
```

After (`src/controller/JournalController.ts:172-193`):
```ts
deleteEntryFromForm(res: Response, id: string): void {
  this.logger.info(`Deleting entry ${id} from form`);
  const result = this.service.deleteEntry(id);
  if (!result.ok && this.isJournalError(result.value) && result.value.name === "EntryNotFound") {
    res.status(404).render("entries/not-found", { id, error: result.value });
    return;
  }
  if (!result.ok) {
    res.status(500).render("entries/not-found", { id, message: "Unable to delete entry" });
    return;
  }
  res.redirect("/entries");
}
```

### Step 13. Modernize CSS for App-Like Experience
- Branch: `3.5-results-errors-validation`
- Commit: `16e334a6fe6183e33874ae22da447c16e35abb4d`
- Quick jump: `git checkout 16e334a6fe6183e33874ae22da447c16e35abb4d`

We replace the neon demo style with cleaner spacing, typography, navigation, and button treatment.

Before (`static/styles.css:1-10`):
```css
body {
  margin: 0;
  padding: 40px;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #0b0f1a;
  color: #e6f1ff;
}
```

After (`static/styles.css:1-14`):
```css
body {
  margin: 0;
  padding: 24px;
  font-family: "Segoe UI", Arial, sans-serif;
  background: #f5f7fb;
  color: #1f2937;
}

main {
  max-width: 920px;
  margin: 0 auto;
}
```

### Step 14. Add Focused HTTP Regression Checks
- Branch: `3.5-results-errors-validation`
- Commit: `e3d2bd2af65ddd1110bc53f1e7ceb6acaf2f88d8`
- Quick jump: `git checkout e3d2bd2af65ddd1110bc53f1e7ceb6acaf2f88d8`

We add a lecture-specific `.http` script to validate template render behavior and 400-level validation responses.

Before (`test/3.5.http`, new file):
```http
# /dev/null
```

After (`test/3.5.http:1-14`):
```http
### Seed entry
POST http://localhost:3000/entries/new
Content-Type: application/x-www-form-urlencoded

content=First+entry

### Verify template-rendered page
GET http://localhost:3000/entries/1

### Verify validation failure maps to 400
POST http://localhost:3000/entries/new
Content-Type: application/x-www-form-urlencoded

content=
```

### Step 15. Improve Home Template Guidance Text
- Branch: `3.5-results-errors-validation`
- Commit: `0b95f38b0796485dd6e660967edfd0cf4374464c`
- Quick jump: `git checkout 0b95f38b0796485dd6e660967edfd0cf4374464c`

We make home-page intent clearer so navigation affordances are obvious in the rendered UI.

Before (`views/home.ejs:1-4`):
```html
<h1>Welcome to the Journal App!</h1>
<p>This is the starting point of our Journal Application.</p>
<ul>
```

After (`views/home.ejs:1-5`):
```html
<h1>Welcome to the Journal App!</h1>
<p>This is the starting point of our Journal Application.</p>
<p>Use the navigation links to create, browse, edit, and delete journal entries.</p>
<ul>
```

### Step 16. Final Dependency Typing Fix for Layout Middleware
- Branch: `3.5-results-errors-validation`
- Commit: `66bcd512cfdce07eedc4ce4b041056676c3f9ab1`
- Quick jump: `git checkout 66bcd512cfdce07eedc4ce4b041056676c3f9ab1`

We finish by adding missing type definitions to keep TypeScript dependency state aligned with EJS layout usage.

Before (`package.json:26-29`):
```json
"devDependencies": {
  "@types/express": "^5.0.6"
}
```

After (`package.json:26-30`):
```json
"devDependencies": {
  "@types/express": "^5.0.6",
  "@types/express-ejs-layouts": "^2.5.4"
}
```

## Conclusion
This sequence intentionally layers reliability and clarity: typed results, typed domain errors, boundary validation, and explicit error mapping first; then template architecture, UI polish, and focused tests. The tradeoff is a bit more boilerplate in each layer, but we gain predictable behavior, cleaner controller logic, and a codebase that scales better for future features.
