export interface IJournalEntry {
  id: string;  
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class JournalEntry implements IJournalEntry {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, content: string) {
    this.id = id;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateContent(newContent: string): void {
    this.content = newContent;
    this.updatedAt = new Date();
  }
}

export function createJournalEntry(id: string, content: string): IJournalEntry {
  return new JournalEntry(id, content);
}