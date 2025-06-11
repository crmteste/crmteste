import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://crmfront-hl9hwbp0t-crmtestes-projects.vercel.app',
      'https://crmfront-teal.vercel.app'
    ],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
