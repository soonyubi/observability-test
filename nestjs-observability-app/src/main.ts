import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startTelemetry, shutdownTelemetry } from './tracing';

async function bootstrap() {
  startTelemetry();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received. Shutting down...');
    await app.close();
    await shutdownTelemetry();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await shutdownTelemetry();
    process.exit(0);
  });
}
bootstrap();
