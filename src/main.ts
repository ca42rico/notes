import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.port || 3000;

  const options = new DocumentBuilder()
    .setTitle("Notes Rest API")
    .setDescription("Interesting description.")
    .setVersion("0.0.1")
    .addServer("/api")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("api/docs", app, document);

  app.setGlobalPrefix("/api");
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
