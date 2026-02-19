# Changes: 0c4010d -> 5.7-testing-as-contract-verfication (Run 2026-02-19)

## Git Comparison
- Base branch/hash: `0c4010d`
- Target branch: `5.7-testing-as-contract-verfication`
- Code comparison range: `0c4010d..75654b8`

## Commits Introduced on Target
- `0be016a` test: add Jest and Supertest test infrastructure
- `ddf062f` test: add JournalService contract tests
- `8130e9f` test: add HTTP contract verification integration tests
- `75654b8` refactor: extract app composition for reusable test wiring

## Chapter Summary

In this run, we convert the branch from manual HTTP checks to executable contract verification. First, we add test tooling (Jest + Supertest). Then we lock service behavior with unit tests. Next, we verify the HTTP contract through integration tests (status codes, redirects, JSON responses). Finally, we extract app composition so runtime and tests share the same dependency wiring.

## Git Overview and Helpful Commands

- Show history in compact form:
  - `git log --oneline`
- Show one commit in detail:
  - `git show <hash>`
- Compare two revisions or branches:
  - `git diff <from>..<to>`
- Move working tree to a commit for inspection:
  - `git checkout <hash>`

## Step-by-Step Timeline Walkthrough

### Step 1. Add Test Infrastructure (Jest + Supertest)
- Branch: `5.7-testing-as-contract-verfication`
- Commit: `0be016a5973418192226c5156e124489c737d5bb`
- Quick jump: `git checkout 0be016a5973418192226c5156e124489c737d5bb`

What changed:
- Installed testing dependencies (`jest`, `ts-jest`, `supertest`, types)
- Added `jest.config.cjs`
- Added `tsconfig.json`
- Added `npm test` / `npm run test:watch`
- Added a smoke test (`test/smoke.test.ts`) to verify the harness

Why:
- This commit creates the foundation for all contract tests in later steps.

### Step 2. Verify Service Contracts in Isolation
- Branch: `5.7-testing-as-contract-verfication`
- Commit: `ddf062f131820df68f3c08248188e655ee828f5c`
- Quick jump: `git checkout ddf062f131820df68f3c08248188e655ee828f5c`

What changed:
- Added `test/service/JournalService.test.ts`
- Verified:
  - content is trimmed before repository delegation,
  - blank content maps to `InvalidContent`,
  - oversized content maps to `ValidationError`,
  - repository errors pass through unchanged.

Why:
- Service contracts are business-facing and should remain stable even if repository internals evolve.

### Step 3. Verify HTTP Contracts End-to-End
- Branch: `5.7-testing-as-contract-verfication`
- Commit: `8130e9fecf543adb7c0059d0cf77af5443b6885e`
- Quick jump: `git checkout 8130e9fecf543adb7c0059d0cf77af5443b6885e`

What changed:
- Added `test/http/JournalHttpContracts.test.ts`
- Verified:
  - home route rendering,
  - form POST create -> redirect -> show behavior,
  - 400 rejection for blank form content,
  - 404 mapping for missing entries on HTML routes,
  - 404 mapping for missing entries on JSON API routes,
  - delete success (`204`) and repeated delete failure (`404`).

Why:
- These tests verify externally visible behavior that clients depend on.

### Step 4. Extract Composition Root for Testable Wiring
- Branch: `5.7-testing-as-contract-verfication`
- Commit: `75654b81af8f6259256e39f7d3266c9e0ceb0ec9`
- Quick jump: `git checkout 75654b81af8f6259256e39f7d3266c9e0ceb0ec9`

What changed:
- Added `src/composition.ts` with `createComposedApp(...)`
- Updated `src/server.ts` to use the composition helper
- Updated HTTP integration tests to reuse the same app composition path

Why:
- Runtime and test setup now share one source of truth, reducing setup drift and improving confidence in test realism.

## Verification Command

After Step 4:

```bash
npm test
```

Expected result:
- All suites pass, including smoke, service, and HTTP contract tests.
