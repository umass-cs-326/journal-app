import request from 'supertest'
import type { Express } from 'express'
import { createComposedApp } from '../../src/composition.js'
import type { ILoggingService } from '../../src/service/LoggingService.js'

function makeSilentLogger(): ILoggingService {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
}

describe('HTTP contract verification', () => {
  let app: Express

  beforeEach(() => {
    app = createComposedApp(makeSilentLogger()).getExpressApp()
  })

  it('renders home page', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.text).toContain('Welcome to the Journal App!')
  })

  it('creates an entry from form POST and redirects to show page', async () => {
    const createResponse = await request(app)
      .post('/entries/new')
      .type('form')
      .send({ content: 'Contract testing entry' })

    expect(createResponse.status).toBe(302)
    expect(createResponse.headers.location).toBe('/entries/1')

    const showResponse = await request(app).get('/entries/1')
    expect(showResponse.status).toBe(200)
    expect(showResponse.text).toContain('Contract testing entry')
  })

  it('returns 400 when form content is blank', async () => {
    const response = await request(app)
      .post('/entries/new')
      .type('form')
      .send({ content: '   ' })

    expect(response.status).toBe(400)
    expect(response.text).toContain('Entry content is required.')
  })

  it('maps EntryNotFound to 404 for HTML route', async () => {
    const response = await request(app).get('/entries/404')

    expect(response.status).toBe(404)
    expect(response.text).toContain('Journal Entry Not Found')
    expect(response.text).toContain('Entry id: 404')
  })

  it('maps EntryNotFound to 404 JSON for PATCH API route', async () => {
    const response = await request(app)
      .patch('/api/entries/404')
      .send({ content: 'Updated' })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      message: 'Journal entry with id 404 not found',
    })
  })

  it('returns 204 on delete success and 404 on second delete', async () => {
    await request(app)
      .post('/entries/new')
      .type('form')
      .send({ content: 'Entry to delete' })

    const firstDelete = await request(app).delete('/api/entries/1')
    expect(firstDelete.status).toBe(204)

    const secondDelete = await request(app).delete('/api/entries/1')
    expect(secondDelete.status).toBe(404)
    expect(secondDelete.body).toEqual({
      message: 'Journal entry with id 1 not found',
    })
  })
})
