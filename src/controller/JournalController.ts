import type { Response } from "express";
import { IJournalService } from "../service/JournalService";
import { ILoggingService } from "../service/LoggingService";
import { JournalError } from "../service/errors";

export interface IJournalController {
  showHome(res: Response): void;
  showEntryForm(res: Response): void;
  newEntryFromForm(res: Response, content: string): void;
  showAllEntries(res: Response): void;
  showEntry(res: Response, id: string): void;
  showEditForm(res: Response, id: string): void;
  updateEntryFromForm(res: Response, id: string, content: string): void;
  replaceEntry(res: Response, id: string, content: string): void;
  patchEntry(res: Response, id: string, content: string): void;
  deleteEntry(res: Response, id: string): void;
}

class JournalController implements IJournalController {
  constructor(
    private readonly service: IJournalService,
    private readonly logger: ILoggingService
  ) {}

  private isJournalError(value: unknown): value is JournalError {
    return (
      typeof value === "object" &&
      value !== null &&
      "name" in value &&
      "message" in value
    );
  }

  private mapErrorStatus(error: JournalError): number {
    if (error.name === "EntryNotFound") {
      return 404;
    }
    if (error.name === "InvalidContent" || error.name === "ValidationError") {
      return 400;
    }
    return 500;
  }

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

    const result = this.service.createEntry(content);
    if (!result.ok && this.isJournalError(result.value)) {
      const error = result.value;
      if (error.name === "InvalidContent" || error.name === "ValidationError") {
        this.logger.warn(`Create entry rejected: ${error.message}`);
        res.status(400).send(error.message);
        return;
      }

      this.logger.error(`Create entry failed: ${error.message}`);
      res.status(500).send("Unable to create entry.");
      return;
    }

    if (!result.ok) {
      res.status(500).send("Unable to create entry.");
      return;
    }

    res.redirect(`/entries/${result.value.id}`);
  }

  showAllEntries(res: Response): void {
    this.logger.info("Listing all journal entries");
    const result = this.service.getEntries();
    if (!result.ok && this.isJournalError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).send(result.value.message);
      return;
    }
    if (!result.ok) {
      res.status(500).send("Unable to list entries");
      return;
    }

    const entries = result.value;
    let html = "<h1>All Journal Entries</h1><ul>";
    for (const entry of entries) {
      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    }
    html += "</ul>";
    res.send(html);
  }

  showEntry(res: Response, id: string): void {
    this.logger.info(`Showing entry ${id}`);
    const result = this.service.getEntry(id);
    if (!result.ok && this.isJournalError(result.value) && result.value.name === "EntryNotFound") {
      res.status(404).send("<h1>Journal Entry Not Found</h1>");
      return;
    }
    if (!result.ok && this.isJournalError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).send(result.value.message);
      return;
    }
    if (!result.ok) {
      res.status(500).send("Unable to load entry.");
      return;
    }

    const entry = result.value;
    const html = `<h1>Journal Entry</h1><p>${entry.content}</p>
      <p><a href="/entries/${entry.id}/edit">Edit Entry</a></p>
      <form action="/entries/${entry.id}/delete" method="POST">
        <button type="submit">Delete Entry</button>
      </form>
      <p><a href="/entries">Back to Entries</a></p>`;

    res.send(html);
  }

  showEditForm(res: Response, id: string): void {
    const result = this.service.getEntry(id);
    if (!result.ok && this.isJournalError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).send(result.value.message);
      return;
    }
    if (!result.ok) {
      res.status(500).send("Unable to load edit form");
      return;
    }

    const entry = result.value;
    const html = `<h1>Edit Journal Entry</h1>
      <p>This form uses POST because browser forms support GET/POST.</p>
      <form action="/entries/${entry.id}/edit" method="POST">
        <textarea name="content" rows="8" cols="60" required>${entry.content}</textarea>
        <button type="submit">Save Changes</button>
      </form>`;
    res.send(html);
  }

  updateEntryFromForm(res: Response, id: string, content: string): void {
    this.logger.info(`Updating entry ${id} from form POST`);
    const result = this.service.patchEntry(id, content);
    if (!result.ok && this.isJournalError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).send(result.value.message);
      return;
    }
    if (!result.ok) {
      res.status(500).send("Unable to update entry");
      return;
    }
    res.redirect(`/entries/${id}`);
  }

  replaceEntry(res: Response, id: string, content: string): void {
    this.logger.info(`Replacing entry ${id} via PUT`);
    const result = this.service.replaceEntry(id, content);
    if (!result.ok && this.isJournalError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).json({ message: result.value.message });
      return;
    }
    if (!result.ok) {
      res.status(500).json({ message: "Unable to replace entry" });
      return;
    }
    res.json(result.value);
  }

  patchEntry(res: Response, id: string, content: string): void {
    this.logger.info(`Patching entry ${id} via PATCH`);
    const result = this.service.patchEntry(id, content);
    if (!result.ok && this.isJournalError(result.value)) {
      res.status(this.mapErrorStatus(result.value)).json({ message: result.value.message });
      return;
    }
    if (!result.ok) {
      res.status(500).json({ message: "Unable to patch entry" });
      return;
    }
    res.json(result.value);
  }

  deleteEntry(res: Response, id: string): void {
    this.logger.info(`Deleting entry ${id}`);
    const result = this.service.deleteEntry(id);
    if (!result.ok && this.isJournalError(result.value)) {
      this.logger.warn(`Delete failed for ${id}`);
      res.status(this.mapErrorStatus(result.value)).json({ message: result.value.message });
      return;
    }
    if (!result.ok) {
      res.status(500).json({ message: "Unable to delete entry" });
      return;
    }
    res.status(204).send();
  }
}

export function CreateJournalController(
  service: IJournalService,
  logger: ILoggingService
): IJournalController {
  return new JournalController(service, logger);
}
