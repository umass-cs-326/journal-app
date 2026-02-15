import path from 'node:path'
import { IApp } from './contracts'
import express, { RequestHandler } from 'express'
import { Request, Response } from 'express'
import Layouts from 'express-ejs-layouts'
import { IJournalController } from './controller/JournalController'
import { ILoggingService } from './service/LoggingService'

// Type for async route handlers, which return a Promise
type AsyncRequestHandler = RequestHandler

// Helper to wrap async route handlers and catch errors
function asyncHandler(fn: AsyncRequestHandler) {
  return function (req: Request, res: Response, next: any) {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export class ExpressApp implements IApp {
  private readonly app: express.Express

  constructor(
    private readonly controller: IJournalController,
    private readonly logger: ILoggingService,
  ) {
    this.app = express()
    this.registerMiddleware()
    this.registerTemplating()
    this.registerRoutes()
  }

  registerMiddleware(): void {
    this.app.use(express.static('static'))
    this.app.use(Layouts)
  }

  registerTemplating(): void {
    this.app.set('view engine', 'ejs')
    this.app.set('views', path.join(process.cwd(), 'views'))
    this.app.set('layout', 'layouts/base')
  }

  registerRoutes(): void {
    const controller = this.controller

    this.app.get(
      '/',
      asyncHandler((_req: Request, res: Response) => {
        this.logger.info('GET /')
        this.controller.showHome(res)
      }),
    )

    this.app.get(
      '/entries/new',
      asyncHandler((_req: Request, res: Response) =>
        controller.showEntryForm(res),
      ),
    )

    this.app.post(
      '/entries/new',
      express.urlencoded({ extended: true }),
      asyncHandler((req: Request, res: Response) => {
        const raw = req.body.content
        const content = typeof raw === 'string' ? raw.trim() : ''

        if (!content) {
          this.logger.warn(
            'POST /entries/new rejected: content missing or empty',
          )
          res.status(400).send('Entry content is required.')
          return
        }

        controller.newEntryFromForm(res, content)
      }),
    )

    this.app.get(
      '/entries',
      asyncHandler((_req: Request, res: Response) =>
        controller.showAllEntries(res),
      ),
    )

    this.app.get(
      '/entries/:id',
      asyncHandler((req: Request, res: Response) => {
        const id = req.params.id as string
        controller.showEntry(res, id)
      }),
    )

    this.app.get(
      '/entries/:id/edit',
      asyncHandler((req: Request, res: Response) => {
        this.logger.info(`GET /entries/${req.params.id}/edit`)
        const id = req.params.id as string
        this.controller.showEditForm(res, id)
      }),
    )

    this.app.post(
      '/entries/:id/edit',
      express.urlencoded({ extended: true }),
      asyncHandler((req: Request, res: Response) => {
        this.logger.info(`POST /entries/${req.params.id}/edit`)
        const id = req.params.id as string
        const content = req.body.content as string
        this.controller.updateEntryFromForm(res, id, content)
      }),
    )

    this.app.post(
      '/entries/:id/delete',
      asyncHandler((req: Request, res: Response) => {
        this.logger.info(`POST /entries/${req.params.id}/delete`)
        const id = req.params.id as string
        this.controller.deleteEntryFromForm(res, id)
      }),
    )

    this.app.put(
      '/api/entries/:id',
      express.json(),
      asyncHandler((req, res) => {
        this.logger.info(`PUT /api/entries/${req.params.id}`)
        const id = req.params.id as string
        const content = req.body.content as string
        this.controller.replaceEntry(res, id, content)
      }),
    )

    this.app.patch(
      '/api/entries/:id',
      express.json(),
      asyncHandler((req, res) => {
        this.logger.info(`PATCH /api/entries/${req.params.id}`)
        const id = req.params.id as string
        const content = req.body.content as string
        this.controller.patchEntry(res, id, content)
      }),
    )

    this.app.delete(
      '/api/entries/:id',
      asyncHandler((req: Request, res: Response) => {
        this.logger.info(`DELETE /api/entries/${req.params.id}`)
        const id = req.params.id as string
        this.controller.deleteEntry(res, id)
      }),
    )
  }

  getExpressApp(): express.Express {
    return this.app
  }
}

export const CreateApp = (
  controller: IJournalController,
  logger: ILoggingService,
): ExpressApp => new ExpressApp(controller, logger)
