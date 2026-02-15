# Changes: bb5c813 -> 4.6-asynchronous-execution-model (Run 2026-02-15)

## Git Comparison
- Base branch: `bb5c813`
- Target branch: `4.6-asynchronous-execution-model`
- Latest target hash: `b13b78239bcee6da2174638b27537453f1489bea`
- Comparison range: `bb5c813..4.6-asynchronous-execution-model`

## Commits Introduced on Target
- `bb5c813` refactor: improve async error handling
- `5ec517e` refactor: update JournalRepository methods to use Promises for async execution
- `add41a1` refactor: update JournalController and JournalService methods to use Promises for async execution
- `0f0210c` refactor: wrap route handlers in asyncHandler for improved error handling
- `17020da` refactor: ensure controller methods return promises for consistent async handling
- `edc4752` Make route handlers async for clarity
- `b13b782` Simplify route handler type annotations

## Chapter Summary
In this run, we set up a safe async path from the routes down to storage. We add a helper to catch async errors, then move the repository and service layers to Promises. We wrap routes with the helper, return the controller Promises, and finally make the handlers use async/await and simpler type annotations.

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

### Step 1. Add an Async Handler Helper
- Branch: `4.6-asynchronous-execution-model`
- Commit: `bb5c81325c24e0df967f3db50a82965d864df9cf`
- Quick jump: `git checkout bb5c81325c24e0df967f3db50a82965d864df9cf`

We add a small wrapper that lets route handlers return Promises and forwards errors to Express.

Before (`src/app.ts:1-10`):
```ts
import path from "node:path";
import { IApp } from "./contracts";
import express from "express";
import { Request, Response } from "express";
import Layouts from "express-ejs-layouts";
import { IJournalController } from "./controller/JournalController";
import { ILoggingService } from "./service/LoggingService";
```

After (`src/app.ts:1-18`):
```ts
import path from 'node:path'
import { IApp } from './contracts'
import express, { RequestHandler } from 'express'
import { Request, Response } from 'express'
import Layouts from 'express-ejs-layouts'
import { IJournalController } from './controller/JournalController'
import { ILoggingService } from './service/LoggingService'

// Type for async route handlers, which return a Promise
type AsyncRequestHandler = RequestHandler

// Helper to wrap async route handlers and catch errors
function asyncHandler(fn: AsyncRequestHandler) {
  return function (req: Request, res: Response, next: any) {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

### Step 2. Make the Repository Promise-Based
- Branch: `4.6-asynchronous-execution-model`
- Commit: `5ec517ec4e4060761d098d0354b95599a563dfde`
- Quick jump: `git checkout 5ec517ec4e4060761d098d0354b95599a563dfde`

We update repository methods to return Promises so the storage layer can become async later.

Before (`src/repository/JournalRespository.ts:13-22`):
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

After (`src/repository/JournalRespository.ts:13-28`):
```ts
export interface IJournalRepository {
  add(content: string): Promise<Result<IJournalEntry, JournalError>>
  getById(id: string): Promise<Result<IJournalEntry, JournalError>>
  getAll(): Promise<Result<IJournalEntry[], JournalError>>
  replaceById(
    id: string,
    content: string,
  ): Promise<Result<IJournalEntry, JournalError>>
  patchById(
    id: string,
    content: string,
  ): Promise<Result<IJournalEntry, JournalError>>
  deleteById(id: string): Promise<Result<null, JournalError>>
}
```

### Step 3. Make the Service Promise-Based
- Branch: `4.6-asynchronous-execution-model`
- Commit: `add41a1115040d0fde72c67b20571b6c4bd56863`
- Quick jump: `git checkout add41a1115040d0fde72c67b20571b6c4bd56863`

We update service contracts and implementations to return Promises and use async functions.

Before (`src/service/JournalService.ts:10-29`):
```ts
export interface IJournalService {
  createEntry(content: string): Result<IJournalEntry, JournalError>;
  getEntry(id: string): Result<IJournalEntry, JournalError>;
  getEntries(): Result<IJournalEntry[], JournalError>;
  replaceEntry(id: string, content: string): Result<IJournalEntry, JournalError>;
  patchEntry(id: string, content: string): Result<IJournalEntry, JournalError>;
  deleteEntry(id: string): Result<null, JournalError>;
}

class JournalService implements IJournalService {
  constructor(private readonly repository: IJournalRepository) {}

