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
  replaceById(id: string, content: string): IJournalEntry;
  patchById(id: string, content: string): IJournalEntry;
  deleteById(id: string): boolean;
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

  replaceById(id: string, content: string): IJournalEntry {
    for (let i = 0; i < this.entries.length; i += 1) {
      if (this.entries[i].id === id) {
        this.entries[i].content = content;
        this.entries[i].updatedAt = new Date();
        return this.entries[i];
      }
    }
    throw new Error(`Journal entry with id ${id} not found`);
  }

  patchById(id: string, content: string): IJournalEntry {
    return this.replaceById(id, content);
  }

  deleteById(id: string): boolean {
    for (let i = 0; i < this.entries.length; i += 1) {
      if (this.entries[i].id === id) {
        this.entries.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}

export function CreateJournalRepository(): IJournalRepository {
  return new JournalRepository();
}
