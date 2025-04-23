import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { metrics } from './metrics';

@Module({
  imports: [
    PrismaModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...metrics],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
