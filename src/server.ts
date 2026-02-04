import type { IApp, IServer } from "./contracts";
import { CreateApp } from "./app";
import { CreateJournalRepository } from './repository/JournalRespository';
import { CreateJournalService } from './service/JournalService';
import { CreateJournalController } from './controller/JournalController';

/**
 * HttpServer implements IServer.
 *
 * This separates "start listening" from "build the app".
 * Tests can import the app without opening a port.
 */
export class HttpServer implements IServer {
  constructor(private readonly app: IApp) {}

  start(port: number): void {
    const expressApp = this.app.getExpressApp();

    expressApp.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

// ----- Composition root for the running process -----

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Now we compose the application and start the server.
const repository = CreateJournalRepository();
const service = CreateJournalService(repository);
const controller = CreateJournalController(service);
const app = CreateApp(controller);
const server = new HttpServer(app);

server.start(PORT);
