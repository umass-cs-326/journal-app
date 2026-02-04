import type { Response } from 'express';
import { IJournalService } from '../service/JournalService';

export interface IJournalController {
  showHome(res: Response): void;
  showEntryForm(res: Response): void;
  newEntryFromForm(res: Response, content: string): void;
  showAllEntries(res: Response): void;
  showEntry(res: Response, id: string): void;
}

class JournalController implements IJournalController {
  constructor(private readonly service: IJournalService) {}

  showHome(res: Response): void {
    res.sendFile("journal.html", { root: "static" });
  }

  showEntryForm(res: Response): void {
    res.sendFile("entry-form.html", { root: "static" });
  }

  newEntryFromForm(res: Response, content: string): void {
    this.service.createEntry(content);
    res.redirect("/");
  }

  showAllEntries(res: Response): void {
    const entries = this.service.getEntries();
    let html = "<h1>All Journal Entries</h1><ul>";
    for (const entry of entries) {
      html += `<li><a href="/entries/${entry.id}">${entry.content}</a></li>`;
    }
    html += "</ul>";
    res.send(html);
  }

  showEntry(res: Response, id: string): void {
    let html = "<h1>Journal Entry Not Found</h1>";
    const entry = this.service.getEntry(id);
    if (entry) {
      html = `<h1>Journal Entry</h1><p>${entry.content}</p>`;
    }
    res.send(html);
  }
}

export function CreateJournalController(service: IJournalService): IJournalController {
  return new JournalController(service);
}