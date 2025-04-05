import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
