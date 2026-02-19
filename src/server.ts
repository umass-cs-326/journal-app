import type { IApp, IServer } from './contracts.js'
import { createComposedApp } from './composition.js'

/**
 * HttpServer implements IServer.
 *
 * This separates "start listening" from "build the app".
 * Tests can import the app without opening a port.
 */
export class HttpServer implements IServer {
  constructor(private readonly app: IApp) {}

  start(port: number): void {
    const expressApp = this.app.getExpressApp()

    expressApp.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${port}`)
    })
  }
}

// ----- Composition root for the running process -----

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const app = createComposedApp()
const server = new HttpServer(app)

server.start(PORT)
