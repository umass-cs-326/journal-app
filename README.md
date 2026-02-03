# The Journal App

A Journal Application for demonstration purposes.

## Overview

This application is part of an 8-week series of lectures on building web applications. Each week focuses on different aspects of web development, from front-end design to back-end architecture. Each lecture is associated with a particular branch in this repository.

## Lecture 1.2 - Elevating The Design of a Journal Application

### What was added on this branch

- New Express route `GET /` that serves a static HTML page starting point for the journal app.
- Build/run workflow updated for TypeScript: compile to `dist/` with `tsc` before starting the server.

### How to build and run

1. Install dependencies: `npm install`
2. Start in dev mode (build then run): `npm run dev`
   - Under the hood, this runs `npm run build` and then `node dist/server.js`.
3. Or build only: `npm run build` (outputs compiled files to `dist/`).
4. Open the app: visit `http://localhost:3000/` for the home page or `http://localhost:3000/features` for the new features page.
5. Stop the server: `Ctrl+C` in the terminal.
