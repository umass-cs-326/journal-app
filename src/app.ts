import { IApp } from "./contracts";
import express from "express";
// We need these types to type our route handlers
import { Request, Response } from "express";

/**
 * ExpressApp implements IApp.
 *
 * This file is the "composition root" for the application:
 * we create our objects and wire dependencies together here.
 */
export class ExpressApp implements IApp {
  private readonly app: express.Express;

  constructor() {
    this.app = express();
    // Register middleware and routes
    this.registerMiddleware();
    this.registerRoutes();
  }

  registerMiddleware(): void {
    // Apply any global middleware here, e.g., logging, CORS, etc.
    // Need this middleware to serve static files (CSS, JS, images, etc.)
    this.app.use(express.static("static"));
  }

  registerRoutes(): void {
    // Home route serving a simple HTML page
    this.app.get("/", (_req: Request, res: Response) => {
      // In our last example, we sent a string of HTML.
      // Now, we serve a static HTML file from the "static" directory.
      // We could have relied on express.static middleware to do this,
      // but this shows how to send a specific file for a route. The difference
      // is in the URL: "/" vs "/journal.html".
      res.sendFile("journal.html", { root: "static" });
    });

    // Features route serving a static HTML page
    this.app.get("/features", (_req: Request, res: Response) => {
      res.sendFile("features.html", { root: "static" });
    });
  }

  getExpressApp(): express.Express {
    return this.app;
  }
}

/**
 * Helper used by tests and the server.
 * Keeping this as a function makes it easy to create a fresh app per test.
 */
export const CreateApp = (): ExpressApp => new ExpressApp();
