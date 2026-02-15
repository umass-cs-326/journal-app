# Lecture 4.6 Concepts: Async Flow, Promises, and Error Handling in Express

## Overview

In this lecture we move the journal app to a consistent async execution model. We add a small helper for async route handlers, shift repository and service methods to return Promises, and then update routes to return and await controller calls. The final cleanup removes redundant type annotations so the async code is easier to read.

## Big Picture

A request starts at the route, moves through the controller and service, then reaches the repository. In this iteration, every step can return a Promise, so errors can be caught in one place and handled consistently. Wrapping routes with an async handler lets Express receive errors from async code. Using async/await makes the flow easy to follow, while keeping type annotations light makes the code more approachable.

## Concepts List

- Promises as the standard async return type
- Async function boundaries across layers
- Async route handler wrappers
- Express error propagation with `next`
- Returning Promises from handlers
- async/await for linear control flow
- Consistent async interfaces in TypeScript
- Type inference to reduce noise
- Gradual async migration for future I/O

## Promises as the standard async return type

Promises provide a uniform way to represent work that completes later. By returning Promises from repositories, services, and controllers, each layer can be awaited by the next one. Why: We choose Promises because they are the native async primitive in JavaScript and they compose cleanly across layers. Used in Step 2, Step 3.

Required Reading:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

## Async function boundaries across layers

Async boundaries are the places where a function returns a Promise and can be awaited. In this lecture, repository, service, and controller methods are all async-ready so the call chain stays consistent. Why: We choose consistent async boundaries to avoid mixing sync and async assumptions across the app. Used in Step 2, Step 3, Step 5, Step 6.

Required Reading:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

## Async route handler wrappers

Express does not automatically catch rejected Promises from async handlers. A wrapper like `asyncHandler` ensures any async error is forwarded to Express error handling. Why: We choose a wrapper so route code can stay clean while errors still flow to `next`. Used in Step 1, Step 4.

Required Reading:

- https://expressjs.com/en/guide/error-handling.html

## Express error propagation with `next`

In Express, calling `next(err)` hands control to the error middleware. The async wrapper uses `catch(next)` so errors from Promises are handled the same way as thrown errors. Why: We choose `next` to stay within Express’s standard error flow. Used in Step 1.

References:

- https://expressjs.com/en/guide/error-handling.html

## Returning Promises from handlers

Even when a handler is wrapped, it still needs to return the Promise so the wrapper can observe failures. Returning the controller call ensures errors are not swallowed. Why: We choose explicit returns to keep error handling reliable. Used in Step 5.

References:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return

## async/await for linear control flow

`async` and `await` let us write asynchronous code that reads top-to-bottom like synchronous code. This reduces cognitive load for students and makes control flow clearer. Why: We choose async/await for readability, especially in route handlers. Used in Step 6.

References:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

## Consistent async interfaces in TypeScript

TypeScript interfaces that return Promises make async behavior explicit for callers. When the repository and service both return Promises, the controller can await them without guessing. Why: We choose explicit Promise return types to align code behavior and types. Used in Step 2, Step 3.

References:

- https://www.typescriptlang.org/docs/handbook/2/functions.html

## Type inference to reduce noise

TypeScript can infer parameter types from context, which allows us to remove repeated annotations in route handlers. This keeps the code focused on behavior instead of boilerplate. Why: We choose inference in simple cases to improve readability for learners. Used in Step 7.

References:

- https://www.typescriptlang.org/docs/handbook/type-inference.html

## Gradual async migration for future I/O

Even if the repository is in-memory today, returning Promises makes it easy to replace with a real database later without changing the rest of the app. Why: We choose a gradual migration path so the design scales when persistence becomes truly async. Used in Step 2, Step 3.

References:

- https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control

## Conclusion

These concepts matter because they make async behavior predictable and teachable. By standardizing on Promises, wrapping route handlers, and using async/await, we make error handling consistent and control flow easy to follow. This prepares the app for real async I/O later while keeping the current code simple for students.
