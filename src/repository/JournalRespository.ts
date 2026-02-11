import { IJournalEntry, createJournalEntry } from "../model/JournalEntry.js";
import { Result, Ok, Err } from "../lib/result.js";
import { JournalError, EntryNotFound, ValidationError } from "../service/errors.js";

/**
 * Repository interface.
 *
 * A repository is "how we talk to storage".
 * Today it's in-memory, later it can be a database.
 */
export interface IJournalRepository {
  add(content: string): Result<IJournalEntry, JournalError>;
  getById(id: string): Result<IJournalEntry, JournalError>;
  getAll(): Result<IJournalEntry[], JournalError>;
  replaceById(id: string, content: string): Result<IJournalEntry, JournalError>;
  patchById(id: string, content: string): Result<IJournalEntry, JournalError>;
  deleteById(id: string): Result<null, JournalError>;
}

class JournalRepository implements IJournalRepository {
  private entries: IJournalEntry[] = [];
  private nextId = 1;

  add(content: string): Result<IJournalEntry, JournalError> {
    if (!content) {
      return Err(ValidationError("Repository received empty content."));
    }
    const entry = createJournalEntry(String(this.nextId++), content);
    this.entries.push(entry);
    return Ok(entry);
  }

  getById(id: string): Result<IJournalEntry, JournalError> {
    const found = this.entries.find((entry) => entry.id === id);
    if (!found) {
      return Err(EntryNotFound(`Journal entry with id ${id} not found`));
    }
    return Ok(found);
  }

  getAll(): Result<IJournalEntry[], JournalError> {
    return Ok(this.entries);
  }

  replaceById(id: string, content: string): Result<IJournalEntry, JournalError> {
    for (let i = 0; i < this.entries.length; i += 1) {
      if (this.entries[i].id === id) {
        this.entries[i].content = content;
        this.entries[i].updatedAt = new Date();
        return Ok(this.entries[i]);
      }
    }
    return Err(EntryNotFound(`Journal entry with id ${id} not found`));
  }

  patchById(id: string, content: string): Result<IJournalEntry, JournalError> {
    return this.replaceById(id, content);
  }

  deleteById(id: string): Result<null, JournalError> {
    for (let i = 0; i < this.entries.length; i += 1) {
      if (this.entries[i].id === id) {
        this.entries.splice(i, 1);
        return Ok(null);
      }
    }
    return Err(EntryNotFound(`Journal entry with id ${id} not found`));
  }
}

export function CreateJournalRepository(): IJournalRepository {
  return new JournalRepository();
}
