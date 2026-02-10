# Logging, Methods, and Forms in an Express Journal App

## Overview

In this lecture we wire a shared logger through our app, expand our HTTP surface area with PUT, PATCH, and DELETE, and round out the UI with edit and delete forms that respect browser constraints. Along the way we practice Express routing and middleware, use TypeScript interfaces and modules to keep boundaries explicit, and build out repository and service layers that make our domain logic easier to grow and test. The result is a journal app that reads like a story: clear routes, deliberate HTTP semantics, and a test script that keeps each step verifiable.

## Big Picture

In a full web application, the backend defines routes and request handling while the frontend provides navigable pages and forms; the two sides meet through HTTP methods, status codes, and payload formats. By adding logging, we make the backend observable; by expanding HTTP methods, we make the API expressive; and by adding HTML forms and links, we make the UI usable without special tooling, all while keeping the code modular through interfaces and layered patterns. These moves are small individually, but together they mirror how real systems grow: clear boundaries, intentional protocols, and testable behavior that scales from development to production.

## Concepts List

- Express routing with app.METHOD handlers
- HTTP methods and their semantics (GET, POST, PUT, PATCH, DELETE)
- Express middleware and body parsing (express.json, express.urlencoded)
- Request data sources (req.params, req.body)
- Response construction (res.send, res.json, res.status, res.sendFile, res.redirect)
- HTTP status codes (200, 204, 404)
- Static file serving (express.static)
- HTML forms: method and enctype constraints
- TypeScript interfaces (contracts for services/controllers)
- TypeScript modules (import/export boundaries)
- Repository pattern (data access abstraction)
- Service layer pattern (business logic boundary)
- Dependency injection and composition root
- Singleton pattern for shared services
- Logging with Node.js console
- API verification via scripted HTTP requests

## Express Routing with app.METHOD Handlers

Express routing maps HTTP methods and paths to handler functions, letting us define separate behaviors for GET, POST, PUT, PATCH, and DELETE endpoints while keeping the app readable. This is the backbone for wiring UI routes, API routes, and our edit/delete form flows. Why: route-level clarity keeps the application structure predictable and makes it easy to add new behaviors without tangled conditionals. Used in Step 1, Step 5, Step 9, Step 12, Step 15, Step 17, Step 19, and Step 21.
References: `https://expressjs.com/en/guide/routing.html`

## HTTP Methods and Their Semantics

HTTP methods describe intent: GET retrieves, POST submits, PUT replaces, PATCH modifies, and DELETE removes, which is exactly the range we add to the journal API. Using the correct method keeps our API self-describing and aligns client expectations with server behavior. Why: method semantics encode meaning that tools, caches, and other developers rely on. Used in Step 5, Step 9, Step 12, Step 15, Step 19, Step 21, and Step 24.
References: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods`

## Express Middleware and Body Parsing

Express middleware like express.json and express.urlencoded parses incoming request bodies into req.body so our handlers can read JSON and form submissions safely, while express.static serves static assets from a directory. These middleware functions are built into Express and are the standard way to prepare request data for route handlers. Why: middleware keeps parsing and static serving consistent and reusable, instead of duplicating logic per route. Used in Step 1, Step 9, Step 12, Step 19, and Step 23.
References: `https://expressjs.com/en/guide/using-middleware` `https://expressjs.com/en/4x/api.html`

## Request Data Sources: req.params and req.body

Express exposes route parameters via req.params and body data via req.body, which lets us read entry IDs from URLs and content from JSON or form submissions. These are the primary inputs that drive updates, patches, and deletions in the journal app. Why: separating URL parameters from body payloads clarifies which data identifies a resource and which data modifies it. Used in Step 1, Step 9, Step 12, Step 15, Step 17, Step 19, and Step 21.
References: `https://expressjs.com/en/guide/routing.html` `https://expressjs.com/en/4x/api.html`

## Response Construction: res.send, res.json, res.status, res.sendFile, res.redirect

Express response helpers let us send HTML (res.send), JSON (res.json), status codes (res.status), static files (res.sendFile), and redirects (res.redirect) in a consistent way. We lean on these methods to return entry pages, API responses, edit forms, and redirect after form submissions. Why: expressive response helpers make server intent obvious and avoid low-level header manipulation. Used in Step 1, Step 8, Step 12, Step 14, Step 16, Step 18, and Step 23.
References: `https://expressjs.com/en/4x/api.html`

## HTTP Status Codes (200, 204, 404)

HTTP status codes communicate outcome: 200 for success with a response body, 204 for success without content (useful after DELETE), and 404 for missing resources. We use these to make API responses precise and predictable. Why: consistent status codes help clients and tests interpret outcomes correctly without guessing. Used in Step 14.
References: `https://developer.mozilla.org/docs/Web/HTTP/Reference/Status` `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204`

