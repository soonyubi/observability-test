import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
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
