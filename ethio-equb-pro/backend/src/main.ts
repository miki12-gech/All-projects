import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ይህ መስመር ነው Senior የሚያስኝህ!
  // ከFrontend የሚመጣን ማንኛውንም ዳታ በህግ እንዲያልፍ ያደርጋል።
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ያልተፈለገ ዳታ (Extra fields) ካለ ውድቅ ያደርጋል
      forbidNonWhitelisted: true, // ያልተፈቀደ ዳታ ከተላከ Error ይሰጣል
      transform: true, // ዳታውን በራሱ ወደ ሚፈለገው Type (ለምሳሌ ከ String ወደ Number) ይቀይራል
    }),
  );

  await app.listen(3000);
}
void bootstrap();
