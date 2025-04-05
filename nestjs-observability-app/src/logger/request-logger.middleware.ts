// request-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from './winston.logger';
import { trace } from '@opentelemetry/api';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const span = trace.getActiveSpan();
    const spanContext = span ? span.spanContext() : null;

    logger.info('📥 Incoming Request', {
      meta: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        traceId: spanContext?.traceId,
        spanId: spanContext?.spanId,
      },
      traceId: spanContext?.traceId,
      spanId: spanContext?.spanId,
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('📤 Response Sent', {
        meta: {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          traceId: spanContext?.traceId,
          spanId: spanContext?.spanId,
        },
        traceId: spanContext?.traceId,
        spanId: spanContext?.spanId,
      });
    });

    next();
  }
}
