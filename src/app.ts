import { IApp } from "./contracts";
import express, { response } from "express";
// We need these types to type our route handlers
import { Request, Response } from "express";
import { IJournalController } from './controller/JournalController';

/**
 * ExpressApp implements IApp.
 *
 * This file is the "composition root" for the application:
 * we create our objects and wire dependencies together here.
 */
export class ExpressApp implements IApp {
  private readonly app: express.Express;

  constructor(private readonly controller: IJournalController) {
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
    // Required because of how 'this' works in JS/TS
    const showHome = (res: Response) => this.controller.showHome(res);
    const showEntryForm = (res: Response) => this.controller.showEntryForm(res);
    const showSearchForm = (res: Response) => this.controller.showSearchForm(res);
    const newEntryFromForm = (res: Response, content: string) =>
      this.controller.newEntryFromForm(res, content);
    const showAllEntries = (res: Response) => this.controller.showAllEntries(res);
    const showEntry = (res: Response, id: string) =>
      this.controller.showEntry(res, id);

    // Home route serving a simple HTML page
    this.app.get("/", (_req: Request, res: Response) => showHome(res));

    // Route to show the form for a new journal entry
    this.app.get("/entries/new", (_req: Request, res: Response) =>
      showEntryForm(res)
    );

    // Route to handle form submission for a new journal entry
    this.app.post("/entries/new", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
      const content = req.body.content;
      newEntryFromForm(res, content);
    });

    // Route to show the form for searching a journal entry by ID
    this.app.get("/entries/search", (_req: Request, res: Response) =>
      showSearchForm(res)
    );

    // Route to handle form submission for searching a journal entry by ID
    this.app.post("/entries/search", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
      const id = req.body.id;
      res.redirect(`/entries/${id}`);
    });

    // Route to show all journal entries
    this.app.get("/entries", (_req: Request, res: Response) =>
      showAllEntries(res)
    );

    // Route to show a specific journal entry by ID
    this.app.get("/entries/:id", (req: Request, res: Response) => {
      const id = req.params.id as string;
      showEntry(res, id);
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
export const CreateApp = 
  (controller: IJournalController): ExpressApp => 
    new ExpressApp(controller);
