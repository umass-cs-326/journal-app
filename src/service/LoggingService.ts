export interface ILoggingService {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

class LoggingService implements ILoggingService {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

let loggingServiceInstance: ILoggingService | null = null;

export function CreateLoggingService(): ILoggingService {
  if (loggingServiceInstance === null) {
    loggingServiceInstance = new LoggingService();
  }
  return loggingServiceInstance;
}
