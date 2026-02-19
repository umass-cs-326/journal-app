import type { IJournalEntry } from '../../src/model/JournalEntry.js'
import type { IJournalRepository } from '../../src/repository/JournalRespository.js'
import { Ok, Err } from '../../src/lib/result.js'
import { CreateJournalService } from '../../src/service/JournalService.js'
import { EntryNotFound } from '../../src/service/errors.js'

function makeEntry(id = '1', content = 'first entry'): IJournalEntry {
  const now = new Date('2026-02-19T00:00:00.000Z')
  return {
    id,
    content,
    createdAt: now,
    updatedAt: now,
  }
}

function makeRepository(overrides: Partial<IJournalRepository> = {}): IJournalRepository {
  const defaultEntry = makeEntry()
  return {
    add: jest.fn().mockResolvedValue(Ok(defaultEntry)),
    getById: jest.fn().mockResolvedValue(Ok(defaultEntry)),
    getAll: jest.fn().mockResolvedValue(Ok([defaultEntry])),
    replaceById: jest.fn().mockResolvedValue(Ok(defaultEntry)),
    patchById: jest.fn().mockResolvedValue(Ok(defaultEntry)),
    deleteById: jest.fn().mockResolvedValue(Ok(null)),
    ...overrides,
  }
}

describe('JournalService', () => {
  it('trims content before delegating to repository.add', async () => {
    const repo = makeRepository()
    const service = CreateJournalService(repo)

    const result = await service.createEntry('  hello world  ')

    expect(result.ok).toBe(true)
    expect(repo.add).toHaveBeenCalledWith('hello world')
  })

  it('returns InvalidContent for blank content and does not call repository.add', async () => {
    const repo = makeRepository()
    const service = CreateJournalService(repo)

    const result = await service.createEntry('    ')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.value.name).toBe('InvalidContent')
      expect(result.value.message).toBe('Entry content is required.')
    }
    expect(repo.add).not.toHaveBeenCalled()
  })

  it('returns ValidationError when content exceeds 5000 chars', async () => {
    const repo = makeRepository()
    const service = CreateJournalService(repo)

    const tooLong = 'x'.repeat(5001)
    const result = await service.createEntry(tooLong)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.value.name).toBe('ValidationError')
      expect(result.value.message).toContain('5000 characters or fewer')
    }
    expect(repo.add).not.toHaveBeenCalled()
  })

  it('passes through repository errors for getEntry', async () => {
    const repo = makeRepository({
      getById: jest
        .fn()
        .mockResolvedValue(Err(EntryNotFound('Journal entry with id 99 not found'))),
    })
    const service = CreateJournalService(repo)

    const result = await service.getEntry('99')

    expect(repo.getById).toHaveBeenCalledWith('99')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.value.name).toBe('EntryNotFound')
    }
  })
})
