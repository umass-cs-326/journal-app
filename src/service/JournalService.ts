import { IJournalEntry } from "../model/JournalEntry.js";
import { IJournalRepository } from "../repository/JournalRespository.js";

/**
 * Service interface.
 *
 * A service coordinates domain logic.
 * Right now our logic is small, but the structure scales.
 */
export interface IJournalService {
  createEntry(content: string): IJournalEntry;
  getEntry(id: string): IJournalEntry;
  getEntries(): IJournalEntry[];
}

class JournalService implements IJournalService {
  constructor(private readonly repository: IJournalRepository) {}

  createEntry(content: string): IJournalEntry {
    return this.repository.add(content);
  }

  getEntry(id: string): IJournalEntry {
    return this.repository.getById(id);
  }

  getEntries(): IJournalEntry[] {
    return this.repository.getAll();
  }
}

export function CreateJournalService(repository: IJournalRepository): IJournalService {
  return new JournalService(repository);
}