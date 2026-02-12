# The Journal App

A Journal Application for demonstration purposes.

## Overview

This application is part of an 8-week series of lectures on building web applications. Each week focuses on different aspects of web development, from front-end design to back-end architecture. Each lecture is associated with a particular branch in this repository.

## Branch

This branch is `3.5-results-errors-validation`. It is associated with lecture 3.5 and should be referenced in conjunction with the lecture slides for that lecture. It continues the journal app narrative by replacing exception-driven flow with typed `Result<T, E>` outcomes and a discriminated `JournalError` model. With explicit success and failure values, each layer can signal intent clearly, and the controller can map domain errors to consistent HTTP responses.

From there, the branch tightens validation as a deliberate, layered practice. The route boundary rejects malformed form submissions early, the service enforces core business rules, and repository methods return typed failures instead of throwing. A small logging upgrade adds timestamps so the new validation and error paths are easier to observe and debug.

The UI story shifts in parallel: controllers stop concatenating HTML strings and instead render EJS templates with a shared base layout. Views for home, entries, and not-found cases provide a consistent shell, while updated CSS makes the app feel more like a real product. The branch wraps up by separating form-delete redirects from API delete semantics and by adding HTTP regression checks that validate the new templated routes and 400-level error responses.

## Reading

Please read the following documents. The `CONCEPTS.md` file provides an overview of the key concepts covered in this branch as well as links to required readings. The required readings are those items identified as `Required Reading`. The `CHANGES.md` file walks through the changes made in this branch, providing context and explanations for each step in the development process.

You are required to read both of the documents below and only the links to required readings identified in the `CONCEPTS.md` file as `Required Reading`. The other links are provided for reference and are not required reading. Naturally, it is expected that you will review the code in this branch and understand the implementation.

- [CONCEPTS.md](CONCEPTS.md): An overview of the key concepts covered in this branch.
- [CHANGES.md](CHANGES.md): A walkthrough of the changes made in this branch.
