import { IApp } from "./contracts";
import express, { response } from "express";
// We need these types to type our route handlers
import { Request, Response } from "express";
import { IJournalController } from './controller/JournalController';
import { ILoggingService } from "./service/LoggingService";

/**
 * ExpressApp implements IApp.
 *
 * This file is the "composition root" for the application:
 * we create our objects and wire dependencies together here.
 */
export class ExpressApp implements IApp {
  private readonly app: express.Express;

  constructor(
    private readonly controller: IJournalController,
    private readonly logger: ILoggingService
  ) {
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
    const controller = this.controller;

    // Home route serving a simple HTML page
    this.app.get("/", (_req: Request, res: Response) => {
      this.logger.info("GET /");
      this.controller.showHome(res);
    });

    // Route to show the form for a new journal entry
    this.app.get("/entries/new", (_req: Request, res: Response) =>
      controller.showEntryForm(res)
    );

    // Route to handle form submission for a new journal entry
    this.app.post("/entries/new", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
      const content = req.body.content;
      controller.newEntryFromForm(res, content);
    });

    // Route to show all journal entries
    this.app.get("/entries", (_req: Request, res: Response) =>
      controller.showAllEntries(res)
    );

    // Route to show a specific journal entry by ID
    this.app.get("/entries/:id", (req: Request, res: Response) => {
      const id = req.params.id as string;
      controller.showEntry(res, id);
    });

    this.app.get("/entries/:id/edit", (req: Request, res: Response) => {
      this.logger.info(`GET /entries/${req.params.id}/edit`);
      const id = req.params.id as string;
      this.controller.showEditForm(res, id);
    });

    this.app.put("/api/entries/:id", express.json(), (req, res) => {
      this.logger.info(`PUT /api/entries/${req.params.id}`);
      const id = req.params.id as string;
      const content = req.body.content as string;
      this.controller.replaceEntry(res, id, content);
    });

    this.app.patch("/api/entries/:id", express.json(), (req, res) => {
      this.logger.info(`PATCH /api/entries/${req.params.id}`);
      const id = req.params.id as string;
      const content = req.body.content as string;
      this.controller.patchEntry(res, id, content);
    });

    this.app.delete("/api/entries/:id", (req: Request, res: Response) => {
      this.logger.info(`DELETE /api/entries/${req.params.id}`);
      const id = req.params.id as string;
      this.controller.deleteEntry(res, id);
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
  (controller: IJournalController, logger: ILoggingService): ExpressApp => 
    new ExpressApp(controller, logger);