  createEntry(content: string): Result<IJournalEntry, JournalError> {
    const normalized = content.trim();
```

After (`src/service/JournalService.ts:10-31`):
```ts
export interface IJournalService {
  createEntry(content: string): Promise<Result<IJournalEntry, JournalError>>
  getEntry(id: string): Promise<Result<IJournalEntry, JournalError>>
  getEntries(): Promise<Result<IJournalEntry[], JournalError>>
  replaceEntry(
    id: string,
    content: string,
  ): Promise<Result<IJournalEntry, JournalError>>
  patchEntry(
    id: string,
    content: string,
  ): Promise<Result<IJournalEntry, JournalError>>
  deleteEntry(id: string): Promise<Result<null, JournalError>>
}

class JournalService implements IJournalService {
  constructor(private readonly repository: IJournalRepository) {}

  async createEntry(
    content: string,
  ): Promise<Result<IJournalEntry, JournalError>> {
    const normalized = content.trim()
```

### Step 4. Wrap Routes with the Async Handler
- Branch: `4.6-asynchronous-execution-model`
- Commit: `0f0210cf29e08bf1dcbc067b1944715f44d3935c`
- Quick jump: `git checkout 0f0210cf29e08bf1dcbc067b1944715f44d3935c`

We use the new helper so route errors can flow into Express error handling.

Before (`src/app.ts:45-63`):
```ts
this.app.get('/', (_req: Request, res: Response) => {
  this.logger.info('GET /')
  this.controller.showHome(res)
})

this.app.get('/entries/new', (_req: Request, res: Response) =>
  controller.showEntryForm(res),
)
```

After (`src/app.ts:45-68`):
```ts
this.app.get(
  '/',
  asyncHandler((_req: Request, res: Response) => {
    this.logger.info('GET /')
    this.controller.showHome(res)
  }),
)

this.app.get(
  '/entries/new',
  asyncHandler((_req: Request, res: Response) =>
    controller.showEntryForm(res),
  ),
)
```

### Step 5. Return Controller Promises from Routes
- Branch: `4.6-asynchronous-execution-model`
- Commit: `17020da4f112835dc37de79340591a3dd58e28bc`
- Quick jump: `git checkout 17020da4f112835dc37de79340591a3dd58e28bc`

We return the Promise from the controller so async errors are caught by the wrapper.

Before (`src/app.ts:63-79`):
```ts
asyncHandler((req: Request, res: Response) => {
  const raw = req.body.content
  const content = typeof raw === 'string' ? raw.trim() : ''

  if (!content) {
    this.logger.warn(
      'POST /entries/new rejected: content missing or empty',
    )
    res.status(400).send('Entry content is required.')
    return
  }

  controller.newEntryFromForm(res, content)
})
```

After (`src/app.ts:63-79`):
```ts
asyncHandler((req: Request, res: Response) => {
  const raw = req.body.content
  const content = typeof raw === 'string' ? raw.trim() : ''

  if (!content) {
    this.logger.warn(
      'POST /entries/new rejected: content missing or empty',
    )
    res.status(400).send('Entry content is required.')
    return
  }

  return controller.newEntryFromForm(res, content)
})
```

### Step 6. Use async/await for Clearer Flow
- Branch: `4.6-asynchronous-execution-model`
- Commit: `edc475222d3b4a26997f4a95c4c0d8c1a9c6c50e`
- Quick jump: `git checkout edc475222d3b4a26997f4a95c4c0d8c1a9c6c50e`

We make the route handlers async and await the controller calls for readability.

Before (`src/app.ts:45-57`):
```ts
this.app.get(
  '/',
  asyncHandler((_req: Request, res: Response) => {
    this.logger.info('GET /')
    return this.controller.showHome(res)
  }),
)
```

After (`src/app.ts:45-58`):
```ts
this.app.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    this.logger.info('GET /')
    await this.controller.showHome(res)
  }),
)
```

### Step 7. Remove Redundant Type Annotations
- Branch: `4.6-asynchronous-execution-model`
- Commit: `b13b78239bcee6da2174638b27537453f1489bea`
- Quick jump: `git checkout b13b78239bcee6da2174638b27537453f1489bea`

We drop repeated Request/Response types where they can be inferred by TypeScript.

Before (`src/app.ts:45-55`):
```ts
this.app.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    this.logger.info('GET /')
    await this.controller.showHome(res)
  }),
)
```

After (`src/app.ts:45-55`):
```ts
this.app.get(
  '/',
  asyncHandler(async (_req, res) => {
    this.logger.info('GET /')
    await this.controller.showHome(res)
  }),
)
```
