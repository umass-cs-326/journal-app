# The Journal App

A Journal Application for demonstration purposes.

## Overview

This application is part of an 8-week series of lectures on building web applications. Each week focuses on different aspects of web development, from front-end design to back-end architecture. Each lecture is associated with a particular branch in this repository.

## Branch

This branch is `4.6-asynchronous-execution-model`. It is associated with lecture 4.6 and should be referenced in conjunction with the lecture slides for that lecture. It continues the journal app narrative by making async behavior consistent from routes to storage. The repository and service now return Promises, and controllers are ready to await those results. This keeps the whole call chain aligned when we later swap in real async I/O like a database.

At the route layer, we add a small async handler wrapper so Promise rejections flow into Express error handling. Routes are updated to return and await controller calls, which makes error flow reliable and the code easier to follow. A final cleanup removes redundant type annotations in handlers so students can focus on the logic instead of boilerplate.

## Reading

Please read the following documents. The `CONCEPTS.md` file provides an overview of the key concepts covered in this branch as well as links to required readings. The required readings are those items identified as `Required Reading`. The `CHANGES.md` file walks through the changes made in this branch, providing context and explanations for each step in the development process.

You are required to read both of the documents below and only the links to required readings identified in the `CONCEPTS.md` file as `Required Reading`. The other links are provided for reference and are not required reading. Naturally, it is expected that you will review the code in this branch and understand the implementation.

- [CONCEPTS.md](CONCEPTS.md): An overview of the key concepts covered in this branch.
- [CHANGES.md](CHANGES.md): A walkthrough of the changes made in this branch.
