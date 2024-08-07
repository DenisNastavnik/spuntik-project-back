import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Sputnik Project')
    .setDescription('Documentation REST API')
    .setVersion('1.0.0')
    .setExternalDoc('Postman Collection', '/docs-json')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    })
    .addTag('Ozon Copy')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE, OPTIONS, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
