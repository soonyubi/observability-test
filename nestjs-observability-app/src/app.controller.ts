import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Counter, Gauge } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
    @InjectMetric('http_requests_total') private counter: Counter<string>,
    @InjectMetric('memory_usage_bytes') private gauge: Gauge<string>,
  ) {}

  @Get()
  getHello(): string {
    this.counter.inc();
    this.gauge.set(process.memoryUsage().heapUsed);
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers() {
    try {
      const users = await this.prismaService.getUsers();
      this.logger.debug('Users fetched successfully');
      return users;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  @Get('error')
  getError(): string {
    throw new Error('This is a test error');
  }

  @Get('slow')
  getSlow(): string {
    for (let i = 0; i < 1000000000; i++) {
      Math.sqrt(i);
    }
    return 'Done';
  }
}
