import { IJournalEntry, createJournalEntry } from "../model/JournalEntry.js";

/**
 * Repository interface.
 *
 * A repository is "how we talk to storage".
 * Today it's in-memory, later it can be a database.
 */
export interface IJournalRepository {
  add(content: string): IJournalEntry;
  getById(id: string): IJournalEntry;
  getAll(): IJournalEntry[];
}

class JournalRepository implements IJournalRepository {
  private entries: IJournalEntry[] = [];
  private nextId = 1;

  add(content: string): IJournalEntry {
    const entry = createJournalEntry(String(this.nextId++), content);
    this.entries.push(entry);
    return entry;
  }

  getById(id: string): IJournalEntry {
    const found = this.entries.find(entry => entry.id === id);
    // We are going to make this better in a later lecture.
    if (!found) {
      throw new Error(`Journal entry with id ${id} not found`);
    }
    return found;
  }

  getAll(): IJournalEntry[] {
    return this.entries;
  }
}

export function CreateJournalRepository(): IJournalRepository {
  return new JournalRepository();
}