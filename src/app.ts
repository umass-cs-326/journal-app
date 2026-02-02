import { IApp } from "./contracts";
import express from "express";

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
