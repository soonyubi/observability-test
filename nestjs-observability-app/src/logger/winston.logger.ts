import * as winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { trace } from '@opentelemetry/api';

// 로그 메시지를 JSON 형식으로 변환하는 포맷터
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.printf((info) => {
    const span = trace.getActiveSpan();
    if (span) {
      const spanContext = span.spanContext();
      info.traceId = spanContext.traceId;
      info.spanId = spanContext.spanId;
    }
    return JSON.stringify(info);
  }),
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: jsonFormat,
  transports: [
    new winston.transports.Console(),
    new OpenTelemetryTransportV3(),
  ],
});
