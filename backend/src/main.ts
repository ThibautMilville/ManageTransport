import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = (
    process.env.CORS_ORIGIN ||
    'http://localhost:3000,https://managetransport.fr,https://www.managetransport.fr'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
