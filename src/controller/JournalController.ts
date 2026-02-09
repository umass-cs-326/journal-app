import type { Response } from 'express';
import { IJournalService } from '../service/JournalService';
import { ILoggingService } from "../service/LoggingService";

export interface IJournalController {
  showHome(res: Response): void;
  showEntryForm(res: Response): void;
  newEntryFromForm(res: Response, content: string): void;
  showAllEntries(res: Response): void;
  showEntry(res: Response, id: string): void;
  replaceEntry(res: Response, id: string, content: string): void;
}

class JournalController implements IJournalController {
  constructor(
    private readonly service: IJournalService,
    private readonly logger: ILoggingService
  ) {}

  showHome(res: Response): void {
    this.logger.info("Rendering home page");
    res.sendFile("journal.html", { root: "static" });
  }

  showEntryForm(res: Response): void {
    this.logger.info("Rendering new entry form");
    res.sendFile("entry-form.html", { root: "static" });
  }

  newEntryFromForm(res: Response, content: string): void {
    this.logger.info("Creating entry from form");
    this.service.createEntry(content);
    res.redirect("/");
  }

  showAllEntries(res: Response): void {
    this.logger.info("Listing all journal entries");
    const entries = this.service.getEntries();
    let html = "<h1>All Journal Entries</h1><ul>";
    for (const entry of entries) {
      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    }
    html += "</ul>";
    res.send(html);
  }

  showEntry(res: Response, id: string): void {
    this.logger.info(`Showing entry ${id}`);
    let html = "<h1>Journal Entry Not Found</h1>";
    const entry = this.service.getEntry(id);
    if (entry) {
      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    }
    res.send(html);
  }

  replaceEntry(res: Response, id: string, content: string): void {
    this.logger.info(`Replacing entry ${id} via PUT`);
    const updated = this.service.replaceEntry(id, content);
    res.json(updated);
  }
}

export function CreateJournalController(
  service: IJournalService,
  logger: ILoggingService
): IJournalController {
  return new JournalController(service, logger);
}