## Static File Serving

Static file serving lets Express deliver HTML files directly from a directory using express.static, which is how the home page and other static assets are exposed. This keeps simple pages lightweight while still living inside the same server. Why: static serving separates templated/server-generated content from simple assets and keeps request handling minimal. Used in Step 23.
References: `https://expressjs.com/en/guide/using-middleware` `https://expressjs.com/en/starter/static-files` `https://expressjs.com/en/4x/api.html`

## HTML Forms: Method and Enctype Constraints

HTML forms only submit using GET or POST and default to application/x-www-form-urlencoded when method is POST, which is why we build POST-based edit and delete routes. This browser constraint shapes our UI-side flows even when the API supports PUT/PATCH/DELETE. Why: understanding form constraints helps us design routes that work in a real browser without extra tooling. Used in Step 16, Step 19, Step 21, and Step 24.
References: `https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/form`

## TypeScript Interfaces

TypeScript interfaces describe the shape of objects and provide contracts for components like logging services, repositories, and controllers, without coupling code to concrete implementations. This keeps our codebase refactor-friendly and type-safe as we evolve behavior. Why: interfaces let us define expectations up front so that changes are safer and clearer. Used in Step 2, Step 7, Step 8, Step 10, and Step 13.
References: `https://www.typescriptlang.org/docs/handbook/interfaces`

## TypeScript Modules (import/export)

TypeScript modules use import and export to share code across files while keeping module scope isolated, which is how we wire services and controllers together cleanly. This allows the app to grow without turning into a single giant file. Why: explicit module boundaries make dependencies visible and easier to reason about. Used in Step 2, Step 3, Step 4, Step 7, and Step 8.
References: `https://www.typescriptlang.org/docs/handbook/2/modules.html`

## Repository Pattern

A repository mediates between the domain and data mapping layers using a collection-like interface, hiding persistence details and centralizing data operations. Our in-memory journal repository follows this idea when we add replace, patch, and delete behaviors. Why: a repository isolates storage concerns so the rest of the app can evolve without rewriting data access. Used in Step 7, Step 10, and Step 13.
References: `https://martinfowler.com/eaaCatalog/repository.html`

## Service Layer Pattern

A service layer organizes business logic into a dedicated boundary, so controllers can stay focused on HTTP concerns while services coordinate domain actions. Our journal service exposes create, replace, patch, and delete as a coherent interface for controllers. Why: separating service logic reduces coupling and keeps controllers lean. Used in Step 7, Step 10, and Step 13.
References: `https://en.wikipedia.org/wiki/Service_layer_pattern`

## Dependency Injection and Composition Root

Dependency injection provides dependencies from the outside instead of constructing them inside a class, which is why we pass the logger and services into app and controller constructors. We assemble those dependencies at a single composition point in the server setup. Why: injection makes components testable and keeps construction concerns out of business logic. Used in Step 3 and Step 4.
References: `https://en.wikipedia.org/wiki/Dependency_injection`

## Singleton Pattern for Shared Services

The singleton pattern restricts a class to a single instance and provides a global access point to it, which matches our shared logging service factory. This ensures every part of the app logs through the same object. Why: a singleton keeps shared infrastructure consistent and avoids duplicate state. Used in Step 2.
References: `https://en.wikipedia.org/wiki/Singleton_pattern`

## Logging with Node.js Console

Node.js provides console.log, console.warn, and console.error as a simple debugging console, which we wrap in a logging service for consistent app messages. These methods write to standard output/error streams, giving us immediate visibility into route and controller activity. Why: structured logging makes it easier to trace behavior as features grow. Used in Step 2, Step 4, and Step 5.
References: `https://nodejs.org/download/release/v8.10.0/docs/api/console.html`

## API Verification via Scripted HTTP Requests

Scripted HTTP requests let us verify endpoints incrementally by exercising specific methods and checking responses, mirroring how clients interact with the API. This keeps the timeline in CHANGES.md testable at every step and emphasizes protocol correctness. Why: reliable verification prevents regressions as we add routes and behaviors. Used in Step 2, Step 6, Step 9, Step 12, Step 15, Step 17, Step 19, Step 21, Step 24, and Step 25.
References: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods` `https://developer.mozilla.org/docs/Web/HTTP/Reference/Status`

## Conclusion

We used a tight set of concepts to grow the app safely: Express routing and middleware make HTTP behavior explicit, TypeScript interfaces and modules keep boundaries clear, and layered patterns (repository, service, DI, singleton) keep responsibilities separated. On top of that, proper HTTP semantics, status codes, and form constraints let the UI and API work together predictably, while logging and scripted checks keep the system observable and verifiable. Together these concepts give us a journal app that is easier to understand, easier to test, and ready to evolve.
