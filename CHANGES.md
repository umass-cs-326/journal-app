# Changes: 2.2-posting-and-retrieving-journal-entries → 3.4-logging-and-http-method-expansion (Run 2026-02-10)

This document summarizes the differences between the `2.2-posting-and-retrieving-journal-entries` branch and the latest commit on the `3.4-logging-and-http-method-expansion` branch, presented as a step-by-step tutorial timeline written in a “we” voice.

## Git comparison info

- Base branch: `2.2-posting-and-retrieving-journal-entries`
- Target branch: `3.4-logging-and-http-method-expansion`
- Latest target commit: `d87cbb9b4e8779776554d014930b5c56c4fb161c`
- Comparison range (git): `2.2-posting-and-retrieving-journal-entries..3.4-logging-and-http-method-expansion`

## Commit(s) introduced on 3.4-logging-and-http-method-expansion

- `84c7ca54c47c594017a57fe9219a68511781d2d3` — Refactor route handlers in ExpressApp to use controller directly
- `a88214f398ac94dd72a5fdf68b3e09cfb2c6cb8c` — Add singleton logging service abstraction
- `d3fb8316ce9b12076fec7163b8dd353102904a5a` — Inject shared logger into app and server
- `703d4aed070610dcebdc31916ad6e7939dee23c7` — Inject logger into controller and baseline logs
- `403addc6c259ac9f3bd9a099c9abd3c1a2670cbe` — Add app-level route logging checkpoints
- `42714dc3e9e42406e87fff9923c0b55b1fb1d54d` — Add baseline REST Client script entries
- `d6a8904ffaf579cb9dea7677550d747fbc2a7f5d` — Add PUT internals in repository and service
- `18d09a564aafa0ba9ac6feab6ce488c21410177e` — Add controller action for PUT replacement
- `4d348f3a52b764d2ecf7c0f44e45ce1eef5635f6` — Add PUT route and end-to-end verification
- `ad396e35e48d4c4073332cd119896c4fac6cc787` — Add PATCH internals in repository and service
- `0e70e3a962b5f6eb04128569537606fa2a035f3c` — Add controller action for PATCH updates
- `0896eaea743d47e779ab418dc1eb1dff0d59c6dd` — Add PATCH route and end-to-end verification
- `bb42d398a3f8eab1cdc0ea4744811df9f46523ad` — Add DELETE internals in repository and service
- `87c948c2a335ddadc028ef2728a2d7c56ae33dc9` — Add controller delete action behavior
- `c8ecd9276b3991145544193addaa58f717cbca99` — Add DELETE route and end-to-end verification
- `ae0a572236528ed345ba44ecb82097ec0eb67c6a` — Add controller support for edit form feature
- `db7833d3fe466a0ae982be847790b4ee25d6e531` — Add GET edit route with immediate test
- `3dae8dc28ea14cd55d465d3ba46269e17c3a4c65` — Add controller action for edit form submit
- `a309243bb4f1e80bc925fa2980f1dab8f8099eb9` — Add POST edit route with immediate test
- `198f9c16ef128ed866be90cf013eaa4258b1f5dc` — Add entry-page edit link with test checkpoint
- `af0d8ced0e6701ef2a93dcf5cfdc83f95a8f01d2` — Add form-compatible POST delete route
- `1d4c700665521da58eed220c66190e883ceafe29` — Add entry-page delete form with test check
- `e4a3531e9b266a686b6bcde77e9bf408059cf305` — Add home navigation links with test check
- `48aa24f4abe3c09953e5d7502e0f47a714f61bec` — Add method-contrast notes to HTTP script
- `d87cbb9b4e8779776554d014930b5c56c4fb161c` — Finalize isolated feature-by-feature test flow

## Summary of changes

We start by tightening how the app wires controllers and logging so we can narrate each route and action with clear, shared instrumentation. Next we expand the journal API to support PUT, PATCH, and DELETE from repository to controller to routing, while adding incremental REST Client checkpoints at every stage. Finally we round out the UI flow with edit and delete forms, home-page navigation links, and a carefully ordered HTTP script that teaches method constraints and verification habits.

## Git overview and help

### What is a git hash?

A git hash (also called a commit hash) is a unique identifier for a specific commit in a Git repository. It looks like a long string of hexadecimal characters, such as:

```
84c7ca54c47c594017a57fe9219a68511781d2d3
```

We can use a commit hash to view or check out an exact version of the code:

```bash
git show 84c7ca54c47c594017a57fe9219a68511781d2d3
git checkout 84c7ca54c47c594017a57fe9219a68511781d2d3
```

### Git help for students

We can use these commands to explore the timeline and switch between commits.

```bash
# Show the commit history in a compact form
git log --oneline

# View what changed in a specific commit
git show 84c7ca54c47c594017a57fe9219a68511781d2d3

# Compare two commits (older..newer)
git diff <older-hash>..<newer-hash>

# Switch to an exact commit (detached HEAD)
git checkout 84c7ca54c47c594017a57fe9219a68511781d2d3

# Return to a branch after exploring a commit
git checkout 3.4-logging-and-http-method-expansion
```

Notes for students:
- A git hash uniquely identifies a commit; short hashes also work in most cases.
- When we `checkout` a hash, we are in “detached HEAD” mode. This is safe for viewing old versions, but we should return to a branch when done.

## Step-by-step walkthrough of additions and changes

### Step 1: Direct Lines — Commit timeline: 2.2-posting-and-retrieving-journal-entries @ c6d3de9cc510cc83b21b7c9683800520df4dde88 → 3.4-logging-and-http-method-expansion @ 84c7ca54c47c594017a57fe9219a68511781d2d3

Quick jump: `git checkout 84c7ca54c47c594017a57fe9219a68511781d2d3`

We simplify route handler wiring by calling controller methods directly, reducing extra closures and clarifying intent.

**Before (c6d3de9) — File:** `src/app.ts` (lines 29–62)
```ts
    29	  registerRoutes(): void {
    30	    // Required because of how 'this' works in JS/TS
    31	    const showHome = (res: Response) => this.controller.showHome(res);
    32	    const showEntryForm = (res: Response) => this.controller.showEntryForm(res);
    33	    const newEntryFromForm = (res: Response, content: string) =>
    34	      this.controller.newEntryFromForm(res, content);
    35	    const showAllEntries = (res: Response) => this.controller.showAllEntries(res);
    36	    const showEntry = (res: Response, id: string) =>
    37	      this.controller.showEntry(res, id);
    38	
    39	    // Home route serving a simple HTML page
    40	    this.app.get("/", (_req: Request, res: Response) => showHome(res));
    41	
    42	    // Route to show the form for a new journal entry
    43	    this.app.get("/entries/new", (_req: Request, res: Response) =>
    44	      showEntryForm(res)
    45	    );
    46	
    47	    // Route to handle form submission for a new journal entry
    48	    this.app.post("/entries/new", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
    49	      const content = req.body.content;
    50	      newEntryFromForm(res, content);
    51	    });
    52	
    53	    // Route to show all journal entries
    54	    this.app.get("/entries", (_req: Request, res: Response) =>
    55	      showAllEntries(res)
    56	    );
    57	
    58	    // Route to show a specific journal entry by ID
    59	    this.app.get("/entries/:id", (req: Request, res: Response) => {
    60	      const id = req.params.id as string;
    61	      showEntry(res, id);
    62	    });
```

**After (84c7ca5) — File:** `src/app.ts` (lines 29–55)
```ts
    29	  registerRoutes(): void {
    30	    const controller = this.controller;
    31	
    32	    // Home route serving a simple HTML page
    33	    this.app.get("/", (_req: Request, res: Response) => controller.showHome(res));
    34	
    35	    // Route to show the form for a new journal entry
    36	    this.app.get("/entries/new", (_req: Request, res: Response) =>
    37	      controller.showEntryForm(res)
    38	    );
    39	
    40	    // Route to handle form submission for a new journal entry
    41	    this.app.post("/entries/new", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
    42	      const content = req.body.content;
    43	      controller.newEntryFromForm(res, content);
    44	    });
    45	
    46	    // Route to show all journal entries
    47	    this.app.get("/entries", (_req: Request, res: Response) =>
    48	      controller.showAllEntries(res)
    49	    );
    50	
    51	    // Route to show a specific journal entry by ID
    52	    this.app.get("/entries/:id", (req: Request, res: Response) => {
    53	      const id = req.params.id as string;
    54	      controller.showEntry(res, id);
    55	    });
```

### Step 2: One Logger to Rule — Commit timeline: 3.4-logging-and-http-method-expansion @ 84c7ca54c47c594017a57fe9219a68511781d2d3 → 3.4-logging-and-http-method-expansion @ a88214f398ac94dd72a5fdf68b3e09cfb2c6cb8c

Quick jump: `git checkout a88214f398ac94dd72a5fdf68b3e09cfb2c6cb8c`

We introduce a shared logging service and a first REST Client checkpoint to make upcoming features observable.

**After (a88214f) — File:** `src/service/LoggingService.ts` (lines 1–28)
```ts
     1	export interface ILoggingService {
     2	  info(message: string): void;
     3	  warn(message: string): void;
     4	  error(message: string): void;
     5	}
     6	
     7	class LoggingService implements ILoggingService {
     8	  info(message: string): void {
     9	    console.log(`[INFO] ${message}`);
    10	  }
    11	
    12	  warn(message: string): void {
    13	    console.warn(`[WARN] ${message}`);
    14	  }
    15	
    16	  error(message: string): void {
    17	    console.error(`[ERROR] ${message}`);
    18	  }
    19	}
    20	
    21	let loggingServiceInstance: ILoggingService | null = null;
    22	
    23	export function CreateLoggingService(): ILoggingService {
    24	  if (loggingServiceInstance === null) {
    25	    loggingServiceInstance = new LoggingService();
    26	  }
    27	  return loggingServiceInstance;
    28	}
```

