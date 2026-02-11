# The Journal App

A Journal Application for demonstration purposes.

## Overview

This application is part of an 8-week series of lectures on building web applications. Each week focuses on different aspects of web development, from front-end design to back-end architecture. Each lecture is associated with a particular branch in this repository.

## Branch

This branch is `3.4-logging-and-method-expansion`. It is associated with lecture 3.4 and should be referenced in conjunction with the lecture slides for that lecture. It tells the story of the journal app growing from a simple create/read experience into the beginnings of a web application. It starts by tightening route wiring and introducing a shared logging service, then threads that logger through the composition root so the server, app, and controller all speak with one voice. With that foundation in place, each route and controller action becomes easier to observe, which makes the next round of changes safer and easier to reason about.

From there, the core API surface expands method by method. The repository and service layers gain the internals needed for full replacement, partial updates, and deletion, and the controller and routes are extended to expose those capabilities through PUT, PATCH, and DELETE endpoints. The progression is intentionally incremental, so each new behavior is introduced and verified in sequence instead of being dropped in all at once. This keeps the architecture coherent: controllers stay focused on HTTP concerns, services own application logic, and repositories handle data operations.

The branch then closes the gap between API capabilities and browser realities. Because HTML forms are limited to GET and POST, the app adds form-friendly edit and delete flows: a GET route to render an edit page, a POST route to submit edits, and a POST route for deletion. The entry page is updated with direct edit and delete affordances, and the home page gains clear navigation links so the UI feels like a complete path rather than a set of disconnected endpoints. The result is a practical dual model: RESTful method support for API clients, plus browser-compatible routes for everyday UI interaction.

Running through all of this is a deliberate verification narrative in `test/journal.http`. The script evolves into an ordered checkpoint sequence that mirrors the feature timeline, including method-contrast notes that reinforce why some actions are tested with REST Client while others are exercised through form routes. In effect, the branch is not just a set of code changes; it is a guided progression toward an observable, layered, and minimally functional journal app.

## Reading

Please read the following documents. The `CONCEPTS.md` file provides an overview of the key concepts covered in this branch as well as links to required readings. The required readings are those items identified as `Readings`. The `CHANGES.md` file walks through the changes made in this branch, providing context and explanations for each step in the development process.

You are required to read both of the documents below and only the links to readings identified in the `CONCEPTS.md` file as `Readings`. The other links are provided for reference and are not required reading. Naturally, it is expected that you will review the code in this branch and understand the implementation.

- [CONCEPTS.md](CONCEPTS.md): An overview of the key concepts covered in this branch.
- [CHANGES.md](CHANGES.md): A walkthrough of the changes made in this branch.
