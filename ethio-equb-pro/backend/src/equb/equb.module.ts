import { Module } from '@nestjs/common';
import { EqubService } from './equb.service';
import { EqubController } from './equb.controller';

@Module({
  providers: [EqubService],
  controllers: [EqubController]
})
export class EqubModule {}