**After (a88214f) — File:** `test/journal.http` (lines 1–2)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
```

### Step 3: Thread the Logger — Commit timeline: 3.4-logging-and-http-method-expansion @ a88214f398ac94dd72a5fdf68b3e09cfb2c6cb8c → 3.4-logging-and-http-method-expansion @ d3fb8316ce9b12076fec7163b8dd353102904a5a

Quick jump: `git checkout d3fb8316ce9b12076fec7163b8dd353102904a5a`

We pass the shared logger into the app and server composition root so the same instance can power route and controller logs.

**Before (a88214f) — File:** `src/app.ts` (lines 1–20)
```ts
     1	import { IApp } from "./contracts";
     2	import express, { response } from "express";
     3	// We need these types to type our route handlers
     4	import { Request, Response } from "express";
     5	import { IJournalController } from './controller/JournalController';
     6	
     7	/**
     8	 * ExpressApp implements IApp.
     9	 *
    10	 * This file is the "composition root" for the application:
    11	 * we create our objects and wire dependencies together here.
    12	 */
    13	export class ExpressApp implements IApp {
    14	  private readonly app: express.Express;
    15	
    16	  constructor(private readonly controller: IJournalController) {
    17	    this.app = express();
    18	    // Register middleware and routes
    19	    this.registerMiddleware();
    20	    this.registerRoutes();
```

**After (d3fb831) — File:** `src/app.ts` (lines 1–20)
```ts
     1	import { IApp } from "./contracts";
     2	import express, { response } from "express";
     3	// We need these types to type our route handlers
     4	import { Request, Response } from "express";
     5	import { IJournalController } from './controller/JournalController';
     6	import { ILoggingService } from "./service/LoggingService";
     7	
     8	/**
     9	 * ExpressApp implements IApp.
    10	 *
    11	 * This file is the "composition root" for the application:
    12	 * we create our objects and wire dependencies together here.
    13	 */
    14	export class ExpressApp implements IApp {
    15	  private readonly app: express.Express;
    16	
    17	  constructor(
    18	    private readonly controller: IJournalController,
    19	    private readonly logger: ILoggingService
    20	  ) {
```

**Before (a88214f) — File:** `src/app.ts` (lines 67–69)
```ts
    67	export const CreateApp = 
    68	  (controller: IJournalController): ExpressApp => 
    69	    new ExpressApp(controller);
```

**After (d3fb831) — File:** `src/app.ts` (lines 71–73)
```ts
    71	export const CreateApp = 
    72	  (controller: IJournalController, logger: ILoggingService): ExpressApp => 
    73	    new ExpressApp(controller, logger);
```

**Before (a88214f) — File:** `src/server.ts` (lines 30–34)
```ts
    30	// Now we compose the application and start the server.
    31	const repository = CreateJournalRepository();
    32	const service = CreateJournalService(repository);
    33	const controller = CreateJournalController(service);
    34	const app = CreateApp(controller);
```

**After (d3fb831) — File:** `src/server.ts` (lines 31–36)
```ts
    31	// Now we compose the application and start the server.
    32	const repository = CreateJournalRepository();
    33	const service = CreateJournalService(repository);
    34	const logger = CreateLoggingService();
    35	const controller = CreateJournalController(service, logger);
    36	const app = CreateApp(controller, logger);
```

**Before (a88214f) — File:** `test/journal.http` (lines 1–2)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
```

**After (d3fb831) — File:** `test/journal.http` (lines 1–5)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
     3	
     4	### Step 2 checkpoint: app still boots and serves entries
     5	GET http://localhost:3000/entries
```

### Step 4: Controller Narration — Commit timeline: 3.4-logging-and-http-method-expansion @ d3fb8316ce9b12076fec7163b8dd353102904a5a → 3.4-logging-and-http-method-expansion @ 703d4aed070610dcebdc31916ad6e7939dee23c7

Quick jump: `git checkout 703d4aed070610dcebdc31916ad6e7939dee23c7`

We plug the logger into the controller and add baseline log statements for every existing action.

**Before (d3fb831) — File:** `src/controller/JournalController.ts` (lines 1–45)
```ts
     1	import type { Response } from 'express';
     2	import { IJournalService } from '../service/JournalService';
     3	
     4	export interface IJournalController {
     5	  showHome(res: Response): void;
     6	  showEntryForm(res: Response): void;
     7	  newEntryFromForm(res: Response, content: string): void;
     8	  showAllEntries(res: Response): void;
     9	  showEntry(res: Response, id: string): void;
    10	}
    11	
    12	class JournalController implements IJournalController {
    13	  constructor(private readonly service: IJournalService) {}
    14	
    15	  showHome(res: Response): void {
    16	    res.sendFile("journal.html", { root: "static" });
    17	  }
    18	
    19	  showEntryForm(res: Response): void {
    20	    res.sendFile("entry-form.html", { root: "static" });
    21	  }
    22	
    23	  newEntryFromForm(res: Response, content: string): void {
    24	    this.service.createEntry(content);
    25	    res.redirect("/");
    26	  }
    27	
    28	  showAllEntries(res: Response): void {
    29	    const entries = this.service.getEntries();
    30	    let html = "<h1>All Journal Entries</h1><ul>";
    31	    for (const entry of entries) {
    32	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    33	    }
    34	    html += "</ul>";
    35	    res.send(html);
    36	  }
    37	
    38	  showEntry(res: Response, id: string): void {
    39	    let html = "<h1>Journal Entry Not Found</h1>";
    40	    const entry = this.service.getEntry(id);
    41	    if (entry) {
    42	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    43	    }
    44	    res.send(html);
    45	  }
```

**After (703d4ae) — File:** `src/controller/JournalController.ts` (lines 1–54)
```ts
     1	import type { Response } from 'express';
     2	import { IJournalService } from '../service/JournalService';
     3	import { ILoggingService } from "../service/LoggingService";
     4	
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	}
    12	
    13	class JournalController implements IJournalController {
    14	  constructor(
    15	    private readonly service: IJournalService,
    16	    private readonly logger: ILoggingService
    17	  ) {}
    18	
    19	  showHome(res: Response): void {
    20	    this.logger.info("Rendering home page");
    21	    res.sendFile("journal.html", { root: "static" });
    22	  }
    23	
    24	  showEntryForm(res: Response): void {
    25	    this.logger.info("Rendering new entry form");
    26	    res.sendFile("entry-form.html", { root: "static" });
    27	  }
    28	
    29	  newEntryFromForm(res: Response, content: string): void {
    30	    this.logger.info("Creating entry from form");
    31	    this.service.createEntry(content);
    32	    res.redirect("/");
    33	  }
    34	
    35	  showAllEntries(res: Response): void {
    36	    this.logger.info("Listing all journal entries");
    37	    const entries = this.service.getEntries();
    38	    let html = "<h1>All Journal Entries</h1><ul>";
    39	    for (const entry of entries) {
    40	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    41	    }
    42	    html += "</ul>";
    43	    res.send(html);
    44	  }
    45	
    46	  showEntry(res: Response, id: string): void {
    47	    this.logger.info(`Showing entry ${id}`);
    48	    let html = "<h1>Journal Entry Not Found</h1>";
    49	    const entry = this.service.getEntry(id);
    50	    if (entry) {
    51	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    52	    }
    53	    res.send(html);
    54	  }
```

**Before (d3fb831) — File:** `test/journal.http` (lines 1–5)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
     3	
     4	### Step 2 checkpoint: app still boots and serves entries
     5	GET http://localhost:3000/entries
```

**After (703d4ae) — File:** `test/journal.http` (lines 1–8)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
     3	
     4	### Step 2 checkpoint: app still boots and serves entries
     5	GET http://localhost:3000/entries
     6	
     7	### Step 3 checkpoint: create form route still loads
     8	GET http://localhost:3000/entries/new
```

### Step 5: Route Beacons — Commit timeline: 3.4-logging-and-http-method-expansion @ 703d4aed070610dcebdc31916ad6e7939dee23c7 → 3.4-logging-and-http-method-expansion @ 403addc6c259ac9f3bd9a099c9abd3c1a2670cbe

Quick jump: `git checkout 403addc6c259ac9f3bd9a099c9abd3c1a2670cbe`

We add a route-level log statement to spotlight incoming requests before the new methods arrive.

**Before (703d4ae) — File:** `src/app.ts` (lines 33–38)
```ts
    33	  registerRoutes(): void {
    34	    const controller = this.controller;
    35	
    36	    // Home route serving a simple HTML page
    37	    this.app.get("/", (_req: Request, res: Response) => controller.showHome(res));
```

**After (403addc) — File:** `src/app.ts` (lines 33–40)
```ts
    33	  registerRoutes(): void {
    34	    const controller = this.controller;
    35	
    36	    // Home route serving a simple HTML page
    37	    this.app.get("/", (_req: Request, res: Response) => {
    38	      this.logger.info("GET /");
    39	      this.controller.showHome(res);
    40	    });
```

**Before (703d4ae) — File:** `test/journal.http` (lines 1–8)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
     3	
     4	### Step 2 checkpoint: app still boots and serves entries
     5	GET http://localhost:3000/entries
     6	
     7	### Step 3 checkpoint: create form route still loads
     8	GET http://localhost:3000/entries/new
```

**After (403addc) — File:** `test/journal.http` (lines 1–11)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
     3	
     4	### Step 2 checkpoint: app still boots and serves entries
     5	GET http://localhost:3000/entries
     6	
     7	### Step 3 checkpoint: create form route still loads
     8	GET http://localhost:3000/entries/new
     9	
    10	### Step 4 checkpoint: route-level logging observable
    11	GET http://localhost:3000/
```

### Step 6: Baseline Script — Commit timeline: 3.4-logging-and-http-method-expansion @ 403addc6c259ac9f3bd9a099c9abd3c1a2670cbe → 3.4-logging-and-http-method-expansion @ 42714dc3e9e42406e87fff9923c0b55b1fb1d54d

Quick jump: `git checkout 42714dc3e9e42406e87fff9923c0b55b1fb1d54d`

We reorganize the REST Client file into a stable baseline sequence so new method steps can be layered on safely.

**Before (403addc) — File:** `test/journal.http` (lines 1–11)
```http
     1	### Step 1 checkpoint: baseline home still loads
     2	GET http://localhost:3000/
     3	
     4	### Step 2 checkpoint: app still boots and serves entries
     5	GET http://localhost:3000/entries
     6	
     7	### Step 3 checkpoint: create form route still loads
     8	GET http://localhost:3000/entries/new
     9	
    10	### Step 4 checkpoint: route-level logging observable
    11	GET http://localhost:3000/
```

**After (42714dc) — File:** `test/journal.http` (lines 1–11)
```http
     1	### Step 5 baseline: home
     2	GET http://localhost:3000/
     3	
     4	### Step 5 baseline: list entries
     5	GET http://localhost:3000/entries
     6	
     7	### Step 5 baseline: create entry (form route)
     8	POST http://localhost:3000/entries/new
     9	Content-Type: application/x-www-form-urlencoded
    10	
    11	content=Baseline+entry
```

### Step 7: Replace Internals — Commit timeline: 3.4-logging-and-http-method-expansion @ 42714dc3e9e42406e87fff9923c0b55b1fb1d54d → 3.4-logging-and-http-method-expansion @ d6a8904ffaf579cb9dea7677550d747fbc2a7f5d

Quick jump: `git checkout d6a8904ffaf579cb9dea7677550d747fbc2a7f5d`

We teach the repository and service how to replace entries by id, laying groundwork for the PUT route.

**Before (42714dc) — File:** `src/repository/JournalRespository.ts` (lines 9–36)
```ts
     9	export interface IJournalRepository {
    10	  add(content: string): IJournalEntry;
    11	  getById(id: string): IJournalEntry;
    12	  getAll(): IJournalEntry[];
    13	}
    14	
    15	class JournalRepository implements IJournalRepository {
    16	  private entries: IJournalEntry[] = [];
    17	  private nextId = 1;
    18	
    19	  add(content: string): IJournalEntry {
    20	    const entry = createJournalEntry(String(this.nextId++), content);
    21	    this.entries.push(entry);
    22	    return entry;
    23	  }
    24	
    25	  getById(id: string): IJournalEntry {
    26	    const found = this.entries.find(entry => entry.id === id);
    27	    // We are going to make this better in a later lecture.
    28	    if (!found) {
    29	      throw new Error(`Journal entry with id ${id} not found`);
    30	    }
    31	    return found;
    32	  }
    33	
    34	  getAll(): IJournalEntry[] {
    35	    return this.entries;
    36	  }
```

**After (d6a8904) — File:** `src/repository/JournalRespository.ts` (lines 9–48)
```ts
     9	export interface IJournalRepository {
    10	  add(content: string): IJournalEntry;
    11	  getById(id: string): IJournalEntry;
    12	  getAll(): IJournalEntry[];
    13	  replaceById(id: string, content: string): IJournalEntry;
    14	}
    15	
    16	class JournalRepository implements IJournalRepository {
    17	  private entries: IJournalEntry[] = [];
    18	  private nextId = 1;
    19	
    20	  add(content: string): IJournalEntry {
    21	    const entry = createJournalEntry(String(this.nextId++), content);
    22	    this.entries.push(entry);
    23	    return entry;
    24	  }
    25	
    26	  getById(id: string): IJournalEntry {
    27	    const found = this.entries.find(entry => entry.id === id);
    28	    // We are going to make this better in a later lecture.
    29	    if (!found) {
    30	      throw new Error(`Journal entry with id ${id} not found`);
    31	    }
    32	    return found;
    33	  }
    34	
    35	  getAll(): IJournalEntry[] {
    36	    return this.entries;
    37	  }
    38	
    39	  replaceById(id: string, content: string): IJournalEntry {
    40	    for (let i = 0; i < this.entries.length; i += 1) {
    41	      if (this.entries[i].id === id) {
    42	        this.entries[i].content = content;
    43	        this.entries[i].updatedAt = new Date();
    44	        return this.entries[i];
    45	      }
    46	    }
    47	    throw new Error(`Journal entry with id ${id} not found`);
    48	  }
```

**Before (42714dc) — File:** `src/service/JournalService.ts` (lines 10–29)
```ts
    10	export interface IJournalService {
    11	  createEntry(content: string): IJournalEntry;
    12	  getEntry(id: string): IJournalEntry;
    13	  getEntries(): IJournalEntry[];
    14	}
    15	
    16	class JournalService implements IJournalService {
    17	  constructor(private readonly repository: IJournalRepository) {}
    18	
    19	  createEntry(content: string): IJournalEntry {
    20	    return this.repository.add(content);
    21	  }
    22	
    23	  getEntry(id: string): IJournalEntry {
    24	    return this.repository.getById(id);
    25	  }
    26	
    27	  getEntries(): IJournalEntry[] {
    28	    return this.repository.getAll();
    29	  }
```

**After (d6a8904) — File:** `src/service/JournalService.ts` (lines 10–35)
```ts
    10	export interface IJournalService {
    11	  createEntry(content: string): IJournalEntry;
    12	  getEntry(id: string): IJournalEntry;
    13	  getEntries(): IJournalEntry[];
    14	  replaceEntry(id: string, content: string): IJournalEntry;
    15	}
    16	
    17	class JournalService implements IJournalService {
    18	  constructor(private readonly repository: IJournalRepository) {}
    19	
    20	  createEntry(content: string): IJournalEntry {
    21	    return this.repository.add(content);
    22	  }
    23	
    24	  getEntry(id: string): IJournalEntry {
    25	    return this.repository.getById(id);
    26	  }
    27	
    28	  getEntries(): IJournalEntry[] {
    29	    return this.repository.getAll();
    30	  }
    31	
    32	  replaceEntry(id: string, content: string): IJournalEntry {
    33	    return this.repository.replaceById(id, content);
    34	  }
    35	}
```

**Before (42714dc) — File:** `test/journal.http` (lines 7–11)
```http
     7	### Step 5 baseline: create entry (form route)
     8	POST http://localhost:3000/entries/new
     9	Content-Type: application/x-www-form-urlencoded
    10	
    11	content=Baseline+entry
```

**After (d6a8904) — File:** `test/journal.http` (lines 7–14)
```http
     7	### Step 5 baseline: create entry (form route)
     8	POST http://localhost:3000/entries/new
     9	Content-Type: application/x-www-form-urlencoded
    10	
    11	content=Baseline+entry
    12	
    13	### Step 6 checkpoint: existing GET still works after PUT internals
    14	GET http://localhost:3000/entries/1
```

### Step 8: Controller Replace Hook — Commit timeline: 3.4-logging-and-http-method-expansion @ d6a8904ffaf579cb9dea7677550d747fbc2a7f5d → 3.4-logging-and-http-method-expansion @ 18d09a564aafa0ba9ac6feab6ce488c21410177e

Quick jump: `git checkout 18d09a564aafa0ba9ac6feab6ce488c21410177e`

We add a controller method that invokes the replace logic and returns JSON updates.

**Before (d6a8904) — File:** `src/controller/JournalController.ts` (lines 5–55)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	}
    12	
    13	class JournalController implements IJournalController {
    14	  constructor(
    15	    private readonly service: IJournalService,
    16	    private readonly logger: ILoggingService
    17	  ) {}
    18	
    19	  showHome(res: Response): void {
    20	    this.logger.info("Rendering home page");
    21	    res.sendFile("journal.html", { root: "static" });
    22	  }
    23	
    24	  showEntryForm(res: Response): void {
    25	    this.logger.info("Rendering new entry form");
    26	    res.sendFile("entry-form.html", { root: "static" });
    27	  }
    28	
    29	  newEntryFromForm(res: Response, content: string): void {
    30	    this.logger.info("Creating entry from form");
    31	    this.service.createEntry(content);
    32	    res.redirect("/");
    33	  }
    34	
    35	  showAllEntries(res: Response): void {
    36	    this.logger.info("Listing all journal entries");
    37	    const entries = this.service.getEntries();
    38	    let html = "<h1>All Journal Entries</h1><ul>";
    39	    for (const entry of entries) {
    40	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    41	    }
    42	    html += "</ul>";
    43	    res.send(html);
    44	  }
    45	
    46	  showEntry(res: Response, id: string): void {
    47	    this.logger.info(`Showing entry ${id}`);
    48	    let html = "<h1>Journal Entry Not Found</h1>";
    49	    const entry = this.service.getEntry(id);
    50	    if (entry) {
    51	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    52	    }
    53	    res.send(html);
    54	  }
    55	}
```

**After (18d09a5) — File:** `src/controller/JournalController.ts` (lines 5–61)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	  replaceEntry(res: Response, id: string, content: string): void;
    12	}
    13	
    14	class JournalController implements IJournalController {
    15	  constructor(
    16	    private readonly service: IJournalService,
    17	    private readonly logger: ILoggingService
    18	  ) {}
    19	
    20	  showHome(res: Response): void {
    21	    this.logger.info("Rendering home page");
    22	    res.sendFile("journal.html", { root: "static" });
    23	  }
    24	
    25	  showEntryForm(res: Response): void {
    26	    this.logger.info("Rendering new entry form");
    27	    res.sendFile("entry-form.html", { root: "static" });
    28	  }
    29	
    30	  newEntryFromForm(res: Response, content: string): void {
    31	    this.logger.info("Creating entry from form");
    32	    this.service.createEntry(content);
    33	    res.redirect("/");
    34	  }
    35	
    36	  showAllEntries(res: Response): void {
    37	    this.logger.info("Listing all journal entries");
    38	    const entries = this.service.getEntries();
    39	    let html = "<h1>All Journal Entries</h1><ul>";
    40	    for (const entry of entries) {
    41	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    42	    }
    43	    html += "</ul>";
    44	    res.send(html);
    45	  }
    46	
    47	  showEntry(res: Response, id: string): void {
    48	    this.logger.info(`Showing entry ${id}`);
    49	    let html = "<h1>Journal Entry Not Found</h1>";
    50	    const entry = this.service.getEntry(id);
    51	    if (entry) {
    52	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    53	    }
    54	    res.send(html);
    55	  }
    56	
    57	  replaceEntry(res: Response, id: string, content: string): void {
    58	    this.logger.info(`Replacing entry ${id} via PUT`);
    59	    const updated = this.service.replaceEntry(id, content);
    60	    res.json(updated);
    61	  }
```

**Before (d6a8904) — File:** `test/journal.http` (lines 13–14)
```http
    13	### Step 6 checkpoint: existing GET still works after PUT internals
    14	GET http://localhost:3000/entries/1
```

**After (18d09a5) — File:** `test/journal.http` (lines 13–17)
```http
    13	### Step 6 checkpoint: existing GET still works after PUT internals
    14	GET http://localhost:3000/entries/1
    15	
    16	### Step 7 checkpoint: existing list still works after PUT controller
    17	GET http://localhost:3000/entries
```

### Step 9: PUT Route Online — Commit timeline: 3.4-logging-and-http-method-expansion @ 18d09a564aafa0ba9ac6feab6ce488c21410177e → 3.4-logging-and-http-method-expansion @ 4d348f3a52b764d2ecf7c0f44e45ce1eef5635f6

Quick jump: `git checkout 4d348f3a52b764d2ecf7c0f44e45ce1eef5635f6`

We expose the PUT endpoint and add a full-stack verification request.

**Before (18d09a5) — File:** `src/app.ts` (lines 58–62)
```ts
    58	    // Route to show a specific journal entry by ID
    59	    this.app.get("/entries/:id", (req: Request, res: Response) => {
    60	      const id = req.params.id as string;
    61	      controller.showEntry(res, id);
    62	    });
```

**After (4d348f3) — File:** `src/app.ts` (lines 58–69)
```ts
    58	    // Route to show a specific journal entry by ID
    59	    this.app.get("/entries/:id", (req: Request, res: Response) => {
    60	      const id = req.params.id as string;
    61	      controller.showEntry(res, id);
    62	    });
    63	
    64	    this.app.put("/api/entries/:id", express.json(), (req, res) => {
    65	      this.logger.info(`PUT /api/entries/${req.params.id}`);
    66	      const id = req.params.id as string;
    67	      const content = req.body.content as string;
    68	      this.controller.replaceEntry(res, id, content);
    69	    });
```

**Before (18d09a5) — File:** `test/journal.http` (lines 16–17)
```http
    16	### Step 7 checkpoint: existing list still works after PUT controller
    17	GET http://localhost:3000/entries
```

**After (4d348f3) — File:** `test/journal.http` (lines 16–23)
```http
    16	### Step 7 checkpoint: existing list still works after PUT controller
    17	GET http://localhost:3000/entries
    18	
    19	### Step 8 verify PUT end-to-end
    20	PUT http://localhost:3000/api/entries/1
    21	Content-Type: application/json
    22	
    23	{ "content": "Updated via PUT" }
```

### Step 10: Patch Foundations — Commit timeline: 3.4-logging-and-http-method-expansion @ 4d348f3a52b764d2ecf7c0f44e45ce1eef5635f6 → 3.4-logging-and-http-method-expansion @ ad396e35e48d4c4073332cd119896c4fac6cc787

Quick jump: `git checkout ad396e35e48d4c4073332cd119896c4fac6cc787`

We add patch semantics in the repository and service while keeping a PUT checkpoint to verify stability.

**Before (4d348f3) — File:** `src/repository/JournalRespository.ts` (lines 9–49)
```ts
     9	export interface IJournalRepository {
    10	  add(content: string): IJournalEntry;
    11	  getById(id: string): IJournalEntry;
    12	  getAll(): IJournalEntry[];
    13	  replaceById(id: string, content: string): IJournalEntry;
    14	}
    15	
    16	class JournalRepository implements IJournalRepository {
    17	  private entries: IJournalEntry[] = [];
    18	  private nextId = 1;
    19	
    20	  add(content: string): IJournalEntry {
    21	    const entry = createJournalEntry(String(this.nextId++), content);
    22	    this.entries.push(entry);
    23	    return entry;
    24	  }
    25	
    26	  getById(id: string): IJournalEntry {
    27	    const found = this.entries.find(entry => entry.id === id);
    28	    // We are going to make this better in a later lecture.
    29	    if (!found) {
    30	      throw new Error(`Journal entry with id ${id} not found`);
    31	    }
    32	    return found;
    33	  }
    34	
    35	  getAll(): IJournalEntry[] {
    36	    return this.entries;
    37	  }
    38	
    39	  replaceById(id: string, content: string): IJournalEntry {
    40	    for (let i = 0; i < this.entries.length; i += 1) {
    41	      if (this.entries[i].id === id) {
    42	        this.entries[i].content = content;
    43	        this.entries[i].updatedAt = new Date();
    44	        return this.entries[i];
    45	      }
    46	    }
    47	    throw new Error(`Journal entry with id ${id} not found`);
    48	  }
    49	}
```

**After (ad396e3) — File:** `src/repository/JournalRespository.ts` (lines 9–53)
```ts
     9	export interface IJournalRepository {
    10	  add(content: string): IJournalEntry;
    11	  getById(id: string): IJournalEntry;
    12	  getAll(): IJournalEntry[];
    13	  replaceById(id: string, content: string): IJournalEntry;
    14	  patchById(id: string, content: string): IJournalEntry;
    15	}
    16	
    17	class JournalRepository implements IJournalRepository {
    18	  private entries: IJournalEntry[] = [];
    19	  private nextId = 1;
    20	
    21	  add(content: string): IJournalEntry {
    22	    const entry = createJournalEntry(String(this.nextId++), content);
    23	    this.entries.push(entry);
    24	    return entry;
    25	  }
    26	
    27	  getById(id: string): IJournalEntry {
    28	    const found = this.entries.find(entry => entry.id === id);
    29	    // We are going to make this better in a later lecture.
    30	    if (!found) {
    31	      throw new Error(`Journal entry with id ${id} not found`);
    32	    }
    33	    return found;
    34	  }
    35	
    36	  getAll(): IJournalEntry[] {
    37	    return this.entries;
    38	  }
    39	
    40	  replaceById(id: string, content: string): IJournalEntry {
    41	    for (let i = 0; i < this.entries.length; i += 1) {
    42	      if (this.entries[i].id === id) {
    43	        this.entries[i].content = content;
    44	        this.entries[i].updatedAt = new Date();
    45	        return this.entries[i];
    46	      }
    47	    }
    48	    throw new Error(`Journal entry with id ${id} not found`);
    49	  }
    50	
    51	  patchById(id: string, content: string): IJournalEntry {
    52	    return this.replaceById(id, content);
    53	  }
```

**Before (4d348f3) — File:** `src/service/JournalService.ts` (lines 10–35)
```ts
    10	export interface IJournalService {
    11	  createEntry(content: string): IJournalEntry;
    12	  getEntry(id: string): IJournalEntry;
    13	  getEntries(): IJournalEntry[];
    14	  replaceEntry(id: string, content: string): IJournalEntry;
    15	}
    16	
    17	class JournalService implements IJournalService {
    18	  constructor(private readonly repository: IJournalRepository) {}
    19	
    20	  createEntry(content: string): IJournalEntry {
    21	    return this.repository.add(content);
    22	  }
    23	
    24	  getEntry(id: string): IJournalEntry {
    25	    return this.repository.getById(id);
    26	  }
    27	
    28	  getEntries(): IJournalEntry[] {
    29	    return this.repository.getAll();
    30	  }
    31	
    32	  replaceEntry(id: string, content: string): IJournalEntry {
    33	    return this.repository.replaceById(id, content);
    34	  }
    35	}
```

**After (ad396e3) — File:** `src/service/JournalService.ts` (lines 10–39)
```ts
    10	export interface IJournalService {
    11	  createEntry(content: string): IJournalEntry;
    12	  getEntry(id: string): IJournalEntry;
    13	  getEntries(): IJournalEntry[];
    14	  replaceEntry(id: string, content: string): IJournalEntry;
    15	  patchEntry(id: string, content: string): IJournalEntry;
    16	}
    17	
    18	class JournalService implements IJournalService {
    19	  constructor(private readonly repository: IJournalRepository) {}
    20	
    21	  createEntry(content: string): IJournalEntry {
    22	    return this.repository.add(content);
    23	  }
    24	
    25	  getEntry(id: string): IJournalEntry {
    26	    return this.repository.getById(id);
    27	  }
    28	
    29	  getEntries(): IJournalEntry[] {
    30	    return this.repository.getAll();
    31	  }
    32	
    33	  replaceEntry(id: string, content: string): IJournalEntry {
    34	    return this.repository.replaceById(id, content);
    35	  }
    36	
    37	  patchEntry(id: string, content: string): IJournalEntry {
    38	    return this.repository.patchById(id, content);
    39	  }
```

**Before (4d348f3) — File:** `test/journal.http` (lines 19–23)
```http
    19	### Step 8 verify PUT end-to-end
    20	PUT http://localhost:3000/api/entries/1
    21	Content-Type: application/json
    22	
    23	{ "content": "Updated via PUT" }
```

**After (ad396e3) — File:** `test/journal.http` (lines 19–29)
```http
    19	### Step 8 verify PUT end-to-end
    20	PUT http://localhost:3000/api/entries/1
    21	Content-Type: application/json
    22	
    23	{ "content": "Updated via PUT" }
    24	
    25	### Step 9 checkpoint: PUT remains functional before PATCH route
    26	PUT http://localhost:3000/api/entries/1
    27	Content-Type: application/json
    28	
    29	{ "content": "PUT still works" }
```

### Step 11: Patch Controller Link — Commit timeline: 3.4-logging-and-http-method-expansion @ ad396e35e48d4c4073332cd119896c4fac6cc787 → 3.4-logging-and-http-method-expansion @ 0e70e3a962b5f6eb04128569537606fa2a035f3c

Quick jump: `git checkout 0e70e3a962b5f6eb04128569537606fa2a035f3c`

We add a controller method for PATCH updates and keep a GET checkpoint to confirm read behavior stays intact.

**Before (ad396e3) — File:** `src/controller/JournalController.ts` (lines 5–62)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	  replaceEntry(res: Response, id: string, content: string): void;
    12	}
    13	
    14	class JournalController implements IJournalController {
    15	  constructor(
    16	    private readonly service: IJournalService,
    17	    private readonly logger: ILoggingService
    18	  ) {}
    19	
    20	  showHome(res: Response): void {
    21	    this.logger.info("Rendering home page");
    22	    res.sendFile("journal.html", { root: "static" });
    23	  }
    24	
    25	  showEntryForm(res: Response): void {
    26	    this.logger.info("Rendering new entry form");
    27	    res.sendFile("entry-form.html", { root: "static" });
    28	  }
    29	
    30	  newEntryFromForm(res: Response, content: string): void {
    31	    this.logger.info("Creating entry from form");
    32	    this.service.createEntry(content);
    33	    res.redirect("/");
    34	  }
    35	
    36	  showAllEntries(res: Response): void {
    37	    this.logger.info("Listing all journal entries");
    38	    const entries = this.service.getEntries();
    39	    let html = "<h1>All Journal Entries</h1><ul>";
    40	    for (const entry of entries) {
    41	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    42	    }
    43	    html += "</ul>";
    44	    res.send(html);
    45	  }
    46	
    47	  showEntry(res: Response, id: string): void {
    48	    this.logger.info(`Showing entry ${id}`);
    49	    let html = "<h1>Journal Entry Not Found</h1>";
    50	    const entry = this.service.getEntry(id);
    51	    if (entry) {
    52	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    53	    }
    54	    res.send(html);
    55	  }
    56	
    57	  replaceEntry(res: Response, id: string, content: string): void {
    58	    this.logger.info(`Replacing entry ${id} via PUT`);
    59	    const updated = this.service.replaceEntry(id, content);
    60	    res.json(updated);
    61	  }
    62	}
```

**After (0e70e3a) — File:** `src/controller/JournalController.ts` (lines 5–68)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	  replaceEntry(res: Response, id: string, content: string): void;
    12	  patchEntry(res: Response, id: string, content: string): void;
    13	}
    14	
    15	class JournalController implements IJournalController {
    16	  constructor(
    17	    private readonly service: IJournalService,
    18	    private readonly logger: ILoggingService
    19	  ) {}
    20	
    21	  showHome(res: Response): void {
    22	    this.logger.info("Rendering home page");
    23	    res.sendFile("journal.html", { root: "static" });
    24	  }
    25	
    26	  showEntryForm(res: Response): void {
    27	    this.logger.info("Rendering new entry form");
    28	    res.sendFile("entry-form.html", { root: "static" });
    29	  }
    30	
    31	  newEntryFromForm(res: Response, content: string): void {
    32	    this.logger.info("Creating entry from form");
    33	    this.service.createEntry(content);
    34	    res.redirect("/");
    35	  }
    36	
    37	  showAllEntries(res: Response): void {
    38	    this.logger.info("Listing all journal entries");
    39	    const entries = this.service.getEntries();
    40	    let html = "<h1>All Journal Entries</h1><ul>";
    41	    for (const entry of entries) {
    42	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    43	    }
    44	    html += "</ul>";
    45	    res.send(html);
    46	  }
    47	
    48	  showEntry(res: Response, id: string): void {
    49	    this.logger.info(`Showing entry ${id}`);
    50	    let html = "<h1>Journal Entry Not Found</h1>";
    51	    const entry = this.service.getEntry(id);
    52	    if (entry) {
    53	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    54	    }
    55	    res.send(html);
    56	  }
    57	
    58	  replaceEntry(res: Response, id: string, content: string): void {
    59	    this.logger.info(`Replacing entry ${id} via PUT`);
    60	    const updated = this.service.replaceEntry(id, content);
    61	    res.json(updated);
    62	  }
    63	
    64	  patchEntry(res: Response, id: string, content: string): void {
    65	    this.logger.info(`Patching entry ${id} via PATCH`);
    66	    const updated = this.service.patchEntry(id, content);
    67	    res.json(updated);
    68	  }
```

**Before (ad396e3) — File:** `test/journal.http` (lines 25–29)
```http
    25	### Step 9 checkpoint: PUT remains functional before PATCH route
    26	PUT http://localhost:3000/api/entries/1
    27	Content-Type: application/json
    28	
    29	{ "content": "PUT still works" }
```

**After (0e70e3a) — File:** `test/journal.http` (lines 25–32)
```http
    25	### Step 9 checkpoint: PUT remains functional before PATCH route
    26	PUT http://localhost:3000/api/entries/1
    27	Content-Type: application/json
    28	
    29	{ "content": "PUT still works" }
    30	
    31	### Step 10 checkpoint: GET entry still works after PATCH controller
    32	GET http://localhost:3000/entries/1
```

### Step 12: PATCH Route Online — Commit timeline: 3.4-logging-and-http-method-expansion @ 0e70e3a962b5f6eb04128569537606fa2a035f3c → 3.4-logging-and-http-method-expansion @ 0896eaea743d47e779ab418dc1eb1dff0d59c6dd

Quick jump: `git checkout 0896eaea743d47e779ab418dc1eb1dff0d59c6dd`

We wire the PATCH endpoint and verify it end-to-end.

**Before (0e70e3a) — File:** `src/app.ts` (lines 64–69)
```ts
    64	    this.app.put("/api/entries/:id", express.json(), (req, res) => {
    65	      this.logger.info(`PUT /api/entries/${req.params.id}`);
    66	      const id = req.params.id as string;
    67	      const content = req.body.content as string;
    68	      this.controller.replaceEntry(res, id, content);
    69	    });
```

**After (0896eae) — File:** `src/app.ts` (lines 64–76)
```ts
    64	    this.app.put("/api/entries/:id", express.json(), (req, res) => {
    65	      this.logger.info(`PUT /api/entries/${req.params.id}`);
    66	      const id = req.params.id as string;
    67	      const content = req.body.content as string;
    68	      this.controller.replaceEntry(res, id, content);
    69	    });
    70	
    71	    this.app.patch("/api/entries/:id", express.json(), (req, res) => {
    72	      this.logger.info(`PATCH /api/entries/${req.params.id}`);
    73	      const id = req.params.id as string;
    74	      const content = req.body.content as string;
    75	      this.controller.patchEntry(res, id, content);
    76	    });
```

**Before (0e70e3a) — File:** `test/journal.http` (lines 31–32)
```http
    31	### Step 10 checkpoint: GET entry still works after PATCH controller
    32	GET http://localhost:3000/entries/1
```

**After (0896eae) — File:** `test/journal.http` (lines 31–38)
```http
    31	### Step 10 checkpoint: GET entry still works after PATCH controller
    32	GET http://localhost:3000/entries/1
    33	
    34	### Step 11 verify PATCH end-to-end
    35	PATCH http://localhost:3000/api/entries/1
    36	Content-Type: application/json
    37	
    38	{ "content": "Updated via PATCH" }
```

### Step 13: Delete Internals — Commit timeline: 3.4-logging-and-http-method-expansion @ 0896eaea743d47e779ab418dc1eb1dff0d59c6dd → 3.4-logging-and-http-method-expansion @ bb42d398a3f8eab1cdc0ea4744811df9f46523ad

Quick jump: `git checkout bb42d398a3f8eab1cdc0ea4744811df9f46523ad`

We add delete behavior in the repository and service and keep a PATCH checkpoint to guard current behavior.

**Before (0896eae) — File:** `src/repository/JournalRespository.ts` (lines 9–54)
```ts
     9	export interface IJournalRepository {
    10	  add(content: string): IJournalEntry;
    11	  getById(id: string): IJournalEntry;
    12	  getAll(): IJournalEntry[];
    13	  replaceById(id: string, content: string): IJournalEntry;
    14	  patchById(id: string, content: string): IJournalEntry;
    15	}
    16	
    17	class JournalRepository implements IJournalRepository {
    18	  private entries: IJournalEntry[] = [];
    19	  private nextId = 1;
    20	
    21	  add(content: string): IJournalEntry {
    22	    const entry = createJournalEntry(String(this.nextId++), content);
    23	    this.entries.push(entry);
    24	    return entry;
    25	  }
    26	
    27	  getById(id: string): IJournalEntry {
    28	    const found = this.entries.find(entry => entry.id === id);
    29	    // We are going to make this better in a later lecture.
    30	    if (!found) {
    31	      throw new Error(`Journal entry with id ${id} not found`);
    32	    }
    33	    return found;
    34	  }
    35	
    36	  getAll(): IJournalEntry[] {
    37	    return this.entries;
    38	  }
    39	
    40	  replaceById(id: string, content: string): IJournalEntry {
    41	    for (let i = 0; i < this.entries.length; i += 1) {
    42	      if (this.entries[i].id === id) {
    43	        this.entries[i].content = content;
    44	        this.entries[i].updatedAt = new Date();
    45	        return this.entries[i];
    46	      }
    47	    }
    48	    throw new Error(`Journal entry with id ${id} not found`);
    49	  }
    50	
    51	  patchById(id: string, content: string): IJournalEntry {
    52	    return this.replaceById(id, content);
    53	  }
    54	}
```

**After (bb42d39) — File:** `src/repository/JournalRespository.ts` (lines 9–64)
```ts
     9	export interface IJournalRepository {
    10	  add(content: string): IJournalEntry;
    11	  getById(id: string): IJournalEntry;
    12	  getAll(): IJournalEntry[];
    13	  replaceById(id: string, content: string): IJournalEntry;
    14	  patchById(id: string, content: string): IJournalEntry;
    15	  deleteById(id: string): boolean;
    16	}
    17	
    18	class JournalRepository implements IJournalRepository {
    19	  private entries: IJournalEntry[] = [];
    20	  private nextId = 1;
    21	
    22	  add(content: string): IJournalEntry {
    23	    const entry = createJournalEntry(String(this.nextId++), content);
    24	    this.entries.push(entry);
    25	    return entry;
    26	  }
    27	
    28	  getById(id: string): IJournalEntry {
    29	    const found = this.entries.find(entry => entry.id === id);
    30	    // We are going to make this better in a later lecture.
    31	    if (!found) {
    32	      throw new Error(`Journal entry with id ${id} not found`);
    33	    }
    34	    return found;
    35	  }
    36	
    37	  getAll(): IJournalEntry[] {
    38	    return this.entries;
    39	  }
    40	
    41	  replaceById(id: string, content: string): IJournalEntry {
    42	    for (let i = 0; i < this.entries.length; i += 1) {
    43	      if (this.entries[i].id === id) {
    44	        this.entries[i].content = content;
    45	        this.entries[i].updatedAt = new Date();
    46	        return this.entries[i];
    47	      }
    48	    }
    49	    throw new Error(`Journal entry with id ${id} not found`);
    50	  }
    51	
    52	  patchById(id: string, content: string): IJournalEntry {
    53	    return this.replaceById(id, content);
    54	  }
    55	
    56	  deleteById(id: string): boolean {
    57	    for (let i = 0; i < this.entries.length; i += 1) {
    58	      if (this.entries[i].id === id) {
    59	        this.entries.splice(i, 1);
    60	        return true;
    61	      }
    62	    }
    63	    return false;
    64	  }
```

**Before (0896eae) — File:** `src/service/JournalService.ts` (lines 10–39)
```ts
    10	export interface IJournalService {
    11	  createEntry(content: string): IJournalEntry;
    12	  getEntry(id: string): IJournalEntry;
    13	  getEntries(): IJournalEntry[];
    14	  replaceEntry(id: string, content: string): IJournalEntry;
    15	  patchEntry(id: string, content: string): IJournalEntry;
    16	}
    17	
    18	class JournalService implements IJournalService {
    19	  constructor(private readonly repository: IJournalRepository) {}
    20	
    21	  createEntry(content: string): IJournalEntry {
    22	    return this.repository.add(content);
    23	  }
    24	
    25	  getEntry(id: string): IJournalEntry {
    26	    return this.repository.getById(id);
    27	  }
    28	
    29	  getEntries(): IJournalEntry[] {
    30	    return this.repository.getAll();
    31	  }
    32	
    33	  replaceEntry(id: string, content: string): IJournalEntry {
    34	    return this.repository.replaceById(id, content);
    35	  }
    36	
    37	  patchEntry(id: string, content: string): IJournalEntry {
    38	    return this.repository.patchById(id, content);
    39	  }
```

**After (bb42d39) — File:** `src/service/JournalService.ts` (lines 10–44)
```ts
    10	export interface IJournalService {
    11	  createEntry(content: string): IJournalEntry;
    12	  getEntry(id: string): IJournalEntry;
    13	  getEntries(): IJournalEntry[];
    14	  replaceEntry(id: string, content: string): IJournalEntry;
    15	  patchEntry(id: string, content: string): IJournalEntry;
    16	  deleteEntry(id: string): boolean;
    17	}
    18	
    19	class JournalService implements IJournalService {
    20	  constructor(private readonly repository: IJournalRepository) {}
    21	
    22	  createEntry(content: string): IJournalEntry {
    23	    return this.repository.add(content);
    24	  }
    25	
    26	  getEntry(id: string): IJournalEntry {
    27	    return this.repository.getById(id);
    28	  }
    29	
    30	  getEntries(): IJournalEntry[] {
    31	    return this.repository.getAll();
    32	  }
    33	
    34	  replaceEntry(id: string, content: string): IJournalEntry {
    35	    return this.repository.replaceById(id, content);
    36	  }
    37	
    38	  patchEntry(id: string, content: string): IJournalEntry {
    39	    return this.repository.patchById(id, content);
    40	  }
    41	
    42	  deleteEntry(id: string): boolean {
    43	    return this.repository.deleteById(id);
    44	  }
```

**Before (0896eae) — File:** `test/journal.http` (lines 34–38)
```http
    34	### Step 11 verify PATCH end-to-end
    35	PATCH http://localhost:3000/api/entries/1
    36	Content-Type: application/json
    37	
    38	{ "content": "Updated via PATCH" }
```

**After (bb42d39) — File:** `test/journal.http` (lines 34–44)
```http
    34	### Step 11 verify PATCH end-to-end
    35	PATCH http://localhost:3000/api/entries/1
    36	Content-Type: application/json
    37	
    38	{ "content": "Updated via PATCH" }
    39	
    40	### Step 12 checkpoint: PATCH remains functional before DELETE route
    41	PATCH http://localhost:3000/api/entries/1
    42	Content-Type: application/json
    43	
    44	{ "content": "PATCH still works" }
```

### Step 14: Delete Controller Semantics — Commit timeline: 3.4-logging-and-http-method-expansion @ bb42d398a3f8eab1cdc0ea4744811df9f46523ad → 3.4-logging-and-http-method-expansion @ 87c948c2a335ddadc028ef2728a2d7c56ae33dc9

Quick jump: `git checkout 87c948c2a335ddadc028ef2728a2d7c56ae33dc9`

We implement controller logic for delete outcomes, returning 404 when deletion fails and 204 when it succeeds.

**Before (bb42d39) — File:** `src/controller/JournalController.ts` (lines 5–68)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	  replaceEntry(res: Response, id: string, content: string): void;
    12	  patchEntry(res: Response, id: string, content: string): void;
    13	}
    14	
    15	class JournalController implements IJournalController {
    16	  constructor(
    17	    private readonly service: IJournalService,
    18	    private readonly logger: ILoggingService
    19	  ) {}
    20	
    21	  showHome(res: Response): void {
    22	    this.logger.info("Rendering home page");
    23	    res.sendFile("journal.html", { root: "static" });
    24	  }
    25	
    26	  showEntryForm(res: Response): void {
    27	    this.logger.info("Rendering new entry form");
    28	    res.sendFile("entry-form.html", { root: "static" });
    29	  }
    30	
    31	  newEntryFromForm(res: Response, content: string): void {
    32	    this.logger.info("Creating entry from form");
    33	    this.service.createEntry(content);
    34	    res.redirect("/");
    35	  }
    36	
    37	  showAllEntries(res: Response): void {
    38	    this.logger.info("Listing all journal entries");
    39	    const entries = this.service.getEntries();
    40	    let html = "<h1>All Journal Entries</h1><ul>";
    41	    for (const entry of entries) {
    42	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    43	    }
    44	    html += "</ul>";
    45	    res.send(html);
    46	  }
    47	
    48	  showEntry(res: Response, id: string): void {
    49	    this.logger.info(`Showing entry ${id}`);
    50	    let html = "<h1>Journal Entry Not Found</h1>";
    51	    const entry = this.service.getEntry(id);
    52	    if (entry) {
    53	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    54	    }
    55	    res.send(html);
    56	  }
    57	
    58	  replaceEntry(res: Response, id: string, content: string): void {
    59	    this.logger.info(`Replacing entry ${id} via PUT`);
    60	    const updated = this.service.replaceEntry(id, content);
    61	    res.json(updated);
    62	  }
    63	
    64	  patchEntry(res: Response, id: string, content: string): void {
    65	    this.logger.info(`Patching entry ${id} via PATCH`);
    66	    const updated = this.service.patchEntry(id, content);
    67	    res.json(updated);
    68	  }
```

**After (87c948c) — File:** `src/controller/JournalController.ts` (lines 5–80)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	  replaceEntry(res: Response, id: string, content: string): void;
    12	  patchEntry(res: Response, id: string, content: string): void;
    13	  deleteEntry(res: Response, id: string): void;
    14	}
    15	
    16	class JournalController implements IJournalController {
    17	  constructor(
    18	    private readonly service: IJournalService,
    19	    private readonly logger: ILoggingService
    20	  ) {}
    21	
    22	  showHome(res: Response): void {
    23	    this.logger.info("Rendering home page");
    24	    res.sendFile("journal.html", { root: "static" });
    25	  }
    26	
    27	  showEntryForm(res: Response): void {
    28	    this.logger.info("Rendering new entry form");
    29	    res.sendFile("entry-form.html", { root: "static" });
    30	  }
    31	
    32	  newEntryFromForm(res: Response, content: string): void {
    33	    this.logger.info("Creating entry from form");
    34	    this.service.createEntry(content);
    35	    res.redirect("/");
    36	  }
    37	
    38	  showAllEntries(res: Response): void {
    39	    this.logger.info("Listing all journal entries");
    40	    const entries = this.service.getEntries();
    41	    let html = "<h1>All Journal Entries</h1><ul>";
    42	    for (const entry of entries) {
    43	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    44	    }
    45	    html += "</ul>";
    46	    res.send(html);
    47	  }
    48	
    49	  showEntry(res: Response, id: string): void {
    50	    this.logger.info(`Showing entry ${id}`);
    51	    let html = "<h1>Journal Entry Not Found</h1>";
    52	    const entry = this.service.getEntry(id);
    53	    if (entry) {
    54	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    55	    }
    56	    res.send(html);
    57	  }
    58	
    59	  replaceEntry(res: Response, id: string, content: string): void {
    60	    this.logger.info(`Replacing entry ${id} via PUT`);
    61	    const updated = this.service.replaceEntry(id, content);
    62	    res.json(updated);
    63	  }
    64	
    65	  patchEntry(res: Response, id: string, content: string): void {
    66	    this.logger.info(`Patching entry ${id} via PATCH`);
    67	    const updated = this.service.patchEntry(id, content);
    68	    res.json(updated);
    69	  }
    70	
    71	  deleteEntry(res: Response, id: string): void {
    72	    this.logger.info(`Deleting entry ${id}`);
    73	    const deleted = this.service.deleteEntry(id);
    74	    if (!deleted) {
    75	      this.logger.warn(`Delete failed for ${id}`);
    76	      res.status(404).json({ message: "Entry not found" });
    77	      return;
    78	    }
    79	    res.status(204).send();
    80	  }
```

**Before (bb42d39) — File:** `test/journal.http` (lines 40–44)
```http
    40	### Step 12 checkpoint: PATCH remains functional before DELETE route
    41	PATCH http://localhost:3000/api/entries/1
    42	Content-Type: application/json
    43	
    44	{ "content": "PATCH still works" }
```

**After (87c948c) — File:** `test/journal.http` (lines 40–47)
```http
    40	### Step 12 checkpoint: PATCH remains functional before DELETE route
    41	PATCH http://localhost:3000/api/entries/1
    42	Content-Type: application/json
    43	
    44	{ "content": "PATCH still works" }
    45	
    46	### Step 13 checkpoint: list endpoint still works after DELETE controller
    47	GET http://localhost:3000/entries
```

### Step 15: DELETE Route Online — Commit timeline: 3.4-logging-and-http-method-expansion @ 87c948c2a335ddadc028ef2728a2d7c56ae33dc9 → 3.4-logging-and-http-method-expansion @ c8ecd9276b3991145544193addaa58f717cbca99

Quick jump: `git checkout c8ecd9276b3991145544193addaa58f717cbca99`

We expose the DELETE endpoint and add an end-to-end verification request.

**Before (87c948c) — File:** `src/app.ts` (lines 71–76)
```ts
    71	    this.app.patch("/api/entries/:id", express.json(), (req, res) => {
    72	      this.logger.info(`PATCH /api/entries/${req.params.id}`);
    73	      const id = req.params.id as string;
    74	      const content = req.body.content as string;
    75	      this.controller.patchEntry(res, id, content);
    76	    });
```

**After (c8ecd92) — File:** `src/app.ts` (lines 71–82)
```ts
    71	    this.app.patch("/api/entries/:id", express.json(), (req, res) => {
    72	      this.logger.info(`PATCH /api/entries/${req.params.id}`);
    73	      const id = req.params.id as string;
    74	      const content = req.body.content as string;
    75	      this.controller.patchEntry(res, id, content);
    76	    });
    77	
    78	    this.app.delete("/api/entries/:id", (req: Request, res: Response) => {
    79	      this.logger.info(`DELETE /api/entries/${req.params.id}`);
    80	      const id = req.params.id as string;
    81	      this.controller.deleteEntry(res, id);
    82	    });
```

**Before (87c948c) — File:** `test/journal.http` (lines 46–47)
```http
    46	### Step 13 checkpoint: list endpoint still works after DELETE controller
    47	GET http://localhost:3000/entries
```

**After (c8ecd92) — File:** `test/journal.http` (lines 46–50)
```http
    46	### Step 13 checkpoint: list endpoint still works after DELETE controller
    47	GET http://localhost:3000/entries
    48	
    49	### Step 14 verify DELETE end-to-end
    50	DELETE http://localhost:3000/api/entries/1
```

### Step 16: Edit Form Skeleton — Commit timeline: 3.4-logging-and-http-method-expansion @ c8ecd9276b3991145544193addaa58f717cbca99 → 3.4-logging-and-http-method-expansion @ ae0a572236528ed345ba44ecb82097ec0eb67c6a

Quick jump: `git checkout ae0a572236528ed345ba44ecb82097ec0eb67c6a`

We introduce a controller method that renders the edit form HTML, preparing for the UI route.

**Before (c8ecd92) — File:** `src/controller/JournalController.ts` (lines 49–56)
```ts
    49	  showEntry(res: Response, id: string): void {
    50	    this.logger.info(`Showing entry ${id}`);
    51	    let html = "<h1>Journal Entry Not Found</h1>";
    52	    const entry = this.service.getEntry(id);
    53	    if (entry) {
    54	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    55	    }
    56	    res.send(html);
```

**After (ae0a572) — File:** `src/controller/JournalController.ts` (lines 50–69)
```ts
    50	  showEntry(res: Response, id: string): void {
    51	    this.logger.info(`Showing entry ${id}`);
    52	    let html = "<h1>Journal Entry Not Found</h1>";
    53	    const entry = this.service.getEntry(id);
    54	    if (entry) {
    55	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    56	    }
    57	    res.send(html);
    58	  }
    59	
    60	  showEditForm(res: Response, id: string): void {
    61	    const entry = this.service.getEntry(id);
    62	    const html = `<h1>Edit Journal Entry</h1>
    63	      <p>This form uses POST because browser forms support GET/POST.</p>
    64	      <form action="/entries/${entry.id}/edit" method="POST">
    65	        <textarea name="content" rows="8" cols="60" required>${entry.content}</textarea>
    66	        <button type="submit">Save Changes</button>
    67	      </form>`;
    68	    res.send(html);
    69	  }
```

**Before (c8ecd92) — File:** `test/journal.http` (lines 49–50)
```http
    49	### Step 14 verify DELETE end-to-end
    50	DELETE http://localhost:3000/api/entries/1
```

**After (ae0a572) — File:** `test/journal.http` (lines 49–53)
```http
    49	### Step 14 verify DELETE end-to-end
    50	DELETE http://localhost:3000/api/entries/1
    51	
    52	### Step 15 checkpoint: entry read still works before edit route
    53	GET http://localhost:3000/entries/1
```

### Step 17: Edit Route Wired — Commit timeline: 3.4-logging-and-http-method-expansion @ ae0a572236528ed345ba44ecb82097ec0eb67c6a → 3.4-logging-and-http-method-expansion @ db7833d3fe466a0ae982be847790b4ee25d6e531

Quick jump: `git checkout db7833d3fe466a0ae982be847790b4ee25d6e531`

We wire the GET edit form route and validate it with a REST Client request.

**Before (ae0a572) — File:** `src/app.ts` (lines 58–62)
```ts
    58	    // Route to show a specific journal entry by ID
    59	    this.app.get("/entries/:id", (req: Request, res: Response) => {
    60	      const id = req.params.id as string;
    61	      controller.showEntry(res, id);
    62	    });
```

**After (db7833d) — File:** `src/app.ts` (lines 58–68)
```ts
    58	    // Route to show a specific journal entry by ID
    59	    this.app.get("/entries/:id", (req: Request, res: Response) => {
    60	      const id = req.params.id as string;
    61	      controller.showEntry(res, id);
    62	    });
    63	
    64	    this.app.get("/entries/:id/edit", (req: Request, res: Response) => {
    65	      this.logger.info(`GET /entries/${req.params.id}/edit`);
    66	      const id = req.params.id as string;
    67	      this.controller.showEditForm(res, id);
    68	    });
```

**Before (ae0a572) — File:** `test/journal.http` (lines 52–53)
```http
    52	### Step 15 checkpoint: entry read still works before edit route
    53	GET http://localhost:3000/entries/1
```

**After (db7833d) — File:** `test/journal.http` (lines 52–56)
```http
    52	### Step 15 checkpoint: entry read still works before edit route
    53	GET http://localhost:3000/entries/1
    54	
    55	### Step 16 verify GET edit form route
    56	GET http://localhost:3000/entries/1/edit
```

### Step 18: Form Update Handler — Commit timeline: 3.4-logging-and-http-method-expansion @ db7833d3fe466a0ae982be847790b4ee25d6e531 → 3.4-logging-and-http-method-expansion @ 3dae8dc28ea14cd55d465d3ba46269e17c3a4c65

Quick jump: `git checkout 3dae8dc28ea14cd55d465d3ba46269e17c3a4c65`

We add a controller method for the edit form submission, reusing PATCH semantics under the hood.

**Before (db7833d) — File:** `src/controller/JournalController.ts` (lines 5–70)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	  showEditForm(res: Response, id: string): void;
    12	  replaceEntry(res: Response, id: string, content: string): void;
    13	  patchEntry(res: Response, id: string, content: string): void;
    14	  deleteEntry(res: Response, id: string): void;
    15	}
    16	
    17	class JournalController implements IJournalController {
    18	  constructor(
    19	    private readonly service: IJournalService,
    20	    private readonly logger: ILoggingService
    21	  ) {}
    22	
    23	  showHome(res: Response): void {
    24	    this.logger.info("Rendering home page");
    25	    res.sendFile("journal.html", { root: "static" });
    26	  }
    27	
    28	  showEntryForm(res: Response): void {
    29	    this.logger.info("Rendering new entry form");
    30	    res.sendFile("entry-form.html", { root: "static" });
    31	  }
    32	
    33	  newEntryFromForm(res: Response, content: string): void {
    34	    this.logger.info("Creating entry from form");
    35	    this.service.createEntry(content);
    36	    res.redirect("/");
    37	  }
    38	
    39	  showAllEntries(res: Response): void {
    40	    this.logger.info("Listing all journal entries");
    41	    const entries = this.service.getEntries();
    42	    let html = "<h1>All Journal Entries</h1><ul>";
    43	    for (const entry of entries) {
    44	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    45	    }
    46	    html += "</ul>";
    47	    res.send(html);
    48	  }
    49	
    50	  showEntry(res: Response, id: string): void {
    51	    this.logger.info(`Showing entry ${id}`);
    52	    let html = "<h1>Journal Entry Not Found</h1>";
    53	    const entry = this.service.getEntry(id);
    54	    if (entry) {
    55	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    56	    }
    57	    res.send(html);
    58	  }
    59	
    60	  showEditForm(res: Response, id: string): void {
    61	    const entry = this.service.getEntry(id);
    62	    const html = `<h1>Edit Journal Entry</h1>
    63	      <p>This form uses POST because browser forms support GET/POST.</p>
    64	      <form action="/entries/${entry.id}/edit" method="POST">
    65	        <textarea name="content" rows="8" cols="60" required>${entry.content}</textarea>
    66	        <button type="submit">Save Changes</button>
    67	      </form>`;
    68	    res.send(html);
    69	  }
    70	
```

**After (3dae8dc) — File:** `src/controller/JournalController.ts` (lines 5–76)
```ts
     5	export interface IJournalController {
     6	  showHome(res: Response): void;
     7	  showEntryForm(res: Response): void;
     8	  newEntryFromForm(res: Response, content: string): void;
     9	  showAllEntries(res: Response): void;
    10	  showEntry(res: Response, id: string): void;
    11	  showEditForm(res: Response, id: string): void;
    12	  updateEntryFromForm(res: Response, id: string, content: string): void;
    13	  replaceEntry(res: Response, id: string, content: string): void;
    14	  patchEntry(res: Response, id: string, content: string): void;
    15	  deleteEntry(res: Response, id: string): void;
    16	}
    17	
    18	class JournalController implements IJournalController {
    19	  constructor(
    20	    private readonly service: IJournalService,
    21	    private readonly logger: ILoggingService
    22	  ) {}
    23	
    24	  showHome(res: Response): void {
    25	    this.logger.info("Rendering home page");
    26	    res.sendFile("journal.html", { root: "static" });
    27	  }
    28	
    29	  showEntryForm(res: Response): void {
    30	    this.logger.info("Rendering new entry form");
    31	    res.sendFile("entry-form.html", { root: "static" });
    32	  }
    33	
    34	  newEntryFromForm(res: Response, content: string): void {
    35	    this.logger.info("Creating entry from form");
    36	    this.service.createEntry(content);
    37	    res.redirect("/");
    38	  }
    39	
    40	  showAllEntries(res: Response): void {
    41	    this.logger.info("Listing all journal entries");
    42	    const entries = this.service.getEntries();
    43	    let html = "<h1>All Journal Entries</h1><ul>";
    44	    for (const entry of entries) {
    45	      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    46	    }
    47	    html += "</ul>";
    48	    res.send(html);
    49	  }
    50	
    51	  showEntry(res: Response, id: string): void {
    52	    this.logger.info(`Showing entry ${id}`);
    53	    let html = "<h1>Journal Entry Not Found</h1>";
    54	    const entry = this.service.getEntry(id);
    55	    if (entry) {
    56	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    57	    }
    58	    res.send(html);
    59	  }
    60	
    61	  showEditForm(res: Response, id: string): void {
    62	    const entry = this.service.getEntry(id);
    63	    const html = `<h1>Edit Journal Entry</h1>
    64	      <p>This form uses POST because browser forms support GET/POST.</p>
    65	      <form action="/entries/${entry.id}/edit" method="POST">
    66	        <textarea name="content" rows="8" cols="60" required>${entry.content}</textarea>
    67	        <button type="submit">Save Changes</button>
    68	      </form>`;
    69	    res.send(html);
    70	  }
    71	
    72	  updateEntryFromForm(res: Response, id: string, content: string): void {
    73	    this.logger.info(`Updating entry ${id} from form POST`);
    74	    this.service.patchEntry(id, content);
    75	    res.redirect(`/entries/${id}`);
    76	  }
```

**Before (db7833d) — File:** `test/journal.http` (lines 55–56)
```http
    55	### Step 16 verify GET edit form route
    56	GET http://localhost:3000/entries/1/edit
```

**After (3dae8dc) — File:** `test/journal.http` (lines 55–59)
```http
    55	### Step 16 verify GET edit form route
    56	GET http://localhost:3000/entries/1/edit
    57	
    58	### Step 17 checkpoint: GET edit still works before POST route
    59	GET http://localhost:3000/entries/1/edit
```

### Step 19: POST Edit Route — Commit timeline: 3.4-logging-and-http-method-expansion @ 3dae8dc28ea14cd55d465d3ba46269e17c3a4c65 → 3.4-logging-and-http-method-expansion @ a309243bb4f1e80bc925fa2980f1dab8f8099eb9

Quick jump: `git checkout a309243bb4f1e80bc925fa2980f1dab8f8099eb9`

We add the POST edit route to connect browser forms to the controller update method.

**Before (3dae8dc) — File:** `src/app.ts` (lines 64–68)
```ts
    64	    this.app.get("/entries/:id/edit", (req: Request, res: Response) => {
    65	      this.logger.info(`GET /entries/${req.params.id}/edit`);
    66	      const id = req.params.id as string;
    67	      this.controller.showEditForm(res, id);
    68	    });
```

**After (a309243) — File:** `src/app.ts` (lines 64–75)
```ts
    64	    this.app.get("/entries/:id/edit", (req: Request, res: Response) => {
    65	      this.logger.info(`GET /entries/${req.params.id}/edit`);
    66	      const id = req.params.id as string;
    67	      this.controller.showEditForm(res, id);
    68	    });
    69	
    70	    this.app.post("/entries/:id/edit", express.urlencoded({ extended: true }), (req, res) => {
    71	      this.logger.info(`POST /entries/${req.params.id}/edit`);
    72	      const id = req.params.id as string;
    73	      const content = req.body.content as string;
    74	      this.controller.updateEntryFromForm(res, id, content);
    75	    });
```

**Before (3dae8dc) — File:** `test/journal.http` (lines 58–59)
```http
    58	### Step 17 checkpoint: GET edit still works before POST route
    59	GET http://localhost:3000/entries/1/edit
```

**After (a309243) — File:** `test/journal.http` (lines 58–65)
```http
    58	### Step 17 checkpoint: GET edit still works before POST route
    59	GET http://localhost:3000/entries/1/edit
    60	
    61	### Step 18 verify POST edit route
    62	POST http://localhost:3000/entries/1/edit
    63	Content-Type: application/x-www-form-urlencoded
    64	
    65	content=Edited+from+form
```

### Step 20: Edit Link in View — Commit timeline: 3.4-logging-and-http-method-expansion @ a309243bb4f1e80bc925fa2980f1dab8f8099eb9 → 3.4-logging-and-http-method-expansion @ 198f9c16ef128ed866be90cf013eaa4258b1f5dc

Quick jump: `git checkout 198f9c16ef128ed866be90cf013eaa4258b1f5dc`

We surface an edit link on the entry page so the new form is discoverable.

**Before (a309243) — File:** `src/controller/JournalController.ts` (lines 51–58)
```ts
    51	  showEntry(res: Response, id: string): void {
    52	    this.logger.info(`Showing entry ${id}`);
    53	    let html = "<h1>Journal Entry Not Found</h1>";
    54	    const entry = this.service.getEntry(id);
    55	    if (entry) {
    56	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    57	    }
    58	    res.send(html);
```

**After (198f9c1) — File:** `src/controller/JournalController.ts` (lines 51–60)
```ts
    51	  showEntry(res: Response, id: string): void {
    52	    this.logger.info(`Showing entry ${id}`);
    53	    let html = "<h1>Journal Entry Not Found</h1>";
    54	    const entry = this.service.getEntry(id);
    55	    if (entry) {
    56	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>
    57	        <p><a href="/entries/${entry.id}/edit">Edit Entry</a></p>
    58	        <p><a href="/entries">Back to Entries</a></p>`;
    59	    }
    60	    res.send(html);
```

**Before (a309243) — File:** `test/journal.http` (lines 61–65)
```http
    61	### Step 18 verify POST edit route
    62	POST http://localhost:3000/entries/1/edit
    63	Content-Type: application/x-www-form-urlencoded
    64	
    65	content=Edited+from+form
```

**After (198f9c1) — File:** `test/journal.http` (lines 61–68)
```http
    61	### Step 18 verify POST edit route
    62	POST http://localhost:3000/entries/1/edit
    63	Content-Type: application/x-www-form-urlencoded
    64	
    65	content=Edited+from+form
    66	
    67	### Step 19 verify entry page includes edit link
    68	GET http://localhost:3000/entries/1
```

### Step 21: Form-Friendly Delete Route — Commit timeline: 3.4-logging-and-http-method-expansion @ 198f9c16ef128ed866be90cf013eaa4258b1f5dc → 3.4-logging-and-http-method-expansion @ af0d8ced0e6701ef2a93dcf5cfdc83f95a8f01d2

Quick jump: `git checkout af0d8ced0e6701ef2a93dcf5cfdc83f95a8f01d2`

We add a POST-based delete route so browser forms can trigger deletions without relying on API methods.

**Before (198f9c1) — File:** `src/app.ts` (lines 70–75)
```ts
    70	    this.app.post("/entries/:id/edit", express.urlencoded({ extended: true }), (req, res) => {
    71	      this.logger.info(`POST /entries/${req.params.id}/edit`);
    72	      const id = req.params.id as string;
    73	      const content = req.body.content as string;
    74	      this.controller.updateEntryFromForm(res, id, content);
    75	    });
```

**After (af0d8ce) — File:** `src/app.ts` (lines 70–81)
```ts
    70	    this.app.post("/entries/:id/edit", express.urlencoded({ extended: true }), (req, res) => {
    71	      this.logger.info(`POST /entries/${req.params.id}/edit`);
    72	      const id = req.params.id as string;
    73	      const content = req.body.content as string;
    74	      this.controller.updateEntryFromForm(res, id, content);
    75	    });
    76	
    77	    this.app.post("/entries/:id/delete", (req: Request, res: Response) => {
    78	      this.logger.info(`POST /entries/${req.params.id}/delete`);
    79	      const id = req.params.id as string;
    80	      this.controller.deleteEntry(res, id);
    81	    });
```

**Before (198f9c1) — File:** `test/journal.http` (lines 67–68)
```http
    67	### Step 19 verify entry page includes edit link
    68	GET http://localhost:3000/entries/1
```

**After (af0d8ce) — File:** `test/journal.http` (lines 67–71)
```http
    67	### Step 19 verify entry page includes edit link
    68	GET http://localhost:3000/entries/1
    69	
    70	### Step 20 verify POST delete form route
    71	POST http://localhost:3000/entries/1/delete
```

### Step 22: Delete Button on Entry — Commit timeline: 3.4-logging-and-http-method-expansion @ af0d8ced0e6701ef2a93dcf5cfdc83f95a8f01d2 → 3.4-logging-and-http-method-expansion @ 1d4c700665521da58eed220c66190e883ceafe29

Quick jump: `git checkout 1d4c700665521da58eed220c66190e883ceafe29`

We add a delete form directly on the entry page to pair the new POST route with a visible control.

**Before (af0d8ce) — File:** `src/controller/JournalController.ts` (lines 51–61)
```ts
    51	  showEntry(res: Response, id: string): void {
    52	    this.logger.info(`Showing entry ${id}`);
    53	    let html = "<h1>Journal Entry Not Found</h1>";
    54	    const entry = this.service.getEntry(id);
    55	    if (entry) {
    56	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>
    57	        <p><a href="/entries/${entry.id}/edit">Edit Entry</a></p>
    58	        <p><a href="/entries">Back to Entries</a></p>`;
    59	    }
    60	    res.send(html);
    61	  }
```

**After (1d4c700) — File:** `src/controller/JournalController.ts` (lines 51–63)
```ts
    51	  showEntry(res: Response, id: string): void {
    52	    this.logger.info(`Showing entry ${id}`);
    53	    let html = "<h1>Journal Entry Not Found</h1>";
    54	    const entry = this.service.getEntry(id);
    55	    if (entry) {
    56	      html = `<h1>Journal Entry</h1><p>${entry.content}</p>
    57	        <p><a href="/entries/${entry.id}/edit">Edit Entry</a></p>
    58	        <form action="/entries/${entry.id}/delete" method="POST">
    59	          <button type="submit">Delete Entry</button>
    60	        </form>
    61	        <p><a href="/entries">Back to Entries</a></p>`;
    62	    }
    63	    res.send(html);
```

**Before (af0d8ce) — File:** `test/journal.http` (lines 70–71)
```http
    70	### Step 20 verify POST delete form route
    71	POST http://localhost:3000/entries/1/delete
```

**After (1d4c700) — File:** `test/journal.http` (lines 70–74)
```http
    70	### Step 20 verify POST delete form route
    71	POST http://localhost:3000/entries/1/delete
    72	
    73	### Step 21 verify entry page includes delete form
    74	GET http://localhost:3000/entries/1
```

### Step 23: Home Navigation Links — Commit timeline: 3.4-logging-and-http-method-expansion @ 1d4c700665521da58eed220c66190e883ceafe29 → 3.4-logging-and-http-method-expansion @ e4a3531e9b266a686b6bcde77e9bf408059cf305

Quick jump: `git checkout e4a3531e9b266a686b6bcde77e9bf408059cf305`

We add navigation links on the home page to make the list and entry creation routes easy to reach.

**Before (1d4c700) — File:** `static/journal.html` (lines 1–9)
```html
     1	<html>
     2	  <head>
     3	    <title>Journal App</title>
     4	    <link rel="stylesheet" type="text/css" href="/styles.css" />
     5	  </head>
     6	  <body>
     7	    <h1>Welcome to the Journal App!</h1>
     8	    <p>This is the starting point of our Journal Application.</p>
     9	  </body>
```

**After (e4a3531) — File:** `static/journal.html` (lines 1–13)
```html
     1	<html>
     2	  <head>
     3	    <title>Journal App</title>
     4	    <link rel="stylesheet" type="text/css" href="/styles.css" />
     5	  </head>
     6	  <body>
     7	    <h1>Welcome to the Journal App!</h1>
     8	    <p>This is the starting point of our Journal Application.</p>
     9	    <ul>
    10	      <li><a href="/entries">View All Journal Entries</a></li>
    11	      <li><a href="/entries/new">Create a Journal Entry</a></li>
    12	    </ul>
    13	  </body>
```

**Before (1d4c700) — File:** `test/journal.http` (lines 73–74)
```http
    73	### Step 21 verify entry page includes delete form
    74	GET http://localhost:3000/entries/1
```

**After (e4a3531) — File:** `test/journal.http` (lines 73–77)
```http
    73	### Step 21 verify entry page includes delete form
    74	GET http://localhost:3000/entries/1
    75	
    76	### Step 22 verify home links feature
    77	GET http://localhost:3000/
```

### Step 24: Method Contrast Notes — Commit timeline: 3.4-logging-and-http-method-expansion @ e4a3531e9b266a686b6bcde77e9bf408059cf305 → 3.4-logging-and-http-method-expansion @ 48aa24f4abe3c09953e5d7502e0f47a714f61bec

Quick jump: `git checkout 48aa24f4abe3c09953e5d7502e0f47a714f61bec`

We add teaching notes and contrast requests to highlight method constraints and REST Client usage.

**Before (e4a3531) — File:** `test/journal.http` (lines 73–77)
```http
    73	### Step 21 verify entry page includes delete form
    74	GET http://localhost:3000/entries/1
    75	
    76	### Step 22 verify home links feature
    77	GET http://localhost:3000/
```

**After (48aa24f) — File:** `test/journal.http` (lines 73–88)
```http
    73	### Step 21 verify entry page includes delete form
    74	GET http://localhost:3000/entries/1
    75	
    76	### Step 22 verify home links feature
    77	GET http://localhost:3000/
    78	
    79	### Step 23 teaching note
    80	### Browser forms support GET/POST only.
    81	### Use REST Client for PUT/PATCH/DELETE.
    82	
    83	### Step 23 quick method contrast checks
    84	GET http://localhost:3000/entries/1/edit
    85	PATCH http://localhost:3000/api/entries/1
    86	Content-Type: application/json
    87	
    88	{ "content": "Method contrast patch" }
```

### Step 25: Script Ordering Guide — Commit timeline: 3.4-logging-and-http-method-expansion @ 48aa24f4abe3c09953e5d7502e0f47a714f61bec → 3.4-logging-and-http-method-expansion @ d87cbb9b4e8779776554d014930b5c56c4fb161c

Quick jump: `git checkout d87cbb9b4e8779776554d014930b5c56c4fb161c`

We add a guiding header to keep the REST Client script ordered by feature slices.

**Before (48aa24f) — File:** `test/journal.http` (lines 1–5)
```http
     1	### Step 5 baseline: home
     2	GET http://localhost:3000/
     3	
     4	### Step 5 baseline: list entries
     5	GET http://localhost:3000/entries
```

**After (d87cbb9) — File:** `test/journal.http` (lines 1–6)
```http
     1	### Keep requests ordered by feature step:
     2	### baseline -> PUT slice -> PATCH slice -> DELETE slice -> GET/POST UI routes
     3	### and UI verification checkpoints.
     4	
     5	### Step 5 baseline: home
     6	GET http://localhost:3000/
```

## Conclusion

We finish with a cohesive, logged journal app that supports full REST-style updates and a browser-friendly edit/delete flow, while the test script doubles as a teaching scaffold that keeps the learning path steady and inspectable.
