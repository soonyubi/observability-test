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
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  SemanticResourceAttributes,
  SEMRESATTRS_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import * as os from 'os';
import { resourceFromAttributes } from '@opentelemetry/resources';

export function startTelemetry() {
  const traceExporter = new OTLPTraceExporter({
    url: 'http://otel-collector:4318/v1/traces',
  });

  const logExporter = new OTLPLogExporter({
    url: 'http://otel-collector:4318/v1/logs',
  });

  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'nestjs-app',
      [ATTR_SERVICE_VERSION]: '1.0.0',
      app: 'nestjs',
      project: 'nestjs-observability-app',
      team: 'soonyubing',
    }),
  });
  loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(logExporter),
  );
  logsAPI.setGlobalLoggerProvider(loggerProvider);

  const resource = resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: 'nestjs-app',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'dev',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    app: 'nestjs',
    project: 'nestjs-observability-app',
    team: 'soonyubing',
    [SemanticResourceAttributes.HOST_NAME]: os.hostname(),
  });

  const sdk = new NodeSDK({
    resource,
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `http://otel-collector:4318/v1/metrics`,
      }),
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new NestInstrumentation(),
      new WinstonInstrumentation(),
    ],
  });

  sdk.start();
  console.log('✅ OpenTelemetry started');
}
