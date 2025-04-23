import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async getUsers() {
    try {
      const users = await this.user.findMany();
      this.logger.debug('Users fetched successfully');
      return users;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }
}
