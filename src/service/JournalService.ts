import { IJournalEntry } from "../model/JournalEntry.js";
import { IJournalRepository } from "../repository/JournalRespository.js";
import { Result, Err } from "../lib/result.js";
import { JournalError, InvalidContent, ValidationError } from "./errors.js";

/**
 * Service interface.
 *
 * A service coordinates domain logic.
 */
export interface IJournalService {
  createEntry(content: string): Result<IJournalEntry, JournalError>;
  getEntry(id: string): Result<IJournalEntry, JournalError>;
  getEntries(): Result<IJournalEntry[], JournalError>;
  replaceEntry(id: string, content: string): Result<IJournalEntry, JournalError>;
  patchEntry(id: string, content: string): Result<IJournalEntry, JournalError>;
  deleteEntry(id: string): Result<null, JournalError>;
}

class JournalService implements IJournalService {
  constructor(private readonly repository: IJournalRepository) {}

  createEntry(content: string): Result<IJournalEntry, JournalError> {
    const normalized = content.trim();

    if (!normalized) {
      return Err(InvalidContent("Entry content is required."));
    }

    if (normalized.length > 5000) {
      return Err(ValidationError("Entry content must be 5000 characters or fewer."));
    }

    return this.repository.add(normalized);
  }

  getEntry(id: string): Result<IJournalEntry, JournalError> {
    return this.repository.getById(id);
  }

  getEntries(): Result<IJournalEntry[], JournalError> {
    return this.repository.getAll();
  }

  replaceEntry(id: string, content: string): Result<IJournalEntry, JournalError> {
    return this.repository.replaceById(id, content);
  }

  patchEntry(id: string, content: string): Result<IJournalEntry, JournalError> {
    return this.repository.patchById(id, content);
  }

  deleteEntry(id: string): Result<null, JournalError> {
    return this.repository.deleteById(id);
  }
}

export function CreateJournalService(repository: IJournalRepository): IJournalService {
  return new JournalService(repository);
}
