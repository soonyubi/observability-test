import {
  makeCounterProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';

export const metrics = [
  makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
  }),
  makeGaugeProvider({
    name: 'memory_usage_bytes',
    help: 'Memory usage in bytes',
  }),
];
