import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 ይህንን ካደረግን ሁሉም ክፍሎች ፕሪስማን ማግኘት ይችላሉ
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 ይህንን መላክ (Export) መረሳት የለበትም
})
export class PrismaModule {}
