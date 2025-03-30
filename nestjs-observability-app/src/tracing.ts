// tracing.ts
import { logs as logsAPI } from '@opentelemetry/api-logs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

export function startTelemetry() {
  const traceExporter = new OTLPTraceExporter({
    url: 'http://otel-collector:4318/v1/traces',
  });

  const logExporter = new OTLPLogExporter({
    url: 'http://otel-collector:4318/v1/logs',
  });

  const loggerProvider = new LoggerProvider();
  loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(logExporter),
  );
  logsAPI.setGlobalLoggerProvider(loggerProvider);

  const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log('✅ OpenTelemetry started');
}
