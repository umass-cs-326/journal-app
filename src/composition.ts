import type { IApp } from './contracts.js'
import type { ILoggingService } from './service/LoggingService.js'
import { CreateApp } from './app.js'
import { CreateJournalController } from './controller/JournalController.js'
import { CreateJournalRepository } from './repository/JournalRespository.js'
import { CreateJournalService } from './service/JournalService.js'
import { CreateLoggingService } from './service/LoggingService.js'

export function createComposedApp(logger?: ILoggingService): IApp {
  const resolvedLogger = logger ?? CreateLoggingService()
  const repository = CreateJournalRepository()
  const service = CreateJournalService(repository)
  const controller = CreateJournalController(service, resolvedLogger)
  return CreateApp(controller, resolvedLogger)
}
