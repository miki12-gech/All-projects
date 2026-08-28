import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  // NestJS Logger-ን እንጠቀም
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);

  // 1. CORS: Nuxt 3 Frontend ከዚህ Backend ጋር እንዲነጋገር ይፈቅዳል
  app.enableCors({
    origin: 'http://localhost:3000', // የ Nuxt 3 አድራሻ (በኋላ እንቀይረዋለን)
    credentials: true,
  });

  // 2. Global Prefix
  app.setGlobalPrefix('api');

  // 3. Advanced Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // በ DTO ውስጥ የሌለን መረጃ አትቀበል
      forbidNonWhitelisted: true, // በ DTO ውስጥ የሌለ መረጃ ከተላከ ስህተት ስጥ
      transform: true, // መረጃውን ወደ ሚፈለገው Type (ለምሳሌ String ወደ Number) ቀይር
    }),
  );

  const port = 3001; // Backend-ን ወደ 3001 እናድርገው (3000 ለ Nuxt ስለሚሆን)
  await app.listen(port);
  
  logger.log(`🚀 Agazi School Backend is running on: http://localhost:${port}/api`);
}

// bootstrap() ፈንክሽኑን እንጥራው
void bootstrap();
