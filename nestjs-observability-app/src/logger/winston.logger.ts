import * as winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { Injectable, LoggerService } from '@nestjs/common';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new OpenTelemetryTransportV3(),
  ],
});

@Injectable()
export class MyLogger implements LoggerService {
  log(message: any, context?: string) {
    logger.info(message, { context });
  }
  error(message: any, stack?: string, context?: string) {
    if (message instanceof Error) {
      stack = message.stack;
      message = message.message;
    }
    logger.error(message, { context, stack });
  }
  warn(message: any, context?: string) {
    logger.warn(message, { context });
  }
  debug?(message: any, context?: string) {
    logger.debug(message, { context });
  }
  verbose?(message: any, context?: string) {
    logger.verbose(message, { context });
  }
}
