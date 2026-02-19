# The Journal App

A Journal Application for demonstration purposes.

## Overview

This application is part of an 8-week series of lectures on building web applications. Each week focuses on different aspects of web development, from front-end design to back-end architecture. Each lecture is associated with a particular branch in this repository.

## Branch

This branch is `5.7-testing-as-contract-verfication`. It is associated with lecture 5.7, titled "Testing as Contract Verification". This lecture introduces a full testing workflow with Jest and Supertest, then uses those tests to verify behavioral contracts at two boundaries:

- Service boundary: domain validation + repository delegation
- HTTP boundary: status codes, redirects, and JSON/HTML error semantics

The branch also extracts app composition into a reusable module so runtime and tests share identical wiring while using different logging implementations.

## Reading

Please read the following documents. The `CONCEPTS.md` file provides an overview of the key concepts covered in this branch as well as links to required readings. The required readings are those items identified as `Required Reading`. The other links are provided for reference and are not required reading. Naturally, it is expected that you will review the code in this branch and understand the implementation.

You are required to read both of the documents below and only the links to required readings identified in the `CONCEPTS.md` file as `Required Reading`.

- [CONCEPTS.md](CONCEPTS.md): An overview of the key concepts covered in this branch.
- [CHANGES.md](CHANGES.md): A walkthrough of the changes made in this branch.
