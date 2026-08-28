import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseTestService } from './database-test.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseTestService: DatabaseTestService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  async testDatabase() {
    return await this.databaseTestService.testConnection();
  }
}
