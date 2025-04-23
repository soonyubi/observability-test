import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startTelemetry } from './tracing';
import { MyLogger } from './logger/winston.logger';

async function bootstrap() {
  startTelemetry();

  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
  });
  await app.listen(3000);
}
bootstrap();
