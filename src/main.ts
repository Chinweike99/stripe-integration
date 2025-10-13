import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4000;

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
